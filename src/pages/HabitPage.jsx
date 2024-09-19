import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import TimePicker from "react-time-picker";
import "react-calendar/dist/Calendar.css";
import "react-time-picker/dist/TimePicker.css";
import styles from "./HabitPage.module.css";
import { FaPlus, FaChartLine, FaCalendarAlt, FaPencilAlt, FaTrashAlt, FaCheck, FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import {
  AddNewHabits,
  createNotification,
  DeleteHabit,
  fetchNotifications,
  fetchProtectedResource,
  updateHabit,
  updateHabitCompletion,
} from "../redux/action/habit";
import { useUser } from "@clerk/clerk-react";
import { IoNotificationsSharp } from "react-icons/io5";

const HabitPage = () => {
  const { isSignedIn, user } = useUser();
  const [dates, setDates] = useState([]);
  const [tokenAvailable, setTokenAvailable] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [reminder, setReminder] = useState(false);
  const [notificationName, setNotificationName] = useState("");

  const [editedHabit, setEditedHabit] = useState({
    name: "",
    frequency: "",
  });
  const [newHabitName, setNewHabitName] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [nameError, setNameError] = useState("");
  const [habitsUpdate, setHabitsUpdate] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState(null);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);
  const { allHabits, loading, success, error, notifications } = useSelector((state) => state.habits);
  const navigate = useNavigate();

  const getCalendarDates = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dateArray = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dateArray.push({
        day: days[date.getDay()],
        date: date.getDate(),
        isToday: i === 0,
      });
    }
    setDates(dateArray);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const scheduleNotification = useCallback((habit) => {
    const now = new Date();
    let notificationTime;

    if (habit.frequency === "everyday") {
      notificationTime = new Date(now.setHours(habit.reminderTime.split(":")[0], habit.reminderTime.split(":")[1], 0, 0));
      if (notificationTime <= now) {
        notificationTime.setDate(notificationTime.getDate() + 1);
      }
    } else if (habit.frequency === "every3days") {
      notificationTime = new Date(now.setDate(now.getDate() + 3));
      notificationTime.setHours(habit.reminderTime.split(":")[0], habit.reminderTime.split(":")[1], 0, 0);
    } else if (habit.frequency === "onceaweek") {
      notificationTime = new Date(now.setDate(now.getDate() + 7));
      notificationTime.setHours(habit.reminderTime.split(":")[0], habit.reminderTime.split(":")[1], 0, 0);
    } else if (habit.reminderDate) {
      notificationTime = new Date(habit.reminderDate);
      notificationTime.setHours(habit.reminderTime.split(":")[0], habit.reminderTime.split(":")[1], 0, 0);
    }

    if (notificationTime && notificationTime > now) {
      const timeUntilNotification = notificationTime.getTime() - now.getTime();
      setTimeout(() => {
        toast.info(`Reminder: It's time for your habit "${habit.name}"!`);
        if (habit.frequency !== "none") {
          scheduleNotification(habit);
        }
      }, timeUntilNotification);
    }
  });
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setTokenAvailable(true);
    }
  }, []);
  useEffect(() => {
    if (tokenAvailable) {
      dispatch(fetchProtectedResource());
    }
  }, [tokenAvailable, dispatch]);

  const handleModalToggle = () => setShowModal(!showModal);
  const handleCalendarToggle = () => setShowCalendar(!showCalendar);
  const handleReaminderToggle = () => setReminder(!reminder);
  const handleSaveHabit = (e) => {
    e.preventDefault();
    if (newHabitName.trim() === "") {
      setNameError("Please enter a habit name");
      return;
    }
    setNameError("");

    const frequency = document.getElementById("habitFrequency").value;
    const newHabit = {
      name: newHabitName,
      frequency: frequency,
      reminder: reminder,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completed: false,
    };

    dispatch(AddNewHabits(newHabit));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const toggleHabitCompletion = (id, currentStatus) => {
    dispatch(updateHabitCompletion(id, !currentStatus));
  };

  const handleChartNavigation = () => {
    navigate("/habit-chart", { state: { habits: allHabits } });
  };

  const handleDeleteHabit = (habitId) => {
    dispatch(DeleteHabit(habitId));
  };

  const handleEditClick = (habit) => {
    console.log(habit.id);
    setHabitsUpdate(true);
    setEditedHabit({
      name: habit.name,
      frequency: habit.frequency,
    });
  };

  const handleSaveEdit = (habitId) => {
    dispatch(updateHabit(habitId, editedHabit));
    setHabitsUpdate(false);
  };

  const handleSaveNotification = (e) => {
    e.preventDefault();
    const selectedDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(":");
    selectedDateTime.setHours(hours);
    selectedDateTime.setMinutes(minutes);

    const message = `Reminder: It's time for your habit! ${notificationName}`;

    // Crea la notifica
    const notificationData = {
      user: user.id,
      habits: selectedHabitId,
      message: message,
      scheduledAt: selectedDateTime.toISOString(),
      sent_at: null,
    };

    // Invia la notifica
    dispatch(createNotification(notificationData));

    // Resetta il modulo notifica
    setSelectedDate(null);
    setSelectedTime("09:00");
    setReminder(false);
  };

  return (
    <div className={`${styles.habitPage} min-vh-100 d-flex flex-column py-4 py-md-5`}>
      <div className="container">
        <div className="row justify-content-center mb-4">
          <div className="col-8 col-sm-6 col-md-4 mt-4">
            <img src="/habit.svg" alt="Habit Icon" />
          </div>
        </div>

        <h1 className={`${styles.pageTitle} text-center mb-4`}>Set your goals</h1>

        <div className="d-flex justify-content-end mb-3">
          <button onClick={handleModalToggle} className={`${styles.btnCircle} me-4`}>
            <FaPlus />
          </button>
          <button onClick={handleChartNavigation} className={`${styles.btnCircle} me-4`}>
            <FaChartLine />
          </button>
          <button onClick={handleCalendarToggle} className={`${styles.btnCircle} me-4`}>
            <FaCalendarAlt />
          </button>
        </div>

        <div className="row">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <h2 className="mb-0 mx-2">Your habits</h2>
            <div className={`${styles.calendarStrip} d-flex justify-content-between mb-4 mt-4 p-2 rounded`}>
              {dates.map((item, index) => (
                <div key={index} className={`${styles.calendarDay} text-center p-1 rounded ${item.isToday ? styles.today : ""}`}>
                  <div className={styles.dateNumber}>{item.date}</div>
                  <div className={styles.dayName}>{item.day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {allHabits && allHabits.content && allHabits.content.length > 0 ? (
          allHabits.content.map((habit) => (
            <div key={habit.id} className={`${styles.habitRow} d-flex align-items-center mb-3 `}>
              <div className={`${styles.habitName} d-flex align-items-center justify-content-between`}>
                {habitsUpdate ? (
                  <>
                    <input
                      type="text"
                      value={editedHabit.name}
                      onChange={(e) => setEditedHabit({ ...editedHabit, name: e.target.value })}
                      autoFocus
                      className={styles.editInput}
                    />
                    <input
                      type="text"
                      value={editedHabit.frequency}
                      onChange={(e) => setEditedHabit({ ...editedHabit, frequency: e.target.value })}
                      autoFocus
                      className={styles.editInput}
                    />
                    <Button variant="btn" onClick={() => handleSaveEdit(habit.id)} className={`${styles.saveButton} mt-4 w-100`}>
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    Name: {habit.name} - Frequency: {habit.frequency}
                    <div className="d-flex align-items-center">
                      <button className={`${styles.btnCircle} ms-2`} onClick={() => handleEditClick(habit)} aria-label="Edit habit">
                        <FaPencilAlt />
                      </button>
                      <button className={`${styles.btnCircle} ms-2`} onClick={() => handleDeleteHabit(habit.id)} aria-label="Delete habit">
                        <FaTrashAlt />
                      </button>
                      <button
                        className={`${styles.btnCircle} ms-2`}
                        onClick={() => {
                          setReminder(!reminder);
                          setSelectedHabitId(habit.id);
                          setNotificationName(habit.name);
                        }}
                      >
                        <IoNotificationsSharp />
                      </button>
                      <button
                        className={`${styles.btnCircle} mx-3 ${habit.completed ? styles.completed : styles.notCompleted}`}
                        onClick={() => toggleHabitCompletion(habit.id, habit.completed)}
                      >
                        {habit.completed ? <FaCheck /> : <FaTimes />}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex-grow-1 d-flex align-items-center justify-content-center">
            <div className={`${styles.bigCircle} d-flex align-items-center justify-content-center text-center mt-4 p-3`}>You have no active habits</div>
          </div>
        )}

        <>
          <Modal show={reminder} onHide={handleReaminderToggle} centered>
            <Modal.Header closeButton className={`${styles.modalHeader}`}>
              <Modal.Title className={`${styles.headerModal} text-white`}>Add Notifications</Modal.Title>
            </Modal.Header>
            <Modal.Body className={`${styles.modalBody}`}>
              <Form>
                <Form.Group className="mt-3">
                  <Form.Label className="text-white">Select Date</Form.Label>
                  <Form.Control
                    id="habitDate"
                    type="date"
                    className={`${styles.inputField} mx-auto`}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  />
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label className="text-white">Select Time</Form.Label>
                  <TimePicker
                    onChange={setSelectedTime}
                    value={selectedTime}
                    className={`${styles.inputField} mx-2 border-white bg-transparent text-white`}
                    disableClock={true}
                    clearIcon={null}
                    clockIcon={null}
                    format="h:mm a"
                    portalClassName="time-picker-portal"
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="btn" onClick={handleSaveNotification} className={`${styles.saveButton} mt-4 w-100`}>
                Save Notification
              </Button>
            </Modal.Footer>
          </Modal>
        </>

        <Modal show={showModal} onHide={handleModalToggle} centered>
          <Modal.Header closeButton className={`${styles.modalHeader}`}>
            <Modal.Title className={`${styles.headerModal} text-white`}>Create Habit</Modal.Title>
          </Modal.Header>
          <Modal.Body className={`${styles.modalBody}`}>
            <Form>
              <Form.Group>
                <Form.Label className="text-white">Name</Form.Label>
                <Form.Control
                  id="habitName"
                  type="text"
                  placeholder="Enter habit"
                  className={`${styles.inputField} ${nameError ? "is-invalid" : ""}`}
                  value={newHabitName}
                  onChange={(e) => {
                    setNewHabitName(e.target.value);
                    if (e.target.value.trim() !== "") {
                      setNameError("");
                    }
                  }}
                  required
                />
                {nameError && <div className="invalid-feedback">{nameError}</div>}
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label className="text-white">Frequency</Form.Label>
                <Form.Select id="habitFrequency" className={styles.inputField} required>
                  <option value="none">None</option>
                  <option value="everyday">Everyday</option>
                  <option value="every3days">Every 3 Days</option>
                  <option value="onceaweek">Once a Week</option>
                </Form.Select>
              </Form.Group>

              <Button variant="outline-light" onClick={handleSaveHabit} className={`${styles.saveButton} mt-4 w-100`}>
                Save Habit
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal show={showCalendar} onHide={handleCalendarToggle} centered className={styles.calendarModal}>
          <Modal.Header closeButton className={styles.calendarModalHeader}>
            <Modal.Title>Habits Calendar</Modal.Title>
          </Modal.Header>
          <Modal.Body className={styles.calendarModalBody}>
            {allHabits && allHabits.content && allHabits.content.length > 0 && (
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                className={styles.customCalendar}
                tileClassName={({ date, view }) => {
                  // Converti la data del calendario in formato Date
                  const calendarDate = new Date(date);

                  // Controlla se ci sono abitudini per la data
                  const hasHabit =
                    allHabits.content &&
                    Array.isArray(allHabits.content) &&
                    allHabits.content.some((habit) => new Date(habit.createdAt).toDateString() === calendarDate.toDateString());
                  // Controlla se ci sono notifiche per la data
                  const hasReminder =
                    Array.isArray(notifications) &&
                    notifications.some((notification) => new Date(notification.scheduledAt).toDateString() === calendarDate.toDateString());

                  // Determina le classi di stile in base alla presenza di abitudini e notifiche
                  const classNames = [];
                  if (hasHabit) classNames.push(styles.hasHabit);
                  if (hasReminder) classNames.push(styles.hasReminder);

                  // Restituisce la classe combinata o nulla
                  return classNames.join(" ") || null;
                }}
              />
            )}
          </Modal.Body>
        </Modal>
      </div>
      <ToastContainer />
    </div>
  );
};

export default HabitPage;
