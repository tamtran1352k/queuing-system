import React, { useState } from "react";
import img from "../img/1.png";

import {
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Button,
  theme,
  Image,
  Row,
  Col,
  Card,
  MenuProps,
} from "antd";
import { Footer } from "antd/es/layout/layout";
import { useDispatch } from "react-redux";
import { auth } from "../firebase/fibase";
import { logout } from "../redecers/authReducer";
import { Link, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const MenuLayout: React.FC = () => {
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const gridStyle: React.CSSProperties = {
    width: "25%",
    textAlign: "center",
  };
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      await auth.signOut();
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <Row>
      <Col span={4}>
        {" "}
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          style={{ background: "white" }}
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <div className="demo-logo-vertical" />
          <Image src={img} />
          <Menu mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1" icon={<AppstoreOutlined />}>
              Dashboard
            </Menu.Item>
            <Menu.Item key="2" icon={<VideoCameraOutlined />}>
              <Link to={"/table"}> Thiết bị </Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<UploadOutlined />}>
            
              <Link to={"/dv"}>  Dịch vụ</Link>

            </Menu.Item>
            <Menu.Item key="4" icon={<UserOutlined />}>
              Cấp số{" "}
            </Menu.Item>
            <Menu.Item key="5" icon={<UserOutlined />}>
              Báo cáo{" "}
            </Menu.Item>
            <Menu.Item key="6" icon={<UserOutlined />}>
              Cài đặt hệ thống
            </Menu.Item>
            <Menu.Item key="7" icon={<UserOutlined />}>
            <Link to={"/vaitro"}> Quản lý vai trò </Link>
            </Menu.Item>
            <Menu.Item key="8" icon={<UserOutlined />}>
            <Link to={"/qltk"}> Quản lý tài khoản </Link>
            </Menu.Item>
          </Menu>
          <Button onClick={handleLogout}>Logout</Button>
        </Sider>
      </Col>
    </Row>
  );
};

export default MenuLayout;
