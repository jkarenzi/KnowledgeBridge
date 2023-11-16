import Header from "../components/Header"
import './Community.css'
import { Link, Outlet } from "react-router-dom"
import { useLocation } from "react-router-dom"

const Community = () => {
    const location = useLocation()
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))

    const links = [
        {id: 1, text: 'Community', url: '/community', icon:'/images/community.png'},
        {id: 2, text: 'Admin', url: '/admin', icon:'/images/admin_logo.png'},
        {id: 3, text: 'Library', url: '/library', icon:'/images/library.png'},
        {id: 4, text: 'Settings', url: '/settings', icon:'/images/settings.png'}
    ]

    return (
        <body className="community_body">
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
            <Outlet/>
        </body>
    );
}
 
export default Community;