import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchDetailData } from "../redecers/detailSlice";
import { useAppSelector } from "../hook/hook";
import { useAppDispatch } from "../store/store";
import MenuLayout from "./Menu";
import { Col, Form, Input, Layout, Row, Select, theme } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { Option } from "antd/es/mentions";

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
      <Row>
        <Col span={4}>
          <MenuLayout />
        </Col>

        <Col span={19}>
          {" "}
          <Layout>
            <Header style={{ padding: 0, background: colorBgContainer }}>
              <Row>
                <Col span={11}>
                  <header>
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
                <Col span={13}></Col>
              </Row>
            </Header>
            <Row>
              <Col span={4}>
                <h2 style={{ color: "orange" }}>Quản lý thiết bị </h2>
              </Col>
            </Row>
            <Content style={{ margin: "24px 16px 0" }}>
              <div
                style={{
                  padding: 24,
                  minHeight: 360,
                  background: colorBgContainer,
                }}
              >
                <Row>
                  <Col span={4}>
                    <h2 style={{ color: "orange" }}>Thông tin thiết bị </h2>
                  </Col>
                </Row>
                <Form>
                  <Row>
                    <Col span={12}>
                      <label htmlFor="">
                        <b>Mã thiết bị:</b>{" "}
                      </label>
                      <span>{data.ma}</span>
                    </Col>
                    <Col span={12}>
                      <label htmlFor="">
                        <b>Loại thiết bị: </b>
                      </label>
                      <span>{data.loaitb}</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <label htmlFor="">
                        <b>Tên thiết bị:</b>{" "}
                      </label>
                      <span>{data.name}</span>
                    </Col>
                    <Col span={12}>
                      <label htmlFor="">
                        <b>Tên đăng nhập:</b>{" "}
                      </label>
                      <span>{data.user}</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <label htmlFor="">
                        <b>Địa chỉ IP:</b>{" "}
                      </label>
                      <span>{data.ip}</span>
                    </Col>
                    <Col span={12}>
                      <label htmlFor="">
                        <b>Mật khẩu:</b>{" "}
                      </label>
                      <span>{data.password}</span>
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
                {/* <p>Mã thiết bị: {data.ma}</p>
                <p>Tên thiết bị: {data.name}</p>
                <p>Địa chỉ IP: {data.ip}</p>
                <p>Trạng thái hoạt động: {data.tthd}</p>
                <p>Trạng thái kết nối: {data.ttkn}</p>
                <p>Dịch vụ sử dụng: {data.dvsd}</p>
                <p>Dịch vụ sử dụng: {data.loaitb}</p> */}
              </div>
            </Content>
          </Layout>
          <Footer></Footer>
        </Col>
      </Row>
    </div>
  );
};

export default DetailPage;
