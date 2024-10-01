import { useContext } from "react";
import { AppStateContext } from "./AppStateContext";

export default function Sidebar() {
  const { state, dispatch } = useContext(AppStateContext)

  return (
    <div className="sidebar">
    {state.sidebar && <i onClick={() =>dispatch({type: 'sidebar'})} className="fa-regular fa-solid fa-circle-xmark close-sidebar"></i>}
      <p>PDF OPTIONS</p>

      <div className="orientation">
        <p className="sub-heading">Page orientation</p>
        <button onClick={() => dispatch({type:'portrait'})}>Portrait</button>
        <button onClick={() => dispatch({type:'landscape'})}>Landscape</button>
      </div>

      <div className="margin">
        <p className="sub-heading">Margins</p>
        <button onClick={() => dispatch({type:'margin', payload: 1})}>No margin</button>
        <button onClick={() => dispatch({type:'margin', payload: 0.95})}>Small</button>
        <button onClick={() => dispatch({type:'margin', payload: 0.9})}>Large</button>
      </div>
    </div>
  )
}
