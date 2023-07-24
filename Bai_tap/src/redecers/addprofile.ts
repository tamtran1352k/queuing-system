import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/fibase";

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
  
export const addproList = createAsyncThunk(
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


const AddproSlice = createSlice({
  name: "list",
  initialState: {
    dataList: [] as DataItem[],
    loading: true,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addproList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addproList.fulfilled, (state, action) => {
        state.dataList.push(action.payload);
        state.loading = true;
        state.error = null;
      })
      .addCase(addproList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error adding data";
      });
  },
});

export default AddproSlice.reducer;
