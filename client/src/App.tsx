import { Outlet } from "react-router-dom"
import Decode from "./pages/Decode/Decode"
import Encode from "./pages/Encode/Encode"
import Home from "./pages/Home/Home"
import Login from "./pages/Login/Login"
import Signup from "./pages/Signup/Signup"
import { AuthContext } from "./context/AuthContext"
import { useEffect, useState } from "react"
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
    </>
  )
}

export default App