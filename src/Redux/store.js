// ********* Import necessary libraries and functions *********
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./Reducers/authReducer";
import { productReducer } from "./Reducers/productReducer";


// ********* Create the Redux store using configureStore *********
export const store = configureStore({
    reducer: {
        authReducer,
        productReducer
    }
})