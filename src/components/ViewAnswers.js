import { useEffect,useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import Header from "./Header";
import { Link } from "react-router-dom";
import './ViewAnswers.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import InfiniteScroll from "react-infinite-scroll-component";

const ViewAnswers = () => {
    const { id } = useParams()
    const [ answers, setAnswers ] = useState([])
    const [ question, setQuestion ] = useState({})
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const token = localStorage.getItem('token')
    const location = useLocation()
    const [ userAnswer, setUserAnswer ] = useState('')
    const [ openAnswerOverlay, setOpenAnswerOverlay ] = useState({state:false, question:'', question_id:''})
    const [ dotsmenu, setDotsMenu ] = useState({state:false,id:''})
    const [ showLoader, setShowLoader ] = useState(false)

    const ThreeDotsLoader = () => (
        <div className="loader">
        <div className="dot dot1"></div>
        <div className="dot dot2"></div>
        <div className="dot dot3"></div>
        </div>
    );


    function closeAnswer() {
        setOpenAnswerOverlay({state:false, question:'', question_id:''})
        document.body.style.overflow = 'auto';
    }

    function openAnswer(question, id) {
        setOpenAnswerOverlay({state:true,question:question,question_id:id})
        document.body.style.overflow = 'hidden';
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

    useEffect(()=>{
        fetch(`http://localhost:5000/get_answers/${id}?answers=0`,{
            method: 'GET',
            headers: {'Authorization': `Bearer ${token}`},
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === 'ok'){
                setAnswers(data.answers)
                setQuestion(data.question)
            }    
            console.log('Response from Flask:', data);
        })
        .catch((error) => {
            errorToast("No internet connection!")
            console.error('Error fetching PDF books', error);
        });
    },[])

    function handleAnswerSubmit (e) {
        e.preventDefault()
        const formData = new FormData()

        const currentUTC = new Date();
        currentUTC.setUTCHours(currentUTC.getUTCHours() + 2);
        const timestamp = currentUTC.toISOString();

        formData.append('user_id', userInfo.user_id)
        formData.append('question_id', openAnswerOverlay.question_id)
        formData.append('question', openAnswerOverlay.question)
        formData.append('answer', userAnswer)
        formData.append('timestamp',timestamp)
        fetch('http://localhost:5000/add_answer',{
            method: 'POST',
            body: formData,
            headers: {'Authorization': `Bearer ${token}`},
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === 'ok'){
                closeAnswer()
                showToast(data.message)
            } else {
                errorToast(data.message)
            }
            console.log('Response from Flask:', data);
        })
    }

    const handleAnswerDelete = (id) => {
        fetch(`http://localhost:5000/delete_answer/${id}`,{
            method: 'DELETE',
            headers: {'Authorization': `Bearer ${token}`},
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === 'ok'){
                setAnswers(answers.filter((answer) => answer.answer_id !== id ))
                setDotsMenu({state:false,id:''})
                showToast(data.message)
            } else {
                errorToast(data.message)
            }
            console.log('Response from Flask:', data);
        })
    }

    const links = [
        {id: 1, text: 'Community', url: '/community', icon:'/images/community.png'},
        {id: 2, text: 'Admin', url: '/admin', icon:'/images/admin_logo.png'},
        {id: 3, text: 'Library', url: '/library', icon:'/images/library.png'},
        {id: 4, text: 'Settings', url: '/settings', icon:'/images/settings.png'}
    ]

    const getMoreAnswers = () => {
        setShowLoader(true)
        setTimeout(() => {
            fetch(`http://localhost:5000/get_answers/${id}?answers=${answers.length}`,{
                method: 'GET',
                headers: {'Authorization': `Bearer ${token}`},
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'ok'){
                    setAnswers([...answers, ...data.answers])
                    setShowLoader(false)
                } else {
                    errorToast(data.message)
                }
                console.log('Response from Flask:', data);
            })
        },2000)
    }

    return (
        <body className="view_answers_body">
            <Header links={links} userInfo={userInfo}/> 
            <div className="community_header">
                <div className="community_header_icons">
                    <div className="community_div" style={{borderBottom: location.pathname === '/community'?'4px solid #FF8400':'none'}}>
                        <Link to="/community"><img src="/images/home.png" width="25px" height="25px"/></Link>
                    </div>
                    <div className="community_div" style={{borderBottom: location.pathname === '/community/answer'?'4px solid #FF8400':'none'}}>
                        <Link to="/community/answer"><img src="/images/answer.png" width="25px" height="25px"/></Link>
                    </div>
                </div>
            </div>
            {openAnswerOverlay.state && <div className='answer_big'>
                <div className='answer_container'>
                    <div className="post_overlay_cancel_c">
                        <img src="/images/close.png" width="20px" height="20px" onClick={closeAnswer}/>
                    </div>
                    <div className="post_profile_and_name">
                        <div className="post_profile">
                            <img src={userInfo.profile_url}/>
                        </div>
                        {userInfo.username}
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
                </div>
            </div>}
            <div className="community_big">
                <div className="view_answers_intro">
                    <div className="view_answers_question">
                        {question.question}
                    </div>
                    <div className="view_answers_profile_big">
                        <div className="view_answers_profile">
                            <img src={userInfo.profile_url}/>
                        </div>
                    </div>
                    <div className="view_answers_text">
                        {userInfo.username}, can you answer this question?
                    </div>
                    <button id='answer_button' onClick={()=> openAnswer(question.question, question.question_id)}>
                        Answer
                        <img src='/images/answer.png' width="15px" height="15px"/>
                    </button>
                </div>
                <InfiniteScroll dataLength={answers.length} next={getMoreAnswers} hasMore={true} loader={showLoader?<ThreeDotsLoader/>:null}>
                    {answers.map((answer) => (
                        <div className="answer_post_div">
                            <div className="profile_and_info">    
                                <div className="post_profile_5">
                                    <img src={answer.profile_url}/>
                                </div>
                                <div className="user_info_container">
                                    <h4>{answer.username}</h4>
                                    <h4 style={{fontSize:'small',color:'grey'}}>{answer.created_at}</h4>
                                </div>
                            </div>
                            <div className="actual_post" dangerouslySetInnerHTML={{__html:answer.answer}}></div>
                            {(userInfo.username === answer.username || userInfo.admin) && <img onClick={() => setDotsMenu({state:true,id:answer.answer_id})} className='three_dots_img_1' src="/images/dots.png"/>}
                            {(dotsmenu.state && dotsmenu.id === answer.answer_id) && <div className="dots_menu" style={{top:'5rem'}}>
                                <img src="/images/close.png" width="12px" height="12px" onClick={() => setDotsMenu({state:false,id:''})}/>
                                <div className="dots_menu_13" onClick={() => handleAnswerDelete(dotsmenu.id)}>Delete answer</div>
                            </div>}
                        </div>
                    ))}
                </InfiniteScroll>
            </div>
        </body>
    );
}
 
export default ViewAnswers;