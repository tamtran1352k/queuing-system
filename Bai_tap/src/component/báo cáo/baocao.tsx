import { addDoc, collection, getDocs } from "@firebase/firestore";
import {
  Button,
  Card,
  Col,
  DatePicker,
  DatePickerProps,
  Form,
  Layout,
  Row,
  Space,
  Table,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/fibase";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import MenuLayout from "../menu/Menu";

import { UserOutlined, CloudDownloadOutlined } from "@ant-design/icons";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { User, onAuthStateChanged } from "firebase/auth";
import Test from "../profile/test";

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

  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };
  const user = useSelector((state: RootState) => state.auth.user);

  const getCurrentTime = (): string => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleString("vi-VN", options);
  };

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

  const handleExportToExcel = async () => {
    const timestamp = getCurrentTime();

    const userLogRef = collection(db, "userLogs");
    await addDoc(userLogRef, {
      email: user?.email || "unknown",
      timestamp: timestamp,
      action: ` thao tác tải file báo cáo   ${timestamp}`,
    });
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
                  Báo cáo &gt;{" "}
                  <b>
                    {" "}
                    <Link to="/baocao" style={{ color: "orange" }}>
                      {" "}
                      Lập báo cáo
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
              <Form layout="vertical">
                <Form.Item label="Chọn thời gian ">
                  <Space direction="vertical" style={{ width: "130px" }}>
                    <DatePicker onChange={onChange} />
                  </Space>
                  &emsp; &gt; &emsp;
                  <Space direction="vertical">
                    <DatePicker onChange={onChange} />
                  </Space>
                </Form.Item>
              </Form>
            </Col>
          </Row>

          <Row gutter={10}>
            <Col span={22}>
              <Content
                style={{
                  textAlign: "center",
                }}
              >
                <Row>
                  <Col span={22}>
                    <Table<DataType>
                      columns={columns}
                      dataSource={data}
                      pagination={paginationConfig}
                    />
                  </Col>
                </Row>
              </Content>
            </Col>
            <Col span={2} style={{ right: "30px" }}>
              <Card style={{ backgroundColor: "#FFF2E7", top: "20%" }}>
                <Button
                  style={{
                    background: "white",
                    color: "orange",
                    padding: "10%",
                    right: "13px",
                    borderColor: "orange",
                    fontWeight: "bold",
                  }}
                  icon={<CloudDownloadOutlined />}
                  onClick={handleExportToExcel}
                >
                  Tải về
                </Button>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default BaoCao;
