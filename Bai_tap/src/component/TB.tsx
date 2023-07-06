import React from "react";
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
  Input,
  Form,
  Select,
  Radio,
} from "antd";
import { Footer } from "antd/es/layout/layout";
import ProfilePage from "./ProfilePage";
import MenuLayout from "./Menu";

const { Header, Sider, Content } = Layout;

const TB: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const gridStyle: React.CSSProperties = {
    width: "25%",
    textAlign: "center",
  };
  const style: React.CSSProperties = { padding: "8px 0" };
  const { Option } = Select;

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  };
  return (
    <>
      <Row>
        <Col span={4}>
       <MenuLayout/>
        </Col>
        <Col span={19}>
          <Layout>
            <Header style={{ padding: 0, background: colorBgContainer }}>
              <h1> Dashboard</h1>
            </Header>

            <Row>
              <Col span={4}>
                <h1>Quản lý thiết bị </h1>
              </Col>
            </Row>
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
                    <h1>Thông tin thiết bị </h1>{" "}
                  </Col>
                </Row>
                <Form layout="vertical" >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Mã thiết bị">
                        <Input placeholder="Mã thiết bị" />
                      </Form.Item>

                      <Form.Item label="Tên Thiết bị">
                        <Input placeholder="Tên Thiết bị" />
                      </Form.Item>
                      <Form.Item label="Địa chỉ IP">
                        <Input placeholder="Địa chỉ IP" />
                      </Form.Item>
                    </Col>
                 
                    <Col span={12}>
                      <Form.Item label="Loại thiết bị">
                        <Select placeholder=" Loại thiết bị">
                          <Option value="1">Kioks</Option>
                          <Option value="2">Display counter</Option>
                        </Select>{" "}
                      </Form.Item>

                      <Form.Item label="Tên đăng nhập">
                        <Input placeholder="Nhập tên đăng nhập" />
                      </Form.Item>
                      <Form.Item label="Mật khẩu">
                        <Input placeholder="Nhập mật khẩu" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>

                <Row>
                  <Col span={4}>
                    <h1>Dịch vụ sử dụng </h1>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Input placeholder="Nhập lại dịch vụ sử dụng" />
                  </Col>
                </Row>
              </div>
            </Content>
            <Footer>
              <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    background: "white",
                    color: "orange",
                    marginRight: "20px",
                    borderColor: "orange",
                  }}
                >
                  Hủy bỏ
                </Button>

                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ background: "#FF9138" }}
                >
                  Tiếp Tục
                </Button>
              </Form.Item>
            </Footer>
          </Layout>
        </Col>
      </Row>
    </>
  );
};

export default TB;
