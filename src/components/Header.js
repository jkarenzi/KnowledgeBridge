import { useEffect, useState } from 'react';
import './Header.css';
import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

const Header = (props) => {
    const links = props.links;
    const navigate = useNavigate()
    const location = useLocation()
    const [openUserOptions, setOpenUserOptions ] = useState(false);
    const [newLinks, setNewLinks] = useState([])

    const showToast = () => {
        toast.success('Successfully logged out', {
          position: toast.POSITION.TOP_RIGHT, // Set the position
        });
    };

    function handleLogout() {
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        navigate('/login')
        showToast()
    }

    function openUser() {
        setOpenUserOptions(!openUserOptions)
    }

    useEffect(() => {
        if(!props.userInfo.admin) {
            setNewLinks(links.filter((link) => link.text !== 'Admin'))
            console.log(newLinks)
        }else{
            setNewLinks(links)
        }
    },[])

    return (
        <header>
            <div className='kb_logo'>
                Knowledge<span id="kb_logo">Bridge</span>
            </div>
            <nav>
                {newLinks.map((nav_link) => (
                    <div className='nav_link_div' id={nav_link.id} style={{borderBottom: (location.pathname === nav_link.url || location.pathname === '/user_mgt' && nav_link.text === 'Admin')?'4px solid #FF8400':'none'}}>
                        <img src={nav_link.icon} width="30px" height="30px"/>
                        <Link to={nav_link.url}>{nav_link.text}</Link>
                    </div>  
                ))}
            </nav>
            <div className='user_profile_header_99'>
                <div className = 'user_profile_header'>
                    {props.userInfo?<img src={props.userInfo.profile_url} alt="User Profile" onClick={openUser}/>:<Navigate to='/login'/>}
                </div>
            </div>
            {openUserOptions && <div className='user_logout'>
                <button onClick={handleLogout}>Logout</button>
            </div>}
        </header>
    );
}
 
export default Header;