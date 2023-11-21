import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({username:"", password:"",confirmPassword:'', email:""})
    const navigate = useNavigate()

    const showToast = () => {
        toast.success('Sign up successful!', {
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
        fetch('https://kbbackend.onrender.com/signup',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        })    
        .then((response) => response.json())
        .then((data) => {
            if (data.status === 'ok') {
                navigate('/login')
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
                <h1>Signup</h1>
                <form onSubmit={handleSubmit}>
                    <div class="txt_field">
                        <input type="email" onChange={(e) => setFormData({...formData, email:e.target.value})} required/>
                        <span></span>
                        <label>Email</label>
                    </div>
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
                    <div class="txt_field">
                        <input type="password" onChange={(e) => setFormData({...formData, confirmPassword:e.target.value})} required/>
                        <span></span>
                        <label>Confirm Password</label>
                    </div>
                    <button type='submit' className='login_button'>Signup</button>
                    <div class="signup_link">Already a member?<Link to="/login" className = 'signup'>Login</Link></div>
                </form>
            </div>
        </body>   
    );
}
 
export default Signup;