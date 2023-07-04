import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import MenuLayout from "./Menu";
import { Col, Image, Menu, Row } from "antd";
import Sider from "antd/es/layout/Sider";
import img from "../img/1.png";

import {
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

const auth = getAuth();

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserProfile(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!userProfile) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div>
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
            <Image src={img} style={{ width: "250px", height: "250px" }} />
            <Menu mode="inline" defaultSelectedKeys={["1"]}>
              <Menu.Item key="" icon={<AppstoreOutlined />}>
                Dashboard
              </Menu.Item>
              <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                Thiết bị{" "}
              </Menu.Item>
              <Menu.Item key="3" icon={<UploadOutlined />}>
                Dịch vụ{" "}
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
            </Menu>
          </Sider>
        </Col>
        <Col span={20}>
          <Row>
            <Col span={8}>
              <h1>Thông tin hồ sơ người dùng</h1>
            </Col>
            <Col span={16}></Col>
          </Row>
          <p>Tên người dùng: {userProfile.displayName}</p>
          <p>Email: {userProfile.email}</p>
          <p>Ảnh đại diện: {userProfile.photoURL}</p>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;
