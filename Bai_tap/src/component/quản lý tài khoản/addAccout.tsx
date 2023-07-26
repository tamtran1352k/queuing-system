import React, { useEffect, useState } from "react";
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
import ProfilePage from "../profile/ProfilePage";
import MenuLayout from "../menu/Menu";
import { addList } from "../../redecers/addReducer";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addacList } from "../../redecers/addacRedecer";
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../../firebase/fibase";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { addDoc, collection } from "@firebase/firestore";
import Test from "../profile/test";

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
  const user1 = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(true); // Add loading state
  const [userProfile, setUserProfile] = useState<User | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserProfile(user);
      setLoading(false); // Set loading to false once user profile data is available
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserProfile(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  const getCurrentTime = (): string => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleString("vi-VN", options);
  };

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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

  const handleFormSubmit = async () => {
    const timestamp = getCurrentTime();

    const userLogRef = collection(db, "userLogs");
    await addDoc(userLogRef, {
      email: user1?.email || "unknown",
      timestamp: timestamp,
      action: ` thao tác thêm tài khoản vào ${timestamp}`,
    });
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
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userProfile) {
    return <Link to="/" />;
  }
  return (
    <Layout>
      <Sider>
        <MenuLayout />
      </Sider>

      <Layout>
        <Header style={{ backgroundColor: "#f5f5f5", padding: "16px" }}>
          <Row>
            <Col span={18}>
              <header>
                <h1 style={{ fontSize: "24px", textAlign: "left" }}>
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
            <Col style={{ top: "30px" }}>
              <Test />
            </Col>
          </Row>
        </Header>
        <Content
          style={{
            margin: "24px 16px 0",
          }}
        >
          <Row>
            <Col span={5}>
              <h1
                style={{ color: "orange", fontSize: "24px", textAlign: "left" }}
              >
                Quản lý tài khoản{" "}
              </h1>
            </Col>
          </Row>
          <Content style={{ backgroundColor: "white", textAlign: "center" }}>
            <Col span={24}>
              <Row>
                <Col span={4}>
                  <h1 style={{ color: "orange", fontSize: "24px" }}>
                    Thông tin thiết bị
                  </h1>
                </Col>
              </Row>
              <Form layout="vertical" style={{ marginLeft: "10%" }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Họ và tên" {...formItemLayout}>
                      <Input
                        placeholder="Nhập họ và tên"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </Form.Item>

                    <Form.Item label="Số điện thoại" {...formItemLayout}>
                      <Input
                        placeholder="Nhập số điện thoại"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </Form.Item>
                    <Form.Item label="Email" {...formItemLayout}>
                      <Input
                        placeholder="Nhập Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Form.Item>
                    <Form.Item label="Vai trò" {...formItemLayout}>
                      <Select
                        placeholder="Chọn vai trò"
                        value={vaitro.role}
                        onChange={handleRoleChange}
                      >
                        <Select.Option value="Kế toán">Kế toán</Select.Option>
                        <Select.Option value="Quản lý">Quản lý</Select.Option>
                        <Select.Option value="Admin">Admin</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="Tên đăng nhập" {...formItemLayout}>
                      <Input
                        placeholder="Nhập tên đăng nhập"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </Form.Item>
                    <Form.Item label="Mật khẩu" {...formItemLayout}>
                      <Input.Password
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Form.Item>
                    <Form.Item label="Nhập lại mật khẩu" {...formItemLayout}>
                      <Input.Password
                        placeholder="Nhập lại mật khẩu"
                        value={passwordconfirm}
                        onChange={(e) => setPasswordconfirm(e.target.value)}
                      />
                    </Form.Item>
                    <Form.Item label="Tình trạng" {...formItemLayout}>
                      <Select
                        placeholder="Chọn Hoạt động"
                        value={vaitro.tthd}
                        onChange={handlettthdChange}
                      >
                        <Select.Option value="Hoạt động">
                          Hoạt động
                        </Select.Option>
                        <Select.Option value="Ngưng hoạt động">
                          Ngưng hoạt động
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Col>
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
                Thêm
              </Button>
            </Form.Item>
          </Footer>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AddAccout;
