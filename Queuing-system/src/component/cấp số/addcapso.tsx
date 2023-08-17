import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Layout, Modal, Row, Select } from "antd";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addcsList } from "../../redecers/adcapsoRedecer";
import MenuLayout from "../menu/Menu";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { addDoc, collection } from "@firebase/firestore";
import { auth, db } from "../../firebase/fibase";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Sider from "antd/es/layout/Sider";
import { User, onAuthStateChanged } from "firebase/auth";
import Test from "../profile/test";

interface DataType {
  namekh: string;
  namedv: string;
  nguoncap: string;
  stt: string;
  tgc: string;
  tthai: string;
  hsd: string;
}

const CapSostt: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.auth.user);

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

  const [counter, setCounter] = useState<number>(() => {
    const storedCounter = localStorage.getItem("counter");
    return storedCounter ? parseInt(storedCounter) : 0;
  });
  const handleSelectChange = (value: string) => {
    if (value !== selectedService) {
      setSelectedService(value);
      setVisible(true);

      setCapso((prevState) => ({
        ...prevState,
        namedv: value,
      }));
    }
  };

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [capso, setCapso] = useState<DataType>({
    namekh: "",
    namedv: "",
    nguoncap: "",
    stt: "",
    tgc: "",
    tthai: "",
    hsd: "",
  });
  const services = [
    "Khám tim mạch",
    "Khám sản phụ khoa",
    "Khám răng hàm mặt",
    "Khám tai mũi họng",
    "Khám hô hấp",
    "Khám tổng quát",
  ];
  const statuses = ["Đang chờ", "Đã sử dụng", "Bỏ qua"];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  const handlePrintNumber = async () => {
    setCounter((prevCounter) => prevCounter + 1);
    const data: DataType = {
      ...capso,
      stt: counter.toString().padStart(1, "0"),
      tgc: getCurrentTime(),
      hsd: `17:30 ${getCurrentTime1()}`,
      tthai: randomStatus,
      nguoncap: "Kiosk",
      namekh: "Thanh Tâm",
    };
    const timestamp = getCurrentTime();

    const userLogRef = collection(db, "userLogs");
    await addDoc(userLogRef, {
      email: user?.email || "unknown",
      timestamp: timestamp,
      action: ` thao tác in số vào ${timestamp}`,
    });
    dispatch(addcsList(data) as any);

    setIsModalVisible(true);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleModalOk = () => {
    setIsModalVisible(true);
    localStorage.setItem("counter", (counter + 1).toString());
    navigate("/cs");
  };
  const handleResetLocalStorage = () => {
    // Reset local storage every day
    const lastSavedDate = localStorage.getItem("lastSavedDate");
    const currentDate = new Date().toLocaleDateString();

    if (lastSavedDate !== currentDate) {
      localStorage.clear();
      setCounter(0);
      localStorage.setItem("lastSavedDate", currentDate);
    }

    // Reset the counter to 0 when it reaches 9999999
    if (counter >= 9999999) {
      setCounter(0);
    }
  };
  useEffect(() => {
    handleResetLocalStorage();
    // Load other necessary functions here
  }, []);

  const handleModalCancel = () => {
    setIsModalVisible(false);
    localStorage.setItem("counter", counter.toString());
    //lưu biến đếm localStorage
    navigate("/cs");
  };

  useEffect(() => {
    //load loại trang funtion biến đếm localStorage

    localStorage.setItem("counter", counter.toString());
  }, [counter]);
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

  const getCurrentTime1 = (): string => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return date.toLocaleString("vi-VN", options);
  };
  const formatCounter = (value: number) => {
    return value.toString().padStart(1, "0");
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
      <Col span={20}>
        <Layout>
          <Header style={{ backgroundColor: "#f5f5f5" }}>
            <Row>
              <Col span={18}>
                <header style={{ textAlign: "left", fontSize: "20px" }}>
                  <h1>
                    Cấp số &gt; Danh sách cấp số&gt;
                    <b>
                      {" "}
                      <Link to="/cs" style={{ color: "orange" }}>
                        {" "}
                        Cấp số Mới
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
          <Row>
            <Col span={4}>
              <h1 style={{ color: "Orange", fontSize: "24px" }}>
                Quản lý số cấp
              </h1>
            </Col>
          </Row>
          <Content
            style={{
              margin: "24px 16px 0",
            }}
          >
            <Content style={{ backgroundColor: "white", textAlign: "center" }}>
              <Row>
                <Col span={8}></Col>
                <Col span={8}>
                  <h1 style={{ color: "Orange", fontSize: "24px" }}>
                    Cấp số mới{" "}
                  </h1>
                  <h3>Dịch vụ khách hàng lựa chọn </h3>

                  <Select
                    placeholder=" Chọn dịch vụ"
                    style={{ width: "100%" }}
                    onChange={handleSelectChange}
                  >
                    {services.map((service) => (
                      <Select.Option key={service} value={service}>
                        {service}
                      </Select.Option>
                    ))}
                  </Select>
                  <Row>
                    <Col span={12}>
                      <Button
                        style={{
                          marginTop: "10px",
                          marginLeft: "40% ",
                          color: "orange",
                          background: "#FFF2E7",
                        }}
                      >
                        <Link to={"/cs"}>Hủy bỏ</Link>
                      </Button>
                    </Col>
                    <Col span={12}>
                      <Button
                        style={{
                          marginTop: "10px",
                          marginRight: "40% ",
                          color: "white",
                          background: "orange",
                        }}
                        onClick={handlePrintNumber}
                      >
                        In số
                      </Button>
                    </Col>
                  </Row>

                  <Form.Item>
                    <p>Là trường thông tin bắt buộc</p>
                  </Form.Item>
                </Col>
                <Col span={8}></Col>
              </Row>
            </Content>
          </Content>
        </Layout>
      </Col>

      <Modal
        visible={isModalVisible}
        footer={null}
        maskClosable={false}
        onCancel={handleModalCancel}
      >
        <Content style={{ textAlign: "center" }}>
          <h1>Số thứ tự được cấp </h1>
          <h1 style={{ color: "orange" }}>{formatCounter(counter)}</h1>
          <p>
            {" "}
            DV: {capso.namedv} <b>(tại quầy số 1)</b>{" "}
          </p>
        </Content>

        <Footer style={{ color: "white", backgroundColor: "orange" }}>
          <h2>Thời gian cấp: {getCurrentTime()}</h2>
          <h2>Hạn sử dụng: {` 17:30   ${getCurrentTime1()}`}</h2>
        </Footer>
      </Modal>
    </Layout>
  );
};

export default CapSostt;
