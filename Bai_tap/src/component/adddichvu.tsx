import { Button, Checkbox, Col, Form, Row } from "antd";
import Input from "antd/es/input/Input";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/fibase";
import { useState } from "react";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import MenuLayout from "./Menu";
import TextArea from "antd/es/input/TextArea";
import { Link, useNavigate } from "react-router-dom";

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
 const navigate=useNavigate();
  const handleSubmit = async () => {
    const data: DataType = {
      madv,
      motadv,
      namedv,
      prefix,
      sott,
      surfix,
      tthddv,
      stt,
    };
    try {
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
          setPrefix(randomNumber );

          setStt(madv + "" + randomNumber);

          //   console.log(setTthddv);
        }
        if (value === "surfix") {
          const randomNumber = generateRandomNumber();
          //    console.log(randomNumber);
          setPrefix(randomNumber+"" );

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

  return (
    <div>
      <Row>
        <Col span={4}>
          <MenuLayout />
        </Col>
        <Col span={19}>
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
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
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
    </div>
  );
};

export default AddDichvu;
