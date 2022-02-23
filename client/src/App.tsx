/* Library import */
import React from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'

/* Component import */
import Navigator from './components/Navigator'
import Footer from './components/Footer'

/* Page import */
import LandingPage from './pages/LandingPage'
import MainPage from './pages/MainPage'
import UserInfo from './pages/UserInfo'
import EditProfilePage from './pages/EditProfilePage'
import PostDetailsPage from './pages/PostDetailsPage'
import SettingRoutePage from './pages/SettingRoutePage'
import CreatePostPage from './pages/CreatePostPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'


function App() {
  return (
    <div>
      <BrowserRouter>
      <Navigator />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/main/*" element={<MainPage />} />
          <Route path="/userInfo/*" element={<UserInfo />} />
          <Route path="/editprofile/*" element={<EditProfilePage />} />
          <Route path="/postdetails/*" element={<PostDetailsPage />} />
          <Route path="/settingroute/*" element={<SettingRoutePage />} />
          <Route path="/createpost/*" element={<CreatePostPage />} />
          <Route path="/logins/*" element={<LoginPage />} />
          <Route path="/signup/*" element={<SignupPage />} />
        </Routes>
      <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App
