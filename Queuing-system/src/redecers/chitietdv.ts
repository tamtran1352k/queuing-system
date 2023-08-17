import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/fibase';
import { RootState } from '../store/store';

interface DetailData {
  key: string;
  madv: string;
  motadv: string;
  namedv: string;
  prefix: string;
  sott: string;
  surfix: string;
  tthddv: string;
}

interface DetailState {
  dichvu: DetailData | null;
  loading: boolean;
  error: string | null;
}

const initialState: DetailState = {
    dichvu: null,
  loading: false,
  error: null,
};

export const fetchDetailData = createAsyncThunk(
  'detail/fetchDetailData',
  async (id: string) => {
    const docRef = doc(db, 'dichvu', id);
    const docSnapshot = await getDoc(docRef);
    const docData = docSnapshot.data();
    if (docSnapshot.exists() && docData) {
      const detailData: DetailData = {
        key: docSnapshot.id,
        madv: docData.madv,
        motadv: docData.motadv,
        namedv: docData.namedv,
        prefix: docData.prefix,
        sott: docData.sott,
        surfix: docData.surfix,
        tthddv: docData.tthddv,
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
        state.dichvu = action.payload as DetailData;
      })
      .addCase(fetchDetailData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Error fetching data';
      });
  },
});

export default detailSlice.reducer;
