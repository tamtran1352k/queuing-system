import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore"; // Update import statement
import { db } from "../firebase/fibase";
import MenuLayout from "./Menu";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";

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

  return (
    <>
      <Row>
        <Col span={4}>
          <MenuLayout />
        </Col>
        <Col span={18}>
          <Row gutter={20}>
            <Col span={22}>
              <Table<DataType>
                columns={columns}
                dataSource={data}
                pagination={paginationConfig}
              />
            </Col>
            <Col span={2}>
           
              <Card style={{ width: "100%" }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{
                        background: "white",
                        color: "orange",

                        borderColor: "orange",
                      }}
                    >
                      <Link to="/csstt">Cấp số mới</Link>
                    </Button>
                </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default CapSo;
