import { createContext, useReducer, useContext, useRef, useState } from 'react'
import jsPDF from 'jspdf'
// import { AppStateProvider } from './AppStateProvider.jsx'
import './App.css'
// import { AppStateContext } from './AppStateContext.jsx'


const AppStateContext = createContext();

const initialState = {
  images: [],
  imagePreviews: [],
  converting: false,
  landscape: false,
}

const appReducer = (state, action) => {
  switch (action.type) {
      case 'delete_image':
          return {
              ...state,
              images: state.images.filter((_, i) => i !== action.payload),
              imagePreviews: state.imagePreviews.filter((_, i) => i !== action.payload),
          };
        case 'add_image':
          return {
            ...state,
            images: [...state.images, ...action.payload],
          };
        case 'add_preview':
          return {
            ...state,
            imagePreviews: [...state.imagePreviews, ...action.payload],
          };
        case 'converting':
          return {
            ...state, 
            converting: !state.converting,
          };
        case 'toggle_landscape':
          return {
            ...state,
            landscape: !state.landscape,
          };
        case 'clear':
          return {
            ...state,
            images: [],
            imagePreviews:[],
            landscape: false,
          }  
      default:
          return state;
  }
};

function App() {
  const fileInputRef = useRef(null)
  // const [images, setImages] = useState([])
  // const [imagePreviews, setImagePreviews] = useState([])
  // const [converting, setConverting] = useState(false)
  // const [landscape, setLandscape] = useState(false)

  // const { state, dispatch } = useContext(AppStateContext);

  const [state, dispatch] = useReducer(appReducer, initialState);


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

    // setImages((prevImages) => [...prevImages, ...sortedFiles])
    dispatch({type: 'add_image', payload: sortedFiles})
    const filePreviews = []

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        filePreviews.push(event.target.result)
        if (filePreviews.length === files.length) {
          // setImagePreviews((prevPreviews) => [...prevPreviews, ...filePreviews])
          dispatch({type: 'add_preview', payload: filePreviews})
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleConvert = async () => {
    // setConverting(true)
    dispatch({type: 'converting'})
    if (!state.images.length) return
  
    const pdf = new jsPDF({
      orientation: state.landscape ? 'landscape' : 'portrait',
    });
  
    for (let index = 0; index < state.images.length; index++) {
      const file = state.images[index]
  
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
      console.log(imgData, 'JPEG', x, y, imgWidth, imgHeight, undefined, 'SLOW')
  
      if (index > 0) pdf.addPage()
      x >= 0 && y >= 0 && imgWidth > 0 && imgHeight > 0 && pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight, undefined, 'SLOW')
    }

    pdf.save('converted.pdf')
    // setConverting(false)
    dispatch({type: 'converting'})
  };
  
  // const clearImages = () => {
  //   // setImages([])
  //   setImagePreviews([])
    // fileInputRef.current.value = ''
  //   setLandscape(false)
  // }

  const clearImages = () => {
    dispatch({type: 'clear'})
    fileInputRef.current.value = ''
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

  // const handleDelete = (index) => {
  //   const updatedPreviews = imagePreviews.filter((_, i) => i !== index)
  //   const updatedImages = images.filter((_, i) => i !== index)
    
  //   setImagePreviews(updatedPreviews)
  //   // setImages(updatedImages)
  //   dispatch({type: 'add_image', payload: sortedFiles})
  // }

  const newDelete = (index) => {
    dispatch({
      type: 'delete_image',
      payload: index
    })
  }

  console.log(state.images)
  
  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className='container'
    >
      <h2>PIC TO PDF</h2>
      <p>Convert images to PDF in seconds. Easily adjust orientation and margins.</p>

      {(state.images.length == 0 )
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
            <button onClick={() => dispatch({type:'toggle_landscape'})}>{state.landscape ? 'Portrait' : 'Landscape'}</button>
            </div>
            {
              Array.isArray(state.images) && state.images.length > 0  &&
              (
                <div className="preview">
                  <h3>Selected Images</h3>
                  <div className="image-grid">
                  {state.imagePreviews.map((image, index) => {
                    return (
                      <div 
                        className="img-container" 
                        key={index}
                        style={{
                          width: state.landscape ? '297px':'210px',
                          height: state.landscape ? '210px' : '297px',
                        }}
                      >
                        <img src={image} alt={`Uploaded ${index}`} className='preview-img' />
                        <i onClick={() => newDelete(index)} className="fa-regular fa-solid fa-circle-xmark delete"></i>
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
        state.converting && 
        (
          <div className="loadingState">
            <i className="fa-solid fa-gear"></i>
          </div>
        )
      }
    </div>
    </AppStateContext.Provider>
  )
}

export default App
