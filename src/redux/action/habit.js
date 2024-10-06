export const ADD_NEW_HABITS_REQUEST = "ADD_NEW_HABITS_REQUEST";
export const ADD_NEW_HABITS_SUCCESS = "ADD_NEW_HABITS_SUCCESS";
export const ADD_NEW_HABITS_FAILURE = "ADD_NEW_HABITS_FAILURE";
export const RESET_HABITS_STATE = "RESET_HABITS_STATE";
export const GET_HABITS = "GET_HABITS";
export const GET_HABITS_FAILURE = "GET_HABITS_FAILURE";
export const UPDATE_HABIT_REQUEST = "UPDATE_HABIT_REQUEST";
export const UPDATE_HABIT_SUCCESS = "UPDATE_HABIT_SUCCESS";
export const UPDATE_HABIT_FAILURE = "UPDATE_HABIT_FAILURE";
export const CREATE_NOTIFICATION_REQUEST = "CREATE_NOTIFICATION_REQUEST";
export const CREATE_NOTIFICATION_SUCCESS = "CREATE_NOTIFICATION_SUCCESS";
export const CREATE_NOTIFICATION_FAILURE = "CREATE_NOTIFICATION_FAILURE";
export const FETCH_NOTIFICATIONS_REQUEST = "FETCH_NOTIFICATIONS_REQUEST";
export const FETCH_NOTIFICATIONS_SUCCESS = "FETCH_NOTIFICATIONS_SUCCESS";
export const FETCH_NOTIFICATIONS_FAILURE = "FETCH_NOTIFICATIONS_FAILURE";
const updateHabitRequest = () => ({
  type: UPDATE_HABIT_REQUEST,
});

const updateHabitSuccess = (data) => ({
  type: UPDATE_HABIT_SUCCESS,
  payload: data,
});

const updateHabitFailure = (error) => ({
  type: UPDATE_HABIT_FAILURE,
  payload: error,
});

const addNewHabitsRequest = () => ({
  type: ADD_NEW_HABITS_REQUEST,
});

const addNewHabitsSuccess = (data) => ({
  type: ADD_NEW_HABITS_SUCCESS,
  payload: data,
});

const addNewHabitsFailure = (error) => ({
  type: ADD_NEW_HABITS_FAILURE,
  payload: error,
});
export const resetHabitsState = () => ({
  type: RESET_HABITS_STATE,
});
const fetchResourceSuccess = (data) => ({
  type: GET_HABITS,
  payload: data,
});
const fetchResourceFailure = (error) => ({
  type: GET_HABITS_FAILURE,
  payload: error,
});
export const AddNewHabits = (habitsData) => async (dispatch) => {
  const token = localStorage.getItem("authToken");
  dispatch(addNewHabitsRequest());
  try {
    const response = await fetch("https://gross-kerrie-hackaton-team1-79e26745.koyeb.app/habits", {
      method: "POST",
      body: JSON.stringify(habitsData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Errore durante la registrazione");
    }

    dispatch(addNewHabitsSuccess(data));
    dispatch(fetchProtectedResource());
  } catch (error) {
    dispatch(addNewHabitsFailure(error.message));
  }
};

export const fetchProtectedResource = () => async (dispatch) => {
  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch("https://unsightly-maurise-marinalucentini-fc955053.koyeb.app/habits", {
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
export const updateHabitCompletion = (id, completed) => async (dispatch) => {
  const token = localStorage.getItem("authToken");
  dispatch(updateHabitRequest());

  try {
    const response = await fetch(`https://gross-kerrie-hackaton-team1-79e26745.koyeb.app/habits/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ completed }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error updating habit");
    }

    dispatch(updateHabitSuccess(data));
    dispatch(fetchProtectedResource());
    return data;
  } catch (error) {
    dispatch(updateHabitFailure(error.message));
    throw error;
  }
};
export const DeleteHabit = (habitsId) => async (dispatch) => {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(`https://gross-kerrie-hackaton-team1-79e26745.koyeb.app/habits/${habitsId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Errore durante la cancellazione");
    }

    dispatch(fetchProtectedResource());
  } catch (error) {
    dispatch(updateHabitFailure(error.message));
  }
};
export const updateHabit = (id, habitData) => async (dispatch) => {
  const token = localStorage.getItem("authToken");
  dispatch(updateHabitRequest());

  try {
    const response = await fetch(`https://gross-kerrie-hackaton-team1-79e26745.koyeb.app/habits/modHabits/${id}`, {
      method: "PATCH",
      body: JSON.stringify(habitData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error updating habit");
    }

    dispatch(updateHabitSuccess(data));
    dispatch(fetchProtectedResource());
    return data;
  } catch (error) {
    dispatch(updateHabitFailure(error.message));
    throw error;
  }
};
export const createNotification = (notificationData) => async (dispatch) => {
  dispatch({ type: CREATE_NOTIFICATION_REQUEST });

  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch("https://gross-kerrie-hackaton-team1-79e26745.koyeb.app/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(notificationData),
    });

    if (!response.ok) {
      throw new Error("Failed to create notification");
    }

    const result = await response.json();
    dispatch({ type: CREATE_NOTIFICATION_SUCCESS, payload: result });
  } catch (error) {
    dispatch({ type: CREATE_NOTIFICATION_FAILURE, payload: error.message });
  }
};
export const fetchNotifications = () => async (dispatch) => {
  dispatch({ type: FETCH_NOTIFICATIONS_REQUEST });
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch("https://gross-kerrie-hackaton-team1-79e26745.koyeb.app/notifications?page=0&size=10&sortBy=id", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    dispatch({ type: FETCH_NOTIFICATIONS_SUCCESS, payload: data.content });
  } catch (error) {
    dispatch({ type: FETCH_NOTIFICATIONS_FAILURE, payload: error.message });
  }
};
