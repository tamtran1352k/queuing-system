import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Col, Form, Input, Layout, Row, message } from "antd";
import { RootState, AppDispatch } from "../../store/store";
import img1 from "../../img/2.png";
import img from "../../img/1.png";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/fibase";
import { login } from "../../redecers/authReducer";
import { addDoc, collection } from "@firebase/firestore";

const { Content } = Layout;

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // useEffect(() => {
  //   const user = auth.currentUser;
  //   if (user) {
  //     navigate('/tb');
  //   }
  // }, [navigate]);
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
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    try {
      // Kiểm tra email có hợp lệ (có chứa @) trước khi thực hiện đăng nhập
      if (!email.includes("@")) {
        throw new Error("Định dạng email không hợp lệ!");
      }

      // Thực hiện đăng nhập bằng Firebase Auth
      const response = await signInWithEmailAndPassword(auth, email, password);
      const { user } = response;

      const timestamp = getCurrentTime();
      dispatch(
        login({
          email,
          timestamp,
          action: `login vào thời gian ${timestamp}`,
        })
      );
      const userLogRef = collection(db, "userLogs");
      await addDoc(userLogRef, {
        email,
        timestamp: timestamp,
        action: `login vào thời gian ${timestamp}`,
      });
      navigate("/profile");
    } catch (error) {
      // Xử lý lỗi khi đăng nhập thất bại
      message.error("Mật khẩu không đúng!");

    }
  };

  return (
    <Layout>
      <Content>
        <Row>
          <Col span={6}>
            <div style={{ paddingBottom: "100px" }}>
              <img src={img} alt="" width={170} height={136} style={{objectFit:"cover",display:"inline-block"}} />
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
                  <Input
                    name="email"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setEmail(e.target.value)
                    }
                  />
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
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setPassword(e.target.value)
                    }
                  />
                </Form.Item>
                <Form.Item>
                  <Row>
                    <Col span={9}>
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
