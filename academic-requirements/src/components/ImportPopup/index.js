import { React, useEffect, useState } from "react";
import popupStyles from "./ImportPopup.module.css";
import ErrorPopup from "../ErrorPopup";
import PropTypes from "prop-types";

const ImportPopup = (props) => {
  const [show, setShow] = useState(false);

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
    // if it is file "uploads" (really justs closes the the pop up)
    else {
      console.log("upload");
      closeHandler();
    }
  };

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
};

export default ImportPopup;
