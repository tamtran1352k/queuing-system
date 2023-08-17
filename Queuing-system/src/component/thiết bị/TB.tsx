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
} from "antd";
import { Footer } from "antd/es/layout/layout";
import ProfilePage from "../profile/ProfilePage";
import MenuLayout from "../menu/Menu";
import { addList } from "../../redecers/addReducer";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { addDoc, collection } from "@firebase/firestore";
import { auth, db } from "../../firebase/fibase";
import { User, onAuthStateChanged } from "firebase/auth";
import Test from "../profile/test";

const { Header, Sider, Content } = Layout;

interface Device {
  ma: string;
  name: string;
  ip: string;
  dvsd: string[];
  tttb: string;
  ttkn: string;
  user: string;
  password: string;
  id: string;
  loaitb: string;
}
const randomHd = () => {
  const randomValues = Math.random();
  if (randomValues < 1 / 2) {
    return "Đang hoạt động";
  } else {
    return "Ngưng hoạt động";
  }
};
const randomKn = () => {
  const randomValues = Math.random();
  if (randomValues < 1 / 2) {
    return "Kế nối";
  } else {
    return "Mất kết nối";
  }
};
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

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true); // Add loading state

  const [userProfile, setUserProfile] = useState<User | null>(null);
  const user1 = useSelector((state: RootState) => state.auth.user);

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

  const [ma, setMa] = useState("");
  const [name, setName] = useState("");
  const [ip, setIp] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [tttb, settttb] = useState("");

  const [thietbi, setThietBi] = useState<Device>({
    ma: "",
    name: "",
    ip: "",
    dvsd: [],
    tttb: randomHd(),
    ttkn: randomKn(),
    user: "",
    password: "",
    id: "",
    loaitb: "",
  });

  const handleFormSubmit = async () => {
    const data: Device = {
      ma: ma,
      name: name,
      ip: ip,
      dvsd: thietbi.dvsd,
      loaitb: thietbi.loaitb,
      tttb: thietbi.tttb,
      ttkn: thietbi.ttkn,
      user: user,
      password: password,
      id: "",
    };

    try {
      dispatch(addList(data) as any);
      navigate("/table");
      const timestamp = getCurrentTime();

      const userLogRef = collection(db, "userLogs");
      await addDoc(userLogRef, {
        email: user1?.email || "unknown",
        timestamp: timestamp,
        action: ` thao tác thêm thiết bị vào ${timestamp}`,
      });
    } catch (error) {
      console.error("Lỗi khi xử lý ghi nhật ký hoặc thêm dữ liệu: ", error);
    }
  };

  const handleDeviceChange = (value: string[]) => {
    setThietBi((prevDeviceData) => {
      return {
        ...prevDeviceData,
        dvsd: value,
      };
    });
  };

  const handleLoaiThietBiChange = (value: string) => {
    setThietBi((prevDeviceData) => {
      return {
        ...prevDeviceData,
        loaitb: value,
      };
    });
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userProfile) {
    return <Link to="/" />;
  }
  return (
    <>
      <Layout>
        <Sider>
          <MenuLayout />
        </Sider>

        <Col span={19}>
          <Header style={{ padding: 0, background: "#f5f5f5" }}>
            <Row>
              <Col span={18}>
                <header style={{ textAlign: "left", fontSize: "16px" }}>
                  <h1>
                    Thiết bị &gt; Danh sách thiết bị &gt;
                    <b>
                      {" "}
                      <Link to="/tb" style={{ color: "orange" }}>
                        {" "}
                        Thêm thiết bị
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

          <Row>
            <Col span={5}>
              <h1
                style={{
                  color: "orange",
                  fontSize: 20,
                }}
              >
                Quản lý thiết bị{" "}
              </h1>
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
                <Col span={6}>
                  <h1
                    style={{
                      color: "orange",
                      textAlign: "left",
                      fontSize: 24,
                    }}
                  >
                    Thông tin thiết bị{" "}
                  </h1>
                </Col>
              </Row>
              <Form layout="vertical">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Mã thiết bị">
                      <Input
                        placeholder="Mã thiết bị"
                        value={ma}
                        onChange={(e) => setMa(e.target.value)}
                      />
                    </Form.Item>

                    <Form.Item label="Tên Thiết bị">
                      <Input
                        placeholder="Tên Thiết bị"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </Form.Item>
                    <Form.Item label="Địa chỉ IP">
                      <Input
                        placeholder="Địa chỉ IP"
                        value={ip}
                        onChange={(e) => setIp(e.target.value)}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="Loại thiết bị">
                      <Select
                        placeholder="Loại thiết bị"
                        value={thietbi.loaitb}
                        onChange={handleLoaiThietBiChange}
                      >
                        <Option value="Kioks">Kioks</Option>
                        <Option value="Display counter">Display counter</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item label="Tên đăng nhập">
                      <Input
                        placeholder="Nhập tên đăng nhập"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                      />
                    </Form.Item>
                    <Form.Item label="Mật khẩu">
                      <Input
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>

              <Row>
                <Col span={24}>
                  <Row>
                    <label>Dịch vụ</label>
                  </Row>

                  <Select
                    allowClear
                    mode="multiple"
                    value={thietbi.dvsd}
                    onChange={handleDeviceChange}
                    style={{ width: "100%" }}
                  >
                    <Select.Option value="Khám tim mạch">
                      Khám tim mạch
                    </Select.Option>
                    <Select.Option value="Khám sản phụ khoa">
                      Khám sản phụ khoa
                    </Select.Option>
                    <Select.Option value="Khám răng hàm mặt">
                      Khám răng hàm mặt
                    </Select.Option>
                    <Select.Option value="Khám tai mũi họng">
                      Khám tai mũi họng
                    </Select.Option>
                    <Select.Option value="Khám hô hấp">
                      Khám hô hấp
                    </Select.Option>
                    <Select.Option value="Khám tổng quát">
                      Khám tổng quát
                    </Select.Option>
                  </Select>
                  <Row>
                    <Col span={4}>
                      {" "}
                      <Form.Item>
                        <p>Là trường thông tin bắt buộc</p>
                      </Form.Item>
                    </Col>
                  </Row>
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
                <Link to="/table">Hủy bỏ</Link>
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
        </Col>
      </Layout>
    </>
  );
};

export default TB;
