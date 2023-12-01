import './Home.css'
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <body className='home_body'>
            <header className='home_header'>
                <div className='kb_logo_1'>
                    Knowledge<span id="kb_logo_1">Bridge</span>
                </div>
                <div className="header_right">
                    <Link to='/login'>login</Link>
                    <Link to='/signup' className='home_header_signup'>Sign Up</Link>
                </div>
            </header>
            <div className='home_container_1'>
                <div className='kb_home_who'>
                    <h1>We provide</h1>
                    <p>
                        quality educational resources and study materials to aid students
                        in their learning process, particularly those with economic hardships,
                        who can not afford conventional study materials
                    </p>
                    <Link to='/signup'>Get Started</Link>
                </div>
                <img src='/images/many-books.png' width="550px" height="490px"/>
            </div>
            <div className='home_container_2'>
                <img src='/images/library-home.png' id="home_cont_2_img" width="650px" height="350px"/>   
                <div className='kb_home_who'>
                    <h1>Our library</h1>
                    <p>
                        Immerse yourself in a vast array of educational resources. From textbooks 
                        to insightful guides, our library transforms traditional learning into a 
                        dynamic digital experience. Unleash the power of knowledge at your fingertips. 
                        Join us on a seamless journey through the pages of wisdom – your gateway to a 
                        world of PDF treasures awaits!
                    </p>
                </div>
            </div>
            <div className='home_container_2'>
                <div className='kb_home_who'>
                    <h1>Our Community</h1>
                    <p>
                        Engage in thought-provoking discussions, share insights, and seek guidance from a 
                        diverse community passionate about learning. Whether you're a seasoned expert or 
                        just starting your educational journey, our community is the place to exchange ideas, 
                        ask questions, and celebrate milestones.
                    </p>
                </div>
                <img id="home_cont_2_img_1" src='/images/community-home.png' width="650px" height="350px"/>
            </div>
        </body>
    );
}
 
export default Home;