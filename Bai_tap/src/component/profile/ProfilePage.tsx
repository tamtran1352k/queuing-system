import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { Avatar, Col, Row, Button, Form, message, Input, Layout } from "antd";
import { UserOutlined } from "@ant-design/icons";
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  collection,
  getDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase/fibase";
import { useDispatch } from "react-redux";
import { logout } from "../../redecers/authReducer";
import MenuLayout from "../menu/Menu";
import { CameraOutlined, BellOutlined } from "@ant-design/icons";
import { addproList } from "../../redecers/addprofile";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import { Link } from "react-router-dom";

const auth = getAuth();
const firestore = getFirestore(); // Obtain the Firestore instance

interface DataItem {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  password: string;
  phone: string;
  role: string;
  username: string;
}

const ProfilePage: React.FC = () => {

  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [dataList, setDataList] = useState<DataItem[]>([]);
  
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

  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      await auth.signOut();
      dispatch(logout());
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  const handleUpload = async (file: File) => {
    const reader = new FileReader();

    reader.onload = async () => {
      if (reader.readyState === 2) {
        setAvatarImage(reader.result as string);

        try {
          // Upload the image to Firestore
          const imageDocRef = doc(firestore, "images", userProfile?.uid!);
          await setDoc(imageDocRef, {
            imageUrl: reader.result,
          });
        } catch (error) {
          console.log("Error uploading image:", error);
        }
      }
    };

    reader.readAsDataURL(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  useEffect(() => {
    fetchDataList();
  }, []);

  const fetchDataList = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "user"));
      const listData: DataItem[] = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as DataItem)
      );
      setDataList(listData);
    } catch (error) {
      console.error("Error retrieving data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(collection(db, "img"), userProfile?.uid!);

        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          const docData = docSnapshot.data() as DataItem;
          const userData: User = {
            ...userProfile!,
            displayName: docData.name,
            phoneNumber: docData.phone,
            emailVerified: userProfile?.emailVerified || false,
            photoURL: docData.imageUrl,
          };
          setUserProfile(userData);
          setAvatarImage(docData.imageUrl);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userProfile?.uid) {
      fetchData();
    }
  }, [userProfile?.uid]);

  const handleSubmit = (): void => {
    if (image && userProfile?.uid) {
      const imageName = `images/${userProfile.uid}/${image.name}`;
      const imageRef = ref(storage, imageName);
      uploadBytes(imageRef, image)
        .then(() => getDownloadURL(imageRef))
        .then((downloadUrl: string) => {
          setUrl(downloadUrl);
          console.log(downloadUrl);
          setAvatarImage(downloadUrl); // set the avatarImage state with the uploaded image URL
          const imageDocRef = doc(firestore, "img", userProfile.uid);
          setDoc(imageDocRef, { imageUrl: downloadUrl }, { merge: true }) // merge: true allows you to update the document instead of overwriting
            .catch((error: any) => {
              console.log("Error uploading image URL to Firestore:", error);
            });
        })
        .catch((error: any) => {
          console.log("Error getting downloadURL:", error);
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
    <>
      <Layout>
        <Sider>
          <MenuLayout />
        </Sider>
        <Layout>
          <Header style={{ backgroundColor: "#f5f5f5" }}>
            <Row>
              <Col span={6}>
                <h1
                  style={{
                    fontSize: "24px",
                    textAlign: "left",
                    color: "orange",
                  }}
                >
                  Thông tin cá nhân
                </h1>{" "}
              </Col>
              <Col span={18}>
                <Row style={{ marginTop: "1%" }}>
                  <Col span={8} style={{ left: 450 }}>
                    <Button
                      icon={<BellOutlined />}
                      style={{
                        borderRadius: "50%",
                        width: "50px",
                        height: "50px",
                        color: "orange",
                        backgroundColor: "#FFF2E7",
                      }}
                    ></Button>
                  </Col>
                  <Col span={8} style={{ left: 220 }}>
                    <Avatar
                      style={{ width: "50px", height: "50px" }}
                      size={128}
                      icon={<UserOutlined />}
                      src={avatarImage || url}
                    />
                  </Col>
                  <Col span={8}>
                    <Form layout="vertical" style={{ marginTop: "2%" }}>
                      <Form.Item>
                        <label htmlFor="">
                          Xin chào <br />
                        </label>
                        {dataList
                          .filter(
                            (data: DataItem) =>
                              userProfile?.email === data.email
                          )
                          .map((data: DataItem) => (
                            <b key={data.id}>
                              <b style={{ right: 100 }}>
                                <b>{data.name ?? ""}</b>
                              </b>
                            </b>
                          ))}
                      </Form.Item>
                    </Form>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Header>
          <Content
            style={{
              margin: "24px 16px 0",
            }}
          >
            <Content
              style={{
                backgroundColor: "white",
                textAlign: "center",
                height: "40vh",
              }}
            >
              <Row>
                <Form style={{ right: "30px", marginTop: "3%" }}>
                  <Row gutter={20}>
                    <Col span={6} style={{ textAlign: "left" }}>
                      <Form.Item style={{ textAlign: "center" }}>
                        <Avatar
                          size={128}
                          icon={<UserOutlined />}
                          src={avatarImage || url}
                          onClick={() => {
                            const fileInput =
                              document.getElementById("customImageUpload");
                            fileInput?.click();
                          }}
                        />

                        <Button
                          style={{
                            top: "52px",
                            right: "35px",

                            backgroundColor: "orange",
                          }}
                          type="primary"
                          icon={<CameraOutlined />}
                          onClick={handleSubmit}
                        ></Button>
                        {dataList
                          .filter(
                            (data: DataItem) =>
                              userProfile?.email === data.email
                          )
                          .map((data: DataItem) => (
                            <h1 key={data.id}>
                              <p>{data.name}</p>
                            </h1>
                          ))}
                        <input
                          type="file"
                          id="customImageUpload"
                          accept=".jpg,.jpeg,.png"
                          style={{ display: "none" }}
                          onChange={(e) => handleImageChange(e)}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8} style={{ textAlign: "left" }}>
                      {dataList
                        .filter(
                          (data: DataItem) => userProfile?.email === data.email
                        )
                        .map((data: DataItem) => (
                          <h4 key={data.id}>
                            <label>Tên người dùng:</label>
                            <Input value={data.name ?? ""} disabled />
                            <label>Số điện thoại:</label>
                            <Input value={data.phone ?? ""} disabled />
                            <label>Email: </label>
                            <Input value={userProfile?.email ?? ""} disabled />
                          </h4>
                        ))}
                    </Col>
                    <Col span={8} style={{ textAlign: "left" }}>
                      {dataList
                        .filter(
                          (data: DataItem) => userProfile?.email === data.email
                        )
                        .map((data: DataItem) => (
                          <h4 key={data.id}>
                            <label>Tên Đăng nhập: </label>
                            <Input value={data.username ?? ""} disabled />
                            <label>Mật khẩu:</label>
                            <Input value={data.password ?? ""} disabled />
                            <label>Vai trò: </label>
                            <Input value={data.role ?? ""} disabled />
                          </h4>
                        ))}
                    </Col>
                  </Row>
                </Form>
              </Row>
            </Content>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default ProfilePage;
