import { fetchProtectedResource } from "./habit";

export const ADD_USER_REQUEST = "ADD_USER_REQUEST";
export const ADD_USER_SUCCESS = "ADD_USER_SUCCESS";
export const ADD_USER_FAILURE = "ADD_USER_FAILURE";
const addUserRequest = () => ({
  type: ADD_USER_REQUEST,
});

const addUserSuccess = (data) => ({
  type: ADD_USER_SUCCESS,
  payload: data,
});

const addUserFailure = (error) => ({
  type: ADD_USER_FAILURE,
  payload: error,
});
// add user
export const AddUser = (emailUser, habitsId) => async (dispatch) => {
  const token = localStorage.getItem("authToken");
  dispatch(addUserRequest());
  try {
    const response = await fetch(`https://unsightly-maurise-marinalucentini-fc955053.koyeb.app/habits/${habitsId}/share`, {
      method: "POST",
      body: JSON.stringify(emailUser),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Errore durante la registrazione");
    }

    dispatch(addUserSuccess(data));
    dispatch(fetchProtectedResource());
  } catch (error) {
    dispatch(addUserFailure(error.message));
  }
};
