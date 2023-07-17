import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/fibase";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = await doc(collection(db, "dscs"), id);
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

    return () => {};
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return null; 
  }

  return (
    <div>
      <h1>Chi tiết cấp số {data.stt}</h1>
      <p>Tên khách hàng: {data.namekh}</p>
      <p>Tên dịch vụ: {data.namedv}</p>
      <p>Thời gian cấp: {data.tgc}</p>
      <p>Hạn sử dụng: {data.hsd}</p>
      <p>Trạng thái: {data.tthai}</p>
      <p>Nguồn cấp: {data.nguoncap}</p>
    </div>
  );
};

export default DetailsCs;
