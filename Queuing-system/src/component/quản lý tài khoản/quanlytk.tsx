import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Layout,
  Row,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import { Link } from "react-router-dom";
import { getDocs, collection } from "@firebase/firestore";
import { auth, db } from "../../firebase/fibase";
import { ColumnsType } from "antd/es/table";
import MenuLayout from "../menu/Menu";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Option } from "antd/es/mentions";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import { User, onAuthStateChanged } from "firebase/auth";
import Test from "../profile/test";
interface DataType {
  key: string;
  name: string;
  imageUrl: string;
  password: string;
  phone: string;
  role: string;
  username: string;
  email: string;
  tthd: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Tên đăng nhập",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "Họ và tên",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Vai trò",
    dataIndex: "role",
    key: "role",
  },

  {
    title: "Trạng thái hoạt động",
    dataIndex: "tthd",
    key: "tthd",

    render: (text) => (
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: text === "Hoạt động" ? "green" : "red",
            marginRight: 5,
          }}
        ></div>
        <span>{text === "Hoạt động" ? "Hoạt động" : "Ngưng hoạt động"}</span>
      </div>
    ),
  },
  {
    title: "",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <Link to={`/updateqltk/${record.key}`}>Cập nhật</Link>
      </Space>
    ),
  },
];

const QuanLyTK: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "user"));
        const newData: DataType[] = [];
        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          newData.push({
            key: doc.id,
            name: docData.name,
            imageUrl: docData.imageUrl,
            password: docData.password,
            phone: docData.phone,
            role: docData.role,
            username: docData.username,
            email: docData.email,
            tthd: docData.tthd,
          });
        });
        setData(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const filteredData = data.filter((item) => {
    for (let i = 0; i < searchKeyword.length; i++) {
      const searchChar = searchKeyword.charAt(i).toLowerCase();
      if (!item.name.toLowerCase().includes(searchChar)) {
        return false;
      }
    }
    return true;
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
        <Header style={{ backgroundColor: "#f5f5f5" }}>
          <Row>
            <Col span={18}>
              <header>
                <h1
                  style={{
                    fontSize: "24px",
                    textAlign: "left",
                  }}
                >
                  Cài đặt hệ thống &gt;
                  <b>
                    <Link to="/qltk" style={{ color: "orange" }}>
                      Quản lý tài khoản
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
          {" "}
          <Row>
            <Col>
              <h1
                style={{ color: "orange", fontSize: "24px", textAlign: "left" }}
              >
                Danh sách tài khoản{" "}
              </h1>
            </Col>
          </Row>
          <Row>
            <Col span={4}>
              <Form.Item>
                <Col span={12}>
                  <label htmlFor="">
                    <h3>Tên Vai trò</h3>
                  </label>
                </Col>
                <Select placeholder="Chọn vai trò">
                  <Option value="Kế toán">Kế toán </Option>
                  <Option value="Quản lý">Quản lý</Option>
                  <Option value="Admin">Admin </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}></Col>
            <Col span={4}>
              <Form.Item>
                <Col span={9}>
                  <label htmlFor="">
                    <h3>Từ khóa</h3>
                  </label>
                </Col>
                <Input
                  placeholder="Nhập từ khóa"
                  prefix={<SearchOutlined style={{ color: "orange" }} />}
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Col span={24}>
            <Row gutter={20}>
              <Content
                style={{
                  textAlign: "center",
                  marginLeft: 30,
                }}
              >
                <Col span={20}>
                  <Table
                    columns={columns}
                    dataSource={filteredData}
                    pagination={{ pageSize: 4 }}
                    style={{ width: 1000, justifyContent: "center" }}
                  />
                </Col>{" "}
              </Content>

              <Col span={4}>
                <Card style={{ backgroundColor: "#FFF2E7", right: 40 }}>
                  <Link to="/addac">
                    <Button
                      style={{
                        backgroundColor: "orange",
                        textAlign: "center",
                      }}
                      icon={<PlusOutlined />}
                    ></Button>
                  </Link>
                  <br />

                  <Link
                    style={{ color: "orange", fontWeight: "bold" }}
                    to="/addac"
                  >
                    Thêm tài khoản
                  </Link>
                </Card>
              </Col>
            </Row>
          </Col>
        </Content>
      </Layout>
    </Layout>
  );
};

export default QuanLyTK;
