import { useContext, useRef, useState } from 'react'
import style from "../Encode/Encode.module.css"
import Navbar from '../../Components/Navbar/Navbar'
import Footer from '../../Components/Footer/Footer'

import { IoClose } from "react-icons/io5";
import { AuthContext } from '../../context/AuthContext';
import baseURL from '../../commonVariable';

function Decode() {
    const {authData}=useContext(AuthContext)
    const [file,setFile]=useState<Blob | null>(null)
    const [downloadFileData,setDownloadFileData]=useState({success:false,fileText:"",fileName:"text.txt",errorStatus: false, errorMessage: ""})
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
                                if(e.dataTransfer.files[0]?.type=="image/png"){
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
                                    <img src="/Frame 1.svg" alt="" className={style.icon}/>
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
                                            accept='image/png'
                                        />
                                    </label>
                                </>
                            }
                            <div className={[style.outerBorder,style.decode].join(" ")}></div>
                        </div>
                        <button
                            className={style.encodeBtn}
                            disabled={
                                file?false:true
                            }
                            onClick={async()=>{
                                modalRef.current.showModal()
                                if(canvas && file && ctx){
                                    setDownloadFileData(prev=>{
                                        return {...prev,success:false}
                                    })
                                    const image=new Image()
                                    image.src=URL.createObjectURL(file)
                                    image.onload=async()=>{
                                        let w=image.width
                                        let h=image.height
                                        canvas.width=w
                                        canvas.height=h
                                        ctx.clearRect(0,0,w,h)
                                        ctx.drawImage(
                                            image,
                                            0,0
                                        )
                                        const decodeRes=await decodeTextFromImage()
                                        if(decodeRes?.status=="success" && decodeRes.decodedText){
                                            const encryptedData=decodeRes.decodedText
                                            // console.log(encryptedText)
                                            const res=await fetch(baseURL+"/api/decrypt",
                                                {
                                                    method:"POST",
                                                    headers:{
                                                        "Content-Type":"application/json",
                                                        "authorization":"Bearer "+authData.token
                                                    },
                                                    body:JSON.stringify({
                                                        encryptedData
                                                    })
                                                }
                                            )
                                            if(res.status==200){
                                                const {decryptedText}=await res.json()
                                                setDownloadFileData(
                                                    {
                                                        success:true,
                                                        fileText:decryptedText,
                                                        fileName:"main.txt",
                                                        errorStatus:false,
                                                        errorMessage:""
                                                    }
                                                )
                                            }else if(res.status==403){
                                                setDownloadFileData(
                                                    {
                                                        success:false,
                                                        errorStatus:true,
                                                        errorMessage:"You are not authorised",
                                                        fileName:"",
                                                        fileText:""
                                                    }
                                                )
                                            }else{
                                                setDownloadFileData(
                                                    {
                                                        success:false,
                                                        errorStatus:true,
                                                        errorMessage:"File could not be decoded. Sorry",
                                                        fileName:"",
                                                        fileText:""
                                                    }
                                                )
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
                    setDownloadFileData(prev=>{
                        return {...prev,success:false}
                    })
                }}
                title="Close Modal"
            >
                <IoClose/>
            </button>
            <h3
                className={style.dialogTitle}
                style={
                    {
                        color: (!downloadFileData.success && downloadFileData.errorStatus) ? "#be0000" : "#259A86"
                    }
                }
            >
                {
                    (downloadFileData.success)&&
                    <>Your File is ready</>
                }
                {
                    (!downloadFileData.success && downloadFileData.errorStatus)&&
                    <>Your File could not be retrieved</>
                }
                {
                    (!downloadFileData.success && !downloadFileData.errorStatus)&&
                    <>Your File is on way</>
                }

            </h3>
            <div className={style.dialogBoxContent}>
                {
                    (downloadFileData.success && !downloadFileData.errorStatus)?
                    <>
                        <div
                            className={style.fileImageContainer}
                        >
                            <img src="/file-icon.png" alt="" />
                        </div>
                        <p>{downloadFileData.fileName}</p>
                    </>
                    :
                    <div>
                        {
                            downloadFileData.errorStatus?
                            <>
                                <p
                                    style={{color:"#a80909",fontStyle:"italic"}}
                                >Sorry File Could not be decoded</p>
                                <p
                                    style={{color:"#a80909",fontStyle:"italic"}}
                                >{downloadFileData.errorMessage}</p>
                            </>:
                            <p>Loading</p>
                        }
                    </div>
                }
            </div>
            <button
            className={style.downloadBtn}
                disabled={!downloadFileData.success}
                onClick={()=>{
                    if(downloadFileData.success){
                        const blob= new Blob([downloadFileData.fileText],{type:"plain/text"})
                        const url=URL.createObjectURL(blob)
                        const a = document.createElement("a")
                        a.href=url
                        a.download=downloadFileData.fileName
                        const downloadHandler=()=>{
                          setTimeout(()=>{
                            URL.revokeObjectURL(url)
                            a.removeEventListener("click", downloadHandler)
                          },1000)
                        }
                        a.addEventListener("click",downloadHandler)
                        a.click()
                        
                    }
                }}
            >Download</button>
        </dialog>
        <Footer/>
    </div>
  )
}

export default Decode