const CustomPage = () => {
    return (
        <body className="home_body">
            <header className="home_header">
                <div className='kb_logo' style={{color:'black'}}>
                    Knowledge<span id="kb_logo" style={{color:'white'}}>Bridge</span>
                </div>
            </header>
            <div style={{display:'flex',flexDirection:'column',height:'33rem',justifyContent:'center',alignItems:'center',width:'100%',gap:'1rem'}}>
                <div style={{fontSize:'larger'}}>The page you are looking for can't be found</div>
                <img src="/images/404.png"/>
            </div>
        </body>
    );
}
 
export default CustomPage;