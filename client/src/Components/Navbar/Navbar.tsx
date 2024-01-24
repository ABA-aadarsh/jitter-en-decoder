import React from 'react'
import style from "./Navbar.module.css"
import { IoIosLogOut } from "react-icons/io";
import { NavLink } from 'react-router-dom';
function Navbar() {
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
          <li
            className={style.link}
          >
            <NavLink
              to="/encode"
              className={({isActive})=>{
                return isActive ? style.linkActive: ""
              }}
            >Encode</NavLink>
          </li>
          <li
            className={style.link}
          >
            <NavLink
              to="/decode"
              className={({isActive})=>{
                return isActive ? style.linkActive: ""
              }}
            >Decode</NavLink>
          </li>
        </ul>
      </div>

      <button
        className={style.logoutBtn}
      >
        <IoIosLogOut/>
        <span>Logout</span>
      </button>
    </nav>
  )
}

export default Navbar