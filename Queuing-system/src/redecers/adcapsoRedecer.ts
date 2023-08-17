import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/fibase";


interface DataItem {
  namekh: string;
  namedv: string;
  nguoncap: string;
  stt: string;
  tgc: string;
  tthai: string;
  hsd: string;
}

export const addcsList = createAsyncThunk(
  "dscs/addList",
  async (data: DataItem) => {
    try {
      await addDoc(collection(db, "dscs"), data);
      return data;
    } catch (error) {
      throw error;
    }
  }
);


const AddcsSlice = createSlice({
  name: "dscs",
  initialState: {
    dataList: [] as DataItem[],
    loading: true,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addcsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addcsList.fulfilled, (state, action) => {
        state.dataList.push(action.payload);
        state.loading = true;
        state.error = null;
      })
      .addCase(addcsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error adding data";
      });
  },
});
export const addCsItem = (data: DataItem): PayloadAction<DataItem> => ({
  type: "dscs/addList",
  payload: data,
});

export const incrementLatestNumber = (): PayloadAction<void> => ({
  type: "dscs/incrementLatestNumber",
  payload: undefined,
});

export default AddcsSlice.reducer;
