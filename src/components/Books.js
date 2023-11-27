import { useState } from 'react';
import { useEffect } from 'react';
import './Books.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';

const Books = (props) => {
    const navigate = useNavigate()
    const token = props.token
    const userInfo = props.userInfo

    const [bookLoader, setBookLoader] = useState(false)

     // Define a CSS loader for the Three Dots animation
    const ThreeDotsLoader = () => (
        <div className="loader">
        <div className="dot dot1"></div>
        <div className="dot dot2"></div>
        <div className="dot dot3"></div>
        </div>
    );

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

    const showBook = (id,pdf) => {
        setBookLoader({state:true,id:id})
        const formData = new FormData()
        formData.append('id', userInfo.user_id)
        fetch('https://kbbackend.onrender.com/get_permissions',{
            method: 'POST',
            body: formData,
            headers: {'Authorization': `Bearer ${token}`}
        })
        .then((response) => response.json())
        .then((data) => {
            setBookLoader({state:false,id:''})
            if(data.code !== 0){
                navigate('/login')
            }
            if(data.status === 'ok'){
                if(data.permissions.view_book){
                    navigate(`/viewBook/${id}`)
                }else{
                    props.setView({state:true,pdf:pdf})
                }
            }
        })
        .catch((error) => {
            setBookLoader({state:false,id:''})
            errorToast("No internet connection!")
            console.error('Error', error);
        });
    }

    const Download = (id,pdf) => {
        setBookLoader({state:true,id:id})
        const formData = new FormData()
        formData.append('id', userInfo.user_id)
        fetch('https://kbbackend.onrender.com/get_permissions',{
            method: 'POST',
            body: formData,
            headers: {'Authorization': `Bearer ${token}`}
        })
        .then((response) => response.json())
        .then((data) => {
            setBookLoader({state:false,id:''})
            if(data.code !== 0){
                navigate('/login')
            }
            if(data.status === 'ok'){
                console.log(data)
                if(data.permissions.download_book){
                    window.open(`https://kbbackend.onrender.com/download/${id}?user_id=${userInfo.user_id}`);
                }else{
                    props.setDownload({state:true,pdf:pdf})
                }
            }
        })
        .catch((error) => {
            setBookLoader({state:false,id:''})
            errorToast("No internet connection!")
            console.error('Error', error);
        });
    }

    function openDeleteOverlay(id, pdf) {
        console.log(id)
        props.setAddDeleteOverlay({state:true, id:id, pdf:pdf})
        document.body.style.overflow = 'hidden';
    }


    if (props.bookList.length === 0) {
        return (
            <h3 id='error_msg'>{props.msg}</h3>
        )
    } else {
        return (
            <div className='book_container'>
                {props.bookList.map((book) => (
                    <div className='book' key={book.file_id}>
                        <div className='book_name'>
                            <img src="/images/pdf_image.jpeg" width='20px' height='25px'/>
                            { book.filename}
                            {(bookLoader.state && bookLoader.id === book.file_id) && <ThreeDotsLoader/>}
                        </div>
                        <div className='book_options'>
                            <img src='/images/book.png' onClick={()=>{showBook(book.file_id,book.filename)}}/>
                            <img src='/images/download.png' onClick={() => Download(book.file_id,book.filename)}/>
                            {userInfo?userInfo.admin && <img src='/images/delete.png' onClick={()=> {openDeleteOverlay(book.file_id, book.filename)}}/>:<Navigate to="/login"/>}   
                        </div>
                    </div>
                ))}
            </div>
        );
    }    
}
 
export default Books;