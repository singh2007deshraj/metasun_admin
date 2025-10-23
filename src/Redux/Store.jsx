import { configureStore } from '@reduxjs/toolkit';
import LayoutSlice from './LayoutSlice';
import LoginSlice from './LoginSlice'
export const store = configureStore({
    reducer: {
        layout: LayoutSlice,
        login: LoginSlice
    }
})