import React from "react";
import "./App.css";

import { Route, Routes } from "react-router-dom";
import ListT from "./component/dashboard/ListT";
import TB from "./component/thiết bị/TB";
import MenuLayout from "./component/menu/Menu";
import TableView from "./component/thiết bị/table";
import Login from "./component/login/Login";
import ProfilePage from "./component/profile/ProfilePage";
import DetailPage from "./component/thiết bị/chitiet";
import UpdateDevicePage from "./component/thiết bị/update";
import TablePage from "./component/vai trò/vaitro";
import { UpdateVt } from "./component/vai trò/updatevt";
import AddVt from "./component/vai trò/addvaitro";
import QuanLyTK from "./component/quản lý tài khoản/quanlytk";
import AddAccout from "./component/quản lý tài khoản/addAccout";
import UpdateQltk from "./component/quản lý tài khoản/UpdateQltk";
import ChitietDichvu from "./component/dichvu/chitietdichvu";
import CapnhatDichvu from "./component/dichvu/capnhatdichvu";
import AddDichvu from "./component/dichvu/adddichvu";
import Dichvu from "./component/dichvu/dichvu";
import CapSo from "./component/cấp số/tablecapso";
import CapSostt from "./component/cấp số/addcapso";
import DetailsCs from "./component/cấp số/detailscs";
import BaoCao from "./component/báo cáo/baocao";
import NhatkyNguoiDung from "./component/nhật ký người dung/nknd";
import Test from "./component/profile/test";
import { Forgot } from "./component/login/Forgot";
import { NewPass } from "./component/login/NewPass";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/newpass" element={<NewPass />} />

        <Route path="/menu" element={<MenuLayout />} />
        <Route path="/tb" element={<TB />} />
        <Route path="/listt" element={<ListT />} />
        <Route path="/table" element={<TableView />} />
        <Route path="/details/:id" element={<DetailPage />} />
        <Route path="/update/:id" element={<UpdateDevicePage />} />
        <Route path="/vaitro" element={<TablePage />} />
        <Route path="/updatevt/:id" element={<UpdateVt />} />
        <Route path="/addvt" element={<AddVt />} />
        <Route path="/qltk" element={<QuanLyTK />} />
        <Route path="/addac" element={<AddAccout />} />
        <Route path="/updateqltk/:id" element={<UpdateQltk />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/ctdv/:id" element={<ChitietDichvu />} />
        <Route path="/updv/:id" element={<CapnhatDichvu />} />
        <Route path="/adddv" element={<AddDichvu />} />
        <Route path="/cs" element={<CapSo />} />
        <Route path="/csstt" element={<CapSostt />} />
        <Route path="/dv" element={<Dichvu />} />
        <Route path="/ctcs/:id" element={<DetailsCs />} />
        <Route path="/baocao" element={<BaoCao />} />
        <Route path="/nknd" element={<NhatkyNguoiDung />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </div>
  );
}

export default App;
