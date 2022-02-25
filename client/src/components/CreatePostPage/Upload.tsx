import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons'

function Upload() {
  const [routes, setRoutes] = useState([
    {name:"해운대 국밥 맛집", imgSrc: "asda.png"},
    {name:"해운대 카페거리", imgSrc: "abcd.png"},
    {name:"광안리 해수욕장", imgSrc: "abcd.png"},
    {name:"삼겹살집", imgSrc: "esc.png"}]);
  const [thumbnail, setThumbnail] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [checkOption, setCheckOption] = useState<boolean[]>([true]);

  const selectIdx = (e:any) => {
    const checking = routes.map((_, idx) => idx === Number(e.target.value));
    setCheckOption(checking)
  }

  return (
    <>
    {routes && true ?
    routes.map((route, idx) => {
      return (
        <div key={route.name} className='createpost_upload_route'>
          <span className="createpost_upload_route_number">{`경로${idx+1}:`}</span>
          <span className="createpost_upload_route_name">{route.name}</span>
          <FontAwesomeIcon icon={faImage} className="upload-icon"/>
          <input className="createpost_upload_route_checkbox" type="checkbox"  checked={checkOption[idx]} value={idx} onClick={(event)=>selectIdx(event)}/>
          { idx === 0
          ? <span className="thumbnail_selectbox_span">대표 이미지를 선택 해 주세요.</span>
          : null
          }
        </div>
      )
    })
      : <div>등록한 경로를 찾을 수 없습니다.</div>
  }
    <div/>
    </>
  ) 
}

export default Upload