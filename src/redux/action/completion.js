export const GET_HABITS_COMPLETION = "GET_HABITS_COMPLETION";
export const GET_HABITS_COMPLETION_FAILURE = "GET_HABITS_COMPLETION_FAILURE";

const fetchResourceSuccess = (data) => ({
  type: GET_HABITS_COMPLETION,
  payload: data,
});
const fetchResourceFailure = (error) => ({
  type: GET_HABITS_COMPLETION_FAILURE,
  payload: error,
});

export const fetchCompletionHabit = () => async (dispatch) => {
  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch("https://unsightly-maurise-marinalucentini-fc955053.koyeb.app/habits/completions", {
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
