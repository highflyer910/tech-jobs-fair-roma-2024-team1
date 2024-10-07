import React, { useState, useEffect, useCallback } from "react";

import { useNavigate } from "react-router-dom";

import "react-calendar/dist/Calendar.css";
import "react-time-picker/dist/TimePicker.css";
import styles from "./HabitPage.module.css";
import {
  FaPlus,
  FaChartLine,
  FaCalendarAlt,
  FaPencilAlt,
  FaTrashAlt,
  FaCheck,
  FaTimes,
  FaHeartbeat,
  FaBriefcase,
  FaBrain,
  FaDumbbell,
  FaBook,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { DeleteHabit, fetchProtectedResource, updateHabitCompletion } from "../../redux/action/habit";

import CreateHabit from "./CreateHabit";
import UpdateHabit from "./Updatehabit";

const HabitPage = () => {
  const [dates, setDates] = useState([]);
  const [tokenAvailable, setTokenAvailable] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [reminder, setReminder] = useState(false);

  const [newHabitName, setNewHabitName] = useState("");

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [habitsUpdate, setHabitsUpdate] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState(null);
  const [localHabits, setLocalHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const { allHabits, loading, success, error } = useSelector((state) => state.habits);
  const navigate = useNavigate();

  useEffect(() => {
    if (allHabits && allHabits.content) {
      setLocalHabits(allHabits.content);
    }
  }, [allHabits]);

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

  const handleModalToggle = () => {
    setShowModal(!showModal);
    setNewHabitName("");
    setReminder(false);
  };
  const handleCalendarToggle = () => setShowCalendar(!showCalendar);

  const handleDateSelect = (item) => {
    setSelectedDate(item.date);
  };

  const toggleHabitCompletion = (id) => {
    dispatch(updateHabitCompletion(id));
  };

  const handleChartNavigation = () => {
    navigate("/habit-chart", { state: { habits: allHabits } });
  };

  const handleDeleteHabit = (habitId) => {
    dispatch(DeleteHabit(habitId));
  };

  const handleEditClick = (habit) => {
    setHabitsUpdate(true);
    setSelectedHabitId(habit.id);
  };

  useEffect(() => {
    getCalendarDates();
  }, []);

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
                <div
                  key={index}
                  className={`${styles.calendarDay} text-center p-1 rounded ${item.isToday ? styles.today : ""}`}
                  onClick={() => handleDateSelect(item)}
                >
                  <div className={styles.dateNumber}>{item.date}</div>
                  <div className={styles.dayName}>{item.day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
          </div>
        ) : localHabits.length > 0 ? (
          //  Raggruppiamo le abitudini per categoria
          Object.entries(
            [...new Map(localHabits.map((habit) => [habit.id, habit])).values()].reduce((acc, habit) => {
              const category = habit.category && habit.category.name ? habit.category.name : "Uncategorized";

              if (!acc[category]) acc[category] = [];
              acc[category].push(habit);
              return acc;
            }, {})
          ).map(([category, habits]) => (
            <div key={category} className={`${styles.categoryGroup}`}>
              {/*  Icona in base alla categoria */}
              <div className="d-flex align-items-center">
                {category === "Health" && <FaHeartbeat size={24} />}
                {category === "Work" && <FaBriefcase size={24} />}
                {category === "Personal Development" && <FaBrain size={24} />}
                {category === "Fitness" && <FaDumbbell size={24} />}
                {category === "Education" && <FaBook size={24} />}
                <h3 className="m-0 d-flex align-items-center mx-3">{category}</h3>
              </div>

              {/* Mappiamo le abitudini all'interno di ogni categoria */}
              {habits.map((habit) => (
                <div key={habit.id} className={`${styles.habitRow}`}>
                  <div className={`${styles.habitName} flex-column flex-md-row my-3`}>
                    {habitsUpdate && selectedHabitId === habit.id ? (
                      <UpdateHabit
                        styles={styles}
                        setHabitsUpdate={setHabitsUpdate}
                        setSelectedHabitId={setSelectedHabitId}
                        setIsLoading={setIsLoading}
                        habit={habit}
                      />
                    ) : (
                      // <div className={styles.editMode}>
                      //   <input
                      //     type="text"
                      //     value={editedHabit.name}
                      //     onChange={(e) => setEditedHabit({ ...editedHabit, name: e.target.value })}
                      //     className={styles.editInput}
                      //     placeholder="Habit name"
                      //   />
                      //   <input
                      //     type="text"
                      //     value={editedHabit.frequency}
                      //     onChange={(e) => setEditedHabit({ ...editedHabit, frequency: e.target.value })}
                      //     className={styles.editInput}
                      //     placeholder="Frequency"
                      //   />
                      //   <div className={styles.editButtons}>
                      //     <button onClick={() => handleSaveEdit(habit.id)} className={styles.saveButton}>
                      //       Save
                      //     </button>
                      //     <button
                      //       onClick={() => {
                      //         setHabitsUpdate(false);
                      //         setSelectedHabitId(null);
                      //       }}
                      //       className={styles.cancelButton}
                      //     >
                      //       Cancel
                      //     </button>
                      //   </div>
                      // </div>
                      <>
                        <h4>{habit.name}</h4>
                        <div className={`${styles.habitActions} d-flex align-items-center`}>
                          <button
                            className={`${styles.habitActionBtn} ms-2 ${habit.completed ? styles.completed : styles.notCompleted}`}
                            onClick={() => toggleHabitCompletion(habit.id)}
                          >
                            {habit.completed ? <FaCheck /> : <FaTimes />}
                          </button>
                          <button className={`${styles.habitActionBtn} ms-2`} onClick={() => handleEditClick(habit)} aria-label="Edit habit">
                            <FaPencilAlt />
                          </button>
                          <button className={`${styles.habitActionBtn} ms-2`} onClick={() => handleDeleteHabit(habit.id)} aria-label="Delete habit">
                            <FaTrashAlt />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="flex-grow-1 d-flex align-items-center justify-content-center">
            <div className={`${styles.bigCircle} d-flex align-items-center justify-content-center text-center mt-4 p-3`}>You have no active habits</div>
          </div>
        )}
        {/* 
      
        {/* modal create habit */}
        <CreateHabit showModal={showModal} handleModalToggle={handleModalToggle} setShowModal={setShowModal} styles={styles} />
        {/* calendar */}
        {/* <Modal show={showCalendar} onHide={handleCalendarToggle} centered className={styles.calendarModal}>
          <Modal.Header closeButton className={styles.calendarModalHeader}>
            <Modal.Title>Habits Calendar</Modal.Title>
          </Modal.Header>
          <Modal.Body className={styles.calendarModalBody}>
            {localHabits.length > 0 && (
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                className={styles.customCalendar}
                tileClassName={({ date, view }) => {
                  const calendarDate = new Date(date);
                  const hasHabit = localHabits.some((habit) => new Date(habit.createdAt).toDateString() === calendarDate.toDateString());
                  const hasReminder =
                    Array.isArray(notifications) &&
                    notifications.some((notification) => new Date(notification.scheduledAt).toDateString() === calendarDate.toDateString());

                  const classNames = [];
                  if (hasHabit) classNames.push(styles.hasHabit);
                  if (hasReminder) classNames.push(styles.hasReminder);

                  return classNames.join(" ") || null;
                }}
              />
            )}
          </Modal.Body>
        </Modal> */}
      </div>
      <ToastContainer />
    </div>
  );
};

export default HabitPage;
