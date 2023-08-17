import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/fibase";

interface DataItem {
  namevt: string;
  mota: string;
  sond: number;
  cna: string[];
  cnb: string[];
}

export const addVt = createAsyncThunk(
  "vaitro/addVt",
  async (data: DataItem) => {
    try {
      await addDoc(collection(db, "vaitro"), data);
      return data;
    } catch (error) {
      throw error;
    }
  }
);

const AddvtSlice = createSlice({
  name: "list",
  initialState: {
    dataList: [] as DataItem[],
    loading: true,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addVt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addVt.fulfilled, (state, action) => {
        state.dataList.push(action.payload);
        state.loading = true;
        state.error = null;
      })
      .addCase(addVt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error adding data";
      });
  },
});

export default AddvtSlice.reducer;
