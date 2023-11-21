import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

const ShowQuestions = (props) => {
    const [ dotsmenu, setDotsMenu ] = useState({state:false,id:''})
    const navigate = useNavigate()
    

    const questions = props.questions
    const setQuestions = props.setQuestions
    const setOpenAnswerOverlay = props.setOpenAnswerOverlay
    const userInfo = props.userInfo
    const token = props.token
    

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

    function openAnswer(question, id) {
        setOpenAnswerOverlay({state:true,question:question,question_id:id})
        document.body.style.overflow = 'hidden';
    }

    function showAnswers(id) {
        navigate(`/viewAnswers/${id}`)
    }

    const handleQuestionDelete = (id) => {
        fetch(`https://kbbackend.onrender.com/delete_question/${id}`,{
            method: 'DELETE',
            headers: {'Authorization': `Bearer ${token}`},
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.code !== 0){
                navigate('/login')
            }
            if (data.status === 'ok'){
                setQuestions(questions.filter((question) => question.question_id !== id ))
                setDotsMenu({state:false,id:''})
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

    if (questions.length === 0){
        return (
            <h3 id='error_msg'>{props.message}</h3>
        )
    } else {
        return (
            questions.map((question) => (
                <div className='a_question'>
                    <div className='a_question_category'>
                        <div className='answer_profile_99'>
                            <div className='answer_profile'>
                                <img src={question.profile_url}/>
                            </div>
                        </div>
                        <div className='asked_question'>
                            <div className='asked_question_1' dangerouslySetInnerHTML={{__html:question.question}} onClick={()=> showAnswers(question.question_id)}></div>
                            <div style={{fontSize:'small',color:'grey'}}>{question.created_at}</div>
                        </div>
                    </div>
                    <div style={{display:'flex', width:'98%', 'alignItems':'center', position:'relative'}}>
                        <button id='answer_button' onClick={()=> openAnswer(question.question, question.question_id)}>
                            Answer
                            <img src='/images/answer.png' width="15px" height="15px"/>
                        </button>
                        {userInfo?(userInfo.username === question.username || userInfo.admin) && <img onClick={() => setDotsMenu({state:true,id:question.question_id})} className='three_dots_img' src="/images/dots.png"/>:<Navigate to="/login"/>}
                        {(dotsmenu.state && dotsmenu.id === question.question_id) && <div className="dots_menu">
                            <img src="/images/close.png" width="12px" height="12px" onClick={() => setDotsMenu({state:false,id:''})}/>
                            <div className="dots_menu_13" onClick={() => handleQuestionDelete(dotsmenu.id)}>Delete question</div>
                        </div>}
                    </div>
                </div>
            ))
        );
    }    
}
 
export default ShowQuestions;