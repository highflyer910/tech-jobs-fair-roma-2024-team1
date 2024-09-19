import { combineReducers, configureStore } from "@reduxjs/toolkit";
import HabitsReducer from "../reducers/HabitsReducer";

const rootReducer = combineReducers({
  habits: HabitsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});
