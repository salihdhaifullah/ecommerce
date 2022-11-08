import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux';
import userSlice from './slices/userSlice';

// config the store 
const store= configureStore({
   reducer: {
      user: userSlice.reducer
   }
})

export default store;
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export const useAppDispatch: () => AppDispatch = useDispatch