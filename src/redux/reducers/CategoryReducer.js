import { GET_CATEGORY, GET_CATEGORY_FAILURE } from "../action/category";

const initialState = {
  loading: false,
  success: false,
  error: false,
  content: null,
};
const CategoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CATEGORY:
      return { ...state, content: action.payload, success: true, error: false, loading: false };
    case GET_CATEGORY_FAILURE:
      return { ...state, error: true, errorMsg: action.payload, success: false, loading: false };
    default:
      return state;
  }
};
export default CategoryReducer;
