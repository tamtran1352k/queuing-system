import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/fibase';
import { RootState } from '../store/store';

interface DetailData {
  key: string;
  ma: string;
  name: string;
  ip: string;
  tthd: string;
  ttkn: string;
  dvsd: string[];
  loaitb: string;
  user: string;
  password: string;
}

interface DetailState {
  data: DetailData | null;
  loading: boolean;
  error: string | null;
}

const initialState: DetailState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchDetailData = createAsyncThunk(
  'detail/fetchDetailData',
  async (id: string) => {
    const docRef = doc(db, 'list', id);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      const docData = docSnapshot.data() as DetailData;
      const detailData: DetailData = {
        key: docSnapshot.id,
        ma: docData.ma,
        dvsd: docData.dvsd,
        tthd: docData.tthd,
        ttkn: docData.ttkn,
        name: docData.name,
        loaitb: docData.loaitb,
        user: docData.user,
        password: docData.password,
        ip: docData.ip,
      };
      return detailData;
    } else {
      throw new Error('Document not found');
    }
  }
);

const detailSlice = createSlice({
  name: 'detail',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDetailData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDetailData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDetailData.rejected, (state, action) => {
        state.loading = false;

        state.error = action.error.message ?? 'Error fetching data';
      });
  },
});

export default detailSlice.reducer;

