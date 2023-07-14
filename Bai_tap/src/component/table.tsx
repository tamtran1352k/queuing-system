import React, { useEffect, useState } from "react";
import { Space, Table, Row, Col, Form, Select, Input, Pagination, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/fibase";
import MenuLayout from "./Menu";
import { Header } from "antd/es/layout/layout";
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch } from "react-redux";

interface DataType {
  key: string;
  ma: string;
  name: string;
  ip: string;
  tthd: string;
  ttkn: string;
  dvsd: string;
}

const TableView: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
 

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
            tthd: docData.tthd,
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

    return () => {
    };
  }, []);

  const navigate = useNavigate();

  const columns = [
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
      dataIndex: "tthd",
      key: "tthd",
      
    },
    {
      title: "Trạng thái kết nối",
      dataIndex: "ttkn",
      key: "ttkn",
      
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
          <Link to={`/update/${record.key}`} >Cập nhật</Link>
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

  return (
    <div>
      <Row>
        <Col span={4}>
          <MenuLayout />
        </Col>
        <Col span={20}>
          <Row>
            <Col span={8}>
              <header>
                <h1>
                  Thiết bị &gt;{" "}
                  <b > <Link to="/table" style={{ color: "orange" }}> Danh sách thiết bị</Link></b>
                </h1>
              </header>
            </Col>
          </Row>

          <Row>
            <Col span={5}>
              <h1 style={{ color: "orange" }}>Danh sách thiết bị </h1>
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
          <br />
          <Row>
              <Col span={20}>
            <Table
              columns={columns}
              dataSource={filteredData.map((item) => ({
                ...item,
                action: (
                  <Space size="middle">
                    <Link to={`/details/${item.key}`}>Chi tiết</Link>
                  </Space>
                ),
              }
              ))}
            />
          </Col>
          <Col span={4}>
        
           <Button icon={<PlusOutlined />}>
                <Link to="/tb">Thêm thiết bị</Link>
              </Button>
          </Col> 
          </Row>
       
        </Col>
      </Row>
    </div>
  );
};

export default TableView;
