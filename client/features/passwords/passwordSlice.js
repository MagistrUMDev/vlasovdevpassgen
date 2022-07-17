import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import passwordService from "./passwordService";
import Swal from "sweetalert2";
const initialState = {
  passwords: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  isUpdating: false,
  id: "",
};

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

// Create new password
export const createPassword = createAsyncThunk(
  "passwords/create",
  async (passwordData, thunkAPI) => {
    try {
      if (passwordData === "") {
      }
      const token = thunkAPI.getState().auth.user.token;
      return await passwordService.createPassword(passwordData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Get all passwords
export const getPasswords = createAsyncThunk(
  "passwords/getAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await passwordService.getPasswords(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Update Goal
export const updatePassword = createAsyncThunk(
  "passwords/update",
  async (passwordData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await passwordService.updatePassword(
        passwordData._id,
        passwordData,
        token
      );
    } catch (error) {
      console.log(error);
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
//Delete Password
export const deletePassword = createAsyncThunk(
  "passwords/delete",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await passwordService.deletePassword(id, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const passwordSlice = createSlice({
  name: "password",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.passwords.push(action.payload);
      })
      .addCase(createPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getPasswords.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPasswords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.passwords = action.payload;
      })
      .addCase(getPasswords.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deletePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.passwords = state.passwords.filter(
          (password) => password._id !== action.payload.id
        );
        Toast.fire({
          icon: "success",
          title: "Item was succesfully deleted!",
        });
      })
      .addCase(deletePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        Toast.fire({
          icon: "error",
          title: "Something went wrong...",
        });
      })
      .addCase(updatePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isUpdating = false;

        state.passwords.forEach((password) => {
          if(password._id === action.payload._id ){
            password.name = action.payload.name;
            password.password = action.payload.password;
          }
        });

        Toast.fire({
          icon: "success",
          title: "Password was succesfully updated!",
        });
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isUpdating = false;
        state.id = "";
        state.message = action.payload;
        Toast.fire({
          icon: "error",
          title: "Something went wrong...",
        });
      });
  },
});

export const { reset } = passwordSlice.actions;
export const { updateId } = passwordSlice.actions;
export default passwordSlice.reducer;
