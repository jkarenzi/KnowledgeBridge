import './Users.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Users = (props) => {
    const navigate = useNavigate()
    const token = props.token
    const userInfo = props.userInfo
    const [ profileActionOverlay, setProfileActionOverlay ] = useState({state:false, id:'', user:'', email:'', url:''})

    function open(id,email) {
        props.setAddMailOverlay({state:true, user_id:id, email:email})
    }

    function openDeleteOverlay(id, user) {
        console.log(id)
        props.setAddDeleteOverlay({state:true, id:id, user:user})
        document.body.style.overflow = 'hidden';
    }

    function openProfileOverlay(url) {
        props.setAddProfileOverlay({state:true, url:url})
        document.body.style.overflow = 'hidden';
    }

    function openShowChangeOverlay(user, email) {
        console.log(email)
        closeProfileActionOverlay()
        props.setShowChangeOverlay({state:true, user:user, email:email})
        document.body.style.overflow = 'hidden';
    }

    function openProfileActionOverlay (id, user, email, url) {
        setProfileActionOverlay({state:true, id:id, user:user, email:email, url:url})
    }

    function closeProfileActionOverlay () {
        setProfileActionOverlay({state:false, id:'', user:'', email:'', url:''})
    }

    const showToast = (msg) => {
        toast.success(msg, {
          position: toast.POSITION.TOP_RIGHT, // Set the position
        });
    };

    const errorToast = (msg) => {
        toast.error(msg, {
          position: toast.POSITION.TOP_RIGHT, // Set the position
        });
    };

    function handleRemove(id) {
        fetch(`http://localhost:5000/remove_picture/${id}`,{
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            if (data.status === 'not ok') {
                errorToast(data.message)
                closeProfileActionOverlay()
            } else {
                props.setSearchResults(props.usersList.map((result) => {
                    if(result.user_id === data.user_info.user_id){
                        return data.user_info
                    }else{
                        return result
                    }
                }))
                closeProfileActionOverlay()
                showToast(data.message);
            }
            console.log(data)
        })
        .catch((error) => {
            console.log(error)
            errorToast('No internet connection!')
        })
    }

    if (props.usersList.length === 0) {
        return (
            <h3 id='error_msg'>{props.msg}</h3>
        )
    } else {
        return (
            <div className='user_container'>
                {props.usersList.map((user) => (
                    <div className='user' key={user.user_id}>
                        <div className='user_name'>
                            {(profileActionOverlay.state && profileActionOverlay.id === user.user_id) && <div className='profile_actions_popup'>
                                <img src='/images/close.png' width="12px" height="12px" onClick={closeProfileActionOverlay}/>
                                <button onClick={()=>{handleRemove(profileActionOverlay.id)}}>Remove Image</button>
                                <button onClick={()=> openProfileOverlay(profileActionOverlay.url)}>View Image</button>
                                <button onClick={()=>{openShowChangeOverlay(profileActionOverlay.user, profileActionOverlay.email)}}>Change Image</button>
                            </div>}
                            <div className='user_profile_99'>
                                <div className='user_profile'>
                                    <img src={user.profile_url} onClick={()=>{openProfileActionOverlay(user.user_id, user.username, user.email, user.profile_url)}}/>
                                </div>
                            </div>    
                            <div className='user_details'>
                                <div className='user_details_1'>
                                    <h4>{user.username}</h4>
                                    {user.admin && <img src='/images/admin.png' width="15px" height="15px"/>}
                                </div>
                                <h4 id='email_user'>{user.email}</h4>
                            </div>
                        </div>
                        <div className='options_mgt'>
                            <img src='/images/make-admin.png' width="18px" height="18px" style={{marginBottom:'0.1rem'}} onClick={() => props.setAddAdminOverlay({state:true,id:user.user_id,user:user.username})}/>
                            <img src='/images/mail.png' width="18px" height="20px" onClick={()=> {open(user.user_id, user.email)}} style={{marginTop:'0.1rem'}}/>
                            <img src='/images/delete.png' width="18px" height="20px" onClick={()=> {openDeleteOverlay(user.user_id, user.username)}}/>
                        </div>
                    </div>
                ))}
            </div>    
        ) 
    }
}

export default Users;