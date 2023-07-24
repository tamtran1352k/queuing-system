import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  message,
  Select,
  Space,
  Row,
  Col,
  theme,
} from "antd";
import { useDispatch } from "react-redux";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/fibase";
import { Option } from "antd/es/mentions";
import MenuLayout from "../menu/Menu";
import Layout, { Content, Footer, Header } from "antd/es/layout/layout";
import { updateDevice } from "../../redecers/updateDevice ";
import Sider from "antd/es/layout/Sider";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { User, onAuthStateChanged } from "firebase/auth";
import Test from "../profile/test";

interface DeviceData {
  ma: string;
  name: string;
  ip: string;
  user: string;
  password: string;
  tthd: string;
  ttkn: string;
  dvsd: string[];
  loaitb: string;
}

const UpdateDevicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  const [deviceData, setDeviceData] = useState<DeviceData>({
    ma: "",
    name: "",
    user: "",
    password: "",
    ip: "",
    tthd: "",
    ttkn: "",
    loaitb: "",
    dvsd: [],
  });
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

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        const docRef = doc(collection(db, "list"), id);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          const docData = docSnapshot.data() as DeviceData;
          setDeviceData(docData); // Update the state with the fetched data
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
      action: ` thao tác cập nhật thiết bị   ${timestamp}`,
    });
    try {
      const docRef = doc(collection(db, "list"), id);
      await updateDoc(docRef, { ...deviceData });
      message.success("Device updated successfully");
      dispatch(updateDevice(deviceData));
      navigate("/table");
    } catch (error) {
      console.error("Error updating device:", error);
      message.error("Failed to update device");
    }
  };

  const handleDeviceChange = (value: string[]) => {
    setDeviceData((prevDeviceData) => {
      return {
        ...prevDeviceData,
        dvsd: value,
      };
    });
  };
  const handleLoaiThietBiChange = (value: string) => {
    setDeviceData((prevDeviceData) => {
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
    <Layout>
      <Sider>
        <MenuLayout />
      </Sider>{" "}
      <Col span={19}>
        <Layout>
          <Header style={{ padding: 0, background: "#f5f5f5" }}>
            <Row>
              <Col span={18}>
                <header style={{ textAlign: "left", fontSize: "20px" }}>
                  <h1>
                    Thiết bị &gt; Danh sách thiết bị &gt;
                    <b>
                      {" "}
                      <Link to="/tb" style={{ color: "orange" }}>
                        {" "}
                        Cập nhật thiết bị
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
            <Col span={4}>
              <h1
                style={{
                  textAlign: "left",
                  color: "orange",
                  fontSize: 22,
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
              }}
            >
              <Content
                style={{ backgroundColor: "white", textAlign: "center" }}
              >
                <Row>
                  <Col span={6}>
                    <h1
                      style={{
                        textAlign: "left",
                        color: "orange",
                        fontSize: 22,
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
                          value={deviceData.ma}
                          onChange={(e) =>
                            setDeviceData({ ...deviceData, ma: e.target.value })
                          }
                        />
                      </Form.Item>
                      <Form.Item label="Tên thiết bị">
                        <Input
                          value={deviceData.name}
                          onChange={(e) =>
                            setDeviceData({
                              ...deviceData,
                              name: e.target.value,
                            })
                          }
                        />
                      </Form.Item>
                      <Form.Item label="Địa chỉ IP">
                        <Input
                          value={deviceData.ip}
                          onChange={(e) =>
                            setDeviceData({ ...deviceData, ip: e.target.value })
                          }
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item label="Tên đăng nhập">
                        <Input
                          value={deviceData.user}
                          onChange={(e) =>
                            setDeviceData({
                              ...deviceData,
                              user: e.target.value,
                            })
                          }
                        />
                      </Form.Item>
                      <Form.Item label="Mật khẩu">
                        <Input
                          value={deviceData.password}
                          onChange={(e) =>
                            setDeviceData({
                              ...deviceData,
                              password: e.target.value,
                            })
                          }
                        />
                      </Form.Item>
                      <Form.Item label="Loại thiết bị">
                        <Select
                          value={deviceData.loaitb}
                          onChange={handleLoaiThietBiChange}
                        >
                          <Select.Option value="Kiosk">Kiosk</Select.Option>
                          <Select.Option value="Display counter">
                            Display counter
                          </Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>

                <Row>
                  <Col span={24}>
                    <Form.Item label="Dịch vụ sử dụng">
                      <Space.Compact block>
                        <Select
                          allowClear
                          mode="multiple"
                          value={deviceData.dvsd}
                          style={{ width: "100%" }}
                          onChange={handleDeviceChange}
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
                      </Space.Compact>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={5}>
                    {" "}
                    <Form.Item>
                      <p>Là trường thông tin bắt buộc</p>
                    </Form.Item>
                  </Col>
                </Row>
              </Content>
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
                onClick={handleUpdate} // Use onClick instead of onChange
              >
                Cập nhật{" "}
              </Button>
            </Form.Item>
          </Footer>
        </Layout>
      </Col>
    </Layout>
  );
};

export default UpdateDevicePage;
