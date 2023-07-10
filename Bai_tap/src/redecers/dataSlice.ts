// dataSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/fibase";

// Async thunk to fetch data from Firebase
export const fetchData = createAsyncThunk("data/fetchData", async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "list"));
    const newData = querySnapshot.docs.map((doc) => {
      const docData = doc.data();
      return {
        key: doc.id,
        ma: docData.ma,
        dvsd: docData.dvsd,
        tthd: docData.tthd,
        ttkn: docData.ttkn,
        name: docData.name,
        loaitb:docData.loaitb,
        ip: docData.ip,
      };
    });
    return newData;
  } catch (error) {
    throw error;
  }
});

// Define the initial state
interface DataState {
  data: any[]; // Replace 'any' with the appropriate type for your data
  isLoading: boolean;
  error: string | null;
}

const initialState: DataState = {
  data: [],
  isLoading: false,
  error: null,
};

// Create the data slice
const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchData.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message ?? "Failed to fetch data.";
    });
  },
});

// Export the async thunk and the data reducer
export default dataSlice.reducer;
