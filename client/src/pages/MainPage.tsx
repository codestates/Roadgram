import React, { useEffect } from 'react'

function MainPage() {
  useEffect(()=> {
    console.log("main");
  },[])
  return <div>MainPage</div>
}

export default MainPage
