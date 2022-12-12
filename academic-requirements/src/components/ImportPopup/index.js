import { React, useEffect, useState } from "react";
import popupStyles from "./ImportPopup.module.css";
import ErrorPopup from "../ErrorPopup";
import PropTypes from "prop-types";

const ImportPopup = (props) => {
  const [show, setShow] = useState(false);

  let data;

  const closeHandler = (e) => {
    setShow(false);
    props.onClose(false);
  };

  const [visibility, setVisibility] = useState(false);
  const popupCloseHandler = () => {
    setVisibility(false);
  };
  const [error, setError] = useState("");
  function throwError(error) {
    setVisibility(true);
    setError(error);
  }

  /*
  This is the function that calls to process the upload the selected file.
  Right now it does nothing but closed the popup and checks the file type if it's JSON 
  TODO: Process info in user uploaded .json file
  */
  const processUpload = () => {
    // HTML of the uploaded file
    var filenameElement = document.getElementById("fileName");

    var file = document.getElementById("fileName").files[0];

    // if file has been selected
    if (filenameElement.files.length > 0) {
      //store file name in fileName
      var fileName = filenameElement.files.item(0).name;
    }
    // if file has NOT been selected
    else {
      //Close uploader popup and throw error
      closeHandler();
      throwError("No file selected");
      return;
    }
    // if uploaded file is not a json -> throws error
    if (fileName.split(".").pop().toLowerCase() !== "json") {
      closeHandler();
      throwError("Not a JSON File");
    }
    // if it is file "uploads"
    else {
      let fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = function () {
        data = JSON.parse(fileReader.result);
        if(checkJSON(data)) {
          props.returnMajor(data.major)
          props.returnConcentration(data.concentration)
          props.returnCompleted(data.completed)
          props.returnSemester1(data.semester1)
          props.returnSemester2(data.semester2)
          props.returnSemester3(data.semester3)
          props.returnSemester4(data.semester4)
          props.returnSemester5(data.semester5)
          props.returnSemester6(data.semester6)
          props.returnSemester7(data.semester7)
          props.returnSemester8(data.semester8)
        }
      }
      closeHandler();
    }
  };

  function checkJSON(thisData) {
    if(!thisData.hasOwnProperty("major") || !thisData.hasOwnProperty("concentration") || !thisData.hasOwnProperty("completed") ||
       !thisData.hasOwnProperty("semester1") || !thisData.hasOwnProperty("semester2") || !thisData.hasOwnProperty("semester3") ||
       !thisData.hasOwnProperty("semester4") || !thisData.hasOwnProperty("semester5") || !thisData.hasOwnProperty("semester6") ||
       !thisData.hasOwnProperty("semester7") || !thisData.hasOwnProperty("semester8")) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    setShow(props.show);
  }, [props.show]);

  return (
    <div data-testid="errorPagePopup">
      <ErrorPopup
        onClose={popupCloseHandler}
        show={visibility}
        title="Error"
        error={error}
      />
      <div
        style={{
          visibility: show ? "visible" : "hidden",
          opacity: show ? "1" : "0",
        }}
        className={popupStyles.overlay}
        data-testid="uploaderPage"
      >
        <div className={popupStyles.popup} data-testid="pie">
          <h2>{props.title}</h2>
          <input type="file" id="fileName" data-testid="chooseFile" />
          <button onClick={processUpload} data-testid="uploadButton">
            Upload
          </button>
          <span className={popupStyles.close} onClick={closeHandler}>
            &times;
          </span>
          <div className={popupStyles.content}>{props.import}</div>
        </div>
      </div>
    </div>
  );
};

ImportPopup.propTypes = {
  title: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  returnMajor: PropTypes.func.isRequired,
  returnConcentration: PropTypes.func.isRequired,
  returnCompleted: PropTypes.func.isRequired,
  returnSemester1: PropTypes.func.isRequired,
  returnSemester2: PropTypes.func.isRequired,
  returnSemester3: PropTypes.func.isRequired,
  returnSemester4: PropTypes.func.isRequired,
  returnSemester5: PropTypes.func.isRequired,
  returnSemester6: PropTypes.func.isRequired,
  returnSemester7: PropTypes.func.isRequired,
  returnSemester8: PropTypes.func.isRequired
};

export default ImportPopup;
