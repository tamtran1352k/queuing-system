import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DeviceState {
  // Define your device state here
  devices: DeviceData[];
}

interface DeviceData {
    madv: string;
    motadv: string;
    namedv: string;
    prefix: string;
    sott: string;
    surfix: string;
    tthddv: string;
    stt: string;}

const initialState: DeviceState = {
  devices: [],
};

const updatedvSlice = createSlice({
  name: "device",
  initialState,
  reducers: {
    updatedvDevice(state, action: PayloadAction<DeviceData>) {
      const updatedDevice = action.payload;
      const deviceIndex = state.devices.findIndex(
        (device) => device.madv === updatedDevice.madv
      );
      if (deviceIndex !== -1) {
        state.devices[deviceIndex] = updatedDevice;
      }
    },
  },
});

export const { updatedvDevice } = updatedvSlice.actions;

export default updatedvSlice.reducer;
