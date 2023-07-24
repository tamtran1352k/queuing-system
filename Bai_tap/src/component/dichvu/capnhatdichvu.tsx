import {
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "@firebase/firestore";
import Checkbox, { CheckboxChangeEvent } from "antd/es/checkbox";
import { auth, db } from "../../firebase/fibase";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Col, Form, Input, Layout, Row, message } from "antd";
import MenuLayout from "../menu/Menu";
import TextArea from "antd/es/input/TextArea";
import { useDispatch } from "react-redux";
import { updatedvDevice } from "../../redecers/updvRedecer";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
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

const CapnhatDichvu = () => {
  const [madv, setMadv] = useState("");
  const [motadv, setMotadv] = useState("");
  const [namedv, setNamedv] = useState("");
  const [prefix, setPrefix] = useState("");
  const [sott, setSott] = useState("");
  const [surfix, setSurfix] = useState("");
  const [tthddv, setTthddv] = useState("");
  const [stt, setStt] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams<{ id: string }>();
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

  const [updv, setUpdv] = useState<DataType>({
    madv: "",
    motadv: "",
    namedv: "",
    prefix: "",
    sott: "",
    surfix: "",
    tthddv: "",
    stt: "",
  });
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

  useEffect(() => {
    const fetchDeviceData = async () => {
      const timestamp = getCurrentTime();

      const userLogRef = collection(db, "userLogs");
      await addDoc(userLogRef, {
        email: user?.email || "unknown",
        timestamp: timestamp,
        action: ` thao tác cập nhật dịch vụ   ${timestamp}`,
      });
      try {
        const docRef = doc(collection(db, "dichvu"), id);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          const docData = docSnapshot.data() as DataType;
          setUpdv(docData);
        } else {
          message.error("Device not found");
        }
      } catch (error) {
        console.error("Error fetching device data:", error);
      }
    };
    fetchDeviceData();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const docRef = doc(collection(db, "dichvu"), id);
      await updateDoc(docRef, { ...updv });
      message.success("Device updated successfully");
      dispatch(updatedvDevice(updv));
      navigate("/dv");
    } catch (error) {
      console.error("Error updating device:", error);
      message.error("Failed to update device");
    }
  };
  const handledvChange = (e: CheckboxChangeEvent) => {
    const value = e.target.value;
    const checked = e.target.checked;

    if (value === "all") {
      if (checked) {
        const randomNumber = generateRandomNumber();
        setStt(randomNumber + madv);
        if (value === "prefix") {
          setStt(randomNumber + madv);
        }
        if (value === "surfix") {
          const randomNumber = generateRandomNumber();
          setStt(madv + randomNumber);
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
                Dịch vụ &gt; Danh sách dịch vụ &gt; Chi tiết &gt;
                <b>
                  <Link to={`/updv/${id}`} style={{ color: "orange" }}>
                    Cập nhật
                  </Link>
                </b>
              </h1>
            </header>
          </Col>
          <Col style={{ top: "30px" }}>
            <Test />
          </Col>
        </Row>
        <Content>
          <Header
            style={{
              backgroundColor: "#f5f5f5",
              textAlign: "left",
              color: "Orange",
            }}
          >
            {" "}
            <h1>Quản lý dịch vụ</h1>
          </Header>
          <Content
            style={{
              margin: "24px 16px 0",
            }}
          >
            <Content style={{ backgroundColor: "white", textAlign: "center" }}>
              <Row>
                <Col span={4}>
                  <h1>Thông tin dịch vụ</h1>
                </Col>
              </Row>

              <Form layout="vertical">
                <Row gutter={20}>
                  <Col span={12}>
                    <Form.Item label="Mã dịch vụ">
                      <Input
                        value={updv.madv}
                        onChange={(e) =>
                          setUpdv({
                            ...updv,
                            madv: e.target.value,
                          })
                        }
                      />
                    </Form.Item>

                    <Form.Item label="Tên dịch vụ">
                      <Input
                        value={updv.namedv}
                        onChange={(e) =>
                          setUpdv({
                            ...updv,
                            namedv: e.target.value,
                          })
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Mô tả">
                      <TextArea
                        rows={5}
                        value={updv.motadv}
                        onChange={(e) =>
                          setUpdv({
                            ...updv,
                            motadv: e.target.value,
                          })
                        }
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
                          Tự Động
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
                  </Col>
                </Row>
              </Form>
              <Row style={{ justifyContent: "center" }}>
                <Col span={4}>
                  {" "}
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
                    onClick={handleUpdate}
                  >
                    Cập nhật
                  </Button>
                </Col>
              </Row>
            </Content>
          </Content>
        </Content>
      </Col>
    </Layout>
  );
};

export default CapnhatDichvu;
