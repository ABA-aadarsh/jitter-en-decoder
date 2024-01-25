import React, { useContext } from 'react'
import style from "./Navbar.module.css"
import { IoIosLogOut } from "react-icons/io";
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
function Navbar() {
  const { authData, setAuthData } = useContext(AuthContext)
  const navigate=useNavigate()
  return (
    <nav
      className={style.container}
    >
      <div
        className={style.logoContainer}
      >
        <img src="/icon.png" alt="" />
        <h1>
          <NavLink
            to="/"
          >
            En/De
          </NavLink>
        </h1>
      </div>

      <div>
        <ul
          className={style.linksContainer}
        >
          {
            authData.isAuthenticated ?
              <>
                <li
                  className={style.link}
                >
                  <NavLink
                    to="/encode"
                    className={({ isActive }) => {
                      return isActive ? style.linkActive : ""
                    }}
                  >Encode</NavLink>
                </li>
                <li
                  className={style.link}
                >
                  <NavLink
                    to="/decode"
                    className={({ isActive }) => {
                      return isActive ? style.linkActive : ""
                    }}
                  >Decode</NavLink>
                </li>
              </> :
              <>
                <li
                  className={style.link}
                >
                  <NavLink
                    to="/signup"
                    className={({ isActive }) => {
                      return isActive ? style.linkActive : ""
                    }}
                  >Signup</NavLink>
                </li>
                <li
                  className={style.link}
                >
                  <NavLink
                    to="/login"
                    className={({ isActive }) => {
                      return isActive ? style.linkActive : ""
                    }}
                  >Login</NavLink>
                </li>
              </>
          }

        </ul>
      </div>
      {
        authData.isAuthenticated &&
        <button
          className={style.logoutBtn}
          onClick={() => {
            setAuthData({ isAuthenticated: false, token: "" })
            function clearCookies() {
              var cookies = document.cookie.split("; ");
              for (var c = 0; c < cookies.length; c++) {
                  var d = window.location.hostname.split(".");
                  while (d.length > 0) {
                      var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
                      var p = location.pathname.split('/');
                      document.cookie = cookieBase + '/';
                      while (p.length > 0) {
                          document.cookie = cookieBase + p.join('/');
                          p.pop();
                      };
                      d.shift();
                  }
              }
            }
            clearCookies()
            navigate("/")
          }}
        >
          <IoIosLogOut />
          <span>Logout</span>
        </button>
      }

    </nav>
  )
}

export default Navbar