import { useRef, useState } from 'react'
import jsPDF from 'jspdf'
import './App.css'

function App() {
  const fileInputRef = useRef(null)
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])

  const handleCLick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)

    setImages((prevImages) => [...prevImages, ...files])
    const filePreviews = []

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        filePreviews.push(event.target.result)
        if (filePreviews.length === files.length) {
          setImagePreviews((prevPreviews) => [...prevPreviews, ...filePreviews])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleConvert = async () => {
    if (!images.length) return
  
    const pdf = new jsPDF();
  
    for (let index = 0; index < images.length; index++) {
      const file = images[index]
  
      const imgData = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          resolve(event.target.result)
        }
        reader.readAsDataURL(file)
      })
  
      const img = new Image()
      img.src = imgData
  
      const imgWidth = pdf.internal.pageSize.getWidth()
      const imgHeight = (img.height * imgWidth) / img.width
  
      if (index > 0) pdf.addPage()
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight)
    }

    pdf.save('converted.pdf')
  };
  
  const clearImages = () => {
    setImages([])
    setImagePreviews([])
    fileInputRef.current.value = ''
  }

  console.log(images)
  
  return (
    <>
      <h2>IMAGE TO PDF</h2>
      <p>Convert images to PDF in seconds. Easily adjust orientation and margins.</p>

      {(images.length == 0 )
        ?<button onClick={handleCLick}>Select your images</button>
        :(
          <>
            <button onClick={handleConvert}>Convert to PDF</button>
            <button onClick={handleCLick}>Add images</button>
            <button onClick={clearImages}>Clear</button>
            {
              Array.isArray(images) && images.length > 0  &&
              imagePreviews.map((image, index) => {
                return (
                  <div className="imgContainer" key={index}>
                    <img src={image} alt={`Uploaded ${index}`} style={{ width: '90%', height: 'auto' }} />
                  </div>
                )
              })
            }
          </>
        )
      }
      <input 
      type="file" 
      ref={fileInputRef}
      style={{display: 'none'}}
      accept='image/*'
      multiple
      onChange={handleFileChange}
      />
      
    </>
  )
}

export default App
