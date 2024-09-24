import { useContext } from "react";
import { AppStateContext } from "./AppStateContext";
import jsPDF from 'jspdf'

export default function ImagePreviews({ fileInputRef, handleClick }) {
    const { state, dispatch } = useContext(AppStateContext)

    const handleConvert = async () => {
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
            imgWidth = pageWidth * state.margin
            imgHeight = imgWidth / imgAspectRatio
          } else {
            imgHeight = pageHeight * state.margin
            imgWidth = imgHeight * imgAspectRatio
          }
    
          const x  = (pageWidth - imgWidth) / 2
          const y = (pageHeight - imgHeight) / 2
      
          if (index > 0) pdf.addPage()
          { x >= 0 && y >= 0 && imgWidth > 0 && imgHeight > 0 && pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight, undefined, 'SLOW') }
        }
    
        pdf.save('converted.pdf')
        dispatch({type: 'converting'})
    };

    const clearImages = () => {
        dispatch({type: 'clear'})
        fileInputRef.current.value = ''
    };

    const handleDelete = (index) => {
        dispatch({
          type: 'delete_image',
          payload: index
        })
    };    

  return (
    <>
        <div className="card">
            <button onClick={handleConvert} className='btn btn-convert'>Convert to PDF</button>
            <button onClick={handleClick} className='btn btn-upload'>Add More Images</button>
            <button onClick={clearImages} className='btn btn-clear'>Clear Images</button>
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
                    <img src={image} alt={`Uploaded ${index}`} className='preview-img' style={{maxWidth: `calc(${state.margin} * 100%)`, maxHeight: `calc(${state.margin} * 100%)`}}/>
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
