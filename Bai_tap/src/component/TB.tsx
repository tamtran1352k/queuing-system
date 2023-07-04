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
} from "antd";
import { Footer } from "antd/es/layout/layout";
import ProfilePage from "./ProfilePage";

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
            <Image src={img} style={{ width: "250px",height:"250px" }} />
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

                <Row gutter={16}>
                  <Col className="gutter-row" span={12}>
                    <div style={style}>
                      {" "}
                      <Form>
                        <Form.Item>
                          <div style={{ marginBottom: "16px" }}>
                            <Row>
                              <Col span={4}>
                                <label>Mã thiết bị</label>
                              </Col>
                            </Row>

                            <Input placeholder="Nhập mã thiết bị" />
                          </div>
                          <div style={{ marginBottom: "16px" }}>
                            <Row>
                              <Col span={4}>
                                <label> Tên Thiết bị</label>
                              </Col>
                            </Row>
                            <Input placeholder="Tên Thiết Bị " />
                          </div>
                          <div style={{ marginBottom: "16px" }}>
                            <Row>
                              <Col span={4}>
                                <label> Địa chỉ IP</label>
                              </Col>
                            </Row>
                            <Input placeholder="Địa chỉ IP " />
                          </div>
                        </Form.Item>
                      </Form>
                    </div>
                  </Col>
                  <Col className="gutter-row" span={12}>
                    <div style={style}>
                      {" "}
                      <Form>
                        <Form.Item>
                          <div style={{ marginBottom: "16px" }}>
                            <Row>
                              <Col span={4}>
                                <label> Loại thiết bị</label>
                              </Col>
                            </Row>

                            <Form.Item>
                              <Select placeholder=" Loại thiết bị">
                                <Option value="1">Kioks</Option>
                                <Option value="2">Display counter</Option>
                              </Select>
                            </Form.Item>
                          </div>
                          <div>
                            <Row>
                              <Col span={4}>
                                <label> Tên đăng nhập</label>
                              </Col>
                            </Row>
                            <Input placeholder="Nhập tài khoản" />
                          </div>
                          <div>
                            <br />

                            <Row>
                              <Col span={4}>
                                <label> Mật khẩu</label>
                              </Col>
                            </Row>
                            <Input placeholder="Nhập mật khẩu" />
                          </div>
                        </Form.Item>
                      </Form>
                    </div>
                  </Col>
                </Row>
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
