import { useEffect, useState } from "react";
import { GetNotifications } from "../../redux/action/notification";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await GetNotifications();
        setNotifications(data.content); // Adatta secondo la struttura della tua risposta
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) return <p>Caricamento notifiche...</p>;
  if (error) return <p style={{ color: "red" }}>Errore: {error}</p>;

  return (
    <div>
      <h3>Notifications</h3>
      {notifications.length === 0 ? (
        <p>Nessuna notifica disponibile.</p>
      ) : (
        <ul>
          {notifications.map((notification, index) => (
            <li key={index}>{notification.message}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
