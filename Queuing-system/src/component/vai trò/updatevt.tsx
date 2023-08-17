import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Card, Input, Checkbox, Button, message } from "antd";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "@firebase/firestore";
import { auth, db } from "../../firebase/fibase";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import MenuLayout from "../menu/Menu";
import Sider from "antd/es/layout/Sider";
import { Header } from "antd/es/layout/layout";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { User, onAuthStateChanged } from "firebase/auth";
import Test from "../profile/test";

const { Content } = Layout;

interface Vaitro {
  namevt: string;
  mota: string;
  sond: number;
  cna: string[];
  cnb: string[];
}

export const UpdateVt = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
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
  const [vaitro, setVaitro] = useState<Vaitro>({
    namevt: "",
    mota: "",
    sond: 0,
    cna: [],
    cnb: [],
  });
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

  useEffect(() => {
    const fetchVaitro = async () => {
      try {
        const docRef = doc(collection(db, "vaitro"), id);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          const docData = docSnapshot.data() as Vaitro;
          setVaitro(docData);
        } else {
          message.error("Vaitro not found");
        }
      } catch (error) {
        console.error("Error fetching vaitro:", error);
      }
    };
    fetchVaitro();
  }, [id]);

  const handleUpdate = async () => {
    const timestamp = getCurrentTime();

    const userLogRef = collection(db, "userLogs");
    await addDoc(userLogRef, {
      email: user?.email || "unknown",
      timestamp: timestamp,
      action: ` thao tác cập nhật vai trò   ${timestamp}`,
    });
    try {
      const docRef = doc(collection(db, "vaitro"), id);
      await updateDoc(docRef, { ...vaitro });
      message.success("Vaitro updated successfully");
      navigate("/vaitro");
    } catch (error) {
      console.error("Error updating vaitro:", error);
      message.error("Failed to update vaitro");
    }
  };

  const handlecnaChange = (e: CheckboxChangeEvent) => {
    const value = e.target.value;
    const checked = e.target.checked;
    if (value === "all") {
      if (checked) {
        setVaitro((prevData) => ({
          ...prevData,
          cna: ["Chức năng x", "Chức năng y", "Chức năng z"],
        }));
      } else {
        setVaitro((prevData) => ({
          ...prevData,
          cna: [],
        }));
      }
    } else {
      setVaitro((prevData) => {
        let updatedCna = [...prevData.cna];
        if (checked) {
          updatedCna.push(value);
        } else {
          updatedCna = updatedCna.filter((item) => item !== value);
        }
        return {
          ...prevData,
          cna: updatedCna,
        };
      });
    }
  };

  const handlecnbChange = (e: CheckboxChangeEvent) => {
    const value = e.target.value;
    const checked = e.target.checked;
    if (value === "all") {
      if (checked) {
        setVaitro((prevData) => ({
          ...prevData,
          cnb: ["Chức năng x", "Chức năng y", "Chức năng z"],
        }));
      } else {
        setVaitro((prevData) => ({
          ...prevData,
          cnb: [],
        }));
      }
    } else {
      setVaitro((prevData) => {
        let updatedCnb = [...prevData.cnb];
        if (checked) {
          updatedCnb.push(value);
        } else {
          updatedCnb = updatedCnb.filter((item) => item !== value);
        }
        return {
          ...prevData,
          cnb: updatedCnb,
        };
      });
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
      </Sider>
      <Layout>
        <Header style={{ backgroundColor: "#f5f5f5" }}>
          <Row>
            <Col span={18}>
              <header>
                <h1 style={{ fontSize: 24, textAlign: "left" }}>
                  Cài đặt hệ thống &gt;Quản lý vai trò&gt;{" "}
                  <b>
                    {" "}
                    <Link to="/vaitro" style={{ color: "orange" }}>
                      {" "}
                      Cập nhật vai trò
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
        <Content
          style={{
            margin: "24px 16px 0",
          }}
        >
          <Row>
            <Col span={7}>
              <h1 style={{ color: "orange", fontSize: 24, textAlign: "left" }}>
                Danh sách vai trò
              </h1>
            </Col>
          </Row>
          <Content style={{ backgroundColor: "white", textAlign: "center" }}>
            <Col span={18}>
              <Content>
                <Row>
                  <div>
                    <Row>
                      <Col span={6}>
                        <h1
                          style={{
                            color: "orange",
                            fontSize: 24,
                            textAlign: "left",
                          }}
                        >
                          Thông tin vai trò
                        </h1>
                      </Col>
                      <Col span={9}></Col>
                      <Col span={9}></Col>
                    </Row>
                    <Row gutter={20} style={{ justifyContent: "end" }}>
                      <Col span={12}>
                        <div>
                          <Row>
                            <Col span={5}>
                              <label htmlFor="">Tên vai trò</label>
                            </Col>
                          </Row>
                          <br />

                          <Input
                            value={vaitro.namevt}
                            onChange={(e) =>
                              setVaitro({ ...vaitro, namevt: e.target.value })
                            }
                          />
                        </div>
                        <br />
                        <div>
                          <Row>
                            <Col span={3}>
                              <label htmlFor="">Mô tả</label>
                            </Col>
                          </Row>
                          <br />

                          <Input.TextArea
                            rows={6}
                            style={{ width: "560px" }}
                            value={vaitro.mota}
                            onChange={(e) =>
                              setVaitro({ ...vaitro, mota: e.target.value })
                            }
                          />
                          <p style={{ textAlign: "left" }}>
                            Là trường thông tin bắt buộc
                          </p>
                        </div>
                      </Col>
                      <Col span={10} style={{ marginBottom: "20px" }}>
                        <h1>Phân quyền chức năng</h1>
                        <Card style={{ background: "#FFF2E7" }}>
                          <div>
                            <h1>Nhóm chức năng A</h1>
                            <div>
                              <Checkbox
                                value="all"
                                checked={vaitro.cna.length === 3}
                                onChange={handlecnaChange}
                              >
                                Tất cả
                              </Checkbox>
                            </div>
                            <div>
                              <Checkbox
                                value="Chức năng x"
                                checked={vaitro.cna.includes("Chức năng x")}
                                onChange={handlecnaChange}
                              >
                                Chức năng x
                              </Checkbox>
                            </div>
                            <div>
                              <Checkbox
                                value="Chức năng y"
                                checked={vaitro.cna.includes("Chức năng y")}
                                onChange={handlecnaChange}
                              >
                                Chức năng y
                              </Checkbox>
                            </div>
                            <div>
                              <Checkbox
                                value="Chức năng z"
                                checked={vaitro.cna.includes("Chức năng z")}
                                onChange={handlecnaChange}
                              >
                                Chức năng z
                              </Checkbox>
                            </div>
                          </div>
                          <div>
                            <h1>Nhóm chức năng B</h1>
                            <div>
                              <Checkbox
                                value="all"
                                checked={vaitro.cnb.length === 3}
                                onChange={handlecnbChange}
                              >
                                Tất cả
                              </Checkbox>
                            </div>
                            <div>
                              <Checkbox
                                value="Chức năng x"
                                checked={vaitro.cnb.includes("Chức năng x")}
                                onChange={handlecnbChange}
                              >
                                Chức năng x
                              </Checkbox>
                            </div>
                            <div>
                              <Checkbox
                                value="Chức năng y"
                                checked={vaitro.cnb.includes("Chức năng y")}
                                onChange={handlecnbChange}
                              >
                                Chức năng y
                              </Checkbox>
                            </div>
                            <div>
                              <Checkbox
                                value="Chức năng z"
                                checked={vaitro.cnb.includes("Chức năng z")}
                                onChange={handlecnbChange}
                              >
                                Chức năng z
                              </Checkbox>
                            </div>
                          </div>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </Row>
              </Content>
            </Col>
          </Content>
          <Row style={{ justifyContent: "center", marginTop: "20px" }}>
            <Col span={15}>
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
                <Link to="/vaitro">Hủy bỏ</Link>
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
      </Layout>
    </Layout>
  );
};

export default UpdateVt;
