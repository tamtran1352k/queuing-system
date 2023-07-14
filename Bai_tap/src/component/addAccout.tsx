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
  Input,
  Form,
  Select,
  Radio,
  message,
} from "antd";
import { Footer } from "antd/es/layout/layout";
import ProfilePage from "./ProfilePage";
import MenuLayout from "./Menu";
import { addList } from "../redecers/addReducer";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addacList } from "../redecers/addacRedecer";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/fibase";

const { Header, Sider, Content } = Layout;

interface Device {
  name: string;
  imageUrl: string;
  password: string;
  phone: string;
  role: string;
  username: string;
  email: string;
  tthd: string;
}

const AddAccout: React.FC = () => {
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

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordconfirm, setPasswordconfirm] = useState("");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleFormSubmit = async () => {
    if (password !== passwordconfirm) {
      console.error("Passwords do not match");
      message.error("Passwords do not match");

      return;
    }

    if (!email.includes("@")) {
      console.error("Invalid email format");
      message.error("FInvalid email format");
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("User created:", user);

      const data: Device = {
        name,
        imageUrl: "",
        password,
        phone,
        role: vaitro.role,
        username,
        email,
        tthd: vaitro.tthd,
      };

      dispatch(addacList(data) as any);
      navigate("/qltk");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const [vaitro, setVaitro] = useState<Device>({
    name: "",
    imageUrl: "",
    password: "",
    phone: "",
    role: "",
    username: "",
    email: "",
    tthd: "",
  });

  const handleRoleChange = (value: string) => {
    setVaitro((prevDeviceData) => {
      return {
        ...prevDeviceData,
        role: value,
      };
    });
  };
  const handlettthdChange = (value: string) => {
    setVaitro((prevDeviceData) => {
      return {
        ...prevDeviceData,
        tthd: value,
      };
    });
  };

  return (
    <>
      <Row>
        <Col span={4}>
          <MenuLayout />
        </Col>
        <Col span={19}>
          <Row>
            <Col span={15}>
              <header>
                <h1>
                  Cài đặt hệ thống &gt;Quản lý tài khoản&gt;{" "}
                  <b>
                    {" "}
                    <Link to="/addac" style={{ color: "orange" }}>
                      {" "}
                      Thêm tài khoản{" "}
                    </Link>
                  </b>
                </h1>
              </header>
            </Col>
            <Col span={9}>
            </Col>
          </Row>
          <Layout>
            <Header style={{ padding: 0, background: colorBgContainer }}>
              <Row>
                <Col span={4}>
                  <h1 style={{ color: "orange" }}>Quản lý tài khoản </h1>
                </Col>
              </Row>
            </Header>
            <Row>
              <Col span={5}>
                <h1 style={{ color: "orange" }}>Thông tin tài khoản </h1>
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
                    <h1>Thông tin thiết bị </h1>
                  </Col>
                </Row>
                <Form layout="vertical">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Họ và tên">
                        <Input
                          placeholder="Nhập họ và tên"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </Form.Item>

                      <Form.Item label="Số điện thoại">
                        <Input
                          placeholder="Nhập số điện thoại"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </Form.Item>
                      <Form.Item label="Email">
                        <Input
                          placeholder="Nhập Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </Form.Item>
                      <Form.Item label="Vai trò">
                        <Select
                          placeholder="Chọn vai trò"
                          value={vaitro.role}
                          onChange={handleRoleChange}
                        >
                          <Option value="Kế toán">Kế toán </Option>
                          <Option value="Quản lý">Quản lý</Option>
                          <Option value="Admin">Admin </Option>
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item label="Tên đăng nhập">
                        <Input
                          placeholder="Nhập tên đăng nhập"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </Form.Item>
                      <Form.Item label="Mật khẩu">
                        <Input.Password
                          placeholder="Nhập mật khẩu"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </Form.Item>
                      <Form.Item label="Nhập lại mật khẩu">
                        <Input.Password
                          placeholder="Nhập lại mật khẩu"
                          value={passwordconfirm}
                          onChange={(e) => setPasswordconfirm(e.target.value)}
                        />
                      </Form.Item>
                      <Form.Item label="Tình trạng">
                        <Select
                          placeholder="Chọn Hoạt động"
                          value={vaitro.tthd}
                          onChange={handlettthdChange}
                        >
                          <Option value="Hoạt động">Hoạt động</Option>
                          <Option value="Ngưng hoạt động">
                            Ngưng hoạt động
                          </Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
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
                  <Link to="/qltk">Hủy bỏ</Link>
                </Button>

                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ background: "#FF9138" }}
                  onClick={handleFormSubmit}
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

export default AddAccout;
