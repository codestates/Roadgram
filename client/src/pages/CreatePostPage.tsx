import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import RoutePreview from '../components/CreatePostPage/Route';
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
    <section className='createpost_route_section'>
      <h3 className='createpost_route_title'>경로 Preview</h3>
      <RoutePreview/>
    </section>
    <section className='createpost_upload_section'>
      <h3 className='createpost_upload_title'>사진업로드</h3>
      <Upload/>
    </section>
    <section className='createpost_tag_section'>
      <h3 className='createpost_tag_title'>태그 추가</h3>
      <Tag/>
    </section>
    <section className='createpost_content_section'>
      <h3 className='createpost_content_title'>본문</h3>
      <TextArea/>
    </section>
    <section className='createpost_button_section'>
      <button className='createpost_prev_button' type="button">이전</button>
      <button className='createpost_submit_button'type="submit">작성</button>
      <button className='createpost_cancel_button' type="button">취소</button>
    </section>
  </div>
  )
}

export default CreatePostPage
