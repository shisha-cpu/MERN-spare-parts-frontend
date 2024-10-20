import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    isLoggin: false,
    userInfo: {
        _id: null,
        email: '',
        username: '',
        phone: '',
        createdAt: null,
        password: '',
        wholesale: false,
        orderHistory: [], // Initialize as an empty array
    },
    basket: [], // Initialize as an empty array
};

const persistedState = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : initialState;

export const userSlice = createSlice({
    name: 'user',
    initialState: persistedState,
    reducers: {
        setUser: (state, action) => {
            state.isLoggin = true;
            state.userInfo = { ...action.payload }; 
            state.basket = action.payload.basket || []; 
            localStorage.setItem('user', JSON.stringify(state));
        },
        clearUser: (state) => {
            state.isLoggin = false;
            state.userInfo = {};
            state.basket = {};
            // Remove from localStorage
            localStorage.removeItem('user');
        }
    }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
