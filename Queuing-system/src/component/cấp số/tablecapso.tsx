import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  Layout,
  Row,
  Select,
  Space,
  Table,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore"; // Update import statement
import { auth, db } from "../../firebase/fibase";
import MenuLayout from "../menu/Menu";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { Option } from "antd/es/mentions";
import Sider from "antd/es/layout/Sider";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { User, onAuthStateChanged } from "firebase/auth";
import Test from "../profile/test";

interface DataType {
  key: React.Key;
  namekh: string;
  namedv: string;
  nguoncap: string;
  stt: string;
  tgc: string;
  tthai: string;
  hsd: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Số thứ tự",
    dataIndex: "stt",
    key: "stt",
  },
  {
    title: "Tên khách hàng",
    dataIndex: "namekh",
    key: "namekh",
  },
  {
    title: "Tên dịch vụ",
    dataIndex: "namedv",
    key: "namedv",
  },
  {
    title: "Thời gian cấp",
    dataIndex: "tgc",
    key: "tgc",
  },
  {
    title: "Hạn sử dụng",
    dataIndex: "hsd",
    key: "hsd",
  },
  {
    title: "Trạng thái",
    dataIndex: "tthai",
    key: "tthai",
    render: (text) => (
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor:
              text === "Đang chờ"
                ? "blue"
                : text === "Đã sử dụng"
                ? "gray"
                : text === "Bỏ qua"
                ? "red"
                : "black", // Default color in case none of the conditions match.
            marginRight: 5,
          }}
        ></div>
        <span>
          {text === "Đang chờ"
            ? "Đang chờ"
            : text === "Đã sử dụng"
            ? "Đã sử dụng"
            : text === "Bỏ qua"
            ? "Bỏ qua"
            : "Không xác định"}{" "}
        </span>
      </div>
    ),
  },

  {
    title: "Nguồn cấp",
    dataIndex: "nguoncap",
    key: "nguoncap",
  },
  {
    title: "",
    key: "action",
    render: (_: any, record: { key: any }) => (
      <Space size="middle">
        <Link to={`/ctcs/${record.key}`}>Chi tiết</Link>
      </Space>
    ),
  },
];

const CapSo: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
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
        const querySnapshot = await getDocs(collection(db, "dscs"));
        const newData: DataType[] = [];
        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          newData.push({
            key: doc.id,
            namekh: docData.namekh,
            namedv: docData.namedv,
            nguoncap: docData.nguoncap,
            stt: docData.stt,
            tgc: docData.tgc,
            tthai: docData.tthai,
            hsd: docData.hsd,
          });
        });
        setData(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const pageSize = 5;
  const totalData = data.length;
  const paginationConfig = {
    pageSize,
    showSizeChanger: false,
    total: totalData,
    showLessItems: true,
  };
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
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
        <Layout>
          <Header style={{ backgroundColor: "#f5f5f5" }}>
            <Row>
              <Col span={18}>
                <header style={{ textAlign: "left", fontSize: "20px" }}>
                  <h1>
                    Cấp số &gt;{" "}
                    <b>
                      {" "}
                      <Link to="/cs" style={{ color: "orange" }}>
                        {" "}
                        Danh sách cấp số
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
              <Col>
                <h1 style={{ color: "orange", fontSize: "24px" }}>
                  Quản lý số cấp
                </h1>
              </Col>
            </Row>
            <Form layout="vertical">
              <Row gutter={20}>
                <Col span={4}>
                  <Form.Item label="Tên dịch vụ" style={{ width: "180px" }}>
                    <Select placeholder="Tất cả">
                      <Option value="Tất cả">Tất cả</Option>
                      <Option value="Khám sản-Phụ khoa">
                        Khám sản-Phụ khoa
                      </Option>
                      <Option value="Khám răng hàm mặt">
                        Khám răng hàm mặt
                      </Option>
                      <Option value="Khám tim mạch">Khám tim mạch</Option>
                      <Option value="Khám tai mũi họng">
                        Khám tai mũi họng
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            <Row gutter={16}>
              <Col span={22}>
                <Content
                  style={{
                    textAlign: "center",
                  }}
                >
                  <Table<DataType>
                    columns={columns}
                    dataSource={data}
                    pagination={paginationConfig}
                  />
                </Content>
              </Col>
              <Col span={2}>
                <Card style={{ backgroundColor: "#FFF2E7" }}>
                  <Link to="/csstt">
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
                    to="/csstt"
                  >
                    Cấp số mới{" "}
                  </Link>
                </Card>
              </Col>
            </Row>
            <Footer></Footer>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default CapSo;
