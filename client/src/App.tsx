import { Outlet } from "react-router-dom"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { AuthContext } from "./context/AuthContext"
import { useEffect, useState } from "react"
import baseURL from "./commonVariable";
function getCookie(cookieName:string) {
  let cookie:{[index:string]:string} = {};
  document.cookie.split(';').forEach(function(el) {
    let [key,value] = el.split('=');
    cookie[key.trim()] = value;
  })
  if(cookie[cookieName]){
    return cookie[cookieName];
  }else{
    return null;
  }
}
function App() {
  const [authData,setAuthData]=useState(
    {
      isAuthenticated:false,
      token: getCookie("token") || ""
    }
  )
  useEffect(()=>{
    if(authData.isAuthenticated){

    }else if(authData.token!=""){
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
        }
      }
    verify()
    }
  },[])
  return (
    <>
      <AuthContext.Provider value={{authData,setAuthData}}>
        <Outlet/>
      </AuthContext.Provider>
      <ToastContainer
      />
    </>
  )
}

export default App