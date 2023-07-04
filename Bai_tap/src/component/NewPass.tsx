import { Image } from "antd";
import { Link } from "react-router-dom";
import img from "../img/1.png";
import img3 from "../img/3.png";

import { Button, Checkbox, Col, Form, Input, Layout, Row } from "antd";

const onFinish = (values: any) => {
  console.log("Success:", values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

export const NewPass = () => {
  return (
    <div >
      <Layout>
        <Row style={{ display: "flex", justifyContent: "center" }}>
          <Col flex={4} style={{ display: "flex", justifyContent: "center" }}>
            <Form className="loginForm"
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
              <h1>Đặt lại mật khẩu mới</h1>
              <div>
                <Form.Item
                  style={{}}
                  label="Mật Khẩu"
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                >
                  <Input.Password />
                </Form.Item>{" "}
                <Form.Item
                  style={{}}
                  label="Nhập lại mật Khẩu"
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ background: "#FF9138" }}
                  >
                    Xác Nhận
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