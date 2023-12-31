import { Image, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import img from "../../img/1.png";
import img3 from "../../img/3.png";

import { Button, Checkbox, Col, Form, Input, Layout, Row } from "antd";
import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/fibase";

export const Forgot = () => {
 
  const nvigate = useNavigate();
  const onFinish = (values: any) => {
    const { username } = values;
    if (username.includes("@")) {
      console.log("Success:", values);
      nvigate("/newpass"); 
    } else {
      console.log("Failed: Invalid email format");
      message.error("Failed: Invalid email format")
    }
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };


  return (
    <div>
      <Layout>
        <Row style={{ display: "flex", justifyContent: "center" }}>
          <Col flex={4} style={{ display: "flex", justifyContent: "center" }}>
            <Form
              name="basic"
              labelCol={{ span: 40 }}
              wrapperCol={{ span: 40 }}
              style={{ maxWidth: 600 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              layout="vertical"
            >
              <img src={img} alt="" width={170} height={136} />
              <h1>Đặt lại mật khẩu</h1>
              <div>
                <Form.Item
                  label="Vui lòng nhập lại email để đặt lại mật khẩu của bạn"
                  name="username"
                  rules={[
                    { required: true, message: "Please input your email!" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      background: "white",
                      color: "orange",
                      marginRight: "20px",
                      borderColor: "orange",
                    }}
                  >
                    Hủy
                  </Button>

                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ background: "#FF9138" }}
                  >
                    Tiếp Tục{" "}
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </Col>

          <Col style={{ display: "flex", justifyContent: "center" }}>
            <img src={img3} alt="" width={1000} height={780} />
          </Col>
        </Row>
      </Layout>
    </div>
  );
};