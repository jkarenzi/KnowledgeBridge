import { Navigate, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import './Settings.css';
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';

const Settings = () => {
    const navigate = useNavigate()

    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const token = localStorage.getItem('token')

    const [ changeUsername, setChangeUsername ] = useState(false)
    const [ newUsername, setNewUsername ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ changePassword, setChangePassword ] = useState(false)
    const [ newPassword, setNewPassword ] = useState('')
    const [ confirmPassword, setConfirmPassword ] = useState('')
    const [ oldPassword, setOldPassword ] = useState('')
    const [ changeProfile, setChangeProfile ] = useState(false)
    const [ profile, setProfile ] = useState(null)
    const [ previewImage, setPreviewImage ] = useState(null)
    const [ profileActionOverlay, setProfileActionOverlay ] = useState(false)
    const [ emailOverlay, setEmailOverlay ] = useState(false)
    const [ aPassword, setAPassword ] = useState('')
    const [ newEmail, setNewEmail ] = useState('')

    

    const openChangeUsername = () => {
        setChangeUsername(true)
    }

    const closeChangeUsername = () => {
        setChangeUsername(false)
    }

    const openChangePassword = () => {
        setChangePassword(true)
    }

    const closeChangePassword = () => {
        setChangePassword(false)
    }

    const openChangeProfile = () => {
        closeProfileActionOverlay()
        setChangeProfile(true)
    }

    const closeChangeProfile = () => {
        setChangeProfile(false)
    }

    function openProfileActionOverlay () {
        setProfileActionOverlay(true)
    }

    function closeProfileActionOverlay () {
        setProfileActionOverlay(false)
    }

    const showToast = (message) => {
        toast.success(message, {
          position: toast.POSITION.TOP_RIGHT, // Set the position
        });
    };

    const errorToast = (msg) => {
        toast.error(msg, {
          position: toast.POSITION.TOP_RIGHT, // Set the position
        });
    };

    function handleRemove(id) {
        fetch(`https://kbbackend.onrender.com/remove_picture/${id}`,{
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.code !== 0){
                navigate('/login')
            }
            closeProfileActionOverlay()
            if (data.status === 'not ok') {
                errorToast(data.message)
            } else {
                localStorage.setItem('userInfo',  JSON.stringify(data.user_info))
                showToast(data.message);
            }
            console.log(data)
        })
        .catch((error) => {
            console.log(error)
            errorToast('No internet connection!')
        })
    }

    const handleFileChange = (e) => {
        setProfile(e.target.files[0])
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (event) {
            setPreviewImage(event.target.result);
          };
          reader.readAsDataURL(file);
        }
    };

    const clearFile = () => {
        const inputField = document.getElementById('change_pic')
        inputField.value = null
        setPreviewImage(null)
    }

    const handleEmailChange = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('password', aPassword)
        formData.append('username', userInfo.username)
        formData.append('email', newEmail)

        fetch('https://kbbackend.onrender.com/change_email',{
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.code !== 0){
                navigate('/login')
            }
            if (data.status === 'ok'){
                localStorage.setItem('userInfo', JSON.stringify(data.user_info))
                setEmailOverlay(false)
                showToast(data.message)
            } else {
                errorToast(data.message)
            }
            console.log('Response from Flask:', data);
        })
        .catch((error) => {
            errorToast("No internet connection!")
            console.error('Error', error);
        });
    }

    const handleUsernameChange = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('password', password)
        formData.append('old_username', userInfo.username)
        formData.append('new_username', newUsername)

        fetch('https://kbbackend.onrender.com/change_username',{
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.code !== 0){
                navigate('/login')
            }
            if (data.status === 'ok'){
                localStorage.setItem('userInfo', JSON.stringify(data.user_info))
                closeChangeUsername()
                showToast(data.message)
            } else {
                errorToast(data.message)
            }
            console.log('Response from Flask:', data);
        })
        .catch((error) => {
            errorToast("No internet connection!")
            console.error('Error', error);
        });
    }

    const handlePasswordChange = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('old_password', oldPassword)
        formData.append('new_password', newPassword)
        formData.append('confirm_password', confirmPassword)
        formData.append('username', userInfo.username)
        

        fetch('https://kbbackend.onrender.com/change_password',{
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.code !== 0){
                navigate('/login')
            }
            if (data.status === 'ok'){
                closeChangePassword()
                showToast(data.message)
            } else {
                errorToast(data.message)
            }
            console.log('Response from Flask:', data);
        })
        .catch((error) => {
            errorToast("No internet connection!")
            console.error('Error', error);
        });
    }

    const handleChangeProfile = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('profile_picture', profile)
        formData.append('user', userInfo.username)
        formData.append('email', userInfo.email)

        fetch('https://kbbackend.onrender.com/change_profile',{
            method: 'POST',
            body: formData,
            headers: {'Authorization': `Bearer ${token}`}
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.code !== 0){
                navigate('/login')
            }
            console.log(data)
            if (data.status === 'ok') {
                localStorage.setItem('userInfo',  JSON.stringify(data.user_info))
                closeChangeProfile()
                showToast(data.message);
            } else {
                errorToast(data.message)
            }
        })
        .catch((error) => {
            errorToast("No internet connection!")
            console.error('Error', error);
        });
    }

    const links = [
        {id: 1, text: 'Community', url: '/community', icon:'/images/community.png'},
        {id: 2, text: 'Admin', url: '/admin', icon:'/images/admin_logo.png'},
        {id: 3, text: 'Library', url: '/library', icon:'/images/library.png'},
        {id: 4, text: 'Settings', url: '/settings', icon:'/images/settings.png'}
    ]
    
    return (
        <body className="settings_body">
            <Header links={links} userInfo={userInfo}/>
            <div className="settings_intro">
                {userInfo?userInfo.username:<Navigate to="/login"/>}'s settings
            </div>
            <div className="big_div_container_1">
                <div className="big_div_container">
                    <div className="big_profile_picture">
                        <img id="edit_pic" src='/images/edit_pic.png' width="30px" height="30px" style={{cursor:'pointer'}} onClick={openProfileActionOverlay}/>
                        <div className="inner_profile_picture_1">
                            <div className="inner_profile_picture">
                                {userInfo?<img src={userInfo.profile_url}/>:<Navigate to="/login"/>}
                            </div>
                        </div>
                        {profileActionOverlay && <div className='profile_actions_popup_9'>
                            <img src='/images/close.png' width="12px" height="12px" onClick={closeProfileActionOverlay}/>
                            <button onClick={()=> {handleRemove(userInfo.user_id)}}>Remove Image</button>
                            <button onClick={openChangeProfile}>Change Image</button>
                        </div>}
                    </div>
                    <div className="big_profile_picture_details_1">
                        <div className="big_profile_picture_details">
                            {userInfo?!userInfo.google_auth && <div className="profile_dets">
                                Email: <span id="profile_dets_email">{userInfo.email}</span>
                                <img src="/images/edit_details.png" width="20px" height="20px" onClick={()=> setEmailOverlay(true)}/>
                            </div>:<Navigate to="/login"/>}
                            <div className="profile_dets">
                                Username: <span id="profile_dets_email">{userInfo?userInfo.username:<Navigate to="/login"/>}</span>
                                <img src="/images/edit_details.png" width="20px" height="20px" onClick={openChangeUsername}/>
                            </div>
                            {userInfo?!userInfo.google_auth && <div className="profile_dets">
                                Password: <span id="profile_dets_email">*************</span>
                                <img src="/images/edit_details.png" width="20px" height="20px" onClick={openChangePassword}/>
                            </div>:<Navigate to="/login"/>}
                        </div>
                    </div>
                </div>
            </div>
            {changeUsername && <div className="change_username_big">
                <div className="change_username">
                    <div id="title_101">
                        <h4>Change username</h4>
                        <img src="/images/close.png" width="20px" height="20px" onClick={closeChangeUsername}/> 
                    </div>
                    <h4>Confirm its you</h4>
                    <form onSubmit={handleUsernameChange}>
                        <div className="one_1">
                            <label>Password</label>
                            <input type="password" onChange={(e)=> {setPassword(e.target.value)}} required/>     
                        </div>
                        <div className="one_1">
                            <label>New username</label>
                            <input type="text" onChange={(e)=> {setNewUsername(e.target.value)}} required/>   
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>}
            {changePassword && <div className="change_password_big">
                <div className="change_password">
                    <div id="title_101">
                        <h4>Change password</h4>
                        <img src="/images/close.png" width="20px" height="20px" onClick={closeChangePassword}/> 
                    </div>
                    <h4>Confirm its you</h4>
                    <form onSubmit={handlePasswordChange}>
                        <div className="one_1">
                            <label>Password</label>
                            <input type="password" onChange={(e)=> {setOldPassword(e.target.value)}} required/>   
                        </div>
                        <div className="one_1">
                            <label>New Password</label>
                            <input type="password" onChange={(e)=> {setNewPassword(e.target.value)}} required/>     
                        </div>
                        <div className="one_1">
                            <label>Confirm Password</label>
                            <input type="password" onChange={(e)=> {setConfirmPassword(e.target.value)}} required/>   
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>}
            {changeProfile && <div className="change_profile_set_big">
                <div className="change_profile_set">
                    <div id="title_101">
                        <h4>Update Profile picture</h4>
                        <img src="/images/close.png" width="20px" height="20px" onClick={closeChangeProfile}/> 
                    </div>
                    <form onSubmit={handleChangeProfile}>
                        <div className="upload_change_34">
                            <input type="file" accept="image/jpeg" id="change_pic" onChange={handleFileChange}/>
                            <img src="/images/close.png" width="10px" height="10px" onClick={clearFile}/>
                        </div>
                        <div className="preview_3">
                            {previewImage && <img src={previewImage} style={{objectFit:'cover'}} alt="Preview" width="200px" height="150px"/>}
                        </div> 
                        <button type="submit">Upload</button> 
                    </form>
                </div>
            </div>}
            {emailOverlay && <div className="change_password_big">
                <div className="change_username">
                    <div id="title_101">
                        <h4>Change Email</h4>
                        <img src="/images/close.png" width="20px" height="20px" onClick={()=> setEmailOverlay(false)}/> 
                    </div>    
                    <h4>Confirm its you</h4>
                    <form onSubmit={handleEmailChange}>
                        <div className="one_1">
                            <label>Password</label>
                            <input type="password" onChange={(e)=> {setAPassword(e.target.value)}} required/>     
                        </div>
                        <div className="one_1">
                            <label>New Email</label>
                            <input type="email" onChange={(e)=> {setNewEmail(e.target.value)}} required/>   
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>}
        </body>
    );
}

export default Settings;