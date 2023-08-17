import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DeviceState {
  // Define your device state here
  devices: DeviceData[];
}

interface DeviceData {
  ma: string;
  name: string;
  ip: string;
  user: string;
  password: string;
  tthd: string;
  ttkn: string;
  dvsd: string[];
  loaitb: string;
}

const initialState: DeviceState = {
  devices: [],
};

const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {
    updateDevice(state, action: PayloadAction<DeviceData>) {
      const updatedDevice = action.payload;
      const deviceIndex = state.devices.findIndex(
        (device) => device.ma === updatedDevice.ma
      );
      if (deviceIndex !== -1) {
        state.devices[deviceIndex] = updatedDevice;
      }
    },
  },
});

export const { updateDevice } = deviceSlice.actions;

export default deviceSlice.reducer;
