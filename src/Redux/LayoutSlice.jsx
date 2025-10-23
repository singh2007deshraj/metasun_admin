import { createSlice } from "@reduxjs/toolkit";
const layoutslice = createSlice({
  name: "layout",
  initialState: {
    mobileOpen: false,
  },
  reducers: {
    setMobileOpen: (state, action) => {
        console.log(action.payload)
      state.mobileOpen = action.payload;
    },
  },
});

export const { setMobileOpen } = layoutslice.actions;
export default layoutslice.reducer;
