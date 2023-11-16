import { useState } from 'react';
import { useEffect } from 'react';
import './Books.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Books = (props) => {
    const navigate = useNavigate()
    const token = props.token
    const userInfo = props.userInfo

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

    const showBook = (id) => {
        navigate(`/viewBook/${id}`)
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
                        </div>
                        <div className='book_options'>
                            <img src='/images/book.png' onClick={()=>{showBook(book.file_id)}}/>
                            <a href={`http://localhost:5000/download/${book.file_id}`}><img src='/images/download.png' /></a>
                            {userInfo.admin && <img src='/images/delete.png' onClick={()=> {openDeleteOverlay(book.file_id, book.filename)}}/>}   
                        </div>
                    </div>
                ))}
            </div>
        );
    }    
}
 
export default Books;