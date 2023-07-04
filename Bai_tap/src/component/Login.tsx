import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, Col, Form, Input, Layout, Row } from "antd";
import { RootState, AppDispatch } from "../store/store";
import img from "../img/1.png";
import img1 from "../img/2.png";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/fibase";
import { login } from '../redecers/authReducer';

const { Content } = Layout;

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // useEffect(() => {
  //   const user = auth.currentUser;
  //   if (user) {
  //     navigate('/tb');
  //   }
  // }, [navigate]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    try {
      const response = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { user } = response;

      dispatch(login());
      navigate('/tb');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <Content>
        <Row>
          <Col span={6}>
            <div style={{ paddingBottom: "100px" }}>
              <img src={img} alt="" width={170} height={136} />
              <Form
                name="basic"
                layout="vertical"
                initialValues={{ remember: true }}
                autoComplete="off"
                style={{ paddingLeft: "18%" }}
                onFinish={handleLogin}
              >
                <Form.Item
                  label="Tên đăng nhập"
                  name="email"
                  rules={[
                    { required: true, message: "Please input your email!" },
                  ]}
                >
                  <Input name="email"  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}  />
                </Form.Item>
                <Form.Item
                  label="Mật khẩu"
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                >
                  <Input.Password
                    name="password"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  />
                </Form.Item>
                <Form.Item>
                  <Row>
                    <Col span={17}>
                      <Link to="/forgot" style={{ color: "#E73F3F" }}>
                        Quên mật khẩu?
                      </Link>
                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ background: "#FF9138" }}
                  >
                    Tiếp Tục
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>
          <Col
            span={18}
            style={{
              display: "flex",
              justifyContent: "center",
              paddingLeft: "100px",
            }}
          >
            <img src={img1} alt="" height={790} width={1000} />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Login;
