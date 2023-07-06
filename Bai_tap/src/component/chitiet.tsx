import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchDetailData } from '../redecers/detailSlice';
import { useAppSelector } from '../hook/hook';
import { useAppDispatch } from '../store/store';
import MenuLayout from './Menu';


const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector((state) => state.detail);

  useEffect(() => {
    dispatch(fetchDetailData(id??''));
  }, [dispatch, id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Data not found.</div>;
  }

  return (
    <div>
        <MenuLayout/>
      <h2>Details</h2>
      <p>Mã thiết bị: {data.ma}</p>
      <p>Tên thiết bị: {data.name}</p>
      <p>Địa chỉ IP: {data.ip}</p>
      <p>Trạng thái hoạt động: {data.tthd}</p>
      <p>Trạng thái kết nối: {data.ttkn}</p>
      <p>Dịch vụ sử dụng: {data.dvsd}</p>
    </div>
  );
};

export default DetailPage;
