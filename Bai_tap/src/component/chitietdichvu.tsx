import {
  Col,
  Layout,
  Menu,
  Row,
  message,
  Card,
  Form,
  DatePicker,
  Select,
  Input,
  Table,
  Button,
  Space,
} from "antd";
import MenuLayout from "./Menu";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../store/store";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/fibase";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { Option } from "antd/lib/mentions";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { updatedvDevice } from "../redecers/updvRedecer";

dayjs.locale("vi");

interface DataType {
  key: string;
  madv: string;
  motadv: string;
  namedv: string;
  prefix: string;
  stt: string;
  sott: string;
  surfix: string;
  tthddv: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Số thứ tự",
    dataIndex: "stt",
    key: "stt",
  },
  {
    title: "Trạng thái",
    dataIndex: "tthddv",
    key: "tthddv",
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
        <span>{text === "Hoạt động" ? "Hoạt động" : "Không hoạt động"}</span>
      </div>
    ),
  },
];

const { Header, Content, Sider } = Layout;
const dateFormatList = ["DD/MM/YYYY"];

const ChitietDichvu: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const [dichvu, setDichvu] = useState<DataType | null>(null);
  const [data, setData] = useState<DataType[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const navigate = useNavigate();

  const filteredData = data.filter((item) => {
    return item.stt.toLowerCase().includes(searchKeyword.toLowerCase());
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
            stt: docData.stt,
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

    return () => {};
  }, []);

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        const docRef = doc(collection(db, "dichvu"), id);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          const docData = docSnapshot.data() as DataType;
          setDichvu(docData);
        } else {
          message.error("Device not found");
        }
      } catch (error) {
        console.error("Error fetching device data:", error);
      }
    };

    if (id) {
      fetchDeviceData();
    }
  }, [id]);

  if (!dichvu) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <Sider width={200}>
        <MenuLayout />
      </Sider>
      <Layout>
        <Header style={{ backgroundColor: "#f5f5f5" }}>
          <Row>
            <Col span={12}>
              <div
                style={{ fontSize: 22, textAlign: "start", color: "orange" }}
              >
                <h1
                  style={{ fontWeight: 500, color: "black", textAlign: "left" }}
                >
                  Dịch vụ &gt;
                  <Link to="/dv" style={{ color: "black", marginLeft: 5 }}>
                    Danh sách dịch vụ &gt;
                  </Link>
                  <span style={{ color: "orange", marginLeft: 5 }}>
                    Chi tiết
                  </span>
                </h1>
              </div>
            </Col>
            <Col span={12}></Col>
          </Row>
        </Header>
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            style={{
              fontSize: 25,
              fontWeight: 500,
              color: "orange",
              textAlign: "left",
            }}
          >
            Quản lý dịch vụ
          </div>

          <Row gutter={16}>
            <Col span={6}>
              <Content style={{ backgroundColor: "white", paddingTop: "10%" }}>
                <div style={{ textAlign: "left" }}>
                  <p
                    style={{
                      fontSize: 18,
                      fontWeight: 400,
                      color: "orange",
                      textAlign: "left",
                    }}
                  >
                    Thông tin dịch vụ
                  </p>
                  <p>
                    <b>Mã dịch vụ: </b> &ensp;{dichvu.madv}
                  </p>
                  <p>
                    <b>Tên dịch vụ: </b> &ensp;{dichvu.namedv}
                  </p>
                  <p>
                    <b>Mô tả: </b> &ensp;{dichvu.motadv}
                  </p>
                </div>

                <h1 style={{ color: "orange", textAlign: "left" }}>
                  Quy tắc cấp số{" "}
                </h1>
                <p style={{ textAlign: "left" }}>
                  <b>Tăng tự động: </b> &ensp;
                  <Input
                    disabled
                    style={{ width: "60px" }}
                    placeholder="0001"
                  />
                  &emsp; Đến &emsp;
                  <Input
                    disabled
                    style={{ width: "60px" }}
                    placeholder="9999"
                  />
                </p>
                <p style={{ textAlign: "left" }}>
                  <b>Prefix: </b> &ensp;{" "}
                  <Input
                    placeholder="0001"
                    disabled
                    style={{ width: "100px", margin: "10px" }}
                  />
                </p>
                <p style={{ textAlign: "left" }}>
                  <b>Reset mỗi ngày</b>
                </p>

                <p style={{ textAlign: "left" }}>Ví dụ: {dichvu.madv} - 0001</p>
              </Content>
            </Col>
            <Col span={16}>
              <Content style={{ backgroundColor: "white" }}>
                <div>
                  <Row gutter={20}>
                    <Col span={4}>
                      <label htmlFor="">
                        <h3>Trạng thái </h3>
                      </label>
                      <Select placeholder="Tất cả " style={{ width: "100px" }}>
                        <Option value="Tất cả ">Tất cả </Option>

                        <Option value="Đã hoàn thành">Đã hoàn thành </Option>
                        <Option value="Đã thực hiện ">Đã thực hiện </Option>
                        <Option value="Vắng"> Vắng</Option>
                      </Select>
                    </Col>
                    <Col span={8}>
                      <Col span={15}>
                        <label htmlFor="">
                          <h3>Chọn thời gian</h3>
                        </label>
                      </Col>
                      <Form.Item>
                        <DatePicker
                          defaultValue={dayjs("01/01/2023", dateFormatList[0])}
                          format={dateFormatList}
                          style={{ width: "115px" }}
                        />
                        &gt;
                        <DatePicker
                          defaultValue={dayjs("01/01/2023", dateFormatList[0])}
                          format={dateFormatList}
                          style={{ width: "115px" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item>
                        <label htmlFor="">
                          <h3>Từ khóa</h3>
                        </label>
                        <Input
                          placeholder="Nhập từ khóa"
                          prefix={
                            <SearchOutlined style={{ color: "orange" }} />
                          }
                          value={searchKeyword}
                          onChange={(e) => setSearchKeyword(e.target.value)}
                          style={{ width: "150px" }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
                <Table columns={columns} dataSource={filteredData} />
              </Content>
            </Col>
            <Col span={2}>
              <Row gutter={20}>
                <Card>
                  <Col span={24}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{
                        background: "#FF9138",
                        padding: "10%",
                      }}
                    >
                      <Link to={`/updv/${id}`}>Cập nhật</Link>
                    </Button>
                  </Col>
                </Card>

                <Card>
                  <Col span={24}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{
                        background: "white",
                        color: "orange",
                        padding: "10%",

                        borderColor: "orange",
                      }}
                    >
                      <Link to="/dv">Hủy bỏ</Link>
                    </Button>
                  </Col>
                </Card>
              </Row>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ChitietDichvu;
