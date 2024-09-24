import { useContext } from "react";
import { AppStateContext } from "./AppStateContext";

export default function Sidebar() {
  const { state, dispatch } = useContext(AppStateContext)

  return (
    <div className="sidebar">
      <p>PDF OPTIONS</p>
      <button onClick={() => dispatch({type:'portrait'})}>Portrait</button>
      <button onClick={() => dispatch({type:'landscape'})}>Landscape</button>
    </div>
  )
}
