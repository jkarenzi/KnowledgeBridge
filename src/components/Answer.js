import { useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import './Answer.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from "react-infinite-scroll-component";
import ShowQuestions from './ShowQuestions';
import { Navigate } from 'react-router-dom';


const Answer = () => {
    const [ userPost, setUserPost ] = useState('')
    const [questions, setQuestions] = useState([])
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')))
    const [token,setToken] = useState(localStorage.getItem('token'))
    const navigate = useNavigate()
    const [ query, setQuery ] = useState('')
    const [ showLoader, setShowLoader ] = useState(false)
    const [ message, setMessage ] = useState('')
    const [ userAnswer, setUserAnswer ] = useState('')
    const [ openAnswerOverlay, setOpenAnswerOverlay ] = useState({state:false, question:'', question_id:''})

     // Define a CSS loader for the Three Dots animation
    const ThreeDotsLoader = () => (
        <div className="loader">
        <div className="dot dot1"></div>
        <div className="dot dot2"></div>
        <div className="dot dot3"></div>
        </div>
    );

    const [postLoader, setPostLoader] = useState(false)
 

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

    function handleAnswerSubmit (e) {
        e.preventDefault()
        setPostLoader(true)
        const formData = new FormData()
        const currentUTC = new Date();
        currentUTC.setUTCHours(currentUTC.getUTCHours() + 2);
        const timestamp = currentUTC.toISOString();
        formData.append('user_id', userInfo.user_id)
        formData.append('question_id', openAnswerOverlay.question_id)
        formData.append('question', openAnswerOverlay.question)
        formData.append('answer', userAnswer)
        formData.append('timestamp',timestamp)
        fetch('https://kbbackend.onrender.com/add_answer',{
            method: 'POST',
            body: formData,
            headers: {'Authorization': `Bearer ${token}`},
        })
        .then((response) => response.json())
        .then((data) => {
            setPostLoader(false)
            if(data.code !== 0){
                navigate('/login')
            }
            if (data.status === 'ok'){
                closeAnswer()
                showToast(data.message)
            } else {
                errorToast(data.message)
            }
            console.log('Response from Flask:', data);
        })
        .catch((error) => {
            setPostLoader(false)
            errorToast("No internet connection!")
            console.error('Error', error);
        });
    }

    useEffect(() => {
        setShowLoader(true)
        fetch('https://kbbackend.onrender.com/get_questions?&questions=0',{
            method: 'GET',
            headers: {'Authorization': `Bearer ${token}`},
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.code !== 0){
                navigate('/login')
            }
            if (data.status === 'ok'){
                setQuestions(data.questions)
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

    function closeAnswer() {
        setOpenAnswerOverlay({state:false, question:'', question_id:''})
        setUserAnswer('')
        document.body.style.overflow = 'auto';
    }

    const handleSearch = (e) => {
        e.preventDefault()
        setQuestions([])
        setMessage('')
        setShowLoader(true)
        fetch(`https://kbbackend.onrender.com/get_questions?query=${query}&questions=0`,{
            method: 'GET',
            headers: {'Authorization': `Bearer ${token}`},
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.code !== 0){
                navigate('/login')
            }
            if (data.questions.length === 0) {
                setMessage('No matches found')
            } else {
                setMessage('')
            }
            setQuestions(data.questions)
            setShowLoader(false)
        })
        .catch((error) => {
            errorToast("No internet connection!")
            console.error('Error', error);
        });
    }

    const getMoreQuestions = () => {
        setShowLoader(true)
        fetch(`https://kbbackend.onrender.com/get_questions?query=${query}&questions=${questions.length}`,{
            method: 'GET',
            headers: {'Authorization': `Bearer ${token}`},
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.code !== 0){
                navigate('/login')
            }
            if (data.status === 'ok'){
                setQuestions([...questions, ...data.questions])
                setShowLoader(false)
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
        <div className='community_big'>
            <div className="community_search_bar">
                <form onSubmit={handleSearch}>
                    <button style={{border:'none', outline:'none', display:'flex',alignItems:'center',justifyContent:'center',background:'none', width:'25px'}}>
                        <img src='/images/search.png' width="25px" height="25px"/>
                    </button>
                    <input type="text" onChange={(e) => setQuery(e.target.value)} placeholder="Browse questions..."/>
                </form>
            </div>
            {openAnswerOverlay.state && <div className='answer_big'>
                <div className='answer_container'>
                    <div className="post_overlay_cancel_c">
                        <img src="/images/close.png" width="20px" height="20px" onClick={closeAnswer}/>
                    </div>
                    <div className="post_profile_and_name">
                        <div className="post_profile">
                            <img src={userInfo?userInfo.profile_url:<Navigate to="/login"/>}/>
                        </div>
                        {userInfo?userInfo.username:<Navigate to="/login"/>}
                    </div>
                    <div className='question_div_answer'>{openAnswerOverlay.question}</div>
                    <form onSubmit={handleAnswerSubmit}>
                        <ReactQuill
                            value={userAnswer}
                            onChange={setUserAnswer}
                            theme="snow" // You can choose a different theme if desired
                            className="react_quill_editor_1"
                        />
                        <button id="post_answer" type="submit">Submit</button>
                    </form>
                    {postLoader && <ThreeDotsLoader/>}
                </div>
            </div>}
            <div className='all_questions'>
                <div className='questions_intro'>
                    Questions for you
                </div>
                <InfiniteScroll style={{overflow:"unset"}} dataLength={questions.length} next={getMoreQuestions} hasMore={true} loader={showLoader?<ThreeDotsLoader/>:null}>
                    <ShowQuestions questions={questions} setQuestions={setQuestions} setOpenAnswerOverlay={setOpenAnswerOverlay} message={message} userInfo={userInfo} token={token}/>
                </InfiniteScroll>
            </div> 
        </div> 
    );
}

export default Answer;