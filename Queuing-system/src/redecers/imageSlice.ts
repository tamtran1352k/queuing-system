// src/store/imageSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../store/store';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase/fibase';

interface ImageState {
  imageUrl: string | null;
  isUploading: boolean;
  uploadError: string | null;
}

const initialState: ImageState = {
  imageUrl: null,
  isUploading: false,
  uploadError: null,
};

const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    startUpload: (state) => {
      state.isUploading = true;
      state.uploadError = null;
    },
    uploadSuccess: (state, action: PayloadAction<string>) => {
      state.isUploading = false;
      state.imageUrl = action.payload;
    },
    uploadFailure: (state, action: PayloadAction<string>) => {
      state.isUploading = false;
      state.uploadError = action.payload;
    },
  },
});

export const { startUpload, uploadSuccess, uploadFailure } = imageSlice.actions;

export const uploadImage = (file: File) => async (dispatch: AppDispatch) => {
  dispatch(startUpload());

  try {
    // Upload the image to Firebase Storage
    const storageRef = ref(storage, 'images/' + file.name);
    const snapshot = await uploadBytes(storageRef, file);

    // Get the download URL of the uploaded image
    const downloadUrl = await getDownloadURL(snapshot.ref);

    dispatch(uploadSuccess(downloadUrl));
  } catch (error:any) {
    dispatch(uploadFailure(error.message));
  }
};

export default imageSlice.reducer;
