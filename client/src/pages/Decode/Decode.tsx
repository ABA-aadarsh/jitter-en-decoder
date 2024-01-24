import React, { useRef, useState } from 'react'
import style from "../Encode/Encode.module.css"
import Navbar from '../../Components/Navbar/Navbar'
import Footer from '../../Components/Footer/Footer'

import { IoClose } from "react-icons/io5";

function Decode() {
    const [loading,setLoading]=useState<boolean>(false)
    const [file,setFile]=useState<Blob | null>(null)
    const [isDragOver,setIsDragOver]=useState<boolean>(false)
    const canvas:HTMLCanvasElement=document.createElement("canvas")
    const ctx=canvas.getContext("2d")
    const modalRef=useRef<any>(null)
    const decodeTextFromImage=async ()=>{
        if(canvas && ctx && file){
            let text = ""
            let tempList = []
            let i = 0
            const data = [...await ctx.getImageData(0, 0, canvas.width, canvas.height).data]
            for (i; i < data.length; i += 4) {
                if (data[i] == 0 && data[i + 1] == 0 && data[i + 2] == 0) {
                    tempList.push(1)
                } else if(data[i] == 255 && data[i + 1] == 255 && data[i + 2] == 255){
                    tempList.push(0)
                }else{
                    if(tempList.length==0){
                        break
                    }
                }
                if (tempList.length == 8) {
                    text += String.fromCharCode(parseInt(tempList.join(""), 2))
                    tempList = []
                }
            }
            return {
                status: "success",
                decodedText: text
            }
        }else{
            return {
                status:"failed",
                error: "Canvas element not found"
            }
        }
    }
  return (
    <div
        className={style.page}
    >
        <header>
            <Navbar/>
            <section
                className={style.sectionContainer}
            >
                <div>
                    {/* file upload container */}
                    <h1
                    className={style.mainTitle} 
                    >Upload Your Jittered Image</h1>
                    <div
                        className={style.uploadFileContainer}
                    >
                        <div
                            className={style.innerContainer}
                            onDragOver={()=>{
                                setIsDragOver(true)
                            }}
                            onDragLeave={()=>{
                                setIsDragOver(false)
                            }}
                            onDrop={(e)=>{
                                e.preventDefault()
                                if(e.dataTransfer.files[0]?.type=="text/plain"){
                                    setFile(e.dataTransfer.files[0])
                                }
                                setIsDragOver(false)
                            }}
                        >
                            {
                                isDragOver==true?
                                    <div className={style.dropFileMessage}>
                                        <p>Drop IT</p>
                                        <p>!!!</p>
                                    </div>
                                :
                                <>
                                    <img src="/file-icon.png" alt="" className={style.icon}/>
                                    <span>Drag and Drop file here</span>
                                    <span>or</span>
                                    <label
                                        className={style.browseFileLabel}
                                    >
                                        Browse Files
                                        <input type="file" 
                                            className={style.fileInput}
                                            onChange={(e)=>{
                                                e.preventDefault()
                                                if(e.target.files?.length && e.target.files.length!=0){
                                                    setFile(e.target.files[0])
                                                }
                                            }}
                                        />
                                    </label>
                                </>
                            }
                            <div className={style.outerBorder}></div>
                        </div>
                        <button
                            className={style.encodeBtn}
                            onClick={async()=>{
                                if(canvas && file && ctx){
                                    const image=new Image()
                                    image.src=URL.createObjectURL(file)
                                    image.onload=async()=>{
                                        let w=image.width
                                        let h=image.height
                                        canvas.width=w
                                        canvas.height=h
                                        ctx.drawImage(
                                            image,
                                            0,0
                                        )
                                        const decodeRes=await decodeTextFromImage()
                                        if(decodeRes?.status=="success" && decodeRes.decodedText){
                                            const encryptedText=decodeRes.decodedText
                                            const res=await fetch("http://localhost:8080/decrypt",
                                                {
                                                    method:"POST",
                                                    headers:{
                                                        "Content-Type":"application/json"
                                                    },
                                                    body:JSON.stringify({
                                                        encryptedText: encryptedText
                                                    })
                                                }
                                            )
                                            if(res.status==200){
                                                const {decryptedText}=await res.json()
                                                console.log(decryptedText)
                                            }
                                        }
                                    }
                                }
                            }}
                        >Decode File</button>
                    </div>
                    <p
                        className={style.message}
                    >Note : Sometime there might be issue while correctly decoding file</p>
                </div>
            </section>
        </header>
        <dialog 
            ref={modalRef}
            className={style.dialogBox}
        >
            <button
                className={style.closeBtn}
                onClick={()=>{
                    modalRef.current.close()
                }}
                title="Close Modal"
            >
                <IoClose/>
            </button>
            <h3
                className={style.dialogTitle}
            >Your Decrypted File is Ready</h3>
            <button
            className={style.downloadBtn}
                disabled={loading}
                onClick={()=>{
                    
                }}
            >Download</button>
        </dialog>
        <Footer/>
    </div>
  )
}

export default Decode