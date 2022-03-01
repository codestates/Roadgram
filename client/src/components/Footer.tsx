import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import blacklogo from '../images/blacklogo.png'

function Footer() {
  return (
    <div id="footer-container">
      <img className="blacklogo" src={blacklogo} alt="logo" />
      <div className="developers">개발진 소개</div>
      <div className="profile-boxes">
        <div className="profile-box">
          <a href="https://github.com/qwp0905" target="_blank" rel="noopener noreferrer" className="githubLink">
            <FontAwesomeIcon icon={faGithub} className="githubIcon" />
          </a>
          <div className="profile">
            <div className="name">정권진 | Back-end</div>
          </div>
        </div>
        <div className="profile-box">
          <a href="https://github.com/pjb642" target="_blank" rel="noopener noreferrer" className="githubLink">
            <FontAwesomeIcon icon={faGithub} className="githubIcon" />
          </a>
          <div className="profile">
            <div className="name">박종범 | Front-end</div>
          </div>
        </div>
        <div className="profile-box">
          <a href="https://github.com/alsrlqor1007" target="_blank" rel="noopener noreferrer" className="githubLink">
            <FontAwesomeIcon icon={faGithub} className="githubIcon" />
          </a>
          <div className="profile">
            <div className="name">백민기 | Full-stack</div>
          </div>
        </div>
        <div className="profile-box">
          <a href="https://github.com/Mr-Hanbean" target="_blank" rel="noopener noreferrer" className="githubLink">
            <FontAwesomeIcon icon={faGithub} className="githubIcon" />
          </a>
          <div className="profile">
            <div className="name">한주형 | Full-stack</div>
          </div>
        </div>
      </div>
      <div className="copyright">© Roadgram Inc All Rights Reserved</div>
    </div>
  )
}

export default Footer
