export const GetNotifications = async () => {
  const token = localStorage.getItem("authToken"); // Recupera il token dal localStorage

  if (!token) {
    console.error("Nessun token trovato. Effettua il login.");
    throw new Error("Nessun token trovato. Effettua il login.");
  }

  try {
    const response = await fetch("https://unsightly-maurise-marinalucentini-fc955053.koyeb.app/notifications", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Aggiungi il token nell'header Authorization
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Errore nel recupero delle notifiche");
    }

    const data = await response.json();
    return data; // Ritorna i dati delle notifiche
  } catch (error) {
    console.error("Errore nella richiesta:", error.message);
    throw error;
  }
};
