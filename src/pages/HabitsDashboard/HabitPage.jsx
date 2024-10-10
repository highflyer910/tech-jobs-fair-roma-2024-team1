import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";

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
  FaShareAlt,
} from "react-icons/fa";

import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { DeleteHabit, fetchProtectedResource, updateHabitCompletion } from "../../redux/action/habit";

import CreateHabit from "./CreateHabit";
import UpdateHabit from "./Updatehabit";

import CalendarModal from "./CalendarModal";
import ShareHabit from "./ShareHabit";
import Notifications from "./Notifications";

const HabitPage = () => {
  const [dates, setDates] = useState([]);
  const [tokenAvailable, setTokenAvailable] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const [habitsUpdate, setHabitsUpdate] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState(null);
  const [localHabits, setLocalHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [shareHabitShow, setShareHabitShow] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allHabits } = useSelector((state) => state.habits);

  useEffect(() => {
    if (allHabits && allHabits.content) {
      setLocalHabits(allHabits.content);
    }
  }, [allHabits]);

  const getCalendarDates = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dateArray = [];
    const today = new Date(); // Prendi la data di oggi

    // Genera le date a partire da oggi per 7 giorni
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i); // Avanza di un giorno per ciascun ciclo
      dateArray.push({
        day: days[date.getDay()],
        date: date.getDate(),
        fullDate: date, // Aggiungi la data completa per i confronti futuri
        isToday: i === 0, // Imposta true per oggi
      });
    }

    setDates(dateArray); // Salva le date nel tuo stato
  };

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
  };
  const handleShareHabitModalToggle = (habitId) => {
    setShareHabitShow(!shareHabitShow);
    setSelectedHabitId(habitId);
  };
  const handleCalendarToggle = () => setShowCalendar(!showCalendar);

  const toggleHabitCompletion = (id) => {
    dispatch(updateHabitCompletion(id));
  };

  const handleChartNavigation = () => {
    navigate("/habit-chart");
  };

  const handleDeleteHabit = (habitId) => {
    dispatch(DeleteHabit(habitId));
  };

  const handleEditClick = (habit) => {
    setHabitsUpdate(true);
    setSelectedHabitId(habit.id);
  };

  // Filtra le abitudini per la settimana corrente
  const filterAndGroupHabitsByCategory = () => {
    if (!dates || dates.length === 0) return {}; // Assicurati che `dates` sia disponibile e restituisci un oggetto vuoto

    // 1. Filtrare le abitudini per la settimana corrente
    const filteredHabits = localHabits.filter((habit) => {
      const hasFrequencyDates = habit.frequencyDates && habit.frequencyDates.length > 0;

      return hasFrequencyDates
        ? habit.frequencyDates.some((date) => {
            // Il backend restituisce la data come stringa LocalDateTime (es. '2024-10-08T21:11:53.179828')
            const habitDate = new Date(date.split("T")[0]); // Prende solo la parte di data (AAAA-MM-GG)

            // Verifica se habitDate è valida
            if (isNaN(habitDate)) {
              console.error("Invalid date found in habit frequencyDates", date);
              return false; // Ignora le date non valide
            }

            // Confronta le parti di data senza considerare l'ora
            return dates.some((calendarDate) => {
              if (!calendarDate.fullDate || isNaN(calendarDate.fullDate)) {
                console.error("Invalid calendarDate found", calendarDate);
                return false;
              }

              return (
                habitDate.getFullYear() === calendarDate.fullDate.getFullYear() &&
                habitDate.getMonth() === calendarDate.fullDate.getMonth() &&
                habitDate.getDate() === calendarDate.fullDate.getDate()
              );
            });
          })
        : true; // Includi abitudini senza frequencyDates
    });

    // 2. Raggruppare le abitudini filtrate per categoria
    const habitsByCategory = filteredHabits.reduce((acc, habit) => {
      // Controlla se l'abitudine ha una categoria e usa "Uncategorized" se manca
      const category = habit.category && habit.category.name ? habit.category.name : "Uncategorized";

      if (!acc[category]) acc[category] = []; // Inizializza la categoria se non esiste
      acc[category].push(habit); // Aggiungi l'abitudine alla categoria corrispondente
      return acc;
    }, {}); // Oggetto vuoto iniziale per il raggruppamento

    return habitsByCategory; // Restituisce le abitudini raggruppate per categoria
  };

  const habitsByCategory = filterAndGroupHabitsByCategory();

  useEffect(() => {
    getCalendarDates();
  }, []);

  return (
    <div className={`${styles.habitPage} min-vh-100 d-flex flex-column py-4 py-md-5`}>
      <div className="container">
        <div className="row justify-content-center mb-4">
          <div className="col-8 col-sm-6 col-md-4 mt-4">
            <Notifications localHabit={localHabits} />
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
        {isLoading ? (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
          </div>
        ) : Object.keys(habitsByCategory).length > 0 ? (
          Object.entries(habitsByCategory).map(([category, habits]) => (
            <div key={category} className={`${styles.categoryGroup}`}>
              {/* Icona in base alla categoria */}
              <div className="d-flex align-items-center">
                {category === "Health" && <FaHeartbeat size={24} />}
                {category === "Work" && <FaBriefcase size={24} />}
                {category === "Personal Development" && <FaBrain size={24} />}
                {category === "Fitness" && <FaDumbbell size={24} />}
                {category === "Education" && <FaBook size={24} />}
                <h3 className="m-0 d-flex align-items-center mx-3">{category}</h3>
              </div>

              {/* Mappa le abitudini all'interno della categoria */}
              {habits.length > 0 &&
                habits.map((habit) => (
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
                        <>
                          <h4>{habit.name}</h4>
                          <div className={`${styles.habitActions} d-flex align-items-center`}>
                            <button className={`${styles.habitActionBtn} ms-2`} onClick={() => handleShareHabitModalToggle(habit.id)} aria-label="Share habit">
                              <FaShareAlt />
                            </button>
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
        <CalendarModal showCalendar={showCalendar} handleCalendarToggle={handleCalendarToggle} allHabit={allHabits} />
        {/* share habit */}
        <ShareHabit
          shareHabitShow={shareHabitShow}
          handleShareHabitModalToggle={handleShareHabitModalToggle}
          setShareHabitShow={setShareHabitShow}
          styles={styles}
          selectedHabitId={selectedHabitId}
        />
      </div>
    </div>
  );
};

export default HabitPage;
