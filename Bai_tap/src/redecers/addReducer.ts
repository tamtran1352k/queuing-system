import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/fibase";

interface DataItem {
    ma: string;
    name: string;
    ip: string;
    dvsd: string[];
    tttb: string;
    ttkn: string;
    user: string;
    password: string;
    id: string;
}

export const addList = createAsyncThunk(
  "list/addList",
  async (data: DataItem) => {
    try {
      await addDoc(collection(db, "list"), data);
      return data;
    } catch (error) {
      throw error;
    }
  }
);


const listSlice = createSlice({
  name: "list",
  initialState: {
    dataList: [] as DataItem[],
    loading: true,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addList.fulfilled, (state, action) => {
        state.dataList.push(action.payload);
        state.loading = true;
        state.error = null;
      })
      .addCase(addList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error adding data";
      });
  },
});

export default listSlice.reducer;
