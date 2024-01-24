import { useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import style from "../../Common Styles/LoginSignup.module.css";
import Footer from "../../Components/Footer/Footer";
function Signup() {
    const [email,setEmail]=useState<string>("")
    const [password,setPassword]=useState<string>("")
    const [userName,setUsername]=useState<string>("")
  return (
    <div
        className={style.page}
    >
        <Navbar/>
        <div className={style.container}>
            <form
                className={style.loginFormContainer}
                onSubmit={(e)=>{
                    e.preventDefault()
                    console.log(
                        {
                            email,
                            password
                        }
                    )
                }}
            >
                <h1>Create New Account</h1>
                <div className={style.inputContainer}>
                    <span>Username</span>
                    <input type="text" 
                        value={userName}
                        onChange={(e)=>setUsername(e.currentTarget.value)}
                        placeholder="Username"
                    />
                </div>
                <div className={style.inputContainer}>
                    <span>Email</span>
                    <input type="email" 
                        value={email}
                        onChange={(e)=>setEmail(e.currentTarget.value)}
                        placeholder="user@gmail.com"
                    />
                </div>
                <div className={style.inputContainer}>
                    <span>Password</span>
                    <input type="password" 
                        value={password}
                        onChange={(e)=>setPassword(e.currentTarget.value)}
                        placeholder="******"
                    />
                </div>
                <button type="submit"
                    className={style.loginBtn}
                >Signup</button>

                <span
                    className={style.alternateMessage}
                >Already Have Account ? Login Now</span>

                <div
                    className={style.imageContainer}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#00cba9" fill-opacity="1" d="M0,224L48,208C96,192,192,160,288,154.7C384,149,480,171,576,192C672,213,768,235,864,229.3C960,224,1056,192,1152,154.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
                </div>
            </form>
            <p
                className={style.noteMessage}
            >Be assured. Your documents won't be saved anywhere. Login and Signup is made compulsion to assign decryption key unique to each account. Your encrypted file can't be decrypted with other account for security reason</p>
        </div>
        {/* <Footer/> */}
    </div>
  )
}

export default Signup