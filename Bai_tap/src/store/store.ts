import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import authReducer from "../redecers/authReducer";
import imageSlice from "../redecers/imageSlice";
import detailSlice from "../redecers/detailSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    image: imageSlice,
    detail:detailSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
