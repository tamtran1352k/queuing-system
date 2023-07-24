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
import MenuLayout from "../menu/Menu";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../store/store";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase/fibase";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { Option } from "antd/lib/mentions";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { updatedvDevice } from "../../redecers/updvRedecer";
import { User, onAuthStateChanged } from "firebase/auth";
import Test from "../profile/test";

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
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userProfile) {
    return <Link to="/" />;
  }
  return (
    <Layout>
      <Sider width={200}>
        <MenuLayout />
      </Sider>
      <Layout>
        <Header style={{ backgroundColor: "#f5f5f5" }}>
          <Row>
            <Col span={18}>
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
            <Col style={{ top: "30px" }}>
              <Test />
            </Col>
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
                          format={dateFormatList}
                          style={{ width: "115px" }}
                        />
                        &gt;
                        <DatePicker
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
                <Card style={{ backgroundColor: "#FFF2E7" }}>
                  <Col span={24}>
                    <Link to={`/updv/${id}`}>
                      <Button
                        htmlType="submit"
                        icon={
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-pen"
                            viewBox="0 0 16 16"
                          >
                            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
                          </svg>
                        }
                        style={{
                          backgroundColor: "#FF7506",
                        }}
                      ></Button>
                    </Link>

                    <Link
                      style={{
                        color: "orange",
                        padding: "10%",
                        fontWeight: "bold",
                        borderColor: "orange",
                      }}
                      to={`/updv/${id}`}
                    >
                      Cập nhật
                    </Link>
                  </Col>
                </Card>

                <Card style={{ backgroundColor: "#FFF2E7", marginTop: "20%" }}>
                  <Col span={24}>
                    <Link to="/dv">
                      <Button
                        htmlType="submit"
                        icon={
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="29"
                            viewBox="0 0 28 29"
                            fill="none"
                          >
                            <path
                              d="M18.8885 2.54004H9.1235C4.86516 2.54004 2.3335 5.07171 2.3335 9.31837V19.0834C2.3335 23.33 4.86516 25.8617 9.11183 25.8617H18.8768C23.1235 25.8617 25.6552 23.33 25.6552 19.0834V9.31837C25.6668 5.07171 23.1352 2.54004 18.8885 2.54004Z"
                              fill="#FF7506"
                            />
                            <path
                              d="M16.2398 10.1H10.2315L10.6165 9.71503C10.9548 9.37669 10.9548 8.81669 10.6165 8.47836C10.2782 8.14003 9.71818 8.14003 9.37985 8.47836L7.54818 10.31C7.20985 10.6484 7.20985 11.2084 7.54818 11.5467L9.37985 13.3784C9.55485 13.5534 9.77652 13.635 9.99818 13.635C10.2198 13.635 10.4415 13.5534 10.6165 13.3784C10.9548 13.04 10.9548 12.48 10.6165 12.1417L10.3132 11.8384H16.2398C17.7332 11.8384 18.9582 13.0517 18.9582 14.5567C18.9582 16.0617 17.7448 17.275 16.2398 17.275H10.4998C10.0215 17.275 9.62485 17.6717 9.62485 18.15C9.62485 18.6284 10.0215 19.025 10.4998 19.025H16.2398C18.7015 19.025 20.7082 17.0184 20.7082 14.5567C20.7082 12.095 18.7015 10.1 16.2398 10.1Z"
                              fill="#FFF2E7"
                            />
                          </svg>
                        }
                        style={{
                          backgroundColor: "#FF7506",
                          color: "white",
                        }}
                      ></Button>
                    </Link>
                    <Link
                      style={{
                        color: "orange",
                        padding: "10%",
                        fontWeight: "bold",

                        borderColor: "orange",
                      }}
                      to="/dv"
                    >
                      Hủy bỏ
                    </Link>
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
