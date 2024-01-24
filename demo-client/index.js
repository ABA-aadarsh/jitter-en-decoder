const canvas = document.querySelector("#canvas")
const inputBox = document.querySelector(".value")
const submitBtn = document.querySelector("#submitBtn")
const downloadBtn = document.querySelector(".downloadBtn")
const ctx = canvas.getContext("2d")
const generateImageContainer = document.querySelector(".generatedImageContainer")
const fileUploadInput = document.querySelector("#fileUploadInput")
const fileUploadForm = document.querySelector("form.uploadImageforDecoding")
const pixelWidth = 1
const pixelHeight = 1
const decodedResultContainer = document.querySelector(".decodedResult")
const encodeToBinary = (text = "") => {
    let binaryText = ""
    for (let i = 0; i < text.length; i++) {
        const asciiValue = text.charCodeAt(i)
        const temp = asciiValue.toString(2)
        binaryText += temp.length < 8 ? "0".repeat(8 - temp.length) + temp : temp
    }
    return binaryText
}
const encrypt = (text) => {
    // some logic for encryption
    return text
}
const createPixelRect = ({ value, x, y, width, height }) => {
    ctx.fillStyle = value == 0 ? "white" : "black"
    ctx.fillRect(
        x, y, width, height
    )
    ctx.fill()
}
const decodeTextFromImage = async () => {
    // const width=canvas.width/pixelWidth
    // const height=canvas.height/pixelHeight
    let text = ""
    let tempList = []
    let i = 0
    const data = [...await ctx.getImageData(0, 0, canvas.width, canvas.height).data]
    for (i; i < data.length; i += 4) {
        if (data[i] == 0 || data[i + 1] == 0 || data[i + 2] == 0) {
            tempList.push(1)
        } else {
            tempList.push(0)
        }
        if (tempList.length == 8) {
            text += String.fromCharCode(parseInt(tempList.join(""), 2))
            tempList = []
        }
    }
    return text
}
const createImageBinary = (binaryData) => {
    const imageWidth = 8
    const imageHeight = binaryData.length / imageWidth

    canvas.width = imageWidth * pixelWidth // 5px * 8
    canvas.height = imageHeight * pixelHeight
    let i = 0; let value;
    for (let y = 0; y < imageHeight; y++) {
        for (let x = 0; x < imageWidth; x++) {
            value = binaryData[i]
            createPixelRect(
                {
                    value: value,
                    x: x * pixelWidth,
                    y: y * pixelHeight,
                    width: pixelWidth,
                    height: pixelHeight
                }
            )
            i += 1;
        }
    }
}
submitBtn.addEventListener("click", async () => {
    const value = inputBox.value
    
    const res=await fetch("http://localhost:8080/encrypt",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                rawData : value,
                fileName: "data",
                fileType: ".txt"
            })
        }
    )
    if(res.status==200){
        const {encryptedText}=await res.json()
        // console.log(encryptedText)
        const binaryData = encodeToBinary(encryptedText)
        createImageBinary(binaryData)
        generateImageContainer.classList.remove("hide")
    }
})
downloadBtn.addEventListener("click", () => {
    var link = document.createElement('a');
    link.download = 'jitterFile.png';
    link.href = canvas.toDataURL()
    link.click();
})
const loadImageToCanvas = ({ width, height, image }) => {
    canvas.width = width
    canvas.height = height
    ctx.drawImage(
        image,
        0,
        0
    )
}
const decodeFromBinary = (binaryData = "") => {
    let text = ""
    while (binaryData != "") {
        const oneChar = binaryData.slice(0, 8)
        binaryData = binaryData.slice(8)
        const ascii = parseInt(oneChar, 2)
        text += String.fromCharCode(ascii)
    }
    return text
}

fileUploadInput.addEventListener("change", async (e) => {
    e.preventDefault()
    const filepath = e.currentTarget.value
    var re = /(\.jpg|\.jpeg|\.bmp|\.gif|\.png)$/i;
    if (!re.exec(filepath)) {
        alert("File extension not supported!");
        fileUpload.value = ""
    } else {
        const file = fileUploadInput.files[0]
        if (file) {
            let newImage = new Image();
            newImage.src = URL.createObjectURL(file);
            newImage.onload =
                async function () {
                    let w = newImage.width;
                    let h = newImage.height;
                    loadImageToCanvas(
                        {
                            width: w,
                            height: h,
                            image: newImage
                        }
                    )
                    const encryptedText=await decodeTextFromImage()
                    console.log(encryptedText)
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
                        decodedResultContainer.innerHTML=decryptedText
                        decodedResultContainer.classList.remove("hide")
                        generateImageContainer.classList.remove("hide")
                    }
                };
        }
    }
})