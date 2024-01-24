import React, { useRef, useState } from 'react'
import style from "./Encode.module.css"
import Navbar from '../../Components/Navbar/Navbar'
import Footer from '../../Components/Footer/Footer'
import { IoClose } from "react-icons/io5";

function Encode() {
    const [loading,setLoading]=useState<boolean>(false)
    const [file,setFile]=useState<File | null>(null)
    const [isDragOver,setIsDragOver]=useState<boolean>(false)
    const modalRef=useRef<any>(null)
    const canvasRef=useRef(null)
    const encodeToBinary = ({text=""}:{text:string}) => {
        let binaryText = ""
        for (let i = 0; i < text.length; i++) {
            const asciiValue = text.charCodeAt(i)
            const temp = asciiValue.toString(2)
            binaryText += temp.length < 8 ? "0".repeat(8 - temp.length) + temp : temp
        }
        return binaryText
    }
    const createPixel=(ctx:CanvasRenderingContext2D,
        {
            color,
            x,
            y,
            width,
            height
        }:{
            color:string,
            x:number,y:number,width:number,height:number
        }
    )=>{
        ctx.fillStyle = color
        ctx.fillRect(
            x, y, width, height
        )
        ctx.fill()
    }
    const generateCanvasImage=(text:string)=>{
        if(canvasRef && canvasRef.current){
            const canvas:HTMLCanvasElement=canvasRef.current
            const res=canvas.getContext("2d")
            if (!res || !(res instanceof CanvasRenderingContext2D)) {
                throw new Error('Failed to get 2D context');
            }
            const ctx:CanvasRenderingContext2D=res
            ctx.clearRect(0,0,canvas.width,canvas.height)
            const binaryText=encodeToBinary({text})
            // const binaryText="0001"
            const imageWidth = Math.floor(Math.pow(binaryText.length,0.5))
            const imageHeight = imageWidth+5
            canvas.width=imageWidth
            canvas.height=imageHeight
            console.log(canvas.width,canvas.height)
            console.log(imageWidth,imageHeight)
            let i=0;let color:string;
            for (let y = 0; y < imageHeight; y++) {
                for (let x = 0; x < imageWidth; x++) {
                    if(i<binaryText.length){
                        color=binaryText[i]=="0"?"white":"black"
                    }else{
                        color="green"
                    }
                    createPixel(
                        ctx,
                        {
                            color: color,
                            x: x,
                            y: y,
                            width: 1,
                            height: 1
                        }
                    )
                    i += 1;
                }
            }
        }
    }
    
    const getEncryptedFromBackend=async(fileText:string,fileName:string)=>{
        try{
            const res=await fetch("http://localhost:8080/encrypt",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(
                    {
                        rawData:fileText,
                        fileName,
                        fileType:"txt"
                    }
                )
            })
            if(res.status==200){
                const {encryptedText}:{encryptedText:string}=await res.json()
                return {encryptedText,status:res.status}
            }else{
                return {error:"Failed to fetched",status:res.status}
            }
        }catch(error){
            return {error:"Failed to fetched",status:406}
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
                    >Upload File You Want To Jitter</h1>
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
                            disabled={
                                file?false:true
                            }
                            onClick={async ()=>{
                                if(file ){
                                    const text:string=await file.text()
                                    const fileName:string=file.name;
                                    modalRef.current.showModal()
                                    const res=await getEncryptedFromBackend(text,fileName)
                                    if(res.status==200 && res.encryptedText){
                                        generateCanvasImage(res.encryptedText)
                                    }
                                }
                            }}
                        >Encode File</button>
                    </div>
                    <p
                        className={style.message}
                    >Note : Though the encryption is made so not to fail, it is recommended not to upload document containing highly secretive texts like password or secret key. It is all fun and play until... it isn't.</p>
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
            >Your Jittered Image Is Ready</h3>
            <canvas
                className={style.generatedImage}
                ref={canvasRef}
            ></canvas>
            <button
            className={style.downloadBtn}
                disabled={loading}
                onClick={()=>{
                    var link:HTMLAnchorElement = document.createElement('a');
                    link.download = 'jitterFile.png';
                    if(canvasRef.current){
                        const canvas:HTMLCanvasElement=canvasRef.current
                        link.href = canvas.toDataURL()
                        link.click();
                    }
                }}
            >Download</button>
        </dialog>
        <Footer/>
    </div>
  )
}

export default Encode