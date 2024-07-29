import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggin: false,
        userInfo: {},
        basket : {},
        
    },
    reducers: {
        setUser: (state, action) => {
            state.isLoggin = true;
            state.userInfo = action.payload;
            state.basket = action.payload
        },
        clearUser: (state) => {
            state.isLoggin = false;
            state.userInfo = {};
        }
    }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
