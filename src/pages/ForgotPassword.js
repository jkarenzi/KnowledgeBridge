import { useState } from "react";
import { toast } from 'react-toastify';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [ message, setMessage ] = useState('') 
    const [ email, setEmail ] = useState(null)

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

    const handleSubmit = (e) => {
        e.preventDefault()
        fetch('http://localhost:5000/forgot_password',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(email)
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            if (data.status === 'ok'){
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
        <body class="forgot_body">
            <form className="forgot_form" onSubmit={handleSubmit}>
                <label>Enter the email address associated with this account</label>
                <input type="email" required onChange={(e)=>{setEmail({email: e.target.value})}}/>
                <button type="submit" className="forgot_submit">Submit</button>
            </form>
        </body>
    );
}
 
export default ForgotPassword;