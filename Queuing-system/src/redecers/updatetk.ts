import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DeviceState {
  // Define your device state here
  devices: DeviceData[];
}

interface DeviceData {
    name: string;
    imageUrl: string;
    password: string;
    phone: string;
    role: string;
    username: string;
    email: string;
    tthd: string;
}

const initialState: DeviceState = {
  devices: [],
};

const updatetkSlice = createSlice({
  name: "device",
  initialState,
  reducers: {
    updatetkDevice(state, action: PayloadAction<DeviceData>) {
      const updatedDevice = action.payload;
      const deviceIndex = state.devices.findIndex(
        (device) => device.email === updatedDevice.email
      );
      if (deviceIndex !== -1) {
        state.devices[deviceIndex] = updatedDevice;
      }
    },
  },
});

export const { updatetkDevice } = updatetkSlice.actions;

export default updatetkSlice.reducer;
