import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Layout,
  Row,
  Space,
  Table,
  Tag,
} from "antd";
import { collection, getDocs } from "@firebase/firestore";
import { ColumnsType } from "antd/es/table";
import { auth, db } from "../../firebase/fibase";
import { Link } from "react-router-dom";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import MenuLayout from "../menu/Menu";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import { User, onAuthStateChanged } from "firebase/auth";
import Test from "../profile/test";

interface DataType {
  key: string;
  namevt: string;
  sond: number;
  mota: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Tên vai trò",
    dataIndex: "namevt",
    key: "namevt",
  },
  {
    title: "Số người dùng",
    dataIndex: "sond",
    key: "sond",
  },
  {
    title: "Mô tả",
    dataIndex: "mota",
    key: "mota",
  },
  {
    title: "",
    key: "action",
    render: (_: any, record: { key: any }) => (
      <Space size="middle">
        <Link to={`/UpdateVt/${record.key}`}>Cập nhật</Link>
      </Space>
    ),
  },
];

const TablePage: React.FC = () => {
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
        const querySnapshot = await getDocs(collection(db, "vaitro"));
        const newData: DataType[] = [];
        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          newData.push({
            key: doc.id,
            namevt: docData.namevt,
            mota: docData.mota,
            sond: docData.sond,
          });
        });
        setData(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {};
  }, []);

  const filteredData = data.filter((item) => {
    for (let i = 0; i < searchKeyword.length; i++) {
      const searchChar = searchKeyword.charAt(i).toLowerCase();
      if (!item.namevt.toLowerCase().includes(searchChar)) {
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
      </Sider>{" "}
      <Col span={18}>
        <Layout>
          <Header style={{ backgroundColor: "#f5f5f5" }}>
            <Row>
              <Col span={16}>
                <header>
                  <h1 style={{ textAlign: "left", fontSize: 22 }}>
                    Cài đặt hệ thống &gt;{" "}
                    <b>
                      {" "}
                      <Link to="/vatro" style={{ color: "orange" }}>
                        {" "}
                        Quản lý vai trò
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
                  style={{ color: "orange", textAlign: "left", fontSize: 22 }}
                >
                  {" "}
                  Danh sách vai trò
                </h1>
              </Col>
              <Col span={11}></Col>
              <Col span={8}>
                <Form.Item>
                  <Col span={5}>
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
          </Content>
        </Layout>

        <Row gutter={15}>
          <Col span={22}>
            <Content
              style={{
                backgroundColor: "white",
                textAlign: "center",
                marginLeft: "30px",
              }}
            >
              <Table
                columns={columns}
                dataSource={filteredData}
                pagination={{ pageSize: 4 }}
              />
            </Content>
          </Col>{" "}
          <Col span={2}>
            <Card style={{ backgroundColor: "#FFF2E7" }}>
              <Link to="/addvt">
                <Button
                  style={{
                    backgroundColor: "orange",
                    textAlign: "center",
                  }}
                  icon={<PlusOutlined />}
                ></Button>
              </Link>
              <br />

              <Link style={{ color: "orange", fontWeight: "bold" }} to="/addvt">
                Thêm vai trò
              </Link>
            </Card>
          </Col>
        </Row>
      </Col>
    </Layout>
  );
};

export default TablePage;
