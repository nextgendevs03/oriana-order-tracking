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
import { baseApi } from "./api/baseApi";
import permissionReducer from "./permissionSlice";
import userReducer from "./userSlice";
import roleReducer from "./roleSlice";
import poReducer from "./poSlice";
import categoryReducer from "./categorySlice";
import oemReducer from "./oemSlice";
import productReducer from "./productSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["po", "auth", "permission", "user", "role", "category", "oem", "product"], 
  blacklist: [baseApi.reducerPath],
};

const rootReducer = combineReducers({
   permission: permissionReducer,
   user: userReducer,
   role: roleReducer,
   po: poReducer,
   category: categoryReducer,
   oem: oemReducer,
   product: productReducer,
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