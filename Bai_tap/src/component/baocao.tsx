import { collection, getDocs } from "@firebase/firestore";
import { Button, Card, Col, Row, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { db } from "../firebase/fibase";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import MenuLayout from "./Menu";

import { UserOutlined, CloudDownloadOutlined } from "@ant-design/icons";

interface DataType {
  key: string;
  namekh: string;
  namedv: string;
  nguoncap: string;
  stt: string;
  tgc: string;
  tthai: string;
  hsd: string;
}

const BaoCao = () => {
  const [data, setData] = useState<DataType[]>([]);

  const columns: ColumnsType<DataType> = [
    {
      title: "Số thứ tự",
      dataIndex: "stt",
      key: "stt",
      sorter: (a, b) => parseInt(a.stt) - parseInt(b.stt),
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "namedv",
      key: "namedv",
      sorter: (a, b) => a.namedv.localeCompare(b.namedv),
    },
    {
      title: "Thời gian cấp",
      dataIndex: "tgc",
      key: "tgc",
      sorter: (a, b) => a.tgc.localeCompare(b.tgc),
    },
    {
      title: "Tình trạng",
      dataIndex: "tthai",
      key: "tthai",
      sorter: (a, b) => a.tthai.localeCompare(b.tthai),
    },
    {
      title: "Nguồn cấp",
      dataIndex: "nguoncap",
      key: "nguoncap",
    },
  ];

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

  const handleExportToExcel = () => {
    const dataWithoutKey = data.map(({ key, ...rest }) => rest);

    const worksheet = XLSX.utils.json_to_sheet(dataWithoutKey);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, "bao_cao.xlsx");
  };

  return (
    <>
      <Row>
        <Col span={4}>
          <MenuLayout />
        </Col>

        <Col span={20}>
          <Row>
            <Col span={22}>
              <Table<DataType>
                columns={columns}
                dataSource={data}
                pagination={paginationConfig}
              />
            </Col>
            <Col span={2}>
              <Card style={{ backgroundColor: "orange", top: "20%" }}>
                <Button
                  style={{
                    background: "white",
                    color: "orange",
                    padding: "10%",
                    borderColor: "orange",
                  }}
                  icon={<CloudDownloadOutlined />}
                  onClick={handleExportToExcel}
                >
                  Tải về
                </Button>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default BaoCao;
