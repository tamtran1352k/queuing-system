import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Row, Space, Table, Tag } from "antd";
import { collection, getDocs } from "@firebase/firestore";
import { ColumnsType } from "antd/es/table";
import { db } from "../firebase/fibase";
import { Link } from "react-router-dom";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import MenuLayout from "./Menu";

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

    return () => {
    };
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

  return (
    <div>
      <Row>
        <Col span={4}>
          <MenuLayout />
        </Col>
        <Col span={18}>
        <Row>
            <Col span={10}>
              <header>
                <h1>
                  Cài đặt hệ thống &gt;{" "}
                  <b > <Link to="/vatro" style={{ color: "orange" }}> Quản lý vai trò</Link></b>
                </h1>
              </header>
            </Col>
            <Col span={4}>
              
            </Col>
            <Col span={10}>
              <header>
                <h1>
                  Cài đặt hệ thống &gt;{" "}
                  <b > <Link to="/vatro" style={{ color: "orange" }}> Quản lý vai trò</Link></b>
                </h1>
              </header>
            </Col>
          </Row>
          <Row>
            <Col span={5}>
              <h1 style={{ color: "orange" }}> Danh sách vai trò</h1>
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
          <Row>
            <Col span={20}>
              <Table columns={columns} dataSource={filteredData} />
            </Col>
            <Col span={4}>
              <Button icon={<PlusOutlined />}>
                <Link to="/addvt">Thêm vai trò</Link>
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default TablePage;
