import { Button, Checkbox, Col, Form, Layout, Row } from "antd";
import Input from "antd/es/input/Input";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../firebase/fibase";
import { useEffect, useState } from "react";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import MenuLayout from "../menu/Menu";
import TextArea from "antd/es/input/TextArea";
import { Link, useNavigate } from "react-router-dom";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { User, onAuthStateChanged } from "firebase/auth";
import Test from "../profile/test";

interface DataType {
  madv: string;
  motadv: string;
  namedv: string;
  prefix: string;
  sott: string;
  surfix: string;
  tthddv: string;
  stt: string;
}

function generateRandomNumber(): string {
  const min = 1;
  const max = 9999;
  // Generate a random number from 1 to 9999
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  // Convert the number to a string
  let randomString = randomNumber.toString();
  // Add leading zeros to the string if necessary
  while (randomString.length < 4) {
    randomString = "0" + randomString;
  }
  // Return the random string
  return randomString;
}

const AddDichvu = () => {
  const [madv, setMadv] = useState("");
  const [motadv, setMotadv] = useState("");
  const [namedv, setNamedv] = useState("");
  const [prefix, setPrefix] = useState("");
  const [sott, setSott] = useState("");
  const [surfix, setSurfix] = useState("");
  const [tthddv, setTthddv] = useState("");
  const [stt, setStt] = useState("");
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
  const user = useSelector((state: RootState) => state.auth.user);

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

  const randomHd = () => {
    const randomValues = Math.random();
    if (randomValues < 1 / 2) {
      return "Đang hoạt động";
    } else {
      return "Ngưng hoạt động";
    }
  };
  const handleSubmit = async () => {
    const data: DataType = {
      madv,
      motadv,
      namedv,
      prefix,
      sott,
      surfix,
      tthddv: randomHd(),
      stt,
    };

    try {
      const timestamp = getCurrentTime();

      const userLogRef = collection(db, "userLogs");
      await addDoc(userLogRef, {
        email: user?.email || "unknown",
        timestamp: timestamp,
        action: ` thao tác dịch vụ vào ${timestamp}`,
      });
      console.log(user?.email);
      const docRef = await addDoc(collection(db, "dichvu"), data);
      console.log("Document written with ID: ", docRef.id);
      // Reset the form after submitting
      setMadv("");
      setMotadv("");
      setNamedv("");
      setPrefix("");
      setSott("");
      setSurfix("");
      setTthddv("");
      setStt("");
      navigate("/dv");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handledvChange = (e: CheckboxChangeEvent) => {
    const value = e.target.value;
    const checked = e.target.checked;

    if (value === "all") {
      if (checked) {
        const randomNumber = generateRandomNumber();

        //console.log(randomNumber);
        setStt(randomNumber + "" + madv);
        if (value === "prefix") {
          setPrefix(randomNumber);

          setStt(madv + "" + randomNumber);

          //   console.log(setTthddv);
        }
        if (value === "surfix") {
          const randomNumber = generateRandomNumber();
          //    console.log(randomNumber);
          setPrefix(randomNumber + "");

          setStt(randomNumber + "" + madv);
          //   console.log(setTthddv);
        }
      } else {
        setStt("");
      }
    } else {
      setStt("");
    }
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
      </Sider>{" "}
      <Col span={19}>
        <Row>
          <Col span={18}>
            <header style={{ textAlign: "left" }}>
              <h1>
                Dịch vụ &gt; Danh sách dịch vụ &gt;
                <b>
                  {" "}
                  <Link to="/dv" style={{ color: "orange" }}>
                    {" "}
                    Thêm dịch vụ
                  </Link>
                </b>
              </h1>
            </header>
          </Col>
          <Col style={{ top: "30px" }}>
            <Test />
          </Col>
        </Row>
        <Row>
          <Col span={5}>
            <h1 style={{ color: "orange" }}>Quản lý dịch vụ</h1>
          </Col>
          <Col span={20}></Col>
        </Row>
        <Content
          style={{
            margin: "24px 16px 0",
          }}
        >
          <Content style={{ backgroundColor: "white", textAlign: "center" }}>
            <Form layout="vertical">
              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item label="Mã dịch vụ">
                    <Input
                      value={madv}
                      onChange={(e) => setMadv(e.target.value)}
                    />
                  </Form.Item>

                  <Form.Item label="Tên dịch vụ">
                    <Input
                      value={namedv}
                      onChange={(e) => setNamedv(e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Mô tả">
                    <TextArea
                      rows={5}
                      value={motadv}
                      onChange={(e) => setMotadv(e.target.value)}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Form layout="vertical">
              <Row>
                <Col span={12}>
                  <div style={{ textAlign: "initial" }}>
                    <Form.Item>
                      <Checkbox value={"all"} onChange={handledvChange}>
                        Tự Động{" "}
                      </Checkbox>
                      <Input
                        disabled={true}
                        style={{ width: "100px" }}
                        placeholder="0001"
                      />
                      &emsp; Đến &emsp;
                      <Input
                        disabled
                        style={{ width: "100px" }}
                        placeholder="9999"
                      />
                    </Form.Item>
                    <Form.Item>
                      <Checkbox value={"prefix"}>
                        prefix &emsp;
                        <Input
                          value={prefix}
                          placeholder="0001"
                          disabled
                          style={{ width: "100px", margin: "10px" }}
                        />
                      </Checkbox>
                    </Form.Item>

                    <Form.Item>
                      <Checkbox value={"surfix"}>
                        surfix &emsp;
                        <Input
                          value={surfix}
                          placeholder="0001"
                          disabled
                          style={{ width: "100px", margin: "10px" }}
                        />
                      </Checkbox>
                    </Form.Item>
                  </div>

                  <div style={{ textAlign: "initial" }}>
                    <Form.Item>
                      <Checkbox value={"reset"}>Reset mỗi ngày </Checkbox>
                    </Form.Item>
                  </div>
                  <Row>
                    <Col span={8}>
                      {" "}
                      <Form.Item>
                        <p>Là trường thông tin bắt buộc</p>
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
            <Row style={{ justifyContent: "center" }}>
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
                <Link to="/dv">Hủy bỏ</Link>
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{ background: "#FF9138" }}
                onClick={handleSubmit}
              >
                Thêm dịch vụ
              </Button>
            </Row>
          </Content>
        </Content>
      </Col>
    </Layout>
  );
};

export default AddDichvu;
