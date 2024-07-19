import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice"; // Импортируйте редюсер из userSlice

const store = configureStore({
    reducer: {
        user: userReducer
    }
});

export default store;
