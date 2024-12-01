import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/", // Django backend URL
});

// Example: Fetching reminders (GET request)
api
  .get("notes/")
  .then((response) => {
    console.log("Reminders:", response.data);
  })
  .catch((error) => {
    console.error("Error fetching reminders:", error);
  });

// Example: Creating a reminder (POST request)
const createReminder = (content) => {
  api
    .post("notes/", { text: content })
    .then((response) => {
      console.log("Reminder created:", response.data);
    })
    .catch((error) => {
      console.error("Error creating reminder:", error);
    });
};

// Example: Deleting a reminder (DELETE request)
const deleteReminder = (id) => {
  api
    .delete(`notes/delete/${id}/`)
    .then((response) => {
      console.log("Reminder deleted");
    })
    .catch((error) => {
      console.error("Error deleting reminder:", error);
    });
};
