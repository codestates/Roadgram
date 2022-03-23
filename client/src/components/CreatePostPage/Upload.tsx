import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCircleDot } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-regular-svg-icons'
import AWS, { S3 } from 'aws-sdk'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../..'
import { setImages } from '../../store/RouteListSlice'
import { setThumbnail } from '../../store/createPostSlice'

function Upload() {
  const { routeList } = useSelector((state: RootState) => state.routes)
  const { thumbnail } = useSelector((state: RootState) => state.createPost)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const dispatch = useDispatch()

  const selectThumbnail = (index: number) => {
    const { imageSrc } = routeList[index]
    if (imageSrc === '' || !imageSrc) {
      alert('이미지가 업로드 된 항목만 지정 가능합니다.')
      return
    }

    // thumbnail state에 이미지 저장
    dispatch(setThumbnail(imageSrc));
    // thumnail index 저장
    setSelectedIndex(index);
  }

  /* s3 버킷 설정 */
  AWS.config.region = 'ap-northeast-2' // 리전
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ap-northeast-2:2103383f-abd8-41b1-bd30-b700ce368c14',
  })

  /* s3 버킷 업로드 합수 */
  const imageHandler = (idx: number, e: any) => {
    const routeImage = e.target.files[0]
    if (!routeImage) {
      // 이미지가 없으면 공백값 넣어줌
      // dispatch(setImages({idx, src: ""}));
    } else {       
      const upload = new S3.ManagedUpload({
        params: {
          Bucket: 'ootd13image',
          Key: routeImage.name,
          Body: routeImage,
        },
      })
      const promise = upload.promise()
      promise
        .then((data: any) => {
          dispatch(setImages({ idx, src: data.Location }))
        })
        .catch((err: any) => console.log(err))
    }
  }

  return (
    <div className="createpost_upload_div">
      {routeList && true ? (
        routeList.map((route, idx) => {
          return (
            <div className="createpost_upload_route_div">
              <label key={route.placeName} className="createpost_upload_route_label" htmlFor={`upload_image${idx}`}>
                {route.imageSrc === '' || !route.imageSrc ? (
                  <div className="createpost_upload_route_img">
                    <FontAwesomeIcon icon={faPlus} className="createpost_plusicon" />
                  </div>
                ) : (
                  <div className="createpost_upload_route_img">
                    <div className="createpost_upload_image_img_div">이미지 변경</div>
                    <img className="createpost_upload_image_img" src={route.imageSrc} alt="route_image" />
                  </div>
                )}
                <input
                  id={`upload_image${idx}`}
                  className="hidden"
                  accept="image/*"
                  type="file"
                  onChange={e => imageHandler(idx, e)}
                />
              </label>
              <div className="createpost_upload_route_thumbnail_div">
                {selectedIndex === idx ? (
                  <>
                    <div className="selectBox">
                      <FontAwesomeIcon
                        icon={faCircleDot}
                        className="createpost_upload_route_thumbnail_checkbox"
                        type="checkbox"
                      />
                      <div className="createpost_upload_route_span">{route.placeName}</div>
                    </div>
                    <div className="createpost_upload_route_thumnail_span">썸네일로 지정</div>
                  </>
                ) : (
                  <>
                    <div className="selectBox">
                      <FontAwesomeIcon
                        icon={faCircle}
                        className="createpost_upload_route_thumbnail_checkbox"
                        type="checkbox"
                        onClick={() => selectThumbnail(idx)}
                      />
                      <div className="createpost_upload_route_span">{route.placeName}</div>
                    </div>
                    {/* <span className="createpost_upload_route_thumnail_span">썸네일로 지정</span> */}
                  </>
                )}
              </div>
            </div>
          )
        })
      ) : (
        <div>등록한 경로를 찾을 수 없습니다.</div>
      )}
      <div />
    </div>
  )
}

export default Upload
