import React from 'react'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useEffect } from 'react';
import { useState } from 'react';
import Tag from '../components/CreatePostPage/Tag';
import TextArea from '../components/CreatePostPage/TextArea';
import Upload from '../components/CreatePostPage/Upload';

function CreatePostPage() {
  const [tags, setTags] = useState([""]);
  
  useEffect(() => {
    console.log(tags);
  },[tags])

  return (
  <div className='createpost_whole_div'>
    <div className="createpost_title_div">
      <div className="arrow_icon_div">
        <Link to="/settingroute">
        <FontAwesomeIcon icon={faArrowLeft} className="arrow_icon"/>
        </Link>
      </div>
      <h1>게시글 작성</h1>
    </div>
    <section className='createpost_tag_section'>
      <span className='createpost_tag_title'>* 태그</span>
      <Tag/>
    </section>
    <section className='createpost_content_section'>
      <span className='createpost_content_title'>* 본문</span>
      <TextArea/>
    </section>
    <section className='createpost_upload_section'>
      <span className='createpost_upload_title'>* 이미지 업로드</span>
      <Upload/>
    </section>
      <button className='createpost_submit_button'type="submit">저장하기</button>
  </div>
  )
}

export default CreatePostPage
