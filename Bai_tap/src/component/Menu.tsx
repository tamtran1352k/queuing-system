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
import { Layout, Menu, Button, theme, Image, Row, Col, Card } from "antd";
import { Footer } from "antd/es/layout/layout";

const { Header, Sider, Content } = Layout;

const MenuLayout: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const gridStyle: React.CSSProperties = {
    width: "25%",
    textAlign: "center",
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
      <Col span={10}>
        {" "}
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <h1> Dashboard</h1>
          </Header>
          <Content style={{ margin: "24px 16px 0" }}>
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
              }}
            >
              <h1>Bieu do cap so </h1>
              <Card title="Card Title">
                <Card.Grid style={gridStyle}>Content</Card.Grid>
                <Card.Grid hoverable={false} style={gridStyle}>
                  Content
                </Card.Grid>
                <Card.Grid style={gridStyle}>Content</Card.Grid>
                <Card.Grid style={gridStyle}>Content</Card.Grid>
                <Card.Grid style={gridStyle}>Content</Card.Grid>
                <Card.Grid style={gridStyle}>Content</Card.Grid>
                <Card.Grid style={gridStyle}>Content</Card.Grid>
              </Card>
            </div>
          </Content>
        </Layout>
        <Footer></Footer>

      </Col>
      <Col span={10}>
        {" "}
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <h1> Dashboard</h1>
          </Header>
          <Content style={{ margin: "24px 16px 0" }}>
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
              }}
            >
              <h1>tong quan </h1>
              <Card title="Card Title">
                <Card.Grid style={gridStyle}>Content</Card.Grid>
                <Card.Grid hoverable={false} style={gridStyle}>
                  Content
                </Card.Grid>
                <Card.Grid style={gridStyle}>Content</Card.Grid>
                <Card.Grid style={gridStyle}>Content</Card.Grid>
                <Card.Grid style={gridStyle}>Content</Card.Grid>
                <Card.Grid style={gridStyle}>Content</Card.Grid>
                <Card.Grid style={gridStyle}>Content</Card.Grid>
              </Card>
            </div>
          </Content>
          <Footer></Footer>

        </Layout>
      </Col>
    </Row>
  );
};

export default MenuLayout;
