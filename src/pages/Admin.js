import { useEffect, useState } from 'react';
import './Admin.css';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [ category, setCategory ] = useState('')
    const [ level, setLevel ] = useState('')
    const [ pdfFiles, setPdfFiles ] = useState(null);
    const [countData, setCountData ] = useState([])
    const [ showLoader, setShowLoader ] = useState(false)
    const [ uploadLoader, setUploadLoader ] = useState(false)
    const [ openAddBookOverlay, setOpenAddBookOverlay ] = useState(false)


    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const token = localStorage.getItem('token')
    console.log(token)
    
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

    useEffect(() => {
        if(!userInfo.admin){
            navigate('/library')
            errorToast("Access Denied")
        }
    },[])

    useEffect(() => {
        setShowLoader(true)
        fetch('https://kbbackend.onrender.com/get_info_books',{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.code !== 0){
                navigate('/login')
            }
            setCountData(data.category_count)
            setShowLoader(false)
        })
        .catch((error) => {
            errorToast("No internet connection!")
            console.error('Error', error);
        });
    },[])

    const handleSubmit = (e) => {
        e.preventDefault()
        setUploadLoader(true)
        const formData = new FormData()
        formData.append('category', category)
        formData.append('level', level)
        
        for (let i=0; i < pdfFiles.length; i++){
            formData.append('files', pdfFiles[i])
        }
        
        fetch('https://kbbackend.onrender.com/add_books',{
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
        .then((response) => response.json())
        .then((data) => {
            setUploadLoader(false)
            if(data.code !== 0){
                navigate('/login')
            }
            if (data.status === 'success'){
                showToast(data.message)
            }else{
                errorToast(data.message)
            }
            console.log(data)
        })
        .catch((error) => {
            setUploadLoader(false)
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

    const clearFile = () => {
        const inputField = document.getElementById('upload_pdf')
        inputField.value = null
    }

    return (
        <body className='admin_body'>
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
            <h3 id='cmp'>Content Management Portal</h3>
            <h1 id='cmp1' style={{textAlign:'left',marginLeft:'2rem',fontWeight:500}}>Categories</h1> 
            <div style={{minHeight:'8rem',marginBottom:'2rem'}}>
                {showLoader?<ThreeDotsLoader/>:
                <div className='category_count'>
                    {countData.map((category) => (
                        <div className='count_22'>
                            <h4>{category.count}</h4>
                            {category.category}    
                        </div>    
                    ))}
                </div>}
            </div>
            <button onClick={() => {document.body.style.overflow='hidden';setOpenAddBookOverlay(true)}} className='add_book_btn'>Add book</button>
            {openAddBookOverlay && <div className="change_username_big">
                <div className="add_book_overlay">
                    <div id="title_101">
                        <h4 style={{fontSize:'large'}}>Add a book</h4>
                        <img src="/images/close.png" width="20px" height="20px" style={{cursor: 'pointer'}} onClick={() => {document.body.style.overflow='auto';setOpenAddBookOverlay(false)}}/> 
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className='category'>
                            <label>Category</label>
                            <select id="category" onChange={(e) => setCategory(e.target.value)} required>
                                <option value="" disabled selected>Select Category</option>
                                <option value="Computer science">Computer science</option>
                                <option value="Childrens' books">Childrens' books</option>
                                <option value="Physics">Physics</option>
                                <option value="Chemistry">Chemistry</option>
                                <option value="Arts">Arts</option>
                                <option value="Music">Music</option>
                                <option value="Religion">Religion</option>
                            </select>
                            <label>Level of Education</label>
                            <select id="levels" onChange={(e) => setLevel(e.target.value)} required>
                                <option value="" disabled selected>Select Level</option>
                                <option value="Undergraduate">Undergraduate</option>
                                <option value="A'Level">A'Level</option>
                                <option value="O'Level">O'Level</option>
                                <option value="Primary">Primary</option>
                            </select>
                        </div>
                        <div className='upload_pdf'>
                            <label>Upload book(s)</label>
                            <div className='upload_input'>
                                <input type="file" id="upload_pdf" accept=".pdf" onChange={(e) => setPdfFiles(e.target.files)} multiple required/>
                                <img src="/images/close.png" width="10px" height="10px" onClick={clearFile}/>
                            </div>
                        </div>
                        <button type="submit" id='submit_pdf'>Upload</button>
                        {uploadLoader && <ThreeDotsLoader/>}
                    </form>
                </div>
            </div>}
        </body>
    );
}
 
export default Admin;