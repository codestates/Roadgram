import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleLeft, faChevronCircleRight, faCircle } from '@fortawesome/free-solid-svg-icons'
import Map from './Map'
import { RootState } from '..'

function Media() {
  const { articleInfo } = useSelector((state: RootState) => state.articleDetails)
  const [current, setCurrent] = useState(0)
  const [isStaticMap, setIsStaticMap] = useState(true)
  const [imageLength, setImageLength] = useState(1)
  const [isMap, setIsMap] = useState(false)

  useEffect(() => {
    if (articleInfo.roads) {
      setImageLength(articleInfo.roads.length)
    }
  }, [current, imageLength])

  const imageLoading = () => {
    setIsStaticMap(false)
    setImageLength(articleInfo.roads.length)
  }

  const nextSlide = () => {
    setCurrent(current === imageLength - 1 ? 0 : current + 1)
  }

  const prevSlide = () => {
    setCurrent(current === 0 ? imageLength - 1 : current - 1)
  }

  const moveDot = (index: number) => {
    setCurrent(index)
  }

  if (!Array.isArray(articleInfo.roads || imageLength <= 0)) {
    return null
  }

  return (
    <div className={`${isStaticMap ? 'slider' : 'slider-image'}`}>
      {isStaticMap ? <Map /> : null}
      {!isStaticMap && articleInfo.roads && articleInfo.roads.length > 0 ? (
        <>
          <FontAwesomeIcon className="angleLeft" icon={faChevronCircleLeft} onClick={prevSlide} />
          <FontAwesomeIcon className="angleRight" icon={faChevronCircleRight} onClick={nextSlide} />
        </>
      ) : null}
      {articleInfo.roads && articleInfo.roads.length > 0 ? (
        <div className="view_selectbox">
          <li
            className={`${isStaticMap ? 'view_span_select' : 'view_span'}`}
            onClick={() => setIsStaticMap(true)}
            onKeyDown={() => setIsStaticMap(true)}
          >
            경로 보기
          </li>
          <span className="road_view">ㅣ</span>
          <li
            className={`${isStaticMap ? 'view_span' : 'view_span_select'}`}
            onClick={() => imageLoading()}
            onKeyDown={() => setIsStaticMap(false)}
          >
            사진 보기
          </li>
        </div>
      ) : null}
      <div className="dots">
        {!isStaticMap && articleInfo.roads && articleInfo.roads.length > 0
          ? articleInfo.roads.map(image => {
              return (
                <FontAwesomeIcon
                  className={articleInfo.roads.indexOf(image) === current ? 'dot-active' : 'dot'}
                  icon={faCircle}
                  onClick={() => moveDot(articleInfo.roads.indexOf(image))}
                />
              )
            })
          : null}
      </div>
      {isStaticMap ? (
        <div key={articleInfo.thumbnail} id="staticMap" />
      ) : (
        articleInfo.roads.map(image => {
          return (
            <div className={articleInfo.roads.indexOf(image) === current ? 'slide active' : 'slide'}>
              {articleInfo.roads.indexOf(image) === current && <img className="image" alt="img" src={image.imageSrc} />}
            </div>
          )
        })
      )}
    </div>
  )
}

export default Media
