import { GET_HABITS_COMPLETION, GET_HABITS_COMPLETION_FAILURE } from "../action/completion";

const initialState = {
  loading: false,
  success: false,
  error: false,
  content: null,
  errorMsg: null,
};
const HabitsCompletionReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_HABITS_COMPLETION:
      return { ...state, content: action.payload, success: true, error: false, loading: false };
    case GET_HABITS_COMPLETION_FAILURE:
      return { ...state, error: true, errorMsg: action.payload, success: false, loading: false };

    default:
      return state;
  }
};
export default HabitsCompletionReducer;
