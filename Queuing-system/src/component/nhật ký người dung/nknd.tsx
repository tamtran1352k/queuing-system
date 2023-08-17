import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Table, { ColumnsType } from "antd/es/table";
import { collection, getDocs } from "firebase/firestore"; // Import các hàm liên quan đến Firestore
import { auth, db } from "../../firebase/fibase";
import {
  Col,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  Layout,
  Row,
  Space,
} from "antd";
import MenuLayout from "../menu/Menu";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import { Link } from "react-router-dom";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { User, onAuthStateChanged } from "firebase/auth";
import Test from "../profile/test";

const NhatkyNguoiDung: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  interface DataType {
    key: React.Key;
    email: string;
    timestamp: string;
    action: string;
  }
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataType[]>([]); // Sử dụng state để lưu dữ liệu
  const [loading1, setLoading1] = useState(true); // Add loading state
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
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };
  const columns: ColumnsType<DataType> = [
    {
      title: "email",
      dataIndex: "email",
    },
    {
      title: "timestamp",
      dataIndex: "timestamp",
    },
    {
      title: "action",
      dataIndex: "action",
    },
  ];

  useEffect(() => {
    // Lấy dữ liệu từ Firestore và cập nhật biến data
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "userLogs"));
        const newData = querySnapshot.docs.map((doc) => ({
          key: doc.id,
          ...doc.data(),
        })) as DataType[];
        setData(newData);
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
    };

    fetchData();
  }, [user]); // Fetch lại dữ liệu mỗi khi user thay đổi
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
              <header style={{ textAlign: "left", fontSize: "20px" }}>
                <h1>
                  Cài đặt hệ thống &gt;{" "}
                  <b>
                    {" "}
                    <Link to="/baocao" style={{ color: "orange" }}>
                      {" "}
                      Nhật ký hoạt động
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
          <Form layout="vertical">
            <Row>
              <Col span={7}>
                <Form.Item label="Chọn thời gian ">
                  <Space direction="vertical" style={{ width: "130px" }}>
                    <DatePicker onChange={onChange} />
                  </Space>
                  &emsp; &gt; &emsp;
                  <Space direction="vertical">
                    <DatePicker onChange={onChange} />
                  </Space>
                </Form.Item>
              </Col>
              <Col span={11}></Col>
              <Col span={6}>
                <Form.Item label="Từ khóa">
                  <Input
                    placeholder="Nhập từ khóa"
                    style={{ textAlign: "left" }}
                    prefix={<SearchOutlined style={{ color: "orange" }} />}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Content style={{ textAlign: "center" }}>
            <Col span={20} style={{ marginLeft: "9%" }}>
              <Table
                columns={columns}
                dataSource={data}
                pagination={{ pageSize: 4 }}
              />
            </Col>{" "}
          </Content>
        </Content>
      </Layout>
    </Layout>
  );
};

export default NhatkyNguoiDung;
