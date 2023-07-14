import React, { useState } from "react";
import { Layout, Row, Col, Card, Input, Checkbox, Button } from "antd";
import MenuLayout from "./Menu";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addVt } from "../redecers/addvtRedecer";
import { CheckboxChangeEvent } from "antd/es/checkbox";

const { Content } = Layout;

interface Vaitro {
  namevt: string;
  mota: string;
  sond: number;
  cna: string[];
  cnb: string[];
}

const AddVt: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [vaitro, setVaitro] = useState<Vaitro>({
    namevt: "",
    mota: "",
    sond: 0,
    cna: [],
    cnb: [],
  });

  const handleFormSubmit = () => {
    const data: Vaitro = {
      namevt: vaitro.namevt,
      mota: vaitro.mota,
      sond: vaitro.sond,
      cna: vaitro.cna,
      cnb: vaitro.cnb,
    };
    dispatch(addVt(data) as any);
    navigate("/vaitro");
  };

  const handleCnaAllChange = (e: CheckboxChangeEvent) => {
    const checked = e.target.checked;
    setVaitro((prevData) => ({
      ...prevData,
      cna: checked ? ["Chức năng x", "Chức năng y", "Chức năng z"] : [],
    }));
  };

  const handleCnaChange = (value: string, checked: boolean) => {
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
  };

  const handleCnbAllChange = (e: CheckboxChangeEvent) => {
    const checked = e.target.checked;
    setVaitro((prevData) => ({
      ...prevData,
      cnb: checked ? ["Chức năng x", "Chức năng y", "Chức năng z"] : [],
    }));
  };

  const handleCnbChange = (value: string, checked: boolean) => {
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

          <Content>
            <Row>
              <Col span={7}>
                <h1 style={{ color: "orange" }}>Danh sách vai trò</h1>
              </Col>
            </Row>
            <Row style={{ justifyContent: "center" }}>
              <Card>
                <div>
                  <Row>
                    <Col span={6}>
                      <h1 style={{ color: "orange" }}>Thông tin vai trò</h1>
                    </Col>
                    <Col span={18}></Col>
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
                          id="description"
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
                          <div style={{ textAlign: "start" }}>
                          <h1 style={{ color: "orange" }}>Nhóm chức năng A</h1>

                            <div>
                              <Checkbox
                                value={[
                                  "Chức năng x",
                                  "Chức năng y",
                                  "Chức năng z",
                                ]}
                                checked={vaitro.cna.length === 3}
                                onChange={handleCnaAllChange}
                                style={{ marginRight: "13%" }}
                              >
                                Tất cả
                              </Checkbox>
                            </div>
                            <div>
                              <Checkbox
                                value="Chức năng x"
                                checked={vaitro.cna.includes("Chức năng x")}
                                onChange={(e) =>
                                  handleCnaChange(
                                    "Chức năng x",
                                    e.target.checked
                                  )
                                }
                              >
                                Chức năng x
                              </Checkbox>
                            </div>
                            <div>
                              <Checkbox
                                value="Chức năng y"
                                checked={vaitro.cna.includes("Chức năng y")}
                                onChange={(e) =>
                                  handleCnaChange(
                                    "Chức năng y",
                                    e.target.checked
                                  )
                                }
                              >
                                Chức năng y
                              </Checkbox>
                            </div>
                            <div>
                              <Checkbox
                                value="Chức năng z"
                                checked={vaitro.cna.includes("Chức năng z")}
                                onChange={(e) =>
                                  handleCnaChange(
                                    "Chức năng z",
                                    e.target.checked
                                  )
                                }
                              >
                                Chức năng z
                              </Checkbox>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div style={{ textAlign: "start" }}>
                          <h1 style={{ color: "orange" }}>Nhóm chức năng B</h1>

                            <div>
                              <Checkbox
                                value={[
                                  "Chức năng x",
                                  "Chức năng y",
                                  "Chức năng z",
                                ]}
                                checked={vaitro.cnb.length === 3}
                                onChange={handleCnbAllChange}
                                style={{ marginRight: "13%" }}
                              >
                                Tất cả
                              </Checkbox>
                            </div>
                            <div>
                              <Checkbox
                                value="Chức năng x"
                                checked={vaitro.cnb.includes("Chức năng x")}
                                onChange={(e) =>
                                  handleCnbChange(
                                    "Chức năng x",
                                    e.target.checked
                                  )
                                }
                              >
                                Chức năng x
                              </Checkbox>
                            </div>
                            <div>
                              <Checkbox
                                value="Chức năng y"
                                checked={vaitro.cnb.includes("Chức năng y")}
                                onChange={(e) =>
                                  handleCnbChange(
                                    "Chức năng y",
                                    e.target.checked
                                  )
                                }
                              >
                                Chức năng y
                              </Checkbox>
                            </div>
                            <div>
                              <Checkbox
                                value="Chức năng z"
                                checked={vaitro.cnb.includes("Chức năng z")}
                                onChange={(e) =>
                                  handleCnbChange(
                                    "Chức năng z",
                                    e.target.checked
                                  )
                                }
                              >
                                Chức năng z
                              </Checkbox>
                            </div>
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
                <Button onClick={handleFormSubmit}>Thêm</Button>
              </Content>
            </Row>
          </Content>
        </Col>
      </Row>
    </div>
  );
};

export default AddVt;
