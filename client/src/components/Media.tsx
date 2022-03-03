import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight, faCircle } from '@fortawesome/free-solid-svg-icons'
import { RootState } from '..'

declare global {
  interface Window {
    kakao: any
  }
}

// 지도의 범위를 설정하는 함수를 불러온다
const bounds = new window.kakao.maps.LatLngBounds()

function Media() {
  const { articleInfo } = useSelector((state: RootState) => state.articleDetails)

  const [current, setCurrent] = useState(0)
  const [imageLength, setImageLength] = useState(0)
  const [isMap, setIsMap] = useState(false)

  useEffect(() => {
    if (articleInfo.roads) {
      setImageLength(articleInfo.roads.length)
    }
  }, [current])

  const nextSlide = () => {
    setCurrent(current === imageLength - 1 ? 0 : current + 1)
  }

  const prevSlide = () => {
    setCurrent(current === 0 ? imageLength - 1 : current - 1)
  }

  const moveDot = (index: number) => {
    setCurrent(index)
  }

  console.log(current)
  // console.log(articleInfo.roads.indexOf(articleInfo.roads[2]))

  if (!Array.isArray(articleInfo.roads || imageLength <= 0)) {
    return null
  }

  return (
    <div>
      <div className="slider">
        <FontAwesomeIcon className="angleLeft" icon={faAngleLeft} onClick={prevSlide} />
        <FontAwesomeIcon className="angleRight" icon={faAngleRight} onClick={nextSlide} />
        <div className="dots">
          {articleInfo.roads ? (
            articleInfo.roads.map(image => {
              return (
                <FontAwesomeIcon
                  className={articleInfo.roads.indexOf(image) === current ? 'dot-active' : 'dot'}
                  icon={faCircle}
                  onClick={() => moveDot(articleInfo.roads.indexOf(image))}
                />
              )
            })
          ) : (
            <div>등록된 이미지가 없습니다.</div>
          )}
        </div>
        {articleInfo.roads.map(image => {
          return (
            <div className={articleInfo.roads.indexOf(image) === current ? 'slide active' : 'slide'}>
              {articleInfo.roads.indexOf(image) === current && <img className="image" alt="img" src={image.imageSrc} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Media
