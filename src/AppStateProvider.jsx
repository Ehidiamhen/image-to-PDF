import { useReducer } from "react";
import { AppStateContext } from "./AppStateContext";

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
                images: state.images.filter((image) => image.id !== action.payload),
                imagePreviews: state.imagePreviews.filter((image) => image.id !== action.payload),
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