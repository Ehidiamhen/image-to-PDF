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

    setImages(files)
    const filePreviews = []

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        filePreviews.push(event.target.result)
        setImagePreviews([...filePreviews])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleConvert = () => {
    if (!images.length) return

    const pdf = new jsPDF()

    Array.from(images).forEach((file, index) =>{
      const reader = new FileReader()
      reader.onload = function(event) {
        const img = new Image()
        img.src = event.target.result

        img.onload = function() {
          const imgWidth = pdf.internal.pageSize.getWidth()
          const imgHeight = (img.height * imgWidth) / img.width

          if (index > 0) pdf.addPage()
          pdf.addImage(img, 'JPEG', 0, 0, imgWidth, imgHeight)
          
          if (index === images.length -1) {
            pdf.save('converted.pdf')
          }
        }
      }
      reader.readAsDataURL(file)
    })
  }

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
