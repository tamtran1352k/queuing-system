import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchDetailData } from "../../redecers/detailSlice";
import { useAppSelector } from "../../hook/hook";
import { useAppDispatch } from "../../store/store";
import MenuLayout from "../menu/Menu";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Layout,
  Row,
  Select,
  theme,
} from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { Option } from "antd/es/mentions";
import Sider from "antd/es/layout/Sider";
import { EditOutlined } from "@ant-design/icons";
import Test from "../profile/test";

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector((state) => state.detail);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  useEffect(() => {
    dispatch(fetchDetailData(id ?? ""));
  }, [dispatch, id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Data not found.</div>;
  }

  return (
    <div>
      <Layout>
        <Sider>
          <MenuLayout />
        </Sider>
        <Col span={19}>
          {" "}
          <Layout>
            <Header style={{ padding: 0, background: "#f5f5f5" }}>
              <Row>
                <Col span={18}>
                  <header style={{ textAlign: "left", fontSize: "20px" }}>
                    <h1>
                      Thiết bị &gt; Danh sách thiết bị &gt;
                      <b>
                        {" "}
                        <Link to="#" style={{ color: "orange" }}>
                          Chi tiết thiết bị
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
                <h2 style={{ color: "orange" }}>Quản lý thiết bị </h2>
              </Col>
            </Row>
            <Row>
              <Col span={20}>
                <Content style={{ margin: "24px 16px 0" }}>
                  <div
                    style={{
                      padding: 24,
                      minHeight: 360,
                      background: colorBgContainer,
                    }}
                  >
                    <Row>
                      <Col span={6}>
                        <h2 style={{ color: "orange" }}>Thông tin thiết bị </h2>
                      </Col>
                    </Row>

                    <Form>
                      <Row>
                        <Col span={12} style={{ textAlign: "left" }}>
                          <p>
                            {" "}
                            <b>Mã thiết bị:&emsp; </b> {data.ma}
                          </p>
                          <p>
                            {" "}
                            <b>Tên thiết bị: &emsp;</b>
                            {data.name}
                          </p>
                          <p>
                            {" "}
                            <b>Địa chỉ IP: &emsp;</b> {data.ip}
                          </p>
                        </Col>
                        <Col span={12} style={{ textAlign: "left" }}>
                          <p>
                            {" "}
                            <b>Loại thiết bị: &emsp;</b> {data.loaitb}
                          </p>
                          <p>
                            {" "}
                            <b>Tên đăng nhập: &emsp;</b>
                            {data.user}
                          </p>
                          <p>
                            {" "}
                            <b>Mật khẩu: &emsp;</b> {data.password}
                          </p>
                        </Col>
                      </Row>

                      <Row style={{ marginTop: "50px" }}>
                        <Col span={24}>
                          <Col span={4}>
                            <h1>Dịch vụ sử dụng:</h1>
                          </Col>
                          <Col style={{ textAlign: "left" }} span={20}>
                            {/* <span> {data.dvsd}</span>{" "} */}
                            <span> {data.dvsd.join(", ")}</span>
                          </Col>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </Content>
              </Col>
              <Col span={4}>
                <Card style={{ backgroundColor: "#FFF2E7" }}>
                  <Link to={`/update/${id}`}>
                    <Button
                      style={{
                        backgroundColor: "orange",
                        textAlign: "center",
                      }}
                      icon={<EditOutlined />}
                    ></Button>
                  </Link>
                  <br />

                  <Link
                    style={{ color: "orange", fontWeight: "bold" }}
                    to={`/update/${id}`}
                  >
                    Cập nhật thiết bị
                  </Link>
                </Card>
              </Col>
            </Row>
          </Layout>
          <Footer></Footer>
        </Col>
      </Layout>
    </div>
  );
};

export default DetailPage;
