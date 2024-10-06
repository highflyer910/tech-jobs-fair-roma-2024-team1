export const GET_CATEGORY = "GET_CATEGORY";
export const GET_CATEGORY_FAILURE = "GET_CATEGORY_FAILURE";

const fetchResourceSuccess = (data) => ({
  type: GET_CATEGORY,
  payload: data,
});
const fetchResourceFailure = (error) => ({
  type: GET_CATEGORY_FAILURE,
  payload: error,
});

export const GetCategories = () => async (dispatch) => {
  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch("https://unsightly-maurise-marinalucentini-fc955053.koyeb.app/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    const data = await response.json();
    dispatch(fetchResourceSuccess(data));
  } catch (error) {
    dispatch(fetchResourceFailure(error.message));
  }
};
