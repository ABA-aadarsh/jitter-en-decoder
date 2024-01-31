import  { useContext, useEffect } from 'react'
import { AuthContext } from './context/AuthContext'
import { useNavigate } from 'react-router-dom'
import baseURL from './commonVariable'

function AuthLayout({
    children
}:{
    children:React.ReactNode
}) {
    const {authData,setAuthData}=useContext(AuthContext)
    const navigate=useNavigate()
    const verify=async ()=>{
        const res=await fetch(baseURL+"/auth/verify",
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
        }else{
          setAuthData(
            {
              isAuthenticated:false,
              token:""
            }
          )
          navigate("/login")
        }
      }
    useEffect(()=>{
        if(authData.isAuthenticated==false){
            verify()
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