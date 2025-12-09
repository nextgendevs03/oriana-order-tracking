import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import permissionReducer from "./permissionSlice";
import { permissionApi } from "./api/permissionApi";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["permission"], 
};

const rootReducer = combineReducers({
  // Uncomment and import the reducer, or implement as needed
   permission: permissionReducer,

  // RTK Query reducer
  [permissionApi.reducerPath]: permissionApi.reducer,
});


const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(permissionApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;