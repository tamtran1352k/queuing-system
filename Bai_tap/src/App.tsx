import React from "react";
import "./App.css";

import { Route, Routes } from "react-router-dom";
import ListT from "./component/ListT";
import { NewPass } from "./component/NewPass";
import TB from "./component/TB";
import { Forgot } from "./component/Forgot";
import MenuLayout from "./component/Menu";
import TableView from "./component/table";
import Login from "./component/Login";
import ProfilePage from "./component/ProfilePage";
import DetailPage from "./component/chitiet";
import UpdateDevicePage from "./component/update";
import TablePage from "./component/vaitro";
import { UpdateVt } from "./component/updatevt";
import AddVt from "./component/addvaitro";
import QuanLyTK from "./component/quanlytk";
import AddAccout from "./component/addAccout";
import UpdateQltk from "./component/UpdateQltk";
import ChitietDichvu from "./component/chitietdichvu";
import CapnhatDichvu from "./component/capnhatdichvu";
import AddDichvu from "./component/adddichvu";
import Dichvu from "./component/dichvu";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/menu" element={<MenuLayout />} />
        <Route path="/tb" element={<TB />} />
        <Route path="/newpass" element={<NewPass />} />
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

        <Route path="/dv" element={<Dichvu />} />
      </Routes>
    </div>
  );
}

export default App;
