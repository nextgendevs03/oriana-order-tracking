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
import permissionReducer from "./permissionSlice";
//import authReducer from "./authSlice";
import userReducer from "./userSlice";

// Import the base API for RTK Query
import { baseApi } from "./api";
import roleReducer from "./roleSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["po", "auth", "permission"], 
  blacklist: [baseApi.reducerPath],
  whitelist: ["po", "user", "role"], // Persist both 'po' and 'role' reducers
};

const rootReducer = combineReducers({
  po: poReducer,
   permission: permissionReducer,
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