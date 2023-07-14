import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Row, Select, Space, Table, Tag } from "antd";
import { Link } from "react-router-dom";
import { getDocs, collection } from "@firebase/firestore";
import { db } from "../firebase/fibase";
import { ColumnsType } from "antd/es/table";
import MenuLayout from "./Menu";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Option } from "antd/es/mentions";
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
  return (
    <>
      <Row>
        <Col span={4}>
          <MenuLayout />
        </Col>
        <Col span={20}>
          <Row>
            <Col span={10}>
              <header>
                <h1>
                  Cài đặt hệ thống &gt;
                  <b>
                    <Link to="/qltk" style={{ color: "orange" }}>
                      Quản lý tài khoản
                    </Link>
                  </b>
                </h1>
              </header>
            </Col>

            <Col span={14}></Col>
          </Row>

          <Row>
            <Col>
              <h1 style={{ color: "orange" }}>Danh sách tài khoản </h1>
            </Col>
          </Row>
          <Form layout="vertical">
            {" "}
            <Row>
              <Col span={6}>
                <Form.Item>
                  <Col span={7}>
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
              <Col span={6}></Col>
              <Col span={6}>
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
          </Form>

          <Row>
            <Col span={20}>
              <Table columns={columns} dataSource={filteredData} />
            </Col>{" "}
            <Col span={4}>
              <Button icon={<PlusOutlined />}>
                <Link to="/addac">Thêm tài khoản</Link>
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default QuanLyTK;
