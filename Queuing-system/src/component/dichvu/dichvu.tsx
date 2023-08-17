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
import type { ColumnsType } from "antd/es/table";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../../firebase/fibase";
import { Link } from "react-router-dom";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import MenuLayout from "../menu/Menu";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import Sider from "antd/es/layout/Sider";
import Test from "../profile/test";

dayjs.locale("vi");

interface DataType {
  key: string;
  madv: string;
  motadv: string;
  namedv: string;
  prefix: string;
  sott: string;
  surfix: string;
  tthddv: string;
}

const { Option } = Select;

const columns: ColumnsType<DataType> = [
  {
    title: "Mã dịch vụ",
    dataIndex: "madv",
    key: "madv",
  },
  {
    title: "Tên dịch vụ",
    dataIndex: "namedv",
    key: "namedv",
  },
  {
    title: "Mô tả",
    dataIndex: "motadv",
    key: "motadv",
  },
  {
    title: "Trạng thái hoạt động",
    dataIndex: "tthddv",
    key: "tthddv",
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
    title: "",
    key: "action",
    render: (_: any, record: { key: any }) => (
      <Space size="middle">
        <Link to={`/ctdv/${record.key}`}>Chi tiết</Link>
      </Space>
    ),
  },
  {
    title: "",
    key: "action",
    render: (_: any, record: { key: any }) => (
      <Space size="middle">
        <Link to={`/updv/${record.key}`}>Cập nhật</Link>
      </Space>
    ),
  },
];

const dateFormatList = ["DD/MM/YYYY"];

const Dichvu: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };

  const filteredData = data.filter((item) => {
    for (let i = 0; i < searchKeyword.length; i++) {
      const searchChar = searchKeyword.charAt(i).toLowerCase();
      if (!item.madv.toLowerCase().includes(searchChar)) {
        return false;
      }
    }
    return true;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "dichvu"));
        const newData: DataType[] = [];
        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          newData.push({
            key: doc.id,
            madv: docData.madv,
            motadv: docData.motadv,
            namedv: docData.namedv,
            prefix: docData.prefix,
            sott: docData.sott,
            surfix: docData.surfix,
            tthddv: docData.tthddv,
          });
        });
        setData(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <Sider>
        <MenuLayout />
      </Sider>{" "}
      <Col span={20}>
        <Row>
          <Col span={18}>
            <header style={{ textAlign: "left" }}>
              <h1>
                Dịch vụ &gt;{" "}
                <b>
                  {" "}
                  <Link to="/dv" style={{ color: "orange" }}>
                    {" "}
                    Danh sách dịch vụ
                  </Link>
                </b>
              </h1>
            </header>
          </Col>
          <Col style={{ top: "30px" }}>
            <Test />
          </Col>
        </Row>
        <Row>
          <Col span={5}>
            <h1
              style={{ color: "orange", textAlign: "left", fontSize: "24px" }}
            >
              Quản lý dịch vụ
            </h1>
          </Col>
          <Col span={20}></Col>
        </Row>
        <Row gutter={10}>
          <Col span={4}>
            <label htmlFor="">
              <h3>Trạng thái hoạt động</h3>
            </label>
            <Select placeholder="Trạng thái hoạt động">
              <Option value="Hoạt động">Hoạt động</Option>
              <Option value="Ngưng hoạt động">Ngưng hoạt động</Option>
            </Select>
          </Col>
          <Col span={8}>
            <Col span={10}>
              <label htmlFor="">
                <h3>Chọn thời gian</h3>
              </label>
            </Col>
            <Form.Item>
              <div>
                <Space
                  direction="vertical"
                  style={{ width: "130px", marginRight: "25px" }}
                >
                  <DatePicker onChange={onChange} />
                </Space>
                &gt; &emsp;
                <Space direction="vertical">
                  <DatePicker onChange={onChange} />
                </Space>
              </div>
            </Form.Item>
          </Col>

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
        <Row gutter={15} style={{ marginLeft: "30px" }}>
          <Col span={22}>
            <Table
              columns={columns}
              dataSource={filteredData}
              pagination={{ pageSize: 4 }}
            />
          </Col>
          <Col span={2}>
            <Card style={{ backgroundColor: "#FFF2E7" }}>
              <Link to="/adddv">
                <Button
                  style={{
                    backgroundColor: "orange",
                    textAlign: "center",
                  }}
                  icon={<PlusOutlined />}
                ></Button>
              </Link>
              <br />

              <Link style={{ color: "orange", fontWeight: "bold" }} to="/adddv">
                Thêm thiết bị
              </Link>
            </Card>
          </Col>
        </Row>
      </Col>
    </Layout>
  );
};

export default Dichvu;
