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
  Form,
  Select,
  Input,
} from "antd";
import { Footer } from "antd/es/layout/layout";
import { Option } from "antd/es/mentions";
import MenuLayout from "./Menu";

const { Header, Sider, Content } = Layout;

const ListT: React.FC = () => {
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
      <MenuLayout/>

      </Col>
      <Col span={19}>
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
              <Row>
                <Col span={4}>
                  <h1> Danh sách thiết bị</h1>
                </Col>
              </Row>
              <div>
                {" "}
                <Row>
                  <Col span={8}>
                    {" "}
                    <div style={{ marginBottom: "16px" }}>
                      <Row>
                        <Col span={6}>
                          <label> Loại thiết bị</label>
                        </Col>
                      </Row>

                      <Form.Item>
                      <Row>
                          <Col span={21}>
                          <Select placeholder=" Loại thiết bị">
                          <Option value="1">Kioks</Option>
                          <Option value="2">Display counter</Option>
                        </Select>
                          </Col>
                        </Row>
                      </Form.Item>
                    </div>
                  </Col>
                  
                  <Col span={8}>
                    {" "}
                    <div style={{ marginBottom: "16px" }}>
                      <Row>
                        <Col span={6}>
                          <label> Loại thiết bị</label>
                        </Col>
                      </Row>

                      <Form.Item>
                      <Row>
                          <Col span={21}>
                          <Select placeholder=" Loại thiết bị">
                          <Option value="1">Kioks</Option>
                          <Option value="2">Display counter</Option>
                        </Select>
                          </Col>
                        </Row>
                      </Form.Item>
                    </div>
                  </Col>
                  <Col span={8}>
                    {" "}
                    <div style={{ marginBottom: "16px" }}>
                      <Row>
                        <Col span={6}>
                          <label> Loại thiết bị</label>
                        </Col>
                      </Row>

                      <Form.Item>
                        <Row>
                          <Col span={20}>
                        <Input placeholder="Nhập từ khóa"/>
                          </Col>
                        </Row>
                   
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
              </div>
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
    </Row>
  );
};

export default ListT;
