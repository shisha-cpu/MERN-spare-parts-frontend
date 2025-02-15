import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice"; // Импортируйте редюсер из userSlice
import basketReducer from './slices/basketSlice';
const store = configureStore({
    reducer: {
        user: userReducer,
        basket: basketReducer
    }
});

export default store;
