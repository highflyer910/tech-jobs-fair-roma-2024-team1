import { useEffect, useState } from "react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socket = new WebSocket("https://unsightly-maurise-marinalucentini-fc955053.koyeb.app/ws-notifications"); // Modifica l'URL se necessario

    socket.onopen = () => {
      console.log("WebSocket connected");
      // Puoi inviare un messaggio di benvenuto o altre informazioni
      socket.send(JSON.stringify({ type: "greeting", content: "Hello!" }));
    };

    socket.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      console.log("Received notification: ", notification);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socket.close(); // Chiudi la connessione WebSocket al termine del componente
    };
  }, []);

  return <div>My Component</div>;
};

export default Notifications;
