import { useState, useEffect } from "react";
import api from "../api";

function Home() {
  const [count, setCount] = useState(0); // State for tracking reminders count
  const [inputField, setInputField] = useState(""); // State for input field value
  const [treeCount, setTreesCount] = useState(0); // State for tracking number of "trees"
  const [a, setA] = useState([]); // State for storing reminders array
  const [image, setImage] = useState(null); // State for uploaded image

  // Fetch reminders from the API when the component mounts
  useEffect(() => {
    fetchReminders();
  }, []);

  // Function to fetch reminders from the API
  const fetchReminders = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/notes/");
      const data = await response.json();
      console.log(data); // This should print the reminders
    } catch (error) {
      console.error("Error fetching reminders:", error);
    }
  };

  // Save reminder button function if needed
  // <button
  //           onClick={() => {
  //             pushReminder(inputField);
  //             setCount(count + 1);
  //             setInputField("");
  //           }}
  //         >
  //           Save Reminder
  //         </button>

  // Function to handle image upload
  const imageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  // Tesseract recognize reference
  // https://stackoverflow.com/questions/65835056/how-to-use-tesseract-recognize-in-nodejs
  const ocrFunction = () => {
    if (!image) {
      alert("Please upload an image first.");
      return;
    }

    Tesseract.recognize(image, "eng").then(({ data: { text } }) => {
      setInputField(text); // Populate the input field with the OCR result
    });
  };

  return (
    <div className="bg-dark text-white min-vh-100 d-flex justify-content-center align-items-top">
      <div className="container text-center">
        <div className="mt-3">
          <>
            <button
              className="btn btn-outline-light btn-sm"
              onClick={clearReminders}
            >
              Clear Reminders
            </button>{" "}
            &nbsp;
            <button
              className="btn btn-outline-light btn-sm"
              onClick={RemoveTrees}
            >
              Cut Down Trees
            </button>
            &nbsp;
            <br />
            <input
              className="form-control w-50 mx-auto"
              value={inputField}
              onChange={(textBox) => setInputField(textBox.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  pushReminder(inputField);
                }
              }}
              type="text"
              placeholder="Type a reminder!"
            />{" "}
            <h3>You have {count} reminders</h3>
            <div className="text-start">
              <ul>
                {a.map((item, index) => (
                  <li key={item.id}>
                    <button
                      className="form-check-input"
                      onClick={() => removeReminder(index)}
                    ></button>{" "}
                    &nbsp;
                    {item.content}
                  </li>
                ))}
              </ul>
            </div>
            <h3>
              <TreesRender treeCount={treeCount} />
              <h1>&nbsp;</h1>
            </h3>
            <h5>Upload an image to save:</h5>
            <input
              className="form-control w-50 mx-auto"
              type="file"
              accept="image/*"
              onChange={imageUpload}
            />
            <button
              className="btn btn-outline-light btn-sm"
              onClick={ocrFunction}
            >
              Save Reminder
            </button>
          </>
        </div>
      </div>
    </div>
  );

  // Function to push a reminder to the array
  function pushReminder(newReminder) {
    if (newReminder.trim() === "") {
      alert("Please enter a valid reminder.");
      return;
    }

    api
      .post("http://localhost:8000/api/notes/", { content: newReminder }) // API call to save the reminder
      .then((res) => {
        if (res.status === 201) {
          alert("Reminder saved!");
          fetchReminders(); // Refresh reminders from the API
        } else {
          alert("Failed to save reminder.");
        }
      })
      .catch((err) => alert("Error saving reminder: " + err));

    setInputField(""); // Clear the input field
  }

  // Remove reminder
  // Remove the reminder by taking the index of the reminder
  // clicked on and delete it via API
  // Then update the reminders and counts as needed
  function removeReminder(i) {
    const reminderId = a[i].id; // Retrieve ID of the reminder
    api
      .delete(`/api/notes/${reminderId}/`) // API call to delete the reminder
      .then((res) => {
        if (res.status === 204) {
          alert("Reminder deleted!");
          setTreesCount(treeCount + 1); // Increment tree count
          fetchReminders(); // Refresh reminders
        } else {
          alert("Failed to delete reminder.");
        }
      })
      .catch((err) => alert("Error deleting reminder: " + err));
  }

  // Clear trees
  function RemoveTrees() {
    setTreesCount(0); // Reset tree count
  }

  // Conditional rendering of trees message
  // Uses the count of number of trees to display different messages
  function TreesRender(props) {
    let treeCount = props.treeCount;
    console.clear();
    console.log(treeCount);
    if (treeCount === 0) {
      return <>You have {treeCount} trees... do better</>;
    }
    if (treeCount < 10) {
      return <>You have {treeCount} trees... getting there!</>;
    }
    if (treeCount < 20) {
      return <>You have {treeCount} trees great job!</>;
    }
    return <>You have {treeCount} trees amazing work!</>;
  }

  // Clear all reminders
  function clearReminders() {
    api
      .delete("/api/reminders/clear/") // Assuming API endpoint for clearing all reminders
      .then((res) => {
        if (res.status === 200) {
          setA([]); // Clear the reminders list
          setCount(0); // Reset the count
          alert("All reminders cleared!");
        } else {
          alert("Failed to clear reminders.");
        }
      })
      .catch((err) => alert("Error clearing reminders: " + err));
  }

  // // Set the Tesseract OCR text to the input field textbox
  // function tesseractInputField() {
  //   setInputField(output);
  // }

  // Conditional rendering of Tesseract text output
  function tesseractOutput() {
    return <>This is a test</>;
  }
}

export default Home;
