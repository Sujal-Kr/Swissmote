import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  user: null,
  loader: true,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userExists: (state, action) => {
      console.log("action.paylaid"+action.payload)
      state.user = action.payload;
      state.loader = false;
    },
    userNotExists: (state, action) => {
      state.user = null;
      state.loader = false;
    },
  },
});

export const { userExists, userNotExists } = authSlice.actions;
export default authSlice.reducer;
