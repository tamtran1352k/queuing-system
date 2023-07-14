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
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { db } from "../firebase/fibase";
import { updatetkDevice } from "../redecers/updatetk";
import MenuLayout from "./Menu";
import { Option } from "antd/es/mentions";

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
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  return (
    <div>
      <Row>
        <Col span={4}>
          <MenuLayout />
        </Col>
        <Col span={19}>
          <Row>
            <Col span={16}>
              <header>
                <h1>
                  Cài đặt hệ thống &gt;Quản lý tài khoản&gt;
                  <b>
                    <Link to="/updateqltk" style={{ color: "orange" }}>
                      Cập nhật tài khoản
                    </Link>
                  </b>
                </h1>
              </header>
            </Col>
            <Col span={8}></Col>
          </Row>
          <Layout>
            <Header style={{ padding: 0, background: colorBgContainer }}>
              <Row>
                <Col span={4}>
                  <h1 style={{ color: "orange" }}>Quản lý tài khoản </h1>
                </Col>
              </Row>
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
                    <h1>Thông tin thiết bị </h1>
                  </Col>
                </Row>
                <Form layout="vertical">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Họ và tên">
                        <Input
                          placeholder="Nhập họ và tên"
                          value={qltk.name}
                          onChange={(e) =>
                            setQltk({ ...qltk, name: e.target.value })
                          }
                        />
                      </Form.Item>

                      <Form.Item label="Số điện thoại">
                        <Input
                          placeholder="Nhập số điện thoại"
                          value={qltk.phone}
                          onChange={(e) =>
                            setQltk({ ...qltk, phone: e.target.value })
                          }
                        />
                      </Form.Item>

                      <Form.Item label="Email">
                        <Input
                          placeholder="Nhập Email"
                          value={qltk.email}
                          onChange={(e) =>
                            setQltk({ ...qltk, email: e.target.value })
                          }
                        />
                      </Form.Item>
                      <Form.Item label="Vai trò">
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
                    </Col>

                    <Col span={12}>
                      <Form.Item label="Tên đăng nhập">
                        <Input
                          placeholder="Nhập tên đăng nhập"
                          value={qltk.username}
                          onChange={(e) =>
                            setQltk({ ...qltk, username: e.target.value })
                          }
                        />
                      </Form.Item>

                      <Form.Item label="Mật khẩu">
                        <Input.Password
                          placeholder="Nhập mật khẩu"
                          value={qltk.password}
                          onChange={(e) =>
                            setQltk({ ...qltk, password: e.target.value })
                          }
                        />
                      </Form.Item>

                      <Form.Item label="Nhập lại mật khẩu">
                        <Input.Password
                          placeholder="Nhập lại mật khẩu"
                          value={qltk.password}
                          onChange={(e) =>
                            setQltk({ ...qltk, password: e.target.value })
                          }
                        />
                      </Form.Item>

                      <Form.Item label="Tình trạng">
                        <Select
                          placeholder="Chọn Hoạt động"
                          value={qltk.tthd}
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
                  onClick={handleUpdate}
                >
                  Tiếp Tục
                </Button>
              </Form.Item>
            </Footer>
          </Layout>
        </Col>
      </Row>
    </div>
  );
};

export default UpdateQltk;
