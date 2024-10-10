import { useEffect, useMemo, useState } from "react";
import { Toast } from "react-bootstrap";

const Notifications = ({ localHabit }) => {
  const [showToast, setShowToast] = useState(false);
  const filteredNotification = useMemo(() => {
    const today = new Date();

    // 1) Filtra le abitudini per la data corrente
    const filteredHabit = localHabit.filter((habit) => {
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

            // Verifica se la data coincide con quella odierna
            return habitDate.getFullYear() === today.getFullYear() && habitDate.getMonth() === today.getMonth() && habitDate.getDate() === today.getDate();
          })
        : false; // Cambiato a false se non ci sono frequencyDates
    });

    // 2) Condiziona le notifiche in base a reminder (true) e completed (false)
    const habitsReminderAndNotComplete = filteredHabit.filter((habit) => {
      return habit.reminder === true && habit.completed === false;
    });

    return habitsReminderAndNotComplete;
  }, [localHabit]);
  useEffect(() => {
    if (filteredNotification.length > 0) {
      setShowToast(true);
    } else {
      setShowToast(false);
    }
  }, [filteredNotification]);
  return (
    <div>
      <Toast show={showToast} onClose={() => setShowToast(false)}>
        <Toast.Header>
          <strong className="me-auto">Notification</strong>
        </Toast.Header>
        <Toast.Body>
          {" "}
          {filteredNotification.length === 0 ? (
            <p>Nessuna notifica disponibile.</p>
          ) : (
            <ul>{localHabit && filteredNotification.map((habit, index) => <li key={index}>{`Reminder: ${habit.name}`}</li>)}</ul>
          )}
        </Toast.Body>
      </Toast>
    </div>
  );
};

export default Notifications;
