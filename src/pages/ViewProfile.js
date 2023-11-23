import Header from "../components/Header";
import { useState,useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
const ViewProfile = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const token = localStorage.getItem('token')
    const location = useLocation()
    const { id } = useParams()
    const navigate = useNavigate()
    const [user, setUser] = useState({})
    const [logs, setLogs] = useState([])

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

    const links = [
        {id: 1, text: 'Community', url: '/community', icon:'/images/community.png'},
        {id: 2, text: 'Admin', url: '/admin', icon:'/images/admin_logo.png'},
        {id: 3, text: 'Library', url: '/library', icon:'/images/library.png'},
        {id: 4, text: 'Settings', url: '/settings', icon:'/images/settings.png'}
    ]

    useEffect(() => {
        fetch(`https://kbbackend.onrender.com/get_profile/${id}`,{
            method: 'GET',
            headers: {'Authorization': `Bearer ${token}`}
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.code !== 0){
                navigate('/login')
            }
            if (data.status === 'ok') {
                setUser(data.user_info)
                setLogs(data.log_list)   
            } else {
                errorToast(data.message)
            }
        })
        .catch((error) => {
            errorToast("No internet connection!")
            console.error('Error', error);
        });
    })

    return (
        <div className="home_body">
            <Header links={links} userInfo={userInfo}/>
            <div className='admin_header'>
                <div className='admin_header_icons'>
                    <div className='admin_header_icons_65' style={{borderBottom: location.pathname === '/user_mgt'?'4px solid #FF8400':'none'}}>
                        <Link to='/user_mgt'><img src='/images/user_mgt.png'/></Link>
                    </div>
                    <div className='admin_header_icons_65' style={{borderBottom: location.pathname === '/admin'?'4px solid #FF8400':'none'}}>
                        <Link to='/admin'><img src='/images/open-book.png'/></Link>
                    </div>
                </div>
            </div>
            <div className="settings_intro">
                {user.username}'s Profile
            </div>
            <div className="big_div_container_1">
                <div className="big_div_container" style={{alignItems:'center',gap:'7rem'}}>
                    <div className="big_profile_picture">
                        <div className="inner_profile_picture_1" style={{width:'13.3rem',height:'13.3rem'}}>
                            <div className="inner_profile_picture" style={{width:'13rem',height:'13rem'}}>
                                <img src={user.profile_url}/>
                            </div>
                        </div>
                    </div>
                    <div className="big_profile_picture_details_1" style={{height:'16.3rem'}}>
                        <div className="big_profile_picture_details" style={{height:'16rem'}}>
                            <div className="profile_dets">
                                Email: <span id="profile_dets_email">{user.email}</span>
                            </div>
                            <div className="profile_dets">
                                Username: <span id="profile_dets_email">{user.username}</span>
                            </div>
                            <div className="profile_dets">
                                UserID: <span id="profile_dets_email">{user.user_id}</span>
                            </div>
                            <div className="profile_dets">
                                Role: <span id="profile_dets_email">{user.admin?'Admin':'User'}</span>
                            </div>
                            <div className="profile_dets">
                                Account Status: <span id="profile_dets_email">{user.confirmed?'Confirmed':'Not Confirmed'}</span>
                            </div>
                            <div className="profile_dets">
                                Profile URL: <span id="profile_dets_email"><a href={user.profile_url} style={{color:'#FF8400'}} target="__blank">link to profile picture</a></span>
                            </div>
                            <div className="profile_dets">
                                Permissions: <span id="profile_dets_email">{user.view_book && 'View Access, '}{user.download_book && 'Download Access'}</span>
                            </div>
                            {user.google_auth && <div className="profile_dets">
                                Account type: <span id="profile_dets_email">Google account</span>
                            </div>}      
                        </div>
                    </div>
                </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',width:'100%', alignItems:'center',marginTop:'2rem',marginBottom:'2rem'}}>
                <h2 style={{textAlign:'left',alignSelf:'flex-start',marginLeft:'3rem',fontWeight:'500'}}>Logs</h2>
                {logs.map((log) => (
                    <div className="one_log" style={{background:'#f2f2f2',display:'flex',paddingLeft:'2rem',paddingRight:'1rem',alignItems:'center',width:'90%',minHeight:'4rem',border:'1px solid lightgray',marginBottom:'0.5rem',textAlign:'left'}}>
                        {log}
                    </div>
                ))}
            </div>

        </div>
    );
}
 
export default ViewProfile;