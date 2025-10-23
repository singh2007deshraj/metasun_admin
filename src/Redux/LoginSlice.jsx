import { createSlice } from "@reduxjs/toolkit";
const loginSlice = createSlice({
  name: "login",
  initialState: {
    isLogin: !!localStorage.getItem("adminLogin"),
    token: localStorage.getItem("metasunAdminToken"),
  },
  reducers: {
    setLogin: (state, action) => {
      // console.log(action.payload);
      state.isLogin = action.payload.login;
      state.token = action.payload.token;
      localStorage.setItem("metasunAdminToken", action.payload.token);
      localStorage.setItem("adminLogin", true);
    },
    logout: (state, action) => {
      // console.log(action.payload);
      state.isLogin = action.payload;
      localStorage.removeItem("adminLogin");
      localStorage.removeItem("metasunAdminToken");
    },
  },
});

export const { setLogin, logout } = loginSlice.actions;
export default loginSlice.reducer;
