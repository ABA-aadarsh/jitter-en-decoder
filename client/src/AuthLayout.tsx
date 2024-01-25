import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from './context/AuthContext'
import { useNavigate } from 'react-router-dom'

function AuthLayout({
    children
}:{
    children:React.ReactNode
}) {
    const {authData}=useContext(AuthContext)
    const navigate=useNavigate()
    useEffect(()=>{
        if(authData.isAuthenticated==false){
            navigate("/login")
        }
    },[authData])
  return (
    <>
        {
            authData.isAuthenticated && 
            children
        }
    </>
  )
}

export default AuthLayout