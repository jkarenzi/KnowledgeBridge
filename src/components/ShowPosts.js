import { useState } from "react"
import { toast } from 'react-toastify';
import './HomeCommunity.css'

const ShowPosts = (props) => {
    const [ dotsmenu, setDotsMenu ] = useState({state:false,id:''})
    const [ commentDotsMenu, setCommentDotsMenu ] = useState({state:false,id:''})
    const [ userComment, setUserComment ] = useState('')
    const [ commentOverlay, setCommentOverlay ] = useState({state:false, post_id:''})
    const [ comments, setComments ] = useState([])

    const posts = props.posts
    const userInfo = props.userInfo
    const token = props.token
    const setPosts = props.setPosts

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

    const handleLike = (id) => {
        const formData = new FormData()
        formData.append('user_id', userInfo.user_id)
        formData.append('post_id', id)
        fetch('http://localhost:5000/like',{
            method: 'POST',
            body: formData,
            headers: {'Authorization': `Bearer ${token}`},
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === 'ok'){
                setPosts(posts.map((post) => {
                    if (post.post_id === id){
                        const object = {
                            'post_id': post.post_id,
                            'username': post.username,
                            'email': post.email,
                            'profile_url': post.profile_url,
                            'created_at': post.created_at,
                            'user_post': post.user_post,
                            'likes': data.likes,
                            'dislikes': post.dislikes,
                            'comments': post.comments
                        }
                        return object
                    }else{
                        return post
                    }
                }))
            } else {
               errorToast('No internet connection')
            }
            console.log('Response from Flask:', data);
        })
    }

    const handleDislike = (id) => {
        const formData = new FormData()
        formData.append('user_id', userInfo.user_id)
        formData.append('post_id', id)
        fetch('http://localhost:5000/dislike',{
            method: 'POST',
            body: formData,
            headers: {'Authorization': `Bearer ${token}`},
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === 'ok'){
                setPosts(posts.map((post) => {
                    if (post.post_id === id){
                        const object = {
                            'post_id': post.post_id,
                            'username': post.username,
                            'email': post.email,
                            'profile_url': post.profile_url,
                            'created_at': post.created_at,
                            'user_post': post.user_post,
                            'likes': post.likes,
                            'dislikes': data.dislikes,
                            'comments': post.comments
                        }
                        return object
                    }else{
                        return post
                    }
                }))
            } else {
               errorToast('No internet connection')
            }
            console.log('Response from Flask:', data);
        })

    }

    const handleCommentSubmit = (e) => {
        e.preventDefault()
        const currentUTC = new Date();
        currentUTC.setUTCHours(currentUTC.getUTCHours() + 2);
        const timestamp = currentUTC.toISOString();

        const formData = new FormData()
        formData.append('user_id', userInfo.user_id)
        formData.append('post_id', commentOverlay.post_id)
        formData.append('comment', userComment)
        formData.append('timestamp', timestamp)
        fetch('http://localhost:5000/add_comment',{
            method: 'POST',
            headers: {'Authorization': `Bearer ${token}`},
            body: formData
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === 'ok'){
                setPosts(posts.map((post) => {
                    if (post.post_id === commentOverlay.post_id){
                        const object = {
                            'post_id': post.post_id,
                            'username': post.username,
                            'email': post.email,
                            'profile_url': post.profile_url,
                            'created_at': post.created_at,
                            'user_post': post.user_post,
                            'likes': post.likes,
                            'dislikes': post.dislikes,
                            'comments': data.comments
                        }
                        return object
                    }else{
                        return post
                    }
                }))
                setCommentOverlay({state:false, post_id:''})
                showToast(data.message)
            } else {
                errorToast(data.message)
            }
            console.log('Response from Flask:', data);
        })
    }

    const getComments = (id) => {
        setCommentOverlay({state:!commentOverlay.state,post_id:id})
        fetch(`http://localhost:5000/get_comments/${id}`,{
            method: 'GET',
            headers: {'Authorization': `Bearer ${token}`},
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === 'ok'){
                setComments(data.comments)
            } else {
                errorToast(data.message)
            }
            console.log('Response from Flask:', data);
        })
    }

    const handlePostDelete = (id) => {
        fetch(`http://localhost:5000/delete_post/${id}`,{
            method: 'DELETE',
            headers: {'Authorization': `Bearer ${token}`},
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === 'ok'){
                setPosts(posts.filter((post) => post.post_id !== id ))
                setDotsMenu({state:false,id:''})
                showToast(data.message)
            } else {
                errorToast(data.message)
            }
            console.log('Response from Flask:', data);
        })
    }

    const handleCommentDelete = (id) => {
        fetch(`http://localhost:5000/delete_comment/${id}`,{
            method: 'DELETE',
            headers: {'Authorization': `Bearer ${token}`},
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === 'ok'){
                setPosts(posts.map((post) => {
                    if (post.post_id === commentOverlay.post_id){
                        const object = {
                            'post_id': post.post_id,
                            'username': post.username,
                            'email': post.email,
                            'profile_url': post.profile_url,
                            'created_at': post.created_at,
                            'user_post': post.user_post,
                            'likes': post.likes,
                            'dislikes': post.dislikes,
                            'comments': data.comments
                        }
                        return object
                    }else{
                        return post
                    }
                }))
                setComments(comments.filter((comment) => comment.comment_id !== id )) 
                showToast(data.message)
            } else {
                errorToast(data.message)
            }
            console.log('Response from Flask:', data);
        })
    }

    if (posts.length === 0) {
        return (
            <h3 id='error_msg'>{props.message}</h3>
        )
    }else {
        return (  
            posts.map((post) => (
                <div className="user_post_div">
                    <div className="profile_and_info">    
                        <div className="post_profile_5">
                            <img src={post.profile_url}/>
                        </div>
                        <div className="user_info_container">
                            <h4>{post.username}</h4>
                            <h4 style={{fontSize:'small',color:'grey'}}>{post.created_at}</h4>
                        </div>
                    </div>
                    <div className="actual_post" dangerouslySetInnerHTML={{__html:post.user_post}}></div>
                    <div className="user_post_actions">
                        <div className="like">
                            <img src="/images/like.png" width="20px" height="20px" onClick={() => handleLike(post.post_id)}/>
                            <div>{post.likes}</div>
                        </div>
                        <div className="dislike">
                            <img src="/images/dislike.png" width="20px" height="20px" onClick={() => handleDislike(post.post_id)}/>
                            <div>{post.dislikes}</div>
                        </div>
                        <div className="comment">
                            <img src="/images/comment.png" width="20px" height="20px" onClick={() => getComments(post.post_id)}/>
                            <div>{post.comments}</div>
                        </div>
                        {(userInfo.username === post.username || userInfo.admin) && <img onClick={() => setDotsMenu({state:true,id:post.post_id})} className='three_dots_img' src="/images/dots.png"/>}
                        {(dotsmenu.state && dotsmenu.id === post.post_id) && <div className="dots_menu">
                            <img src="/images/close.png" width="12px" height="12px" onClick={() => setDotsMenu({state:false,id:''})}/>
                            <div className="dots_menu_13" onClick={() => handlePostDelete(dotsmenu.id)}>Delete post</div>
                        </div>}
                    </div>
                    {(commentOverlay.state && commentOverlay.post_id === post.post_id) && <div className="comment_big">
                        <div className="create_comment">
                            <div className="post_profile_5" style={{width:'2.5rem', height:'2.5rem'}}>
                                <img src={userInfo.profile_url}/>
                            </div>
                            <form onSubmit={handleCommentSubmit}>
                                <input type="text" required placeholder="Add a comment..." onChange={(e) => {setUserComment(e.target.value)}}/>
                                <button type="submit">Add comment</button>
                            </form> 
                        </div>
                        {comments.map((comment) => (
                            <div className="ind_comment">
                                <div className="profile_and_info" style={{marginTop:0}}>    
                                    <div className="post_profile_5" style={{width:'2.5rem', height:'2.5rem'}}>
                                        <img src={comment.profile_url}/>
                                    </div>
                                    <div className="user_info_container">
                                        <h4>{comment.username}</h4>
                                        <h4 style={{fontSize:'small',color:'grey'}}>{comment.created_at}</h4>
                                    </div>
                                </div>
                                <div className="the_comment">
                                    {comment.comment}
                                </div>
                                {(userInfo.username === comment.username || userInfo.admin) && <img onClick={() => setCommentDotsMenu({state:true,id:comment.comment_id})} className='three_dots_img_1' src="/images/dots.png"/>}
                                {(commentDotsMenu.state && commentDotsMenu.id === comment.comment_id) && <div className="dots_menu">
                                    <img src="/images/close.png" width="12px" height="12px" onClick={() => setCommentDotsMenu({state:false,id:''})}/>
                                    <div className="dots_menu_13" onClick={() => handleCommentDelete(commentDotsMenu.id)}>Delete comment</div>
                                </div>}
                            </div>
                        ))}
                    </div>}
                </div>
            ))
        );
    }
}    
 
export default ShowPosts;