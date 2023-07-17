import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { Avatar, Col, Row, Button, Form } from "antd";
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
import { db, storage } from "../firebase/fibase";
import { useDispatch } from "react-redux";
import { logout } from "../redecers/authReducer";
import MenuLayout from "./Menu";
import { CameraOutlined } from "@ant-design/icons";
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
        const docRef = doc(collection(db, "user"), userProfile?.uid!);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          const docData = docSnapshot.data() as DataItem;
          const userData: User = {
            ...userProfile!,
            displayName: docData.name,
            phoneNumber: docData.phone,
            emailVerified: userProfile?.emailVerified || false,
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
          setAvatarImage(downloadUrl); // set the avatarImage state with the uploaded image URL
          const imageDocRef = doc(firestore, "user", userProfile.uid);
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
  return (
    <div>
      <Row>
        <Col span={4}>
          <MenuLayout />
        </Col>
        <Col span={20}>
          <Row justify="center" align="middle">
            <Col span={12}>
              <h1>Profile Page</h1>
              <Form>
                <Form.Item>
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
                      top: "45px",
                      right: "30px",
                      backgroundColor: "orange",
                    }}
                    type="primary"
                    icon={<CameraOutlined />}
                    onClick={handleSubmit}
                  ></Button>
                  <input
                    type="file"
                    id="customImageUpload"
                    accept=".jpg,.jpeg,.png"
                    style={{ display: "none" }}
                    onChange={(e) => handleImageChange(e)}
                  />
                </Form.Item>
                <Form.Item label="Name">
                  <p>{userProfile?.displayName}</p>
                </Form.Item>
                <Form.Item label="Email">
                  <p>{userProfile?.email}</p>
                </Form.Item>
                <Form.Item label="Phone">
                  <p>{userProfile?.phoneNumber}</p>
                </Form.Item>
                {dataList
                  .filter((data: DataItem) => userProfile?.email === data.email)
                  .map((data: DataItem) => (
                    <h4 key={data.id}>
                      {data.username} {data.role} {data.phone} {data.email}
                    </h4>
                  ))}
              </Form>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;
