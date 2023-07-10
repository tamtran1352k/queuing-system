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
} from "antd";
import { Footer } from "antd/es/layout/layout";
import ProfilePage from "./ProfilePage";
import MenuLayout from "./Menu";
import { addList } from "../redecers/addReducer";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

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

  const handleFormSubmit = () => {
    const data: Device = {
      ma: ma,
      name: name,
      ip: ip,
      dvsd: thietbi.dvsd,
      loaitb: thietbi.loaitb,
      tttb: "",
      ttkn: "",
      user: user,
      password: password,
      id: "",
    };
    dispatch(addList(data) as any);
    navigate("/table");

  };

  const [ma, setMa] = useState("");
  const [name, setName] = useState("");
  const [ip, setIp] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const [thietbi, setThietBi] = useState<Device>({
    ma: "",
    name: "",
    ip: "",
    dvsd: [],
    tttb: "",
    ttkn: "",
    user: "",
    password: "",
    id: "",
    loaitb: "",
  });

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

  return (
    <>
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
                          <Option value="Display counter">
                            Display counter
                          </Option>
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
                        <p >Là trường thông tin bắt buộc</p>

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
                  Hủy bỏ
                </Button>

                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ background: "#FF9138" }}
                  onClick={handleFormSubmit} // Use onClick instead of onChange
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
