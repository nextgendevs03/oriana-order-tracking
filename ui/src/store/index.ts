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
//import authReducer from "./authSlice";

// Import the base API for RTK Query
import { baseApi } from "./api";
import roleReducer from "./roleSlice";
import { roleApi } from "./roleApi";

// Persist configuration
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["po", "role"], // Persist both 'po' and 'role' reducers
};

// Combine reducers
const rootReducer = combineReducers({
  po: poReducer,
  user: userReducer,
  role: roleReducer,
  [roleApi.reducerPath]: roleApi.reducer,
  // Add RTK Query API reducer
  [baseApi.reducerPath]: baseApi.reducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(roleApi.middleware),
});

// Create persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
