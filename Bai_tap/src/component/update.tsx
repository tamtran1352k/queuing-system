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
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/fibase";
import { Option } from "antd/es/mentions";
import MenuLayout from "./Menu";
import Layout, { Content, Footer, Header } from "antd/es/layout/layout";
import { updateDevice } from "../redecers/updateDevice ";

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
          dispatch(updateDevice(docData)); // Dispatch the updateDevice action
        } else {
          message.error("Device not found");
        }
      } catch (error) {
        console.error("Error fetching device data:", error);
      }
    };
    fetchDeviceData();
  }, [dispatch, id]);

  const handleUpdate = async () => {
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
  return (
    <div>
      <Row>
        <Col span={4}>
          <MenuLayout />
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
      </Row>
    </div>
  );
};

export default UpdateDevicePage;
