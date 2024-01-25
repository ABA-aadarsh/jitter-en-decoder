import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import Home from './pages/Home/Home.tsx'
import Encode from './pages/Encode/Encode.tsx'
import Decode from './pages/Decode/Decode.tsx'
import Login from './pages/Login/Login.tsx'
import Signup from './pages/Signup/Signup.tsx'
import { AuthContext } from './context/AuthContext.ts'
import AuthLayout from './AuthLayout.tsx'
import AuthHomeLayout from './AuthHomeLayout.tsx'
const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App/>}>
      <Route path='' element={
        <AuthHomeLayout/>
      }/>
      <Route path='encode' element={
        <AuthLayout>
          <Encode/>
        </AuthLayout>
      }/>
      <Route path='decode' element={
        <AuthLayout>
          <Decode/>
        </AuthLayout>
      }/>
      <Route path='login' element={<Login/>}/>
      <Route path='signup' element={<Signup/>}/>
    </Route>
  )
)
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
