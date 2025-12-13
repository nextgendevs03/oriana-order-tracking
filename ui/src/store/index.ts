import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import poReducer from "./poSlice";
import userReducer from "./userSlice";
import productManagementReducer from "./productManagementSlice";
//import authReducer from "./authSlice";
import { baseApi } from "./api/baseApi";
import permissionReducer from "./permissionSlice";
import roleReducer from "./roleSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["po", "auth", "permission", "user", "role"], 
  blacklist: [baseApi.reducerPath],
};

const rootReducer = combineReducers({
  po: poReducer,
  user: userReducer,
  productManagement: productManagementReducer,
  // Add RTK Query API reducer
   permission: permissionReducer,
   role: roleReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware), 
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;