import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export interface UserState {
  users: User[];
}

const initialState: UserState = {
  users: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
  },
});
export const selectUsers = (state: RootState) => state.user.users;

export const { addUser } = userSlice.actions;
export default userSlice.reducer;
