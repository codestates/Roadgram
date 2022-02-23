import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

function Footer() {
  return (
    <div id="footer-container">
      <div className="profile-boxes">
        <div className="profile-box">
          <a href="https://github.com/qwp0905" target="_blank" rel="noopener noreferrer" className="githubLink">
            <FontAwesomeIcon icon={faGithub} className="githubIcon" />
          </a>
          <div className="profile">
            <div className="name">정권진</div>
            <div className="role">Back-end</div>
          </div>
        </div>
        <div className="profile-box">
          <a href="https://github.com/pjb642" target="_blank" rel="noopener noreferrer" className="githubLink">
            <FontAwesomeIcon icon={faGithub} className="githubIcon" />
          </a>
          <div className="profile">
            <div className="name">박종범</div>
            <div className="role">Front-end</div>
          </div>
        </div>
        <div className="profile-box">
          <a href="https://github.com/alsrlqor1007" target="_blank" rel="noopener noreferrer" className="githubLink">
            <FontAwesomeIcon icon={faGithub} className="githubIcon" />
          </a>
          <div className="profile">
            <div className="name">백민기</div>
            <div className="role">Full-stack</div>
          </div>
        </div>
        <div className="profile-box">
          <a href="https://github.com/Mr-Hanbean" target="_blank" rel="noopener noreferrer" className="githubLink">
            <FontAwesomeIcon icon={faGithub} className="githubIcon" />
          </a>
          <div className="profile">
            <div className="name">한주형</div>
            <div className="role">Full-stack</div>
          </div>
        </div>
      </div>
      <div className="copyright">©2022 Madcode</div>
    </div>
  )
}

export default Footer
