import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Card, Input, Checkbox, Button, message } from "antd";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { collection, doc, getDoc, updateDoc } from "@firebase/firestore";
import { db } from "../firebase/fibase";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import MenuLayout from "./Menu";

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

  const [vaitro, setVaitro] = useState<Vaitro>({
    namevt: "",
    mota: "",
    sond: 0,
    cna: [],
    cnb: [],
  });

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

  return (
    <div>
      <Row>
        <Col span={4}>
          <MenuLayout />
        </Col>
        <Col span={18}>
          <Row>
            <Col span={16}>
              <header>
                <h1>
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
            <Col span={8}>
              <header>
                <h1>Cài đặt hệ thống</h1>
              </header>
            </Col>
          </Row>
          <Row>
            <Col span={7}>
              <h1 style={{ color: "orange" }}>Danh sách vai trò</h1>
            </Col>
          </Row>
          <Content>
            <Row style={{ justifyContent: "center" }}>
              <Card>
                <div>
                  <Row>
                    <Col span={6}>
                      <h1 style={{ color: "orange" }}>Thông tin vai trò</h1>
                    </Col>
                    <Col span={9}></Col>
                    <Col span={9}></Col>
                  </Row>
                  <Row gutter={20}>
                    <Col span={12}>
                      <div>
                        <Row>
                          <Col span={4}>
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
                      </div>
                    </Col>
                    <Col span={10}>
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
              </Card>
            </Row>
            <Row>
              <Content
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <Button>
                  <Link to="/vaitro">Hủy bỏ</Link>
                </Button>
                <Button onClick={handleUpdate}>Cập nhật</Button>
              </Content>
            </Row>
          </Content>
        </Col>
      </Row>
    </div>
  );
};

export default UpdateVt;
