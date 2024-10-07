import { Modal } from "react-bootstrap";
import styles from "../HabitsDashboard/HabitPage.module.css";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
const localizer = momentLocalizer(moment);
const CalendarModal = ({ showCalendar, handleCalendarToggle }) => {
  const { habit } = useSelector((state) => state.habits);
  const [events, setEvents] = useState([]);
  useEffect(() => {
    if (habit && habit.content.length > 0) {
      const newEvents = habit.content.flatMap((habitItem) => {
        const hasFrequencyDates = habitItem.frequencyDates && habitItem.frequencyDates.length > 0;

        if (hasFrequencyDates) {
          return habitItem.frequencyDates.map((date) => {
            // Usa moment.js per convertire LocalDateTime in Date
            const parsedDate = moment(date).toDate(); // Converte in oggetto Date

            return {
              title: habitItem.habit.name,
              start: parsedDate,
              end: parsedDate,
              allDay: true,
              type: "hasHabit", // Tipo per identificare gli eventi
            };
          });
        } else {
          const createdAtDate = moment(habitItem.createdAt).toDate(); // Converte LocalDateTime a Date

          return {
            title: habitItem.habit.name,
            start: createdAtDate,
            end: createdAtDate,
            allDay: true,
            type: "hasHabit", // Tipo per identificare gli eventi
          };
        }
      });
      setEvents(newEvents);
    }
  }, [habit]);

  // Stile personalizzato per gli eventi con classi dinamiche
  const eventStyleGetter = (event) => {
    const className = event.type === "hasHabit" ? styles.hasHabit : styles.hasReminder;

    return {
      className,
    };
  };

  // Stile per le date fuori dal mese corrente
  const dayStyleGetter = (date) => {
    const isCurrentMonth = moment().isSame(date, "month");
    const className = !isCurrentMonth ? styles.outsideMonth : "";

    return {
      className,
    };
  };
  return (
    <>
      <Modal show={showCalendar} onHide={handleCalendarToggle} centered className={styles.calendarModal}>
        <Modal.Header closeButton className={styles.calendarModalHeader}>
          <Modal.Title>Habits Calendar</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.calendarModalBody}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            eventPropGetter={eventStyleGetter} // Applica lo stile dinamico agli eventi
            dayPropGetter={dayStyleGetter} // Applica lo stile dinamico alle date
            views={["month", "agenda"]} // Abilita la vista "agenda"
            style={{ height: 500 }}
          />
        </Modal.Body>
      </Modal>{" "}
    </>
  );
};
export default CalendarModal;
