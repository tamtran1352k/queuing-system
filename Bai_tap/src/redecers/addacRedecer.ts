import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/fibase";

interface DataItem {
  name: string;
  imageUrl: string;
  password: string;
  phone: string;
  role: string;
  username: string;
  email: string;
  tthd: string;
}

export const addacList = createAsyncThunk(
  "list/addList",
  async (data: DataItem) => {
    try {
      await addDoc(collection(db, "user"), data);
      return data;
    } catch (error) {
      throw error;
    }
  }
);


const AddacSlice = createSlice({
  name: "list",
  initialState: {
    dataList: [] as DataItem[],
    loading: true,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addacList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addacList.fulfilled, (state, action) => {
        state.dataList.push(action.payload);
        state.loading = true;
        state.error = null;
      })
      .addCase(addacList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error adding data";
      });
  },
});

export default AddacSlice.reducer;
