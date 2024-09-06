import { useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const fileInputRef = useRef(null)

  const handleCLick = () => {
    fileInputRef.current.click()
  }

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0]
  //   if (file) {
  //     console.log('Selected file:', file)
  //   }
  // }
  return (
    // <>
    //   <div>
    //     <a href="https://vitejs.dev" target="_blank">
    //       <img src={viteLogo} className="logo" alt="Vite logo" />
    //     </a>
    //     <a href="https://react.dev" target="_blank">
    //       <img src={reactLogo} className="logo react" alt="React logo" />
    //     </a>
    //   </div>
    //   <h1>ImageToPDF</h1>
    //   <div className="card">
    //     <button onClick={() => setCount((count) => count + 1)}>
    //       count is {count}
    //     </button>
    //     <p>
    //       Edit <code>src/App.jsx</code> and save to test HMR
    //     </p>
    //   </div>
    //   <p className="read-the-docs">
    //     Click on the Vite and React logos to learn more
    //   </p>
    // </>
    <>
      <h2>JPG TO PDF</h2>
      <p>Convert JPG images to PDF in seconds. Easily adjust orientation and margins.</p>
      <button onClick={handleCLick}>Select JPG images</button>
      <input 
      type="file" 
      ref={fileInputRef}
      style={{display: 'none'}}
      accept='image/*'
      // onChange={handleFileChange}
      id="" 
      />
      
    </>
  )
}

export default App
