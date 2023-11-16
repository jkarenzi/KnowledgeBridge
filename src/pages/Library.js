import { useState } from 'react';
import { useEffect } from 'react';
import Books from '../components/Books';
import './Library.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../components/Header';

const Library = () => {
    const [ query, setQuery ] = useState('')
    const [searchResults, setSearchResults ] = useState([])
    const [categories, setCategories ] = useState([])
    const [ levels, setLevels ] = useState([])
    const [ message, setMessage ] = useState('')
    const [ addDeleteOverlay, setAddDeleteOverlay ] = useState({state:false, id:'', pdf:''})

    const navigate = useNavigate()

    const token = localStorage.getItem('token')
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const [ showLoader, setShowLoader ] = useState(false)

     // Define a CSS loader for the Three Dots animation
    const ThreeDotsLoader = () => (
        <div className="loader">
        <div className="dot dot1"></div>
        <div className="dot dot2"></div>
        <div className="dot dot3"></div>
        </div>
    );

    function closeDeleteOverlay() {
        setAddDeleteOverlay({state:false, id:'', pdf:''})
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

    const handleSearchCheck = () => {
        setSearchResults([])
        setMessage('')
        setShowLoader(true)
        setTimeout(()=> {
            fetch(`http://localhost:5000/get_books?books=0&categories=${categories}&levels=${levels}&query=${query}`,{
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

                if (data.pdf_books.length === 0) {
                    setMessage('No matches found')
                } else {
                    setMessage('')
                }
                setSearchResults(data.pdf_books)
                setShowLoader(false)
            })
            .catch((error) => {
                console.error('Error fetching PDF books', error);
            });
            }, 2000)
    }

    const handleCheck = (e) => {
        if (e.target.checked) {
            if (categories.length === 0) {
                setCategories([e.target.value]);
                
            } else {
                setCategories([...categories, e.target.value]);
            }       
        } else {
            setCategories(categories.filter(category => category !== e.target.value)); 
        }
    }
    

    const handleLevels = (e) => {
        if (e.target.checked) {
            if (levels.length === 0) {
                setLevels([e.target.value]);
            } else {
                setLevels([...levels, e.target.value]);
            }    
        } else {
            setLevels(levels.filter(level => level !== e.target.value));
        }
    }
    

    useEffect(() => {
        // Fetch the list of PDF books from Flask backend
        fetch('http://localhost:5000/get_books?books=0',{
            method: 'GET',
            headers: {'Content-Type': 'application/json','Authorization': `Bearer ${token}`}
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            if (data.code !== 0) {
                navigate('/login')
            }

            setSearchResults(data.pdf_books)
        })
        .catch((error) => {
            setShowLoader(false)
            errorToast("No internet connection!")
            console.error('Error fetching PDF books', error);
        });
    }, []);

    useEffect(() => {
        handleSearchCheck()
    }, [categories, levels])

    const handleSearch = (e) => {
        e.preventDefault()
        setSearchResults([])
        setMessage('')
        setShowLoader(true)
        setTimeout(() => {
            fetch(`http://localhost:5000/get_books?books=0&query=${query}&categories=${categories}&levels=${levels}`,{
                method: 'GET',
                headers: {'Content-Type': 'application/json','Authorization': `Bearer ${token}`}
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.pdf_books.length === 0) {
                    setMessage('No matches found')
                } else {
                    setMessage('')
                }
                setSearchResults(data.pdf_books)
                setShowLoader(false)
            })
            .catch((error) => {
                setShowLoader(false)
                errorToast("No internet connection!")
                console.error('Error fetching PDF books', error);
            }); 
        }, 2000)
    }
    

    const getMoreBooks = () => {
        setShowLoader(true)
        setTimeout(() => {
            fetch(`http://localhost:5000/get_books?books=${searchResults.length}&query=${query}&categories=${categories}&levels=${levels}`,{
            method: 'GET',
            headers: {'Content-Type': 'application/json','Authorization': `Bearer ${token}`}
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.code !== 0) {
                    navigate('/login')
                }

                setSearchResults([...searchResults, ...data.pdf_books])
                setShowLoader(false)
            })
            .catch((error) => {
                setShowLoader(false)
                errorToast("No internet connection!")
                console.error('Error fetching PDF books', error);
            });  
               
        }, 2000); 
    }

    const handleDelete = (id) => {
        fetch(`http://localhost:5000/delete_book/${id}`,{
            method: 'DELETE',
            headers: {'Authorization': `Bearer ${token}`}
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.code !== 0) {
                navigate('/login')
            }
            console.log(data)
            if (data.msg === 'Book deleted successfully') {
                closeDeleteOverlay()
                showToast(data.msg)
                setSearchResults(searchResults.filter((book) => book.file_id !== id))
            } else {
                errorToast(data.msg)
            }
        })
        .catch((error) => {
            setShowLoader(false)
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
        <body className='library_body'>
            <Header links={links} userInfo={userInfo}/>
            <div className='search_div'>
                <h3>Explore Knowledgebridge Library</h3>
                <form id="search-form" onSubmit={handleSearch}>
                    <input type="text" id="search-input" placeholder="Search Knowledgebridge Library" onChange={(e) => setQuery(e.target.value.toLowerCase())}/>
                    <button type="submit" id='search_submit'>Search</button>
                </form>
            </div>
            {addDeleteOverlay.state && <div className="delete_overlay_big">
                <div className="delete_overlay">
                    <div className="delete_user_ask">
                        <h4>Delete Book?</h4>
                    </div>
                    <h4 id="this_will">This will delete <span id="name_delete">{addDeleteOverlay.pdf}</span></h4>
                    <div className="delete_and_cancel">
                        <button onClick={closeDeleteOverlay}>Cancel</button>
                        <button onClick={() => {handleDelete(addDeleteOverlay.id)}}>Delete</button>
                    </div>
                </div>
            </div>}
            <div className='big-book_container'>
                <div className='category_container'>
                    <h3 id='exception'>Filters</h3>
                    <div className='category_section'>
                    <div className='level_head'>
                            <h3>Category</h3>
                        </div>
                        <div className='mini_big'>
                            <div className='mini_category'>
                                <input type='checkbox' value="Computer science" required onChange={handleCheck}/>
                                <h4>Computer Science</h4>
                            </div>
                            <div className='mini_category'>
                                <input type='checkbox' value="Childrens' books" required onChange={handleCheck}/>
                                <h4>Childrens' books</h4>
                            </div>
                            <div className='mini_category'>
                                <input type='checkbox' value="Physics"required onChange={handleCheck}/>
                                <h4>Physics</h4>
                            </div>
                            <div className='mini_category'>
                                <input type='checkbox' value="Chemistry" required onChange={handleCheck}/>
                                <h4>Chemistry</h4>
                            </div>
                            <div className='mini_category'>
                                <input type='checkbox' value="Arts" required onChange={handleCheck}/>
                                <h4>Arts</h4>
                            </div>
                            <div className='mini_category'>
                                <input type='checkbox' value="Music" required onChange={handleCheck}/>
                                <h4>Music</h4>
                            </div>
                            <div className='mini_category'>
                                <input type='checkbox' value="Religion" required onChange={handleCheck}/>
                                <h4>Religion</h4>
                            </div>
                        </div>
                    </div>
                    <div className='level_container'>
                        <div className='level_head'>
                            <h3>Level</h3>
                        </div>
                        <div className='mini_big_1'>
                            <div className='mini_category'>
                                <input type='checkbox' value="Primary" required onChange={handleLevels}/>
                                <h4>Primary</h4>
                            </div>
                            <div className='mini_category'>
                                <input type='checkbox' value="O'Level" required onChange={handleLevels}/>
                                <h4>O'Level</h4>
                            </div>
                            <div className='mini_category'>
                                <input type='checkbox' value="A'Level" required onChange={handleLevels}/>
                                <h4>A'Level</h4>
                            </div>
                            <div className='mini_category'>
                                <input type='checkbox' value="Undergraduate" required onChange={handleLevels}/>
                                <h4>Undergraduate</h4>
                            </div>
                        </div>
                    </div>
                </div>  
                <div className='book_and_sort'>
                    <div className='config'>
                        <div className='length_pdf'>
                            <h4>{searchResults.length}</h4>results
                        </div>
                        <div className='sortby'>
                            <h3>Sort by</h3>
                            <select id="sortby"  required>
                                <option value="" selected>Relevance</option>
                            </select>
                        </div>
                    </div>
                    <InfiniteScroll dataLength={searchResults.length} next={getMoreBooks} hasMore={true} loader={showLoader?<ThreeDotsLoader/>:null}>
                        <Books bookList={searchResults} msg={message} token={token} setSearchResults={setSearchResults} userInfo={userInfo} setAddDeleteOverlay={setAddDeleteOverlay}/>
                    </InfiniteScroll>
                </div>
            </div>
        </body>
    );
}
 
export default Library;