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
    
    updateUserStatus: (state, action: PayloadAction<{ id: string; status: boolean }>) => {
      const { id, status } = action.payload;
      const user = state.users.find((user) => user.id === id);
      if (user) {
        user.status = status ? "Active" : "Inactive";
      }
    },
  },
});
export const selectUsers = (state: RootState) => state.user.users;

export const { addUser, updateUserStatus } = userSlice.actions;
export default userSlice.reducer;
