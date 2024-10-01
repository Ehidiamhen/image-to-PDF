import { useContext, useRef, } from 'react'
import './App.css'
import { AppStateContext } from './AppStateContext.jsx'
import ImagePreviews from './ImagePreviews.jsx'
import Sidebar from './Sidebar.jsx'

function App() {
  const fileInputRef = useRef(null)

  const { state, dispatch } = useContext(AppStateContext);

  const removeInvalidFiles = (files) => {
    const validFiles = files.filter(file => file.type.startsWith('image/'))
    return validFiles
  }

  const handleClick = () => {
    fileInputRef.current.click()
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const sortedFiles = removeInvalidFiles(files)

    dispatch({type: 'add_image', payload: sortedFiles})
    const filePreviews = []

    sortedFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        filePreviews.push(event.target.result)
        if (filePreviews.length === sortedFiles.length) {
          dispatch({type: 'add_preview', payload: filePreviews})
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDrop = (e) => {
    e.preventDefault()

    const files = Array.from(e.dataTransfer.files)

    files.length && handleFileChange({target: { files }})
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }
  
  console.log(state.images)
  
  return (
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
            <button onClick={handleClick} className='btn btn-upload'>Select your images</button>
            <p className='drop'>or drop images here</p>
          </>
        )
        :(
          <>
            <ImagePreviews 
              fileInputRef={fileInputRef}
              handleClick={handleClick}
            />
            {!state.sidebar && <i onClick={() => dispatch({type: 'sidebar'})} className="fa-solid fa-gear open-sidebar"></i>}
            {state.sidebar && <Sidebar />}
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
  )
}

export default App
