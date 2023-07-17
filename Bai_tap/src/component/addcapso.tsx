import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Layout, Modal, Row, Select } from "antd";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addcsList } from "../redecers/adcapsoRedecer";
import MenuLayout from "./Menu";
import { Content, Footer, Header } from "antd/es/layout/layout";

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
  const handlePrintNumber = () => {
    setCounter((prevCounter) => prevCounter + 1);
    const data: DataType = {
      ...capso,
      stt: counter.toString().padStart(7, "0"),
      tgc: getCurrentTime(),
      hsd: `17:30 ${getCurrentTime1()}`,
      tthai: "Đang chờ",
      nguoncap: "Kiosk",
      namekh: "Thanh Tâm",
    };

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

  const handleModalCancel = () => {
    setIsModalVisible(false);
    localStorage.setItem("counter", counter.toString());
    navigate("/cs");
  };

  useEffect(() => {
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
    return value.toString().padStart(6, "0");
  };
  return (
    <div>
      <Row>
        <Col span={4}>
          <MenuLayout />
        </Col>
        <Col span={20}>
          <Layout>
            <Header style={{ background: "white" }}>
              <Row>
                <label>Dịch vụ</label>
              </Row>
            </Header>
            <Content style={{ background: "white" }}>
              <Row>
                <Col span={8}></Col>
                <Col span={8}>
                  <h1 style={{ color: "Orange", fontSize: "30px" }}>
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
                      <Button style={{ marginTop: "10px", marginLeft: "40% " }}>
                        <Link to={"/cs"}>Hủy bỏ</Link>
                      </Button>
                    </Col>
                    <Col span={12}>
                      <Button
                        style={{ marginTop: "10px", marginRight: "40% " }}
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
          </Layout>
        </Col>
      </Row>

      <Modal
        visible={isModalVisible}
        footer={null}
        maskClosable={false}
        onCancel={handleModalCancel}
      >
        <Content style={{textAlign: "center"}}>
          <h1>Số thứ tự được cấp  </h1>
          <h1 >{formatCounter(counter)}</h1>
          <h2>
            {" "}
            DV: {capso.namedv} <b>(tại quầy số 1)</b>{" "}
          </h2>
        </Content>
        <Footer style={{ color: "white", backgroundColor: "orange" }}>
          <h2>Thời gian cấp: {getCurrentTime()}</h2>
          <h2>Hạn sử dụng: {` 17:30   ${getCurrentTime1()}`}</h2>
        </Footer>
      </Modal>
    </div>
  );
};

export default CapSostt;
