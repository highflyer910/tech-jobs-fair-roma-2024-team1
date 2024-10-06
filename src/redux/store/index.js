import { combineReducers, configureStore } from "@reduxjs/toolkit";
import HabitsReducer from "../reducers/HabitsReducer";
import CategoryReducer from "../reducers/CategoryReducer";

const rootReducer = combineReducers({
  habits: HabitsReducer,
  category: CategoryReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});
