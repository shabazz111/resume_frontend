import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // This defaults to localStorage
import resumeReducer from "./resumeSlice";

// Configuration object for redux-persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["resume"], // Only persist this reducer
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, resumeReducer);

// Configure the store
const store = configureStore({
  reducer: {
    resume: persistedReducer,
  },
});

const persistor = persistStore(store);

export { store as default, persistor };
