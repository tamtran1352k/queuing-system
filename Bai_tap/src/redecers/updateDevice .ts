import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

interface DeviceData {
  ma: string;
  name: string;
  ip: string;
  tthd: string;
  ttkn: string;
  dvsd: [];
  user:string;
  password:string;
  loaitb:string;
}

interface UpdateDeviceData {
  deviceData: Partial<DeviceData>;
  key: string;
}

export const updateDevice = createAsyncThunk(
  "device/updateDevice",
  async (data: UpdateDeviceData) => {
    const { deviceData, key } = data;
    try {
      // Perform your update operation here (e.g., update the device data in Firestore)
      // Example:
      const firestore = getFirestore();
      await updateDoc(doc(firestore, "list", key), deviceData);
      return deviceData as DeviceData;
    } catch (error) {
      throw error;
    }
  }
);

const deviceSlice = createSlice({
  name: "device",
  initialState: {} as DeviceData,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateDevice.fulfilled, (state, action: PayloadAction<DeviceData>) => {
      return action.payload;
    });
  },
});

export default deviceSlice.reducer;
