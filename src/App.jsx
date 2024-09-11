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
    <div className='container'>
      <h2>PIC TO PDF</h2>
      <p>Convert images to PDF in seconds. Easily adjust orientation and margins.</p>

      {(images.length == 0 )
        ?<button onClick={handleCLick} className='btn btn-upload'>Select your images</button>
        :(
          <>
            <div className="card">
            <button onClick={handleConvert} className='btn btn-convert'>Convert to PDF</button>
            <button onClick={handleCLick} className='btn btn-upload'>Add More Images</button>
            <button onClick={clearImages} className='btn btn-clear'>Clear Images</button>
            </div>
            {
              Array.isArray(images) && images.length > 0  &&
              (
                <div className="preview-container">
                  <h3>Selected Images</h3>
                  <div className="image-grid">
                  {imagePreviews.map((image, index) => {
                    return (
                     <img key={index} src={image} alt={`Uploaded ${index}`} className='preview-img' />
                    )
                  })}
                  </div>
                </div>
              )
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
      
    </div>
  )
}

export default App
