import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import {
  Avatar,
  Col,
  Image,
  Menu,
  Row,
  Button,
  Upload,
  Form,
  Select,
} from "antd";
import Sider from "antd/es/layout/Sider";
import { UploadOutlined } from "@ant-design/icons";
import {
  AppstoreOutlined,
  VideoCameraOutlined,
  UserOutlined,
} from "@ant-design/icons";
import img from "../img/1.png";
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase/fibase";
import { Option } from "antd/es/mentions";
import Input from "antd/es/input/Input";
import { logout } from "../redecers/authReducer";
import { useDispatch } from "react-redux";
import MenuLayout from "./Menu";

const auth = getAuth();
const firestore = getFirestore(); // Obtain the Firestore instance

const ProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [dataList, setDataList] = useState<DataItem[]>([]);

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
  interface DataItem {
    id: string;
    name: string;
    imageUrl: string;
    password: string;
    phone: string;
    role: string;
    username: string;
  }
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

  const handleSubmit = (): void => {
    if (image && userProfile?.uid) {
      const imageName = `images/${userProfile.uid}/${image.name}`;
      const imageRef = ref(storage, imageName);

      uploadBytes(imageRef, image)
        .then(() => {
          return getDownloadURL(imageRef);
        })
        .then((downloadUrl: string) => {
          setUrl(downloadUrl);

          // Save the downloadUrl to Firestore
          const imageDocRef = doc(firestore, "user", userProfile.uid);
          setDoc(imageDocRef, { imageUrl: downloadUrl }, { merge: true }) // merge: true allows you to update the document instead of overwriting
            .catch((error: any) => {
              console.log("Error uploading image URL to Firestore:", error);
            });
        })
        .catch((error: any) => {
          console.log("Error getting the image URL:", error.message);
        });

      setImage(null);
    }
  };

  if (!userProfile) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div>
      <Row>
        <Col span={4}>
          <MenuLayout />
        </Col>
        <Col span={20}>
          <Row>
            <Col span={8}>
              <h1>Thông tin hồ sơ người dùng</h1>
            </Col>
            <Col span={16}>
              <div>
                {dataList.map((data, index) => (
                  <Row key={index}>
                    <Avatar src={data.imageUrl} size={50} />
                  </Row>
                ))}
                <p>Xin chào </p>
              </div>
            </Col>
          </Row>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={8}>
                <p>Tên người dùng: {userProfile.displayName}</p>
                <p>Email: {userProfile.email}</p>
                {dataList.map((data, index) => (
                  <Row key={index}>
                    <Avatar src={data.imageUrl} size={50} />
                  </Row>
                ))}
                <input type="file" onChange={handleImageChange} />

                <Button onClick={handleSubmit}>Submit</Button>
              </Col>
              <Col span={8}>
                <Form.Item label="Tên người dùng">
                  {dataList.map((data, index) => (
                    <Row key={index}>
                      <Input value={data.name ?? ""} disabled />
                    </Row>
                  ))}
                </Form.Item>

                <Form.Item label="Số điện thoại">
                  {dataList.map((data, index) => (
                    <Row key={index}>
                      <Input value={data.phone ?? ""} disabled />
                    </Row>
                  ))}
                </Form.Item>
                <Form.Item label="email">
                  <Input value={userProfile.email ?? ""} disabled />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="Tên đăng nhập">
                  {dataList.map((data, index) => (
                    <Row key={index}>
                      <Input value={data.username ?? ""} disabled />
                    </Row>
                  ))}{" "}
                </Form.Item>

                <Form.Item label="Mật khẩu">
                  {dataList.map((data, index) => (
                    <Row key={index}>
                      <Input value={data.password ?? ""} disabled />
                    </Row>
                  ))}
                </Form.Item>
                <Form.Item label="Vai trò">
                  {dataList.map((data, index) => (
                    <Row key={index}>
                      <Input value={data.role ?? ""} disabled />
                    </Row>
                  ))}{" "}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;
