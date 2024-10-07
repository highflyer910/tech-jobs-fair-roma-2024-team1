import { Modal } from "react-bootstrap";

const Calendar = ({ showCalendar, handleCalendarToggle, styles, habit }) => {
  return (
    <>
      <Modal show={showCalendar} onHide={handleCalendarToggle} centered className={styles.calendarModal}>
        <Modal.Header closeButton className={styles.calendarModalHeader}>
          <Modal.Title>Habits Calendar</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.calendarModalBody}>
          {/* {habit.length > 0 && (
              <Calendar
            
              
                className={styles.customCalendar}
                // tileClassName={({ date }) => {
                //   const calendarDate = new Date(date);
                //   const hasHabit = habit.some((habit) => new Date(habit.createdAt).toDateString() === calendarDate.toDateString());
                //   const hasReminder =
                //     Array.isArray(notifications) &&
                //     notifications.some((notification) => new Date(notification.scheduledAt).toDateString() === calendarDate.toDateString());

                //   const classNames = [];
                //   if (hasHabit) classNames.push(styles.hasHabit);
                //   if (hasReminder) classNames.push(styles.hasReminder);

                //   return classNames.join(" ") || null;
                // }}
              />
            )} */}
        </Modal.Body>
      </Modal>{" "}
    </>
  );
};
export default Calendar;
