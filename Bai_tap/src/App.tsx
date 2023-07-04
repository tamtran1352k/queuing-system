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
      <Route path="/profile" element={<ProfilePage />} />


      


    </Routes>
    </div>
  );
}

export default App;
