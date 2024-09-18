import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './HabitPage.module.css';

const HabitPage = () => {
  const [dates, setDates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [reminder, setReminder] = useState(false);
  const [habits, setHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [nameError, setNameError] = useState('');

  const navigate = useNavigate();

  const getCalendarDates = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dateArray = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dateArray.push({
        day: days[date.getDay()],
        date: date.getDate(),
        isToday: i === 0
      });
    }
    setDates(dateArray);
  };

  useEffect(() => {
    getCalendarDates();
    const storedHabits = JSON.parse(localStorage.getItem('habits')) || [];
    
    const validatedHabits = storedHabits.map(habit => ({
      ...habit,
      completions: Array.isArray(habit.completions) ? habit.completions : Array(7).fill(false),
      dates: habit.dates ? habit.dates.map(date => new Date(date)) : [],
      reminderDate: habit.reminderDate ? new Date(habit.reminderDate) : null
    }));
    
    setHabits(validatedHabits);

    const storedDate = localStorage.getItem('selectedDate');
    if (storedDate) {
      setSelectedDate(new Date(storedDate));
    }
  }, []);

  const handleModalToggle = () => setShowModal(!showModal);
  const handleCalendarToggle = () => setShowCalendar(!showCalendar);

  const handleSaveHabit = () => {
    if (newHabitName.trim() === '') {
      setNameError('Please enter a habit name');
      return;
    }
    setNameError('');
    if (newHabitName.trim() !== '') {
      const frequency = document.getElementById('habitFrequency').value; 
      const newHabit = {
        name: newHabitName,
        completions: Array(7).fill(false),
        frequency: frequency, 
        reminder: reminder,
        dates: [],
        reminderDate: selectedDate
      };
      const updatedHabits = [...habits, newHabit];
      setHabits(updatedHabits);
      localStorage.setItem('habits', JSON.stringify(updatedHabits));
      setNewHabitName('');
      setReminder(false); 
      handleModalToggle();
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    localStorage.setItem('selectedDate', date.toISOString());
  };

  const toggleHabitCompletion = (habitIndex, dateIndex) => {
    setHabits(prevHabits => {
      const updatedHabits = prevHabits.map((habit, index) => {
        if (index === habitIndex) {
          const newCompletions = [...habit.completions];
          newCompletions[dateIndex] = !newCompletions[dateIndex];
          
          const completionDate = new Date();
          completionDate.setDate(completionDate.getDate() - dateIndex);
          
          let newDates = [...habit.dates];
          if (newCompletions[dateIndex]) {
            if (!newDates.some(d => d.toDateString() === completionDate.toDateString())) {
              newDates.push(completionDate);
            }
          } else {
            newDates = newDates.filter(d => d.toDateString() !== completionDate.toDateString());
          }
          
          return { ...habit, completions: newCompletions, dates: newDates };
        }
        return habit;
      });
      localStorage.setItem('habits', JSON.stringify(updatedHabits));
      return updatedHabits;
    });
  };

  const handleChartNavigation = () => {
    navigate('/habit-chart', { state: { habits: habits } });
  };

  const handleDeleteHabit = (habitIndex) => {
    const updatedHabits = habits.filter((_, index) => index !== habitIndex);
    setHabits(updatedHabits);
    localStorage.setItem('habits', JSON.stringify(updatedHabits));
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
          <button onClick={handleModalToggle} className={`${styles.btnCircle} me-4`}>+</button>
          <button onClick={handleChartNavigation} className={`${styles.btnCircle} me-4`}>〽</button>
          <button onClick={handleCalendarToggle} className={`${styles.btnCircle} me-4`}>&#128467;</button>
        </div>

        <div className="row">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <h2 className="mb-0 mx-2">Your habits</h2>
            <div className={`${styles.calendarStrip} d-flex justify-content-between mb-4 mt-4 p-2 rounded`}>
              {dates.map((item, index) => (
                <div key={index} className={`${styles.calendarDay} text-center p-1 rounded ${item.isToday ? styles.today : ''}`}>
                  <div className={styles.dateNumber}>{item.date}</div>
                  <div className={styles.dayName}>{item.day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {habits.map((habit, habitIndex) => (
          <div key={habitIndex} className={`${styles.habitRow} d-flex align-items-center mb-3`}>
            <div className={`${styles.habitName} d-flex align-items-center`}>
              {habit.name}
              <button
                className={`${styles.deleteButton} ms-2`}
                onClick={() => handleDeleteHabit(habitIndex)}
                aria-label="Delete habit"
              >
                ×
              </button>
            </div>
            <div className={`${styles.completionStrip} d-flex justify-content-between`}>
              {habit.completions.map((completed, dateIndex) => (
                <button
                  key={`${habitIndex}-${dateIndex}`}
                  className={`${styles.completionButton} ${completed ? styles.completed : styles.notCompleted}`}
                  onClick={() => toggleHabitCompletion(habitIndex, dateIndex)}
                >
                  {completed ? '✔' : '×'}
                </button>
              ))}
            </div>
          </div>
        ))}

        {habits.length === 0 && (
          <div className="flex-grow-1 d-flex align-items-center justify-content-center">
            <div className={`${styles.bigCircle} d-flex align-items-center justify-content-center text-center mt-4 p-3`}>
              You have no active habits
            </div>
          </div>
        )}

        <Modal show={showModal} onHide={handleModalToggle} centered>
          <Modal.Header closeButton className={`${styles.modalHeader}`}>
            <Modal.Title className={`${styles.headerModal} text-white`}>Create Habit</Modal.Title>
          </Modal.Header>
          <Modal.Body className={`${styles.modalBody}`}>
            <Form>
            <Form.Group controlId="habitName">
              <Form.Label htmlFor="habitName" className="text-white">Name</Form.Label>
              <Form.Control
                id="habitName"
                type="text"
                placeholder="Enter habit"
                className={`${styles.inputField} ${nameError ? 'is-invalid' : ''}`}
                value={newHabitName}
                onChange={(e) => {
                  setNewHabitName(e.target.value);
                  if (e.target.value.trim() !== '') {
                    setNameError('');
                  }
                }}
              />
              {nameError && <div className="invalid-feedback">{nameError}</div>}
            </Form.Group>

              <Form.Group controlId="habitFrequency" className="mt-3">
                <Form.Label htmlFor="habitFrequency" className="text-white">Frequency</Form.Label>
                <Form.Select id="habitFrequency" className={styles.inputField}>
                  <option value="everyday">Everyday</option>
                  <option value="every3days">Every 3 Days</option>
                  <option value="onceaweek">Once a Week</option>
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="habitReminder" className="mt-3 d-flex align-items-center justify-content-between">
                <Form.Label htmlFor="habitReminder" className="text-white mb-0">Reminder</Form.Label>
                <Form.Check
                  type="switch"
                  id="habitReminder"
                  className={styles.switch}
                  checked={reminder}
                  onChange={() => setReminder(!reminder)}
                />
              </Form.Group>

              <Form.Group controlId="habitDate" className="mt-3">
                <Form.Label htmlFor="habitDate" className="text-white">Select Date</Form.Label>
                <Form.Control
                  id="habitDate"
                  type="date"
                  className={`${styles.inputField} mx-auto`}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                />
              </Form.Group>

              <Button variant="outline-light" onClick={handleSaveHabit} className={`${styles.saveButton} mt-4 w-100`}>
                Save Habit
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal 
        show={showCalendar} 
        onHide={handleCalendarToggle} 
        centered
        className={styles.calendarModal}
      >
        <Modal.Header closeButton className={styles.calendarModalHeader}>
          <Modal.Title>Habits Calendar</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.calendarModalBody}>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            className={styles.customCalendar}
            tileClassName={({ date, view }) => 
              view === 'month' && 
              (habits.some(habit => habit.dates.some(d => d.toDateString() === date.toDateString())) ||
               habits.some(habit => habit.reminderDate && habit.reminderDate.toDateString() === date.toDateString()))
                ? styles.hasHabit 
                : null
            }
          />
        </Modal.Body>
      </Modal>
      </div>
    </div>
  );
};

export default HabitPage;