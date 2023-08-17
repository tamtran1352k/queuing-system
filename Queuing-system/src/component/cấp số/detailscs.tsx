import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/fibase";
import { Button, Card, Col, Layout, Row, theme } from "antd";
import MenuLayout from "../menu/Menu";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { RollbackOutlined } from "@ant-design/icons";
import { User, onAuthStateChanged } from "firebase/auth";
import Test from "../profile/test";
interface DataType {
  key: string;
  namekh: string;
  namedv: string;
  nguoncap: string;
  stt: string;
  tgc: string;
  tthai: string;
  hsd: string;
}

const DetailsCs: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loading1, setLoading1] = useState(true); // Add loading state
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
    const fetchData = async () => {
      try {
        const docRef = doc(collection(db, "dscs"), id);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          const docData = docSnapshot.data() as DataType;
          setData({
            key: docSnapshot.id,
            namekh: docData.namekh,
            namedv: docData.namedv,
            nguoncap: docData.nguoncap,
            stt: docData.stt,
            tgc: docData.tgc,
            tthai: docData.tthai,
            hsd: docData.hsd,
          });
        } else {
          setError("Record not found");
        }
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return null;
  }

  if (!userProfile) {
    return <Link to="/" />;
  }

  const statusCircleStyle = {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    display: "inline-block",
    marginRight: "5px",
  };

  let statusColor;
  switch (data.tthai) {
    case "Đang chờ":
      statusColor = "blue";
      break;
    case "Đã sử dụng":
      statusColor = "gray";
      break;
    case "Bỏ qua":
      statusColor = "red";
      break;
    default:
      statusColor = "black";
      break;
  }

  return (
    <>
      <Row>
        <Layout>
          <Col span={4}>
            <MenuLayout />
          </Col>
          <Col span={18}>
            <Header
              style={{
                background: "#F6F6F6",
                color: "orange",
              }}
            >
              <Row>
                <Col span={16}>
                  <div style={{ color: "orange" }}>
                    <h1
                      style={{
                        color: "black",
                        textAlign: "left",
                      }}
                    >
                      Thiết bị &gt;
                      <Link to="/cs" style={{ color: "black", marginLeft: 5 }}>
                        Danh sách cấp số &gt;
                      </Link>
                      <span style={{ color: "orange", marginLeft: 5 }}>
                        Chi tiết
                      </span>
                    </h1>
                  </div>
                </Col>
                <Col style={{ top: "30px" }}>
                  <Test />
                </Col>
              </Row>
            </Header>
            <Row>
              <Col
                style={{
                  background: "#F6F6F6",
                  textAlign: "left",
                  color: "orange",
                }}
              >
                <h1>Quản lý cấp số</h1>
              </Col>
            </Row>
            <Content
              style={{ background: colorBgContainer, marginRight: "25px" }}
            >
              <Col span={4} style={{ color: "orange" }}>
                <h1>Thông tin cấp số</h1>
              </Col>
              <Row>
                <Col span={12}>
                  <div style={{ textAlign: "left" }}>
                    <p>
                      <b>Họ tên:</b> {data.namekh}
                    </p>

                    <p>
                      <b>Tên dịch vụ: </b>
                      {data.namedv}
                    </p>
                    <p>
                      <b>Số thứ tự:</b> {data.stt}
                    </p>
                    <p>
                      <b>Thời gian cấp:</b> {data.tgc}
                    </p>
                    <p>
                      <b>Hạn sử dụng:</b> {data.hsd}
                    </p>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ textAlign: "left" }}>
                    <p>
                      <b>Nguồn cấp:</b> {data.nguoncap}
                    </p>
                    <p>
                      <b> Trạng thái:</b>{" "}
                      <span
                        style={{
                          ...statusCircleStyle,
                          backgroundColor: statusColor,
                        }}
                      ></span>
                      {data.tthai}
                    </p>
                  </div>
                </Col>
              </Row>
            </Content>
          </Col>
          <Col span={2}>
            <Card
              style={{ background: "#FFF2E7", top: "200px", right: "10px" }}
            >
              {" "}
              <Link to={"/cs"}>
                {" "}
                <Button
                  style={{ right: "15px", background: "orange" }}
                  icon={<RollbackOutlined />}
                ></Button>
                <br />
              </Link>
              <Link
                style={{ right: "15px", color: "orange", fontWeight: "bold" }}
                to={"/cs"}
              >
                {" "}
                Quay lại
              </Link>
            </Card>
          </Col>
        </Layout>
      </Row>
    </>
  );
};

export default DetailsCs;
