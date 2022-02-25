import React, { useState } from 'react';

function RoutePreview() {
  const [routes, setRoutes] = useState([
    {name:"해운대 국밥 맛집", imgSrc: "https://ootd13image.s3.ap-northeast-2.amazonaws.com/%E1%84%84%E1%85%A9%E1%84%80%E1%85%A1%E1%84%89%E1%85%B3.jpeg"},
    {name:"해운대 카페거리", imgSrc: "https://ootd13image.s3.ap-northeast-2.amazonaws.com/%E1%84%84%E1%85%A9%E1%84%80%E1%85%A1%E1%84%89%E1%85%B3.jpeg"},
    {name:"광안리 해수욕장", imgSrc: "https://ootd13image.s3.ap-northeast-2.amazonaws.com/%E1%84%84%E1%85%A9%E1%84%80%E1%85%A1%E1%84%89%E1%85%B3.jpeg"},
    {name:"삼겹살집", imgSrc: "https://ootd13image.s3.ap-northeast-2.amazonaws.com/%E1%84%84%E1%85%A9%E1%84%80%E1%85%A1%E1%84%89%E1%85%B3.jpeg"}]);

  return (
    <>
    <div className="title">
      <h3 className='createpost_route_name'>{`경로1: ${routes[0].name}`}</h3>
    </div>
    <img className='createpost_route_img' src={routes[0].imgSrc} alt="map" /> 
    <div className="createpost_route_selectbox">
      {routes && true
        ? routes.map((route: any) => {
          return (
            <button key={route.name} type="button" className='createpost_route_selection'>{route.name}</button>
          );
        })
        : null
      }
    </div>
      </>
  )
}

export default RoutePreview