import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

function Footer() {
  return (
    <div className="footer-container">
      <div className="footer-box">
        <div className="profile-boxes">
          <div className="profile-box">
            <a href="https://github.com/qwp0905" target="_blank" rel="noopener noreferrer" className="githubLink">
              <FontAwesomeIcon icon={faGithub} className="githubIcon" />
            </a>
            <div className="profile">
              정권진
              <br />
              Back-end
            </div>
          </div>
          <div className="profile-box">
            <a href="https://github.com/pjb642" target="_blank" rel="noopener noreferrer" className="githubLink">
              <FontAwesomeIcon icon={faGithub} className="githubIcon" />
            </a>
            <div className="profile">
              박종범
              <br />
              Front-end
            </div>
          </div>
          <div className="profile-box">
            <a href="https://github.com/alsrlqor1007" target="_blank" rel="noopener noreferrer" className="githubLink">
              <FontAwesomeIcon icon={faGithub} className="githubIcon" />
            </a>
            <div className="profile">
              백민기
              <br />
              Full-stack
            </div>
          </div>
          <div className="profile-box">
            <a href="https://github.com/Mr-Hanbean" target="_blank" rel="noopener noreferrer" className="githubLink">
              <FontAwesomeIcon icon={faGithub} className="githubIcon" />
            </a>
            <div className="profile">
              한주형
              <br />
              Full-stack
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
