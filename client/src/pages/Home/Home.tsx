import Navbar from '../../Components/Navbar/Navbar'
import style from "./Home.module.css"
import Footer from '../../Components/Footer/Footer'
import { useNavigate } from 'react-router-dom'
function Home({
    isAuthenticated=false
}) {
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
                            onClick={()=>
                                {
                                    if(isAuthenticated){
                                        navigate("/encode")
                                    }else{
                                        navigate("/login")
                                    }
                                }
                            }
                        >
                            {
                                isAuthenticated?
                                <>Encode a File</>:
                                <>Login to Encode</>
                            }
                        </button>
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
                            onClick={()=>
                                {
                                    if(isAuthenticated){
                                        navigate("/decode")
                                    }else{
                                        navigate("/login")
                                    }
                                }
                            }
                        >
                            {
                                isAuthenticated?
                                <>Decode a File</>:
                                <>Login to Decode</>
                            }
                        </button>
                    </div>
                </section>
            </header>
            <Footer/>
        </div>
    </>
  )
}

export default Home