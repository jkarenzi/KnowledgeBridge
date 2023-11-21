import { Link, useNavigate } from "react-router-dom"
import './HomeCommunity.css'
import { useState, useEffect } from "react"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the styles
import { toast } from 'react-toastify';
import InfiniteScroll from "react-infinite-scroll-component";
import ShowPosts from "./ShowPosts";
import { Navigate } from "react-router-dom";


const HomeCommunity = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const token = localStorage.getItem('token')
    const [ showAsk, setShowAsk ] = useState(false)
    const [ showPost, setShowPost ] = useState(false)
    const [ openCommOverlay, setOpenCommOverlay ] = useState(false)
    const [ userPost, setUserPost ] = useState('')
    const [ question, setQuestion ] = useState('')
    const [ posts, setPosts ] = useState([])
    const [ query, setQuery ] = useState('')
    const [ showLoader, setShowLoader ] = useState(false)
    const [ message, setMessage ] = useState('')
    const navigate = useNavigate()

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


    useEffect(()=>{
        setShowLoader(true)
        fetch('https://kbbackend.onrender.com/get_posts?posts=0',{
            method: 'GET',
            headers: {'Authorization': `Bearer ${token}`},
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.code !== 0){
                navigate('/login')
            }
            if (data.status === 'ok'){
                setPosts(data.posts)
            } else {
                errorToast(data.message)
            }
            setShowLoader(false)
            console.log('Response from Flask:', data);
        })
        .catch((error) => {
            errorToast("No internet connection!")
            console.error('Error', error);
        });
    },[])

    const handleAddSubmit = (e) => {
        e.preventDefault()
        const currentUTC = new Date();
        currentUTC.setUTCHours(currentUTC.getUTCHours() + 2);
        const timestamp = currentUTC.toISOString();

        const formData = new FormData()

        formData.append('id', userInfo.user_id)
        formData.append('question', question)
        formData.append('timestamp', timestamp)
        
        fetch('https://kbbackend.onrender.com/add_question',{
            method: 'POST',
            headers: {'Authorization': `Bearer ${token}`},
            body: formData
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.code !== 0){
                navigate('/login')
            }
            if (data.status === 'ok'){
                CloseComm()
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

    const handlePostSubmit = (e) => {
        e.preventDefault()
        const currentUTC = new Date();
        currentUTC.setUTCHours(currentUTC.getUTCHours() + 2);
        const timestamp = currentUTC.toISOString();
        const formData = new FormData()

        formData.append('id', userInfo.user_id)
        formData.append('timestamp', timestamp)
        formData.append('user_post', userPost)

        fetch('https://kbbackend.onrender.com/add_post',{
            method: 'POST',
            headers: {'Authorization': `Bearer ${token}`},
            body: formData
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.code !== 0){
                navigate('/login')
            }
            if (data.status === 'ok'){
                CloseComm()
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

    const showAskCategory = () => {
        setShowPost(false)
        setShowAsk(true)
    }

    const showPostCategory = () => {
        setShowAsk(false)
        setShowPost(true)
    }

    const OpenComm = (action=null) => {
        if (action === 'ask'){
            setShowAsk(true)
        } else if (action === 'post') {
            setShowPost(true)
        } else {
            setShowPost(true)
        }
        setOpenCommOverlay(true)
    }

    const CloseComm = () => {
        setUserPost('')
        setShowAsk(false)
        setShowPost(false)
        setOpenCommOverlay(false)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        setPosts([])
        setMessage('')
        setShowLoader(true)
        fetch(`https://kbbackend.onrender.com/get_posts?query=${query}&posts=0`,{
            method: 'GET',
            headers: {'Authorization': `Bearer ${token}`},
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.code !== 0){
                navigate('/login')
            }
            if (data.posts.length === 0) {
                setMessage('No matches found')
            } else {
                setMessage('')
            }
            setPosts(data.posts)
            setShowLoader(false)
        })
        .catch((error) => {
            errorToast("No internet connection!")
            console.error('Error', error);
        });
    }

    const getMorePosts = () => {
        setShowLoader(true)
        fetch(`https://kbbackend.onrender.com/get_posts?query=${query}&posts=${posts.length}`,{
            method: 'GET',
            headers: {'Authorization': `Bearer ${token}`},
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.code !== 0){
                navigate('/login')
            }
            if (data.status === 'ok'){
                setPosts([...posts, ...data.posts])
                setShowLoader(false)
                console.log(posts)
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
        <div className="community_big">
            <div className="community_search_bar">
                <form onSubmit={handleSearch}>
                    <button style={{border:'none', outline:'none', display:'flex',alignItems:'center',justifyContent:'center',background:'none', width:'25px'}}>
                        <img src='/images/search.png' width="25px" height="25px"/>
                    </button>
                    <input type="text" onChange={(e) => setQuery(e.target.value)} placeholder="Search community..."/>
                </form>
            </div>
            <div className="create_post">
                <div className="create_post_1">
                    <div className="post_profile">
                        <img src={userInfo?userInfo.profile_url:<Navigate to="/login"/>}/>
                    </div>
                    <button onClick={OpenComm}>What do you want to ask or share?</button>
                </div>
                <div className="create_post_2">
                    <button onClick={()=> {OpenComm('ask')}}>
                        <img src="/images/ask.png" width="15px" height="15px"/>
                        Ask
                    </button>|
                    <Link to="/community/answer">
                        <img src="/images/answer.png" width="15px" height="15px"/>
                        Answer
                    </Link>|
                    <button onClick={()=> {OpenComm('post')}}>
                        <img src="/images/post.png" width="15px" height="15px"/>
                        Post
                    </button>
                </div>
            </div>
            {openCommOverlay && <div className="post_overlay_cc">
                <div className="post_or_ask">
                    <div className="post_or_ask_header">
                        <div className="post_overlay_cancel_c">
                            <img src="/images/close.png" width="20px" height="20px" onClick={CloseComm}/>
                        </div>
                        <div className="ask_qn_post_sm">
                            <div className="ask_qn" onClick={showAskCategory} style={{borderBottom:showAsk?'3px solid #204fdc':'none'}}>
                                Ask question
                            </div>
                            <div className="post_sm" onClick={showPostCategory} style={{borderBottom:showPost?'3px solid #204fdc':'none'}}>
                                Create post
                            </div>
                        </div>   
                    </div>
                    {showAsk && <form id="add_form" onSubmit={handleAddSubmit}>
                        <div className="post_profile_and_name">
                            <div className="post_profile">
                                <img src={userInfo?userInfo.profile_url:<Navigate to="/login"/>}/>
                            </div>
                            {userInfo?userInfo.username:<Navigate to="/login"/>}
                        </div>
                        <input type="text" placeholder='Start your question with "What","How", "Why" etc' onChange={(e)=>{setQuestion(e.target.value)}}/>
                        <button type="submit">Add question</button>
                    </form>}
                    {showPost && <form id="post_form" onSubmit={handlePostSubmit}>
                        <div className="post_profile_and_name">
                            <div className="post_profile">
                                <img src={userInfo?userInfo.profile_url:<Navigate to="/login"/>}/>
                            </div>
                            {userInfo?userInfo.username:<Navigate to="/login"/>}
                        </div>
                        <ReactQuill
                            value={userPost}
                            onChange={setUserPost}
                            theme="snow" // You can choose a different theme if desired
                            className="react_quill_editor"
                        />
                        <button id="post_form_btn" type="submit">Create post</button>
                    </form>}
                </div>
            </div>}
            <InfiniteScroll style={{overflow:"unset"}} dataLength={posts.length} next={getMorePosts} hasMore={true} loader={showLoader?<ThreeDotsLoader/>:null}>
                <ShowPosts posts={posts} setPosts={setPosts} message={message} userInfo={userInfo} token={token}/>
            </InfiniteScroll>
        </div> 
    );
}

export default HomeCommunity;