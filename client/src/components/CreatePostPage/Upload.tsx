import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faPlus, faCircleDot, faCircle } from '@fortawesome/free-solid-svg-icons'
import AWS, { S3 } from 'aws-sdk';

function Upload() {
  const [routes, setRoutes] = useState([
    {name:"해운대 국밥 맛집", imgSrc: ""},
    {name:"해운대 카페거리", imgSrc: ""},
    // {name:"광안리 해수욕장", imgSrc: ""},
    // {name:"삼겹살집", imgSrc: ""},
    // {name:"5번째항목10글자까지가능하니", imgSrc: ""},
    // {name:"6번째항목", imgSrc: ""},
]);
  const [thumbnail, setThumbnail] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [checkOption, setCheckOption] = useState<boolean[]>([true]);

  const selectIdx = (e:any) => {
    const checking = routes.map((_, idx) => idx === Number(e.target.value));
    setCheckOption(checking)
  }

   /* s3 버킷 설정 */
  AWS.config.region = 'ap-northeast-2'; // 리전
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ap-northeast-2:2103383f-abd8-41b1-bd30-b700ce368c14',
  });

   /* s3 버킷 업로드 합수 */
  //  const imageHandler = (e: any) => {
  //    const firstImageFile = e.target.files[0];
  //    if (!firstImageFile) {
  //      setEditInform({ ...editInform, profileImage: '' });
  //    }
  //    else {       
  //  };

  // const uploadImage = (idx: number) => {
  //   const upload = new S3.ManagedUpload({
  //     params: {
  //       Bucket: "ootd13image",
  //       Key: `firstImageFile.name`,
  //       Body: `firstImageFile`,
  //     },
  //   });
  //   const promise = upload.promise();
  //   promise.then(
  //     function (data: any) {
  //       setEditInform({ ...editInform, profileImage: data.Location });
  //     },
  //     function (err: any) {
  //       console.log(err);
  //     }
  //   );
  // }
  // }

  return (
    <div className="createpost_upload_div">
    {routes && true ?
    routes.map((route, idx) => {
      return (
        <label key={route.name} className='createpost_upload_route_div' htmlFor='upload_image'>
          <div className="createpost_upload_route_img">
            <input id="upload_image" className='hidden' accept='image/*' type="file"/>
            <FontAwesomeIcon icon={faPlus} className="createpost_plusicon" />
          </div>
          {/* <div className="createpost_upload_route_span_div"> */}
            <span className="createpost_upload_route_span">{`경로${idx+1}: ${route.name}`}</span>
            {/* <span className="createpost_upload_route_name">{route.name}</span>
          </div> */}
          <div className="createpost_upload_route_thumbnail_div">
            {/* <FontAwesomeIcon icon={faCircleDot} className="createpost_upload_route__thumbnail_checkbox" type="checkbox"  checked={checkOption[idx]} value={idx} onClick={(event)=>selectIdx(event)}/>
             */}
            <FontAwesomeIcon icon={faCircleDot} className="createpost_upload_route_thumbnail_checkbox" type="checkbox" onClick={(event)=>selectIdx(event)}/>
            <span className="createpost_upload_route_thumnail_span">썸네일로 지정</span>
          </div>
        </label>
      )
    })
      : <div>등록한 경로를 찾을 수 없습니다.</div>
  }
    <div/>
    </div>
  ) 
}

export default Upload