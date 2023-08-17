import React, { useEffect, useState } from "react";
import img from "../img/1.png";

import {
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Button,
  theme,
  Image,
  Row,
  Col,
  Card,
  Form,
  Select,
  Input,
  Dropdown,
  Progress,
  DatePicker,
} from "antd";
import { Footer } from "antd/es/layout/layout";
import { Option } from "antd/es/mentions";
import MenuLayout from "../menu/Menu";
import { collection, getDocs } from "@firebase/firestore";
import { auth, db } from "../../firebase/fibase";
import { FormOutlined, DownOutlined, DesktopOutlined } from "@ant-design/icons";
import { Area } from "@ant-design/charts";
import Test from "../profile/test";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { User, onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";

const { Header, Sider, Content } = Layout;
interface DataType {
  stt: number;
  tgc: string;
  tthai: string;
}
interface DataTypedv {
  key: string;
  madv: string;
  motadv: string;
  namedv: string;
  prefix: string;
  sott: string;
  surfix: string;
  tthddv: string;
}
interface DataTypetb {
  key: string;
  ma: string;
  name: string;
  ip: string;
  tttb: string;
  ttkn: string;
  dvsd: string;
}

const ListT: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const gridStyle: React.CSSProperties = {
    width: "25%",
    textAlign: "center",
  };
  const [data, setData] = useState<DataType[]>([]);
  const [datatb, setDatatb] = useState<DataTypetb[]>([]);
  const [datadv, setDatadv] = useState<DataTypedv[]>([]);
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
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "list"));
        const newDatatb: DataTypetb[] = [];
        querySnapshot.forEach((doc) => {
          const docData = doc.data() as DataTypetb;
          newDatatb.push({
            key: docData.key,
            ma: docData.ma, // <-- Added a comma here
            name: docData.name,
            ip: docData.ip,
            tttb: docData.tttb,
            ttkn: docData.ttkn,
            dvsd: docData.dvsd,
          });
        });
        setDatatb(newDatatb);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "dichvu"));
        const newDatadv: DataTypedv[] = [];
        querySnapshot.forEach((doc) => {
          const docData = doc.data() as DataTypedv;
          newDatadv.push({
            key: docData.key,
            madv: docData.madv, // <-- Added a comma here
            motadv: docData.motadv,
            namedv: docData.namedv,
            prefix: docData.prefix,
            sott: docData.sott,
            surfix: docData.surfix,
            tthddv: docData.tthddv,
          });
        });
        setDatadv(newDatadv);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "dscs"));
        const newData: DataType[] = [];
        querySnapshot.forEach((doc) => {
          const docData = doc.data() as DataType;
          newData.push({
            stt: docData.stt,
            tgc: docData.tgc,
            tthai: docData.tthai,
          });
        });
        setData(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const [viewMode, setViewMode] = useState<string>("tgc");

  const transformData = (mode: string): DataType[] => {
    switch (mode) {
      case "tgc":
        const dailySttMap: { [day: string]: number } = {};

        data.forEach((item) => {
          const day = item.tgc;
          if (!dailySttMap[day]) {
            dailySttMap[day] = item.stt;
          } else {
            dailySttMap[day] += item.stt;
          }
        });

        const transformedData: DataType[] = [];
        for (const day in dailySttMap) {
          if (dailySttMap.hasOwnProperty(day)) {
            transformedData.push({
              tgc: day,
              stt: dailySttMap[day],
              tthai: "Ngày",
            });
          }
        }

        return transformedData;
      case "week":
        const weeklyData: DataType[] = [];
        let weeklySales = 0;

        data.forEach((item) => {
          weeklySales += item.stt;
          weeklyData.push({
            tgc: item.tgc,
            stt: item.stt,
            tthai: item.tthai,
          });
        });

        weeklyData.push({
          tgc: "Tổng Tuần",
          stt: weeklySales,
          tthai: "Tổng Tuần",
        });

        return weeklyData;
      case "month":
        const monthlyData: DataType[] = [];
        const monthlySalesMap: { [month: string]: number } = {};

        data.forEach((item) => {
          const month = item.tgc.substring(0, 7);

          if (!monthlySalesMap[month]) {
            monthlySalesMap[month] = item.stt;
          } else {
            monthlySalesMap[month] += item.stt;
          }
        });

        for (const month in monthlySalesMap) {
          if (monthlySalesMap.hasOwnProperty(month)) {
            monthlyData.push({
              tgc: month,
              stt: monthlySalesMap[month],
              tthai: "Tháng",
            });
          }
        }

        monthlyData.push({
          tgc: "Tổng Tháng",
          stt: monthlyData.reduce((sum, item) => sum + item.stt, 0),
          tthai: "Tổng Tháng",
        });

        return monthlyData;
      default:
        return data;
    }
  };

  const tableData: DataType[] = transformData(viewMode).map((item) => ({
    tgc: item.tgc,
    stt: item.stt,
    tthai: item.tthai,
  }));

  // Calculate the total status items for each day
  const calculateTotalStatusItemsForDay = (
    status: string,
    day: string
  ): number => {
    const totalStatusItems = data.filter(
      (item) => item.tthai === status && item.tgc === day
    ).length;
    return totalStatusItems;
  };

  // Function to compute the total number of items and stt for each status in a day

  // Calculate the order status percentage
  const calculateOrderStatusPercentage = (status: string): number => {
    const totalOrders = data.length;
    const statusOrders = data.filter((item) => item.tthai === status).length;
    return (statusOrders / totalOrders) * 100;
  };

  const x: string[] = data.map((item) => item.tgc); // Array of all the days in data

  // Array of total stt for each day
  const y: number[] = data.map((item) =>
    data
      .filter((dataItem) => dataItem.tgc === item.tgc)
      .reduce((totalStt, dataItem) => totalStt + dataItem.stt, 0)
  );

  const chartData = x.map((day, index) => ({
    tgc: day,
    stt: y[index], // Using the total stt for each day as the y-value
  }));

  const config = {
    data: chartData,
    xField: "tgc",
    yField: "stt",
    height: 400,
    xAxis: {
      tickCount: x.length,
      startOnZero: false,
      tickValues: x,
    },
    yAxis: {
      tickCount: y.length,
      tickValues: y,
    },
    areaStyle: { fill: "#8884d8" },
    point: { size: 5, shape: "diamond" },
    line: {
      size: 2,
      smooth: true,
    },
    options: {
      elements: {
        line: {
          tension: 0.4, // Adjust the tension of the line
        },
      },
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10,
        },
      },
    },
  };

  const handleMenuClick = (e: any) => {
    setViewMode(e.key);
  };

  const menu = (
    <Menu onClick={handleMenuClick} selectedKeys={[viewMode]}>
      <Menu.Item key="tgc">Ngày</Menu.Item>
      <Menu.Item key="week">Tuần</Menu.Item>
      <Menu.Item key="month">Tháng</Menu.Item>
    </Menu>
  );
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
        <Row>
          <Col span={14}>
            <Row>
              <Col span={24}>
                <b
                  style={{
                    color: "orange",
                    fontSize: "22px",
                    marginRight: "76%",
                  }}
                >
                  Dashboard{" "}
                </b>
              </Col>
              <Col span={24}>
                <b
                  style={{
                    color: "orange",
                    fontSize: "22px",
                    marginRight: "70%",
                  }}
                >
                  Biểu đồ cấp số{" "}
                </b>
              </Col>
            </Row>

            <Row gutter={16} style={{ marginLeft: "20px" }}>
              <Col span={6}>
                <Card>
                  <h1>
                    <Button
                      icon={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <g clip-path="url(#clip0_81997_5595)">
                            <path
                              d="M5.25 0C5.44891 0 5.63968 0.0790176 5.78033 0.21967C5.92098 0.360322 6 0.551088 6 0.75V1.5H18V0.75C18 0.551088 18.079 0.360322 18.2197 0.21967C18.3603 0.0790176 18.5511 0 18.75 0C18.9489 0 19.1397 0.0790176 19.2803 0.21967C19.421 0.360322 19.5 0.551088 19.5 0.75V1.5H21C21.7956 1.5 22.5587 1.81607 23.1213 2.37868C23.6839 2.94129 24 3.70435 24 4.5V21C24 21.7956 23.6839 22.5587 23.1213 23.1213C22.5587 23.6839 21.7956 24 21 24H3C2.20435 24 1.44129 23.6839 0.87868 23.1213C0.316071 22.5587 0 21.7956 0 21V4.5C0 3.70435 0.316071 2.94129 0.87868 2.37868C1.44129 1.81607 2.20435 1.5 3 1.5H4.5V0.75C4.5 0.551088 4.57902 0.360322 4.71967 0.21967C4.86032 0.0790176 5.05109 0 5.25 0V0ZM1.5 6V21C1.5 21.3978 1.65804 21.7794 1.93934 22.0607C2.22064 22.342 2.60218 22.5 3 22.5H21C21.3978 22.5 21.7794 22.342 22.0607 22.0607C22.342 21.7794 22.5 21.3978 22.5 21V6H1.5Z"
                              fill="#6493F9"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_81997_5595">
                              <rect width="24" height="24" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      }
                      style={{
                        backgroundColor: "#87CEFA",
                        border: "none",
                        borderRadius: "50%",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "30px",
                        height: "30px",
                      }}
                    />{" "}
                    Số thứ tự đã cấp
                  </h1>
                  <Row>
                    <Col span={12}>
                      <h1>{data.length}</h1>
                    </Col>
                    <Col span={12}>
                      {" "}
                      <h1
                        style={{ background: "#FFAC6A", borderRadius: "20%" }}
                      >
                        {calculateOrderStatusPercentage("Đã sử dụng").toFixed(
                          2
                        )}
                        %
                      </h1>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <h1>
                    <Button
                      icon={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-calendar-check"
                          viewBox="0 0 16 16"
                        >
                          <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                          <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                        </svg>
                      }
                      style={{
                        backgroundColor: "#35C75A",
                        border: "none",
                        borderRadius: "50%",

                        alignItems: "center",
                        justifyContent: "center",
                        width: "30px",
                        height: "30px",
                      }}
                    />{" "}
                    Số thứ đã sử dụng
                  </h1>
                  <Row>
                    <Col span={12}>
                      <h1>
                        {" "}
                        {
                          data.filter((item) => item.tthai === "Đã sử dụng")
                            .length
                        }
                      </h1>
                    </Col>
                    <Col span={12}>
                      {" "}
                      <h1
                        style={{ background: "#FFF2E7", borderRadius: "20%" }}
                      >
                        {calculateOrderStatusPercentage("Đã sử dụng").toFixed(
                          2
                        )}
                        %
                      </h1>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <h1>
                    <Button
                      icon={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="25"
                          height="24"
                          viewBox="0 0 25 24"
                          fill="none"
                        >
                          <path
                            d="M19.2506 8.9625L20.1551 8.058C20.2769 7.93778 20.4309 7.85549 20.5985 7.82114C20.7662 7.78679 20.9401 7.80185 21.0994 7.8645L22.2019 8.304C22.3629 8.36959 22.5008 8.48137 22.5984 8.62525C22.696 8.76913 22.7488 8.93867 22.7501 9.1125V11.1315C22.7481 11.3637 22.654 11.5856 22.4885 11.7485C22.323 11.9113 22.0996 12.0018 21.8674 12L21.8299 11.9985C14.1079 11.5185 12.5501 4.977 12.2554 2.4735C12.2426 2.35915 12.2526 2.24341 12.2846 2.1329C12.3166 2.02239 12.3701 1.91927 12.442 1.82942C12.5138 1.73958 12.6027 1.66477 12.7035 1.60928C12.8043 1.55379 12.915 1.51869 13.0294 1.506C13.0632 1.50199 13.0973 1.49998 13.1314 1.5H15.0814C15.2553 1.50063 15.425 1.55323 15.5688 1.65106C15.7126 1.74888 15.8239 1.88746 15.8884 2.049L16.3286 3.1515C16.3934 3.31023 16.4099 3.48452 16.3761 3.65259C16.3424 3.82066 16.2599 3.97506 16.1389 4.0965L15.2344 5.001C15.2344 5.001 15.7549 8.526 19.2506 8.9625Z"
                            fill="#FFAC6A"
                          />
                          <path
                            d="M12.25 22.5H10.75V18.75C10.7494 18.1534 10.5122 17.5815 10.0903 17.1597C9.6685 16.7378 9.09655 16.5006 8.5 16.5H5.5C4.90345 16.5006 4.3315 16.7378 3.90967 17.1597C3.48784 17.5815 3.2506 18.1534 3.25 18.75V22.5H1.75V18.75C1.75119 17.7558 2.14666 16.8027 2.84966 16.0997C3.55267 15.3967 4.5058 15.0012 5.5 15H8.5C9.4942 15.0012 10.4473 15.3967 11.1503 16.0997C11.8533 16.8027 12.2488 17.7558 12.25 18.75V22.5Z"
                            fill="#FFAC6A"
                          />
                          <path
                            d="M7 7.5C7.44501 7.5 7.88002 7.63196 8.25004 7.87919C8.62005 8.12643 8.90843 8.47783 9.07873 8.88896C9.24903 9.3001 9.29359 9.7525 9.20677 10.189C9.11995 10.6254 8.90566 11.0263 8.59099 11.341C8.27632 11.6557 7.87541 11.87 7.43896 11.9568C7.0025 12.0436 6.5501 11.999 6.13896 11.8287C5.72783 11.6584 5.37643 11.37 5.1292 11C4.88196 10.63 4.75 10.195 4.75 9.75C4.75 9.15326 4.98705 8.58097 5.40901 8.15901C5.83097 7.73705 6.40326 7.5 7 7.5ZM7 6C6.25832 6 5.5333 6.21993 4.91661 6.63199C4.29993 7.04404 3.81928 7.62971 3.53545 8.31494C3.25162 9.00016 3.17736 9.75416 3.32206 10.4816C3.46675 11.209 3.8239 11.8772 4.34835 12.4017C4.8728 12.9261 5.54098 13.2833 6.26841 13.4279C6.99584 13.5726 7.74984 13.4984 8.43506 13.2145C9.12029 12.9307 9.70596 12.4501 10.118 11.8334C10.5301 11.2167 10.75 10.4917 10.75 9.75C10.75 9.25754 10.653 8.76991 10.4646 8.31494C10.2761 7.85997 9.99987 7.44657 9.65165 7.09835C9.30343 6.75013 8.89004 6.47391 8.43506 6.28545C7.98009 6.097 7.49246 6 7 6Z"
                            fill="#FFAC6A"
                          />
                        </svg>
                      }
                      style={{
                        backgroundColor: "#E73F3F26",
                        border: "none",
                        borderRadius: "50%",

                        alignItems: "center",
                        justifyContent: "center",
                        width: "30px",
                        height: "30px",
                      }}
                    />{" "}
                    Số thứ đang chờ
                  </h1>
                  <Row>
                    <Col span={12}>
                      <h1>
                        {" "}
                        {
                          data.filter((item) => item.tthai === "Đang chờ")
                            .length
                        }
                      </h1>
                    </Col>
                    <Col span={12}>
                      {" "}
                      <h1
                        style={{ background: "#FFAC6A", borderRadius: "20%" }}
                      >
                        {calculateOrderStatusPercentage("Đang chờ").toFixed(2)}%
                      </h1>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <h1>
                    <Button
                      icon={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-bookmark-star"
                          viewBox="0 0 16 16"
                        >
                          <path d="M7.84 4.1a.178.178 0 0 1 .32 0l.634 1.285a.178.178 0 0 0 .134.098l1.42.206c.145.021.204.2.098.303L9.42 6.993a.178.178 0 0 0-.051.158l.242 1.414a.178.178 0 0 1-.258.187l-1.27-.668a.178.178 0 0 0-.165 0l-1.27.668a.178.178 0 0 1-.257-.187l.242-1.414a.178.178 0 0 0-.05-.158l-1.03-1.001a.178.178 0 0 1 .098-.303l1.42-.206a.178.178 0 0 0 .134-.098L7.84 4.1z" />
                          <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z" />
                        </svg>
                      }
                      style={{
                        backgroundColor: "#F86D6D",
                        border: "none",
                        borderRadius: "50%",

                        alignItems: "center",
                        justifyContent: "center",
                        width: "30px",
                        height: "30px",
                      }}
                    />{" "}
                    Số thứ đã bỏ qua
                  </h1>
                  <Row>
                    <Col span={12}>
                      <h1>
                        {" "}
                        {data.filter((item) => item.tthai === "Bỏ qua").length}
                      </h1>
                    </Col>
                    <Col span={12}>
                      {" "}
                      <h1
                        style={{ background: "#E73F3F26", borderRadius: "20%" }}
                      >
                        {calculateOrderStatusPercentage("Bỏ qua").toFixed(2)}%
                      </h1>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
            <br />
            <Content
              style={{
                background: "white",
                marginLeft: "28px",
                bottom: "10px",
                borderRadius: "2%",
                width: "715px",
              }}
            >
              <Row>
                <Col span={12} style={{ textAlign: "left" }}>
                  <h1>Bảng thống kê theo ngày</h1>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  <h1>
                    Xem theo ngày{" "}
                    <Dropdown overlay={menu} trigger={["click"]}>
                      <Button>
                        {viewMode === "tgc"
                          ? "Ngày"
                          : viewMode === "week"
                          ? "Tuần"
                          : "Tháng"}{" "}
                        <DownOutlined style={{ color: "orange" }} />
                      </Button>
                    </Dropdown>{" "}
                  </h1>
                </Col>
              </Row>
              <div className="area-chart-container">
                <Area {...config} style={{ width: "760px" }} />
              </div>
            </Content>
          </Col>

          <Content>
            <Row>
              <Col span={12}>
                <Test />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <b
                  style={{
                    color: "orange",
                    marginBottom: "5px",
                    marginRight: "30%",
                    fontSize: 20,
                  }}
                >
                  Tổng quan
                </b>{" "}
              </Col>
            </Row>
            <Col span={6} style={{ left: "20px" }}>
              <Col span={24} style={{ marginBottom: "4px" }}>
                <Card bordered={false} style={{ width: "350px" }}>
                  <Row>
                    <Col span={5}>
                      <Progress
                        type="circle"
                        percent={(datatb.length * 100) / 100}
                        format={() => `${datatb.length}%`}
                        strokeColor={{ "100%": "#FFA500" }}
                        size={50}
                      />
                    </Col>

                    <Col span={7}>
                      <b> {datatb.length}</b>
                      <a style={{ marginLeft: 5, color: "#FF7506" }}>
                        <h1>
                          {" "}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <path
                              d="M3.75663 1.16699H10.2375C12.3141 1.16699 12.8333 1.68616 12.8333 3.75699V7.44949C12.8333 9.52616 12.3141 10.0395 10.2433 10.0395H3.75663C1.68579 10.0453 1.16663 9.52616 1.16663 7.45533V3.75699C1.16663 1.68616 1.68579 1.16699 3.75663 1.16699Z"
                              stroke="#FF7506"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M7 10.0449V12.8333"
                              stroke="#FF7506"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M1.16663 7.58301H12.8333"
                              stroke="#FF7506"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M4.375 12.833H9.625"
                              stroke="#FF7506"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                          Thiết bị{" "}
                        </h1>
                      </a>
                    </Col>
                    <Col
                      span={11}
                      style={{ textAlign: "left", marginLeft: "4px" }}
                    >
                      <div>
                        <div>
                          <span
                            style={{
                              borderRadius: "50%",
                              background: "orange",
                              width: "10px", // Optional: Set the width of the dot
                              height: "10px", // Optional: Set the height of the dot
                              display: "inline-block", // Optional: Make the dot appear as an inline element
                            }}
                          ></span>
                          <a style={{ color: "black" }}>
                            Đang hoạt động &ensp;&ensp;
                            <b style={{ color: "orange" }}>
                              {
                                datatb.filter(
                                  (item) => item.tttb === "Đang hoạt động"
                                ).length
                              }
                            </b>
                          </a>
                        </div>
                        <div>
                          <span
                            style={{
                              borderRadius: "50%",
                              background: "purple",
                              width: "10px", // Optional: Set the width of the dot
                              height: "10px", // Optional: Set the height of the dot
                              display: "inline-block", // Optional: Make the dot appear as an inline element
                            }}
                          ></span>
                          <a style={{ color: "black" }}>
                            <a style={{ color: "black" }}>
                              {" "}
                              Ngưng hoạt động{" "}
                              <b style={{ color: "orange" }}>
                                {
                                  datatb.filter(
                                    (item) => item.tttb === "Ngưng hoạt động"
                                  ).length
                                }
                              </b>
                            </a>
                          </a>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col span={24} style={{ marginBottom: "4px" }}>
                <Card bordered={false} style={{ width: "350px" }}>
                  <Row>
                    <Col span={5}>
                      <Progress
                        type="circle"
                        percent={(datadv.length * 100) / 100}
                        format={() => `${datadv.length}%`}
                        status="normal"
                        size={50}
                      />
                    </Col>

                    <Col span={7}>
                      <b> {datadv.length}</b>
                      <a style={{ marginLeft: 5, color: "#4277FF" }}>
                        <h1>
                          {" "}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="15"
                            viewBox="0 0 16 15"
                            fill="none"
                          >
                            <path
                              d="M14.7704 5.7304C14.7704 7.04284 14.0591 8.22267 12.9266 9.04368C12.8874 9.07098 12.8658 9.11778 12.8639 9.16459L12.8149 10.4419C12.809 10.6135 12.6189 10.713 12.4739 10.6213L11.3864 9.94074C11.3864 9.94074 11.3864 9.94074 11.3845 9.94074C11.3218 9.89978 11.2453 9.88808 11.1748 9.90954C10.5282 10.1104 9.82472 10.2216 9.08797 10.2216C9.07817 10.2216 9.06837 10.2216 9.05857 10.2216C9.07817 10.0928 9.08797 9.96219 9.08797 9.82958C9.08797 7.99841 7.2108 6.51436 4.89472 6.51436C4.41857 6.51436 3.96201 6.57676 3.53485 6.69182C3.44863 6.38175 3.40356 6.05802 3.40356 5.7265C3.40356 3.24398 5.94695 1.2334 9.08601 1.2334C12.227 1.2373 14.7704 3.24983 14.7704 5.7304Z"
                              stroke="#4277FF"
                              stroke-width="1.10526"
                              stroke-miterlimit="10"
                            />
                            <path
                              d="M3.53675 6.69531C1.88884 7.14189 0.703369 8.37828 0.703369 9.83308C0.703369 10.8003 1.22851 11.6721 2.06324 12.2785C2.09263 12.3 2.1083 12.3331 2.11026 12.3682L2.14553 13.3102C2.14945 13.4369 2.29053 13.5091 2.3983 13.4428L3.20168 12.9396C3.20756 12.9357 3.2154 12.9299 3.22128 12.926C3.25067 12.9026 3.28986 12.8948 3.32513 12.9065C3.81108 13.0625 4.34013 13.1483 4.89662 13.1483C7.04419 13.1483 8.81555 11.871 9.06048 10.2251"
                              stroke="#4277FF"
                              stroke-width="1.10526"
                              stroke-miterlimit="10"
                            />
                            <clipPath id="clip0_201_18603">
                              <rect width="14" height="14" fill="#4277FF" />
                            </clipPath>
                          </svg>
                          Dịch vụ{" "}
                        </h1>
                      </a>
                    </Col>
                    <Col
                      span={11}
                      style={{ textAlign: "left", marginLeft: "4px" }}
                    >
                      <div>
                        <div>
                          <span
                            style={{
                              borderRadius: "50%",
                              background: "#4277FF",
                              width: "10px", // Optional: Set the width of the dot
                              height: "10px", // Optional: Set the height of the dot
                              display: "inline-block", // Optional: Make the dot appear as an inline element
                            }}
                          ></span>
                          <a style={{ color: "black" }}>
                            Đang hoạt động &ensp;&ensp;
                            <b style={{ color: "orange" }}>
                              {
                                datadv.filter(
                                  (item) => item.tthddv === "Đang hoạt động"
                                ).length
                              }
                            </b>
                          </a>
                        </div>
                        <div>
                          <span
                            style={{
                              borderRadius: "50%",
                              background: "#7E7D88",
                              width: "10px", // Optional: Set the width of the dot
                              height: "10px", // Optional: Set the height of the dot
                              display: "inline-block", // Optional: Make the dot appear as an inline element
                            }}
                          ></span>
                          <a style={{ color: "black" }}>
                            <a style={{ color: "black" }}>
                              {" "}
                              Ngưng hoạt động{" "}
                              <b style={{ color: "orange" }}>
                                {
                                  datadv.filter(
                                    (item) => item.tthddv === "Ngưng hoạt động"
                                  ).length
                                }
                              </b>
                            </a>
                          </a>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col span={24}>
                <Card bordered={false} style={{ width: "350px" }}>
                  <Row>
                    <Col span={5}>
                      <Progress
                        type="circle"
                        percent={(data.length * 100) / 100}
                        format={() => `${data.length}%`}
                        strokeColor={{ "100%": "#00FF00" }}
                        size={50}
                      />
                    </Col>

                    <Col span={7}>
                      <b> {data.length}</b>
                      <a style={{ marginLeft: 5, color: "#35C75A" }}>
                        <h1>
                          {" "}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <g clip-path="url(#clip0_201_18603)">
                              <path
                                d="M1.16663 9.91699L6.99996 12.8337L12.8333 9.91699"
                                stroke="#35C75A"
                                stroke-width="1.16667"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M1.16663 7L6.99996 9.91667L12.8333 7"
                                stroke="#35C75A"
                                stroke-width="1.16667"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M6.99996 1.16699L1.16663 4.08366L6.99996 7.00033L12.8333 4.08366L6.99996 1.16699Z"
                                stroke="#35C75A"
                                stroke-width="1.16667"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_201_18603">
                                <rect width="14" height="14" fill="#35C75A" />
                              </clipPath>
                            </defs>
                          </svg>
                          Cấp số{" "}
                        </h1>
                      </a>
                    </Col>
                    <Col
                      span={11}
                      style={{ textAlign: "left", marginLeft: "4px" }}
                    >
                      <div>
                        <div>
                          <span
                            style={{
                              borderRadius: "50%",
                              background: "#35C75A",
                              width: "10px", // Optional: Set the width of the dot
                              height: "10px", // Optional: Set the height of the dot
                              display: "inline-block", // Optional: Make the dot appear as an inline element
                            }}
                          ></span>
                          <a style={{ color: "black" }}>
                            <a style={{ color: "black" }}>
                              {" "}
                              Đã sử dụng&ensp;&ensp;&ensp;&ensp;&ensp;
                              <b style={{ color: "orange" }}>
                                {
                                  data.filter(
                                    (item) => item.tthai === "Đã sử dụng"
                                  ).length
                                }
                              </b>
                            </a>
                          </a>
                        </div>
                        <div>
                          <span
                            style={{
                              borderRadius: "50%",
                              background: "#7E7D88",
                              width: "10px", // Optional: Set the width of the dot
                              height: "10px", // Optional: Set the height of the dot
                              display: "inline-block", // Optional: Make the dot appear as an inline element
                            }}
                          ></span>
                          <a style={{ color: "black" }}>
                            Đang chờ &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;
                            <b style={{ color: "orange" }}>
                              {
                                data.filter((item) => item.tthai === "Đang chờ")
                                  .length
                              }
                            </b>
                          </a>
                        </div>
                        <div>
                          <span
                            style={{
                              borderRadius: "50%",
                              background: "#F178B6",
                              width: "10px", // Optional: Set the width of the dot
                              height: "10px", // Optional: Set the height of the dot
                              display: "inline-block", // Optional: Make the dot appear as an inline element
                            }}
                          ></span>
                          <a style={{ color: "black" }}>
                            Bỏ qua &ensp;&ensp;
                            &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;
                            <b style={{ color: "orange" }}>
                              {
                                data.filter((item) => item.tthai === "Bỏ qua")
                                  .length
                              }
                            </b>
                          </a>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Content>
                <Col span={24} style={{ bottom: 43 }}>
                  <Col span={12}>
                    <DatePicker
                      className="hide-datepicker"
                      open
                      style={{
                        position: "absolute",
                        paddingTop: "5px",
                        left: -20,
                      }}
                    />
                  </Col>
                </Col>
              </Content>
            </Col>
          </Content>
        </Row>
      </Layout>
    </Layout>
  );
};

export default ListT;
