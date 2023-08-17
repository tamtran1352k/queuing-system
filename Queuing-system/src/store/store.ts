import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import authReducer from "../redecers/authReducer";
import imageSlice from "../redecers/imageSlice";
import detailSlice from "../redecers/detailSlice";
import listSlice from "../redecers/addReducer";
import AddvtSlice from "../redecers/addvtRedecer";
import deviceSlice from "../redecers/updateDevice ";
import updatetkSlice from "../redecers/updatetk";
import chiTietDichVuSlice from "../redecers/chitietdv";
import updatedvSlice from "../redecers/updvRedecer";
import AddcsSlice from "../redecers/adcapsoRedecer";
import thunk from "redux-thunk";
import AddproSlice from "../redecers/addprofile";

const store = configureStore({
  reducer: {
    auth: authReducer,
    image: imageSlice,
    detail:detailSlice,
    addTb: listSlice,
    table: deviceSlice,
    addvt:AddvtSlice,
    update:deviceSlice,
    updatetk:updatetkSlice,
    chitietdv:chiTietDichVuSlice,
    updatedv:updatedvSlice,
    addcs:AddcsSlice,
    addpro:AddproSlice

  } 
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
