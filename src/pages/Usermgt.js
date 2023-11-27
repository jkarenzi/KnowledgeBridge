import { useEffect, useState } from "react";
import Users from "../components/Users";
import './Library.css';
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Header from "../components/Header";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import ViewBook from "./ViewBook";
import { Navigate } from "react-router-dom";


const Usermgt = () => {
    const location = useLocation()
    const [priv, setPriv] = useState('')
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [ email, setEmail ] = useState("")
    const[ role, setRole ] = useState("")
    const [ searchResults, setSearchResults ] = useState([])
    const [ message, setMessage ] = useState('')
    const [ addUserOverlay, setAddUserOverlay ] = useState(false)
    const [ addDeleteOverlay, setAddDeleteOverlay ] = useState({state:false, id:'',user:''})
    const [ addAdminOverlay, setAddAdminOverlay ] = useState({state:false, id:'',user:''})
    const [ addUseOverlay, setAddUseOverlay ] = useState({state:false, id:'',user:''})
    const [ showLoader, setShowLoader ] = useState(false)
    const [ query, setQuery ] = useState('')
    const [ roles, setRoles ] = useState([])
    const [ status, setStatus ] = useState([])
    const [ profile, setProfile ] = useState(null)
    const [previewImage, setPreviewImage] = useState(null);
    const [ addProfileOverlay, setAddProfileOverlay ] = useState({state:false, url:""})
    const [ showChangeOverlay, setShowChangeOverlay ] = useState({state:false, user:"", email:""})
    const [ addMailOverlay, setAddMailOverlay ] = useState({state:false,user_id:'',email:''})
    const [ subject, setSubject ] = useState('')
    const [ mailBody, setMailBody ] = useState('')
    const [ privilegesOverlay, setPrivilegesOverlay ] = useState({state:false,username:'',user_id:"",admin:'',profile_url:''})
    const [ isView, setIsView ] = useState(false)
    const [ isDownload, setIsDownload ] = useState(false)

    const navigate = useNavigate()
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const token = localStorage.getItem('token')

    const ThreeDotsLoader = () => (
        <div className="loader">
        <div className="dot dot1"></div>
        <div className="dot dot2"></div>
        <div className="dot dot3"></div>
        </div>
    );

    useEffect(() => {
        if(!userInfo.admin){
            navigate('/library')
            errorToast("Access Denied")
        }
    },[])

    function close () {
        setAddMailOverlay({state:false,user_id:'',email:''})
    }

    function closeDeleteOverlay() {
        setAddDeleteOverlay({state:false, id:'', user:''})
        document.body.style.overflow = 'auto';
    }

    function closeProfileOverlay() {
        setAddProfileOverlay({state:false, url:''})
        document.body.style.overflow = 'auto';
    }

    function closeShowChangeOverlay () {
        setShowChangeOverlay({state:false, user:"", email:""})
        document.body.style.overflow = 'auto';
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

    function openOverlay () {
        setAddUserOverlay(true) 
        document.body.style.overflow = 'hidden';
    }

    function closeOverlay () {
        setAddUserOverlay(false)
        document.body.style.overflow = 'auto';
    }

    function handleCheck (e) {
        if (e.target.checked) {
            if (roles.length === 0) {
                setRoles([e.target.value]);
                
            } else {
                setRoles([...roles, e.target.value]);
            }       
        } else {
            setRoles(roles.filter(role => role !== e.target.value)); 
        }
    }

    function handleStatus (e) {
        if (e.target.checked) {
            if (status.length === 0) {
                setStatus([e.target.value]);
                
            } else {
                setStatus([...status, e.target.value]);
            }       
        } else {
            setStatus(status.filter(x => x !== e.target.value)); 
        }
    }

    function handleSearchCheck () {
        setSearchResults([])
        setMessage('')
        setShowLoader(true)
        fetch(`https://kbbackend.onrender.com/get_users?users=0&roles=${roles}&query=${query}&status=${status}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.code !== 0) {
                navigate('/login')
            }

            if (data.users.length === 0) {
                setMessage('No matches found')
            } else {
                setMessage('')
            }
            setSearchResults(data.users)
            setShowLoader(false)
        })
        .catch((error) => {
            setShowLoader(false)
            errorToast('No internet connection!')
            console.error('Error fetching users', error);
        });
    }

    function handleMail (e) {
        e.preventDefault()
        const formData = new FormData()
        formData.append('email', addMailOverlay.email)
        formData.append('subject', subject)
        formData.append('body', mailBody)
        fetch('https://kbbackend.onrender.com/send_mail',{
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
                close()
                showToast(data.message)
            }else{
                errorToast(data.message)
            }                     
        })
        .catch((error) => {
            errorToast("No internet connection!")
            console.error('Error', error);
        });
    }

    useEffect(() => {
        handleSearchCheck()
    },[roles, status])

    function handleSearch(e) {
        setSearchResults([])
        setMessage('')
        setShowLoader(true)
        setQuery(e.target.value)
        fetch(`https://kbbackend.onrender.com/get_users?users=0&query=${query}&status=${status}&roles=${roles}`,{
            method: 'GET',
            headers: {'Content-Type': 'application/json','Authorization': `Bearer ${token}`}
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.code !== 0){
                navigate('/login')
            }
            if (data.users.length === 0) {
                setMessage('No matches found')
            } else {
                setMessage('')
            }
            setSearchResults(data.users)
            setShowLoader(false)
        })
        .catch((error) => {
            setShowLoader(false)
            errorToast('No internet connection!')
            console.error('Error fetching users', error);
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('username', username)
        formData.append('password', password)
        formData.append('email', email)
        formData.append('role', role)
        formData.append('profile', profile)

        fetch('https://kbbackend.onrender.com/add_user',{
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })    
        .then((response) => response.json())
        .then((data) => {
            if(data.code !== 0){
                navigate('/login')
            }
            if (data.status === 'ok') {
                closeOverlay()
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

    useEffect(() => {
        // Fetch the list of PDF books from Flask backend
        fetch('https://kbbackend.onrender.com/get_users?users=0',{
            method: 'GET',
            headers: {'Content-Type': 'application/json','Authorization': `Bearer ${token}`}
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.code !== 0) {
                navigate('/login')
            }
            console.log(data)
            setSearchResults(data.users)
        })
        .catch((error) => {
            setShowLoader(false)
            errorToast("No internet connection!")
            console.error('Error fetching PDF books', error);
        });
    }, []);

    const getMoreUsers = () => {
        setShowLoader(true)
        fetch(`https://kbbackend.onrender.com/get_users?users=${searchResults.length}&query=${query}&roles=${roles}&status=${status}`,{
        method: 'GET',
        headers: {'Content-Type': 'application/json','Authorization': `Bearer ${token}`}
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.code !== 0) {
                navigate('/login')
            }
            
            setSearchResults([...searchResults, ...data.users])
            setShowLoader(false)
        })
        .catch((error) => {
            errorToast('No internet connection!')
            console.error('Error fetching PDF books', error);
        });  
    }

    const handleDelete = (id) => {
        fetch(`https://kbbackend.onrender.com/delete_user/${id}`,{
            method: 'DELETE',
            headers: {'Authorization': `Bearer ${token}`}
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.code !== 0) {
                navigate('/login')
            }
            console.log(data)
            if (data.msg === 'User deleted successfully') {
                closeDeleteOverlay()
                showToast(data.msg)
                setSearchResults(searchResults.filter((user) => user.user_id !== id))
            } else {
                errorToast(data.msg)
            }
        })
        .catch((error) => {
            errorToast('No internet connection')
            console.error('Error', error);
        });
    }

    const handleChangeProfile = (e) => {
        e.preventDefault()
        const formData = new FormData()
        console.log(showChangeOverlay.email)
        formData.append('profile_picture', profile)
        formData.append('user', showChangeOverlay.user)
        formData.append('email', showChangeOverlay.email)

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
                setSearchResults(searchResults.map((result) => {
                    if(result.user_id === data.user_info.user_id){
                        return data.user_info
                    }else{
                        return result
                    }
                }))
                closeShowChangeOverlay()
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

    const handleElevate = (id) => {
        const formData = new FormData()
        formData.append('id',id)

        fetch('https://kbbackend.onrender.com/elevate_privileges',{
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
                setAddAdminOverlay({state:false,id:'',user:''})
                showToast(data.message)
            }else {
                setAddAdminOverlay({state:false,id:'',user:''})
                errorToast(data.message)
            }
        })  
        .catch((error) => {
            errorToast("No internet connection!")
            console.error('Error', error);
        }); 
    }

    const handleDiminish = (id) => {
        const formData = new FormData()
        formData.append('id',id)

        fetch('https://kbbackend.onrender.com/diminish_privileges',{
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
                setAddUseOverlay({state:false,id:'',user:''})
                showToast(data.message)
            }else {
                setAddUseOverlay({state:false,id:'',user:''})
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

    const openElevate = (id,username) => {
        setPrivilegesOverlay({...privilegesOverlay,state:false})
        setAddAdminOverlay({state:true,id:id,user:username})
    }

    const openDiminish = (id,username) => {
        setPrivilegesOverlay({...privilegesOverlay,state:false})
        setAddUseOverlay({state:true,id:id,user:username})
    }

    const removeView = (id) => {
        fetch(`https://kbbackend.onrender.com/remove_view/${id}`,{
            method: 'GET',
            headers: {'Authorization': `Bearer ${token}`}
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.code !== 0){
                navigate('/login')
            }
            console.log(data)
            if (data.status === 'ok') {
                setSearchResults(searchResults.map((user) => {
                    if (user.user_id === id){
                        const object = {
                            'user_id': user.user_id,
                            'username': user.username,
                            'email': user.email,
                            'profile_url': user.profile_url,
                            'google_auth': user.google_auth,
                            'view_book': false,
                            'download_book': user.download_book,
                            'subscribed': user.subscribed
                        }
                        return object
                    }else{
                        return user
                    }
                }))
                setIsView(false)
                showToast(data.message)
            }else {
                errorToast(data.message)
            }
        })
        .catch((error) => {
            errorToast("No internet connection!")
            console.error('Error', error);
        });
    }

    const removeDownload = (id) => {
        fetch(`https://kbbackend.onrender.com/remove_download/${id}`,{
            method: 'GET',
            headers: {'Authorization': `Bearer ${token}`}
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.code !== 0){
                navigate('/login')
            }
            console.log(data)
            if (data.status === 'ok') {
                setSearchResults(searchResults.map((user) => {
                    if (user.user_id === id){
                        const object = {
                            'user_id': user.user_id,
                            'username': user.username,
                            'email': user.email,
                            'profile_url': user.profile_url,
                            'google_auth': user.google_auth,
                            'view_book': user.view_book,
                            'download_book': false,
                            'subscribed': user.subscribed
                        }
                        return object
                    }else{
                        return user
                    }
                }))
                setIsDownload(false)
                showToast(data.message)
            }else {
                errorToast(data.message)
            }
        })
        .catch((error) => {
            errorToast("No internet connection!")
            console.error('Error', error);
        });
    }

    const grantPrivilege = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('privilege',priv)
        formData.append('id',privilegesOverlay.user_id)

        fetch('https://kbbackend.onrender.com/grant_privilege',{
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
                if (priv === 'View'){
                    setSearchResults(searchResults.map((user) => {
                        if (user.user_id === privilegesOverlay.user_id){
                            const object = {
                                'user_id': user.user_id,
                                'username': user.username,
                                'email': user.email,
                                'profile_url': user.profile_url,
                                'google_auth': user.google_auth,
                                'view_book': true,
                                'download_book': user.download_book,
                                'subscribed': user.subscribed
                            }
                            return object
                        }else{
                            return user
                        }
                    }))
                    setIsView(true)
                }else if(priv === 'Download'){
                    setSearchResults(searchResults.map((user) => {
                        if (user.user_id === privilegesOverlay.user_id){
                            const object = {
                                'user_id': user.user_id,
                                'username': user.username,
                                'email': user.email,
                                'profile_url': user.profile_url,
                                'google_auth': user.google_auth,
                                'view_book': user.view_book,
                                'download_book': true,
                                'subscribed': user.subscribed
                            }
                            return object
                        }else{
                            return user
                        }
                    }))
                    setIsDownload(true)
                }
                showToast(data.message)
            }else {
                errorToast(data.message)
            }
        })
        .catch((error) => {
            errorToast("No internet connection!")
            console.error('Error', error);
        });

    }

    return (
        <body className='library_body'>
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
            {showChangeOverlay.state && <div className="change_profile_big">
                <div className="change_profile_overlay">
                    <img src="/images/close.png" width="20px" height="20px" onClick={closeShowChangeOverlay}/>
                    <form onSubmit={handleChangeProfile}>
                        <label className="change_pic_label">Upload picture</label>
                        <div className="upload_change_35">
                            <input type="file" accept="image/jpeg" id="change_pic" onChange={handleFileChange}/>
                            <img src="/images/close.png" width="10px" height="10px" onClick={clearFile}/>
                        </div>
                        <div className="preview">
                            {previewImage && <img src={previewImage} style={{objectFit:'cover'}} alt="Preview" width="200px" height="150px"/>}
                        </div>   
                        <button type="submit">Upload</button>
                    </form>
                </div>
            </div>}                                    
            {addUserOverlay && <div className="overlay_div_big">
                <div className="add_user_form">
                    <div className="close_overlay">
                        <h4>New User</h4>
                        <img src="/images/close.png" width="25px" height="25px" onClick={closeOverlay}/>
                    </div>
                    <form id='add_user_form' onSubmit={handleSubmit}>
                        <div class="txt_field">
                            <input type="email" onChange={(e) => setEmail(e.target.value)} required/>
                            <span></span>
                            <label>Email</label>
                        </div>
                        <div class="txt_field">
                            <input type="text" onChange={(e) => setUsername(e.target.value)} required/>
                            <span></span>
                            <label>Username</label>
                        </div>
                        <div class="txt_field">
                            <input type="password" onChange={(e) => setPassword(e.target.value)} required/>
                            <span></span>
                            <label>Password</label>
                        </div>
                        <div className="roles_and_permissions">
                            <label>Roles and permissions</label>
                            <select id="roles_and_permissions" onChange={(e)=> setRole(e.target.value)} required>
                                <option value="" selected disabled>Select Role</option>
                                <option value="user">User account</option>
                                <option value="admin">Admin account</option>
                            </select>
                        </div>
                        <div className="upload_usr_profile">
                            <label>Upload picture</label>
                            <div className="upload_input">
                                <input type="file" accept="image/jpeg" onChange={(e) => setProfile(e.target.files[0])}/>
                                <img src="/images/close.png" width="10px" height="10px"/>
                            </div>
                        </div>
                        <button type='submit' className='login_button'>Create user</button>
                    </form>
                </div>
            </div>}
            {addMailOverlay.state && <div className="mail_big">
                <div className="mail_user">
                    <div id="title_101">
                        <h4 style={{fontSize:'larger', fontWeight:'600'}}>Send Mail</h4>
                        <img src="/images/close.png" width="20px" height="20px" onClick={close}/> 
                    </div>
                    <div className="mail_user_1">
                        <div className="mail_user_11">To:</div>
                        <div id='email_user' style={{fontSize:'large', borderBottom: '2px solid #FF8400'}}>{addMailOverlay.email}</div>
                    </div> 
                    <form onSubmit={handleMail}>
                        <div className="mail_subject">
                            <label>Subject:</label>
                            <input type="text" required onChange={(e) => setSubject(e.target.value)}/>
                        </div>
                        <div className="mail_body">
                            <label>Body:</label>
                            <textarea id="mail_text" required onChange={(e) => setMailBody(e.target.value)}></textarea>
                        </div>
                        <button type="submit">Send</button>
                    </form>
                </div>
            </div>}
            <div className="user_mgt_intro">
                <h3>User Management System</h3>
                <h4>Hello, {userInfo?userInfo.username:<Navigate to="/login"/>}</h4>
            </div>
            {addDeleteOverlay.state && <div className="delete_overlay_big">
                <div className="delete_overlay">
                    <div className="delete_user_ask">
                        <h4>Delete User?</h4>
                    </div>
                    <h4 id="this_will">This will delete <span id="name_delete">{addDeleteOverlay.user}</span></h4>
                    <div className="delete_and_cancel">
                        <button onClick={closeDeleteOverlay}>Cancel</button>
                        <button onClick={() => {handleDelete(addDeleteOverlay.id)}}>Delete</button>
                    </div>
                </div>
            </div>}
            {addAdminOverlay.state && <div className="delete_overlay_big">
                <div className="delete_overlay">
                    <div className="delete_user_ask">
                        <h4>Elevate privileges?</h4>
                    </div>
                    <h4 id="this_will">This will elevate privileges for <span id="name_delete">{addAdminOverlay.user}</span></h4>
                    <div className="delete_and_cancel">
                        <button onClick={() => {setPrivilegesOverlay({...privilegesOverlay,state:true}); setAddAdminOverlay({state:false, id:'',user:''})}}>Cancel</button>
                        <button style={{background:'#FF8400'}} onClick={() => {handleElevate(addAdminOverlay.id)}}>Confirm</button>
                    </div>
                </div>
            </div>}
            {addUseOverlay.state && <div className="delete_overlay_big">
                <div className="delete_overlay">
                    <div className="delete_user_ask">
                        <h4>Diminish privileges?</h4>
                    </div>
                    <h4 id="this_will">This will diminish privileges for <span id="name_delete">{addUseOverlay.user}</span></h4>
                    <div className="delete_and_cancel">
                        <button onClick={() => {setPrivilegesOverlay({...privilegesOverlay,state:true}); setAddUseOverlay({state:false, id:'',user:''})}}>Cancel</button>
                        <button style={{background:'#FF8400'}} onClick={() => {handleDiminish(addUseOverlay.id)}}>Confirm</button>
                    </div>
                </div>
            </div>}
            {privilegesOverlay.state && <div className="delete_overlay_big">
                <div className="privileges_overlay">
                    <div id="title_101">
                        <h4 style={{fontSize:'larger', fontWeight:'600'}}>Roles and privileges</h4>
                        <img src="/images/close.png" width="20px" height="20px" onClick={()=> setPrivilegesOverlay({state:false,username:'',user_id:"",admin:'',profile_url:''})}/> 
                    </div>
                    <div className="post_profile_and_name" style={{fontSize:'medium',marginLeft:'1.5rem'}}>
                        <div className="post_profile" style={{width:'3rem',height:'3rem'}}>
                            <img src={privilegesOverlay.profile_url}/>
                        </div>
                        {privilegesOverlay.username}
                    </div>
                    <div className="profile_dets" style={{background:'#f2f2f2',height:'2rem',width:'26rem',paddingLeft:'1rem',marginLeft:'1.5rem'}}>
                        Role: <span id="profile_dets_email">{privilegesOverlay.admin?'Administrator':'User'}</span>
                        {privilegesOverlay.admin?
                            <img src="/images/diminish.png" width='15px' height='15px' style={{marginLeft:'13rem'}} onClick={() => {openDiminish(privilegesOverlay.user_id,privilegesOverlay.username)}}/>:
                            <img src="/images/elevate.png" width='15px' height='15px' style={{marginLeft:'17rem'}} onClick={() => {openElevate(privilegesOverlay.user_id,privilegesOverlay.username)}}/>
                        }
                    </div>
                    <div className="overlay_priv">
                        <h4>Privileges</h4>
                        <form onSubmit={grantPrivilege} style={{display:'flex', gap:'3rem',alignItems:'center',marginBottom: '0.5rem'}} required>
                            <select id="priv_select" onChange={(e) => setPriv(e.target.value)}required>
                                <option value="" disabled selected>Select Privilege</option>
                                <option value="View">View access</option>
                                <option value="Download">Download access</option>
                            </select>
                            <button type="submit">Add</button>
                        </form> 
                        {isView && <div className="profile_dets" style={{background:'#f2f2f2',height:'2rem',width:'25rem',fontFamily: "'Inconsolata',monospace",paddingLeft:'1rem',paddingRight:'1rem',justifyContent:'space-between',marginLeft:'0'}}>
                            View Access
                            <img src="/images/delete.png" width="15px" height="15px" onClick={()=> removeView(privilegesOverlay.user_id)}/>
                        </div>}
                        {isDownload && <div className="profile_dets" style={{background:'#f2f2f2',height:'2rem',width:'25rem',fontFamily: "'Inconsolata',monospace",paddingLeft:'1rem',paddingRight:'1rem',justifyContent:'space-between',marginLeft:'0'}}>
                            Download Access
                            <img src="/images/delete.png" width="15px" height="15px" onClick={()=> removeDownload(privilegesOverlay.user_id)}/>
                        </div>}
                    </div>
                </div>
            </div>}
            {addProfileOverlay.state && <div className="profile_overlay_big">
                <div className="profile_overlay">
                    <div className="profile_overlay_cancel">
                        <img src="/images/close.png" width="20px" height="20px" onClick={closeProfileOverlay}/>
                    </div>
                    <div className="profile_image_l">
                        <img src={addProfileOverlay.url}/>
                    </div>
                </div>
            </div>}
            <div className='search_mgt_div'>
                <button onClick={openOverlay}>Create new user<span>+</span></button>
                <form id="search-mgt-form">
                    <img src='/images/search.png' width="25px" height="25px"/>
                    <input type="text" id="search-mgt-input" placeholder="Search Users..." onChange={handleSearch} required/>
                </form>
            </div>
            <div className='big-book_container'>
                <div className='category_container'>
                    <h3 id='exception'>Filters</h3>
                    <div className='category_section'>
                        <div className='level_head'>
                            <h3>Role</h3>
                        </div>
                        <div className='mini_big_1'>
                            <div className='mini_category'>
                                <input type='checkbox' value="user" onChange={handleCheck} required/>
                                <h4>User account</h4>
                            </div>
                            <div className='mini_category'>
                                <input type='checkbox' value="admin" onChange={handleCheck} required/>
                                <h4>Admin account</h4>
                            </div>
                        </div>
                    </div>
                    <div className='level_container'>
                        <div className='level_head'>
                            <h3>Status</h3>
                        </div>
                        <div className='mini_big_1'>
                            <div className='mini_category'>
                                <input type='checkbox' value="confirmed" required onChange={handleStatus}/>
                                <h4>Confirmed</h4>
                            </div>
                            <div className='mini_category'>
                                <input type='checkbox' value="not Confirmed" required onChange={handleStatus}/>
                                <h4>Not Confirmed</h4>
                            </div>
                        </div>
                    </div>
                </div>    
                <div className='book_and_sort'>
                    <div className='config'>
                        <div className='length_pdf'>
                            <h4>{searchResults.length}</h4>results
                        </div>
                    </div>
                    <InfiniteScroll style={{overflow:"unset"}} dataLength={searchResults.length} next={getMoreUsers} hasMore={true} loader={showLoader?<ThreeDotsLoader/>:null}>
                        <Users setIsDownload={setIsDownload} setIsView={setIsView} setAddAdminOverlay={setAddAdminOverlay} setAddMailOverlay={setAddMailOverlay} usersList={searchResults} setSearchResults={setSearchResults} msg={message} token={token} userInfo={userInfo} setAddDeleteOverlay={setAddDeleteOverlay} setShowChangeOverlay={setShowChangeOverlay} setAddProfileOverlay={setAddProfileOverlay} setPrivilegesOverlay={setPrivilegesOverlay}/>
                    </InfiniteScroll>
                </div>
            </div>
        </body>
    );
}

export default Usermgt;