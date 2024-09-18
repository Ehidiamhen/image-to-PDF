import { useRef, useState } from 'react'
import jsPDF from 'jspdf'
import './App.css'

function App() {
  const fileInputRef = useRef(null)
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [converting, setConverting] = useState(false)
  const [landscape, setLandscape] = useState(false)

  const removeInvalidFiles = (files) => {
    const validFiles = files.filter(file => file.type.startsWith('image/'))
    return validFiles
  }

  const handleCLick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const sortedFiles = removeInvalidFiles(files)

    setImages((prevImages) => [...prevImages, ...sortedFiles])
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
    setConverting(true)
    if (!images.length) return
  
    const pdf = new jsPDF({
      orientation: landscape ? 'landscape' : 'portrait',
    });
  
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
  
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      const imgAspectRatio = img.width / img.height 
      const pageAspectRatio = pageWidth / pageHeight

      let imgWidth = 1 
      let imgHeight = 1
      
      if (imgAspectRatio > pageAspectRatio) {
        imgWidth = pageWidth * 1
        imgHeight = imgWidth / imgAspectRatio
      } else {
        imgHeight = pageHeight * 1
        imgWidth = imgHeight * imgAspectRatio
      }

      const x  = (pageWidth - imgWidth) / 2
      const y = (pageHeight - imgHeight) / 2
  
      if (index > 0) pdf.addPage()
      pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight, undefined, 'SLOW')
    }

    pdf.save('converted.pdf')
    setConverting(false)
  };
  
  const clearImages = () => {
    setImages([])
    setImagePreviews([])
    fileInputRef.current.value = ''
    setLandscape(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()

    const files = Array.from(e.dataTransfer.files)
    sortedFiles = removeInvalidFiles(files)

    files.length && handleFileChange({target: { sortedFiles }})
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDelete = (index) => {
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index)
    const updatedImages = images.filter((_, i) => i !== index)
    
    setImagePreviews(updatedPreviews)
    setImages(updatedImages)
  }

  console.log(images)
  
  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className='container'
    >
      <h2>PIC TO PDF</h2>
      <p>Convert images to PDF in seconds. Easily adjust orientation and margins.</p>

      {(images.length == 0 )
        ?(
          <>
            <button onClick={handleCLick} className='btn btn-upload'>Select your images</button>
            <p className='drop'>or drop images here</p>
          </>
        )
        :(
          <>
            <div className="card">
            <button onClick={handleConvert} className='btn btn-convert'>Convert to PDF</button>
            <button onClick={handleCLick} className='btn btn-upload'>Add More Images</button>
            <button onClick={clearImages} className='btn btn-clear'>Clear Images</button>
            <button onClick={() => setLandscape(!landscape)}>{landscape ? 'Portrait' : 'Landscape'}</button>
            </div>
            {
              Array.isArray(images) && images.length > 0  &&
              (
                <div className="preview">
                  <h3>Selected Images</h3>
                  <div className="image-grid">
                  {imagePreviews.map((image, index) => {
                    return (
                      <div 
                        className="img-container" 
                        key={index}
                        style={{
                          width: landscape ? '297px':'210px',
                          height: landscape ? '210px' : '297px',
                        }}
                      >
                        <img src={image} alt={`Uploaded ${index}`} className='preview-img' />
                        <i onClick={() => handleDelete(index)} className="fa-regular fa-solid fa-circle-xmark delete"></i>
                      </div>
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
      {
        converting && 
        (
          <div className="loadingState">
            <i className="fa-solid fa-gear"></i>
          </div>
        )
      }
    </div>
  )
}

export default App
