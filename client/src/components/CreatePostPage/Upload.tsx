import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faPlus, faCircleDot, faCircle } from '@fortawesome/free-solid-svg-icons'
import AWS, { S3 } from 'aws-sdk';
import { useDispatch, useSelector } from 'react-redux';
import { setImages } from '../../store/createPostSlice';
import { RootState } from '../..';

function Upload() {
  const [routes, setRoutes] = useState([
    {order: 1,location:"해운대 국밥 맛집", imgSrc: "1"},
    {order: 2,location:"해운대 카페거리", imgSrc: "1"},
    {order: 3,location:"광안리 해수욕장", imgSrc: "1"},
    {order: 4,location:"삼겹살집", imgSrc: ""},
    {order: 5,location:"5번째항목10글자까지가능하니", imgSrc: ""},
    {order: 6,location:"6번째항목", imgSrc: ""},
]);
  const [thumbnail, setThumbnail] = useState("");
  const {images} = useSelector((state: RootState) => state.createPost);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [checkOption, setCheckOption] = useState<boolean[]>([true]);
  const dispatch = useDispatch();


  useEffect(() => {
    console.log("images ===", images);
  }, [images])

  const selectThumbnail = (index: number, e: any) => {
    const { imgSrc } = routes[index+1];
    console.log("imgSrc ===", imgSrc);
    if(imgSrc === "") {
      alert("이미지가 업로드 된 항목만 지정 가능합니다.");
      return;
    }

    const checking = routes.map((_, idx) => idx === Number(e.target.value));
    setCheckOption(checking);

    // thumbnail state에 이미지 저장
    dispatch(setThumbnail(imgSrc));
  }

   /* s3 버킷 설정 */
  AWS.config.region = 'ap-northeast-2'; // 리전
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ap-northeast-2:2103383f-abd8-41b1-bd30-b700ce368c14',
  });

   /* s3 버킷 업로드 합수 */
  const imageHandler = (idx: number) => {
    const routeImage = routes[idx].imgSrc;
    // e.target.files[0]
    console.log("didi", idx);
    if (!routeImage) {
      // 이미지가 없으면 공백처리
      const images = routes.slice();
      images[idx].imgSrc = "";
      // 디스패치하여 넣어줌
      dispatch(setImages(images));
    } else {       
      const upload = new S3.ManagedUpload({
        params: {
          Bucket: "ootd13image",
          Key: `${routes[idx].location}`,
          Body: `${routes[idx]}`,
        },
      });
      const promise = upload.promise();
      promise.then((data: any) => {
        const images = routes.slice();
        console.log("data.location ===", data.Location);
        images[idx].imgSrc = data.Location
          dispatch(setImages(images));
      })
      .catch((err: any) => 
        console.log(err))
    }
  }

  return (
    <div className="createpost_upload_div">
    {images && true ?
    images.map((route, idx) => {
      return (
        <label key={route.location} className='createpost_upload_route_div' htmlFor='upload_image'>
          {route.imgSrc === "" 
          ? <div className="createpost_upload_route_img">
              <input id="upload_image" className='hidden' accept='image/*' type="file" onChange={() => imageHandler(idx)}/>
              <FontAwesomeIcon icon={faPlus} className="createpost_plusicon" />
            </div>
              // <img className='createpost_upload_image_img' src={route.imgSrc} alt="route_image" />
          : <img className='createpost_upload_image_img' src={route.imgSrc} alt="route_image" />
          }
          {/* <div className="createpost_upload_route_span_div"> */}
            <span className="createpost_upload_route_span">{`경로${idx+1}: ${route.location}`}</span>
            {/* <span className="createpost_upload_route_name">{route.name}</span>
          </div> */}
          <div className="createpost_upload_route_thumbnail_div">
            {/* <FontAwesomeIcon icon={faCircleDot} className="createpost_upload_route__thumbnail_checkbox" type="checkbox"  checked={checkOption[idx]} value={idx} onClick={(event)=>selectIdx(event)}/>
             */}
            <FontAwesomeIcon icon={faCircleDot} className="createpost_upload_route_thumbnail_checkbox" type="checkbox" onClick={(e) => selectThumbnail(idx, e)}/>
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