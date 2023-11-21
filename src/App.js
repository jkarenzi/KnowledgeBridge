import logo from './logo.svg';
import './App.css';
import Admin from './pages/Admin';
import Library from './pages/Library';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import ForgotPassword from './pages/ForgotPassword';
import { useEffect } from 'react';
import Usermgt from './pages/Usermgt';
import ViewBook from './pages/ViewBook';
import Community from './pages/Community';
import HomeCommunity from './components/HomeCommunity';
import Spaces from './components/Spaces';
import Following from './components/Following';
import Answer from './components/Answer';
import Settings from './pages/Settings';
import ViewAnswers from './components/ViewAnswers';
import Home from './pages/Home';
import { useState } from 'react';
import CustomPage from './pages/CustomPage';


function App() {
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')))
  const [token,setToken] = useState(localStorage.getItem('token'))
  console.log(token)

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/'>
        <Route index element={<Home/>}/>
        <Route path='login' element={<Login/>}/>
        <Route path='signup' element={<Signup/>}/>
        <Route path='library' element={token && userInfo?<Library/>:<Navigate to='/login'/>}/>
        <Route path='admin' element={token && userInfo?<Admin/>:<Navigate to='/login'/>}/>
        <Route path='user_mgt' element={token && userInfo?<Usermgt/>:<Navigate to='/login'/>}/>   
        <Route path='forgot' element={<ForgotPassword/>}/>
        <Route path='viewBook/:id' element={token && userInfo?<ViewBook/>:<Navigate to='/login'/>}/>
        <Route path='viewAnswers/:id' element={token && userInfo?<ViewAnswers/>:<Navigate to='/login'/>}/>
        <Route path='community' element={token && userInfo?<Community/>:<Navigate to='/login'/>}>
          <Route index element={<HomeCommunity/>}/>
          <Route path='spaces' element={<Spaces/>}/>
          <Route path='following' element={<Following/>}/>
          <Route path='answer' element={<Answer/>}/>
        </Route>
        <Route path='settings' element={token && userInfo?<Settings/>:<Navigate to='/login'/>}/>
        <Route path='*' element={<CustomPage/>}/>
      </Route>
    )
  )

  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
