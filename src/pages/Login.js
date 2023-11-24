import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import jwt_decode from "jwt-decode";
import './Login.css';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const navigate = useNavigate()
    const [ loginLoader, setLoginLoader ] = useState(false)

    const ThreeDotsLoader = () => (
        <div className="loader">
        <div className="dot dot1"></div>
        <div className="dot dot2"></div>
        <div className="dot dot3"></div>
        </div>
    );
      
    function handleCallbackResponse(response) {
        setLoginLoader(true)
        console.log("Encoded JWT Token: " + response.credential);
        const userObject = jwt_decode(response.credential);
        console.log(userObject);

        const formData = new FormData()
        formData.append('username',userObject.name)
        formData.append('email',userObject.email)
        formData.append('profile_url',userObject.picture)

        fetch('https://kbbackend.onrender.com/google_login',{
            method: 'POST',
            body: formData
        })
        .then((response) => response.json())
        .then((data) => {
            setLoginLoader(false)
            if (data.status === 'ok'){
                localStorage.setItem('token', data.token)
                localStorage.setItem('userInfo', JSON.stringify(data.user_info))
                navigate('/library')
                showToast()
            } else {
                errorToast(data.message)
            }
            console.log('Response from Flask:', data);
        })
        .catch((error) => {
            setLoginLoader(false)
            errorToast("No internet connection!")
            console.error('Error', error);
        });
    }
    
    useEffect(() => {
        /* global google */
        try {
            const google = window.google;
            google.accounts.id.initialize({
                client_id: "582051729507-iabd2a7mfi5abvncgh15ih436o0e50ku.apps.googleusercontent.com",
                callback: handleCallbackResponse
            })

            google.accounts.id.renderButton(
                document.getElementById('signInDiv'),
                {theme: 'outline', size: 'large'}
            );
        
            google.accounts.id.prompt(); 
        } catch(err) {
            window.location.reload()
        }
    },[])
    

    
    const [formData, setFormData] = useState({username:"", password:""})

    const showToast = () => {
        toast.success('Login successful!', {
          position: toast.POSITION.TOP_RIGHT, // Set the position
        });
    };

    const errorToast = (msg) => {
        toast.error(msg, {
          position: toast.POSITION.TOP_RIGHT, // Set the position
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoginLoader(true)
        fetch('https://kbbackend.onrender.com/login',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((data) => {
            setLoginLoader(false)
            if (data.status === 'ok'){
                localStorage.setItem('token', data.token)
                localStorage.setItem('userInfo', JSON.stringify(data.user_info))
                navigate('/library')
                showToast()
            } else {
                errorToast(data.message)
            }
            console.log('Response from Flask:', data);
        })
        .catch((error) => {
            setLoginLoader(false)
            errorToast("No internet connection!")
            console.error('Error', error);
        });
    }

    return (
        <body className='login_body'>
            <div className='bg-image'>
                <img src="/images/ccccc.jpeg"/>
            </div>
            <div class="center">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div class="txt_field">
                        <input type="text" onChange={(e) => setFormData({...formData, username:e.target.value})} required/>
                        <span></span>
                        <label>Username</label>
                    </div>
                    <div class="txt_field">
                        <input type="password" onChange={(e) => setFormData({...formData, password:e.target.value})} required/>
                        <span></span>
                        <label>Password</label>
                    </div>
                    <div class="pass"><Link to='/forgot'>Forgot Password?</Link></div>
                    <button type='submit' className='login_button'>Login</button>
                    <div class="signup_link">Not a member?<Link to="/signup" className = 'signup'>Signup</Link></div>
                    <div className='or'>OR</div>
                    <div id='signInDiv'></div>
                    {loginLoader && <ThreeDotsLoader/>}
                </form>
            </div>
        </body>
    );
}
 
export default Login;