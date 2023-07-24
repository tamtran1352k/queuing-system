import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import {
  Avatar,
  Col,
  Row,
  Button,
  Form,
  message,
  Input,
  Layout,
  Dropdown,
  Card,
} from "antd";
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
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

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
interface DataType {
  key: React.Key;
  email: string;
  timestamp: string;
  action: string;
}

const NotificationCard: React.FC<{ data: DataType[] }> = ({ data }) => (
  <Card
    title="Thông báo"
    bordered={false}
    style={{ width: 300, height: 300, overflow: "auto" }}
  >
    {data.map((item) => (
      <div key={item.key}>
        <p style={{ color: "#BF5805", fontWeight: "bold" }}>
          Email: {item.email}
        </p>
        <p>Action: {item.action}</p>
        <hr />
      </div>
    ))}
    <div></div>
  </Card>
);

const Test: React.FC = () => {
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [dataList, setDataList] = useState<DataItem[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);

  const [data, setData] = useState<DataType[]>([]);
  const [showCard, setShowCard] = useState(false);
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
    // Lấy dữ liệu từ Firestore và cập nhật biến data
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "userLogs"));
        const newData = querySnapshot.docs.map((doc) => ({
          key: doc.id,
          ...doc.data(),
        })) as DataType[];
        setData(newData);
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
    };

    fetchData();
  }, [user]); // Fetch lại dữ liệu mỗi khi user thay đổi
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
  const handleButtonClick = () => {
    setShowCard(!showCard); // Toggle the Card visibility when the button is clicked
  };
  const menu = <NotificationCard data={data} />;

  return (
    <>
      <Layout>
        <Header style={{ backgroundColor: "#f5f5f5" }}>
          <Row>
            <Col span={8}>
              <Dropdown overlay={menu} trigger={["click"]} visible={showCard}>
                <Button
                  icon={
                    <BellOutlined
                      style={{ fontSize: "24px", color: "white" }}
                    />
                  }
                  style={{
                    backgroundColor: "orange",
                    border: "none",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "50px",
                    height: "50px",
                  }}
                  type="primary"
                  onClick={handleButtonClick}
                ></Button>
              </Dropdown>
            </Col>
            <Col span={8}>
              <Avatar
                style={{ width: "50px", height: "50px" }}
                size={128}
                icon={<UserOutlined />}
                src={avatarImage || url}
              />
            </Col>
            <Col span={8}>
              <Form layout="vertical">
                <Form.Item>
                  <label htmlFor="">
                    Xin chào <br />
                  </label>
                  {dataList
                    .filter(
                      (data: DataItem) => userProfile?.email === data.email
                    )
                    .map((data: DataItem) => (
                      <b key={data.id} style={{ whiteSpace: "nowrap" }}>
                        <b style={{ right: 100 }}>
                          <b>{data.name ?? ""}</b>
                        </b>
                      </b>
                    ))}
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Header>
      </Layout>
    </>
  );
};
export default Test;
