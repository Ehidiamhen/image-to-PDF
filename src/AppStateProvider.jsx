import { useReducer } from "react";
import { AppStateContext } from "./AppStateContext";

const initialState = {
    images: [],
    imagePreviews: [],
    converting: false,
    landscape: false,
    sidebar: false,
    margin: 1,
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

        case 'portrait':
          return {
            ...state, 
            landscape: false,
          }

        case 'landscape':
          return {
            ...state,
            landscape: true,
          };

        case 'clear':
          return {
            ...state,
            images: [],
            imagePreviews:[],
            landscape: false,
            sidebar: false,
            margin: 1,
          }; 

        case 'sidebar':
          return {
            ...state,
            sidebar: !state.sidebar,
          };
        
        case 'margin':
          return {
            ...state,
            margin: action.payload, 
          };

        default:
            return state;
    }
  };

export const AppStateProvider = ({children}) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    return (
        <AppStateContext.Provider value={{state, dispatch}}>
            {children}
        </AppStateContext.Provider>
    );
};