import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import jwt_decode from "jwt-decode";
import './Login.css';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const navigate = useNavigate()
    const [ user, setUser ] = useState({});
      
    function handleCallbackResponse(response) {
      console.log("Encoded JWT Token: " + response.credential);
      var userObject = jwt_decode(response.credential);
      console.log(userObject);
      setUser(userObject);
    }
    
    useEffect(() => {
        /* global google */
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
        fetch('http://localhost:5000/login',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((data) => {
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
                </form>
            </div>
        </body>
    );
}
 
export default Login;