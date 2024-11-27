import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";

function Home() {
  const [count, setCount] = useState(0);
  const [inputField, setInputField] = useState("");
  const [treeCount, setTreesCount] = useState(0);
  const [a, setA] = useState([]);
  const [image, setImage] = useState(null);
  //enter key input reference
  //https://www.geeksforgeeks.org/how-to-get-the-enter-key-in-reactjs/

  //save reminder button function if needed
  // <button
  //           onClick={() => {
  //             pushReminder(inputField);
  //             setCount(count + 1);
  //             setInputField("");
  //           }}
  //         >
  //           Save Reminder
  //         </button>

  //image upload is generated from chat gpt
  const imageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };
  //tesseract recognise reference
  //https://stackoverflow.com/questions/65835056/how-to-use-tesseract-recognize-in-nodejs
  const ocrFunction = () => {
    Tesseract.recognize(image, "eng").then(({ data: { text } }) => {
      //setOutput(text);
      setInputField(text);
    });
  };

  return (
    <div className="bg-dark text-white min-vh-100 d-flex justify-content-center align-items-top">
      <div className="container text-center">
        <div className="mt-3">
          <>
            <button
              class="btn btn-outline-light btn-sm"
              onClick={() => {
                clearReminders();
              }}
            >
              Clear Reminders
            </button>{" "}
            &nbsp;
            <button
              class="btn btn-outline-light btn-sm"
              onClick={() => {
                RemoveTrees();
              }}
            >
              Cut Down Trees
            </button>
            &nbsp;
            <br />
            <input
              class="form-control w-50 mx-auto"
              value={inputField}
              onChange={(textBox) => setInputField(textBox.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  pushReminder(inputField);
                  setCount(count + 1);
                  setInputField("");
                }
              }}
              type="text"
              placeholder="Type a reminder!"
            />{" "}
            <h3>You have {count} reminders</h3>
            <div className="text-start">
              <ul>
                {a.map((item, index) => (
                  <li key={index}>
                    <button
                      className="form-check-input"
                      onClick={() => {
                        removeReminder(index);
                      }}
                    ></button>{" "}
                    &nbsp;
                    {item}
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
              class="form-control w-50 mx-auto"
              type="file"
              accept="image/*"
              onChange={imageUpload}
            />
            <button
              class="btn btn-outline-light btn-sm"
              onClick={() => {
                ocrFunction();
                //tesseractInputField();
              }}
            >
              Save Reminder
            </button>
          </>
        </div>
      </div>
    </div>
  );
  //function to push a reminder to the array
  function pushReminder(newReminder) {
    setA([...a, newReminder]);
  }
  //remove reminder
  //remove the reminder by taking the index of the reminder
  //clicked on and splice the array at that index until
  //one index after
  //then set the counts as needed
  function removeReminder(i) {
    const newArray = [...a];
    newArray.splice(i, 1);
    setA(newArray);
    setCount(count - 1);
    setTreesCount(treeCount + 1);
  }
  //clear trees
  function RemoveTrees() {
    setTreesCount(0);
  }
  //conditional rendering of trees message
  //uses the count of number of trees to display different messages
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

  //clear all reminders
  function clearReminders() {
    setA([]);
    setCount(0);
  }
  // //set the tesseract ocr text to the input field textBox
  // function tesseractInputField() {
  //   setInputField(output);
  // }

  //conditional rendering of tesseract text output
  function tesseractOutput() {
    return <>This is a test</>;
  }
}

export default Home;
