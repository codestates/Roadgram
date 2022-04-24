import { faFire, faFireFlameCurved } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setTag } from '../store/ArticleSlice';

function PopularTag() {
  const dispatch = useDispatch()
  const [popularTags, setPopularTags] = useState([{tagId: 0, tagName: "", hits: 0}]);

  useEffect(() => {
    getPopularTags()
  }, [])

  const getPopularTags = async () => {
    axios
    .get(`${process.env.REACT_APP_API_URL}/articles/popular-tag`)
    .then((res) => {
      setPopularTags(res.data.data.popularTags)
    })
    .catch((err) => console.log(err))
  }
  
  return (
    <div className="popluar-tag-div">
        {popularTags
        ? <>
            <FontAwesomeIcon className="popular-icon" icon={faFire} />
              <div className="popluar-tag-list">
                {
                  popularTags.map((tag, idx) =>
                  <Link to={`/search?tag=${tag.tagName}`} style={{ textDecoration: 'none', color: 'black'}}>
                  <div 
                    className="popluar-tag-list-box"
                    role="button"
                    tabIndex={0}
                    onClick={()=> dispatch(setTag(tag.tagName))}
                    onKeyDown={()=> dispatch(setTag(tag.tagName))}
                  >
                    <span className="popular-tag-number">{`${idx+1}`}</span>
                    <span className="popular-tag">{`#${tag.tagName}`}</span>
                  </div> 
                    </Link>
                )}
              </div>
          </> 
        : null
        }
    </div>
  )
}

export default PopularTag