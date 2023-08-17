import React, { useState, useEffect } from "react";
import {
  Layout,
  Button,
  Input,
  Form,
  Select,
  message,
  theme,
  Row,
  Col,
} from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { auth, db } from "../../firebase/fibase";
import { updatetkDevice } from "../../redecers/updatetk";
import MenuLayout from "../menu/Menu";
import { Option } from "antd/es/mentions";
import Sider from "antd/es/layout/Sider";
import { User, onAuthStateChanged } from "firebase/auth";
import Test from "../profile/test";

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

const UpdateQltk: React.FC = () => {
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
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

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

  const [qltk, setQltk] = useState<Device>({
    name: "",
    imageUrl: "",
    password: "",
    phone: "",
    role: "",
    username: "",
    email: "",
    tthd: "",
  });

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        const docRef = doc(collection(db, "user"), id);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          const docData = docSnapshot.data() as Device;
          setQltk(docData);
        } else {
          message.error("Device not found");
        }
      } catch (error) {
        console.error("Error fetching device data:", error);
      }
    };
    fetchDeviceData();
  }, [id]);

  const handleUpdate = async () => {
    const timestamp = getCurrentTime();

    const userLogRef = collection(db, "userLogs");
    await addDoc(userLogRef, {
      email: user?.email || "unknown",
      timestamp: timestamp,
      action: ` thao tác cập nhật tài khoản vào  ${timestamp}`,
    });
    try {
      const docRef = doc(collection(db, "user"), id);
      await updateDoc(docRef, { ...qltk });
      message.success("Device updated successfully");
      dispatch(updatetkDevice(qltk));
      navigate("/qltk");
    } catch (error) {
      console.error("Error updating device:", error);
      message.error("Failed to update device");
    }
  };

  const handleRoleChange = (value: string) => {
    setQltk((prevDeviceData) => {
      return {
        ...prevDeviceData,
        role: value,
      };
    });
  };

  const handlettthdChange = (value: string) => {
    setQltk((prevDeviceData) => {
      return {
        ...prevDeviceData,
        tthd: value,
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
                      Cập nhật tài khoản{" "}
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
        <Content style={{ margin: "24px 16px 0" }}>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ color: "orange", textAlign: "left", fontSize: 24 }}>
              Quản lý tài khoản
            </h1>
          </div>
          <div style={{ backgroundColor: "white", textAlign: "center" }}>
            <div>
              <h1 style={{ color: "orange", textAlign: "left", fontSize: 24 }}>
                Thông tin thiết bị
              </h1>
            </div>
            <Form layout="vertical">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  maxWidth: "800px",
                  margin: "0 auto",
                }}
              >
                <div
                  style={{ flex: "1", margin: "0 8px", textAlign: "center" }}
                >
                  <Form.Item
                    label="Họ và tên"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                  >
                    <Input
                      placeholder="Nhập họ và tên"
                      value={qltk.name}
                      onChange={(e) =>
                        setQltk({ ...qltk, name: e.target.value })
                      }
                    />
                  </Form.Item>

                  {/* Other form items for the left column */}
                  <Form.Item
                    label="Số điện thoại"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                  >
                    <Input
                      placeholder="Nhập số điện thoại"
                      value={qltk.phone}
                      onChange={(e) =>
                        setQltk({ ...qltk, phone: e.target.value })
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                  >
                    <Input
                      placeholder="Nhập Email"
                      value={qltk.email}
                      onChange={(e) =>
                        setQltk({ ...qltk, email: e.target.value })
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label="Vai trò"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                  >
                    <Select
                      placeholder="Chọn vai trò"
                      value={qltk.role}
                      onChange={handleRoleChange}
                    >
                      <Select.Option value="Kế toán">Kế toán</Select.Option>
                      <Select.Option value="Quản lý">Quản lý</Select.Option>
                      <Select.Option value="Admin">Admin</Select.Option>
                    </Select>
                  </Form.Item>
                </div>

                <div
                  style={{ flex: "1", margin: "0 8px", textAlign: "center" }}
                >
                  <Form.Item
                    label="Tên đăng nhập"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                  >
                    <Input
                      placeholder="Nhập tên đăng nhập"
                      value={qltk.username}
                      onChange={(e) =>
                        setQltk({ ...qltk, username: e.target.value })
                      }
                    />
                  </Form.Item>

                  {/* Other form items for the right column */}
                  <Form.Item
                    label="Mật khẩu"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                  >
                    <Input.Password
                      placeholder="Nhập mật khẩu"
                      value={qltk.password}
                      onChange={(e) =>
                        setQltk({ ...qltk, password: e.target.value })
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label="Nhập lại mật khẩu"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                  >
                    <Input.Password
                      placeholder="Nhập lại mật khẩu"
                      value={qltk.password}
                      onChange={(e) =>
                        setQltk({ ...qltk, password: e.target.value })
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label="Tình trạng"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                  >
                    <Select
                      placeholder="Chọn Hoạt động"
                      value={qltk.tthd}
                      onChange={handlettthdChange}
                    >
                      <Select.Option value="Hoạt động">Hoạt động</Select.Option>
                      <Select.Option value="Ngưng hoạt động">
                        Ngưng hoạt động
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>
            </Form>
            <Footer style={{ textAlign: "center", padding: "16px" }}>
              <Form.Item>
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
                  onClick={handleUpdate}
                >
                  Tiếp Tục
                </Button>
              </Form.Item>
            </Footer>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UpdateQltk;
