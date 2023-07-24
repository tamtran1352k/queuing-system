import React, { useEffect, useState } from "react";
import {
  Space,
  Table,
  Row,
  Col,
  Form,
  Select,
  Input,
  Pagination,
  Button,
  Layout,
  Card,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase/fibase";
import MenuLayout from "../menu/Menu";
import { Content, Header } from "antd/es/layout/layout";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { ColumnsType } from "antd/es/table";
import Sider from "antd/es/layout/Sider";
import Test from "../profile/test";
import { User, onAuthStateChanged } from "firebase/auth";

interface DataType {
  key: string;
  ma: string;
  name: string;
  ip: string;
  tttb: string;
  ttkn: string;
  dvsd: string;
}

const TableView: React.FC = () => {
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
        const querySnapshot = await getDocs(collection(db, "list"));
        const newData: DataType[] = [];
        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          newData.push({
            key: doc.id,
            ma: docData.ma,
            dvsd: docData.dvsd,
            tttb: docData.tttb,
            ttkn: docData.ttkn,
            name: docData.name,
            ip: docData.ip,
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

  const navigate = useNavigate();

  const columns: ColumnsType<DataType> = [
    {
      title: "Mã thiết bị",
      dataIndex: "ma",
      key: "ma",
    },
    {
      title: "Tên thiết bị",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Địa chỉ IP",
      dataIndex: "ip",
      key: "ip",
    },
    {
      title: "Trạng thái hoạt động",
      dataIndex: "tttb",
      key: "tttb",
      render: (text) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: text === "Đang hoạt động" ? "green" : "red",
              marginRight: 5,
            }}
          ></div>
          <span>{text === "Đang hoạt động" ? "Đang hoạt động" : "Ngưng hoạt động"}</span>
        </div>
      ),
    },
    {
      title: "Trạng thái kết nối",
      dataIndex: "ttkn",
      key: "ttkn",
      render: (text) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: text === "Kết nối" ? "green" : "red",
              marginRight: 5,
            }}
          ></div>
          <span>{text === "Kết nối" ? "Kết nối" : "Mất kết nối"}</span>
        </div>
      ),
    },
    {
      title: "Dịch vụ sử dụng",
      dataIndex: "dvsd",
      key: "dvsd",
    },
    {
      title: "",
      key: "action",
      render: (_: any, record: { key: any }) => (
        <Space size="middle">
          <Link to={`/details/${record.key}`}>Chi tiết</Link>
        </Space>
      ),
    },
    {
      title: "",
      key: "action",
      render: (_: any, record: { key: any }) => (
        <Space size="middle">
          <Link to={`/update/${record.key}`}>Cập nhật</Link>
        </Space>
      ),
    },
  ];

  const filteredData = data.filter((item) => {
    for (let i = 0; i < searchKeyword.length; i++) {
      const searchChar = searchKeyword.charAt(i).toLowerCase();
      if (!item.name.toLowerCase().includes(searchChar)) {
        return false;
      }
    }
    return true;
  });
  const pageSize = 5;
  const totalData = data.length;
  const paginationConfig = {
    pageSize,
    showSizeChanger: false,
    total: totalData,
    showLessItems: true,
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
                <header style={{ textAlign: "left", fontSize: "24px" }}>
                  <h1>
                    Thiết bị &gt;{" "}
                    <b>
                      {" "}
                      <Link to="/table" style={{ color: "orange" }}>
                        {" "}
                        Danh sách thiết bị
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
                <h1 style={{ color: "orange", fontSize: "24px" }}>
                  Danh sách thiết bị{" "}
                </h1>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Form.Item>
                  <Row>
                    <Col span={13}>
                      <label htmlFor="">
                        <h3>Trạng thái hoạt động</h3>{" "}
                      </label>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Tất cả"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          (option?.label ?? "").includes(input)
                        }
                        filterSort={(optionA, optionB) =>
                          (optionA?.label ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.label ?? "").toLowerCase())
                        }
                        options={[
                          {
                            value: "1",
                            label: "Tất cả",
                          },
                          {
                            value: "2",
                            label: "Hoạt động",
                          },
                          {
                            value: "3",
                            label: "Ngưng hoạt động",
                          },
                        ]}
                      />
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item>
                  <Row>
                    <Col span={10}>
                      <label htmlFor="">
                        <h3>Trạng thái kết nối </h3>
                      </label>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Tất cả"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          (option?.label ?? "").includes(input)
                        }
                        filterSort={(optionA, optionB) =>
                          (optionA?.label ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.label ?? "").toLowerCase())
                        }
                        options={[
                          {
                            value: "1",
                            label: "Tất cả",
                          },
                          {
                            value: "2",
                            label: "Kết nối",
                          },
                          {
                            value: "3",
                            label: "Mất kết nối",
                          },
                        ]}
                      />
                    </Col>
                  </Row>
                </Form.Item>
              </Col>

              <Col span={7}>
                <Form.Item>
                  <Col span={8}>
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
              <Row gutter={16}>
                <Col span={22}>
                  <Content
                    style={{ backgroundColor: "white", textAlign: "center" }}
                  >
                    <Table<DataType>
                      columns={columns}
                      pagination={paginationConfig}
                      dataSource={filteredData.map((item) => ({
                        ...item,
                        action: (
                          <Space size="middle">
                            <Link to={`/details/${item.key}`}>Chi tiết</Link>
                          </Space>
                        ),
                      }))}
                    />
                  </Content>
                </Col>

                <Col span={2}>
                  <Card style={{ backgroundColor: "#FFF2E7" }}>
                    <Link to="/tb">
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
                      to="/tb"
                    >
                      Thêm thiết bị
                    </Link>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default TableView;
