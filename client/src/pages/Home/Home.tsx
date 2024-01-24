import Navbar from '../../Components/Navbar/Navbar'
import style from "./Home.module.css"
import Footer from '../../Components/Footer/Footer'
import { useNavigate } from 'react-router-dom'
function Home() {
    const navigate=useNavigate()
  return (
    <>
        <div
            className={style.page}
        >
            <header>
                <Navbar/>
                <section className={style.section}>
                    <div className={`${style.box}`}>
                        <h2>Encode</h2>
                        <p>Easily convert your file into encrypted jitter image. Secured with encruption algorithm. Be assured, Your data is completely safe.</p>
                        <button
                            onClick={()=>navigate("/encode")}
                        >Encode a File</button>
                    </div>
                    <div
                        className={style.imageContainer}
                    >

                    </div>
                </section>
                <section className={style.section+" "+style.wrapReverse}>
                    <div
                        className={style.imageContainer}
                    >

                    </div>
                    <div className={`${style.box}`}>
                        <h2>Decode</h2>
                        <p>Upload your encrypted jitter image and retrieve original data. From your jittered image, decrypt your hidden message, song or anything you wish.</p>
                        <button
                            onClick={()=>navigate("/decode")}
                        >Decode a File</button>
                    </div>
                </section>
            </header>
            <Footer/>
        </div>
    </>
  )
}

export default Home