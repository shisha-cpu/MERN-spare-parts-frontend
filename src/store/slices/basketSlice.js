import { createSlice } from '@reduxjs/toolkit';

const basketSlice = createSlice({
  name: 'basket',
  initialState: {
    items: [],
  },
  reducers: {
    addToBasket: (state, action) => {
      state.items.push(action.payload);
    },
    removeFromBasket: (state, action) => {
      state.items = state.items.filter(item => item.product.Артикул !== action.payload);
    },
    setBasket: (state, action) => {
      state.items = action.payload;
    },
    clearBasket: (state) => {
      state.items = [];
    },
  },
});

export const { addToBasket, removeFromBasket, setBasket, clearBasket } = basketSlice.actions;
export default basketSlice.reducer;