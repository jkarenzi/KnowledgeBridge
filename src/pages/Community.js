import Header from "../components/Header"
import './Community.css'
import { Link, Outlet } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { useState } from "react"

const Community = () => {
    const location = useLocation()
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const token = localStorage.getItem('token')

    const handleClick = () => {
        const icons = document.getElementsByClassName('community_header_icons')[0]
        const searchBar = document.getElementsByClassName('community_search_bar')[0]
        const search = document.getElementById("mobile_search")
        const back = document.getElementById("mobile_back")
        search.style.display = 'none'
        back.style.display = 'flex'
        icons.style.display = 'none'
        searchBar.style.display = 'flex'
    }

    const handleTwoClick = () => {
        const icons = document.getElementsByClassName('community_header_icons')[0]
        const searchBar = document.getElementsByClassName('community_search_bar')[0]
        const search = document.getElementById("mobile_search")
        const back = document.getElementById("mobile_back")
        search.style.display = 'flex'
        back.style.display = 'none'
        icons.style.display = 'flex'
        searchBar.style.display = 'none'
    }
    

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
                <img src="/images/back.png" onClick={handleTwoClick} width="25px" height="25px" id="mobile_back"/>
                <div className="community_header_icons">
                    <div className="community_div" style={{borderBottom: location.pathname === '/community'?'4px solid #FF8400':'none'}}>
                        <Link to="/community"><img src="/images/home.png" width="25px" height="25px"/></Link>
                    </div>
                    <div className="community_div" style={{borderBottom: location.pathname === '/community/answer'?'4px solid #FF8400':'none'}}>
                        <Link to="/community/answer"><img src="/images/answer.png" width="25px" height="25px"/></Link>
                    </div>
                </div>
                <img src="/images/search.png" onClick={handleClick} width="25px" height="25px" id="mobile_search"/>
            </div>
            <Outlet/>
        </body>
    );
}
 
export default Community;