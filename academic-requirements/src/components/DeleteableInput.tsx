import React from "react";
// @ts-ignore
import { ReactComponent as XSymbol } from "../images/xSymbol.svg";
import clsx from "clsx";

import "./DeleteableInput.css";

const DeleteableInput = (props: { text: string, thinWidth: boolean }) => {
  return (
    <div 
      className={clsx("container", props.thinWidth && "thin")}  
      key={props.text}
    >
      <XSymbol className="x" />
      {props.text}
    </div>
    );
  }

export default DeleteableInput;
