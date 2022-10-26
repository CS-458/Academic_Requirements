import React from "react";
// @ts-ignore
import {ReactComponent as XSymbol} from '../images/xSymbol.svg';

import "./DeleteableInput.css";

const InputPage = (props: {
    text: string, onClickDelete: () => void,
  }) => {

    return (
        <div className="container" key={props.text}>
            <XSymbol className="x" onClick={props.onClickDelete} />
            {props.text}
        </div>
    );
  }

export default InputPage;