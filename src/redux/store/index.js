import { combineReducers, configureStore } from "@reduxjs/toolkit";
import HabitsReducer from "../reducers/HabitsReducer";
import CategoryReducer from "../reducers/CategoryReducer";
import HabitsCompletionReducer from "../reducers/HabitsCompletionReducer";

const rootReducer = combineReducers({
  habits: HabitsReducer,
  category: CategoryReducer,
  completion: HabitsCompletionReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});
