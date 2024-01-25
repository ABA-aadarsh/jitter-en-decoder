import React from 'react'
import style from "./Footer.module.css"
import { NavLink } from 'react-router-dom'

function Footer() {
  return (
    <footer
        className={style.container}
    >
        <div
            className={style.box1}
        >
            <h1>Jitter En/De-code</h1>
            <p>A fun project. Encrypt and Encode any song, quote or text you want to a jittered image. Have fun. </p>

            <p>Github Link</p>
        </div>
        <div
            className={style.box2}
        >
            <h2>Links</h2>
            <ul>
                <li>
                    <NavLink
                        to="/encode"
                    >Encode</NavLink>
                </li>
                <li>
                <NavLink
                        to="/decode"
                    >Decode</NavLink>
                </li>
            </ul>
        </div>
    </footer>
  )
}

export default Footer