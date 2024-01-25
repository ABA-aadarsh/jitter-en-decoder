import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from './context/AuthContext'
import Home from './pages/Home/Home'

function AuthHomeLayout() {
  const {authData,setAuthData}=useContext(AuthContext)
  const [loading,setLoading]=useState(true)
  const [loggedIn,setLoggedIn]=useState(authData.isAuthenticated)
  const verify=async ()=>{
    const res=await fetch("http://localhost:8080/auth/verify",
    {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "authorization": "Bearer "+authData.token
      }
    })
    if(res.status==206){
      setAuthData(
        {
          isAuthenticated:true,
          token:authData.token
        }
      )
      return true
    }else{
      setAuthData(
        {
          isAuthenticated:false,
          token:""
        }
      )
      return false
    }
  }
  const checkAuthenticated=async ()=>{
    if(await verify()){
      setLoggedIn(true)
    }else{
      setLoggedIn(false)
    }
    setLoading(false)
  }
  useEffect(()=>{
    if(loggedIn==false && authData.token!=""){
      checkAuthenticated()
    }else{
      setLoading(false)
    }
  },[])
  useEffect(()=>{
    if(loggedIn==true && authData.isAuthenticated==false){
      setLoggedIn(false)
    }
  },[authData])
  return (
    <>
      {
        !loading &&
        <>
          <Home
            isAuthenticated={loggedIn}
          />
        </>
      }
    </>
  )
}

export default AuthHomeLayout