import React from 'react';
import { useState } from "react";

function TextArea() {
  const [textArea, setTextArea] = useState("");
  
  return (
    <textarea className='createpost_content_textarea' placeholder='내용을 입력해주세요'/>
  )
}


export default TextArea