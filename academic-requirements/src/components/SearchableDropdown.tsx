import React from "react";
import Select, { SingleValue } from "react-select";
import "./SearchableDropdown.css";

const SearchableDropdown = (props: {
  options: Array<string>;
  label: string;
  onSelectOption: (option: string) => void;
  showDropdown: boolean;
  thin: boolean;
}) => {
  // Runs a debug message with the selected major
  // and passes the name of the selected class to onSelectOption
  function onChangeOption(
    option: SingleValue<{ label: string; value: string }>
  ) {
    console.log(option && "Selected Option: " + option.value);
    if (option) {
      props.onSelectOption(option.label);
    }
  }

  return (
    <div className={props.thin ? "thinContainer" : "container"} data-testid="select">
      {/* Text that labels the search box*/}
      <div className={props.thin ? "thinLabel" : "label"}>{props.label}</div>
      {/* Dropdown box */}
      {props.showDropdown && (
          <Select
          options={props.options.map((opt) => ({ label: opt, value: opt }))}
          onChange={onChangeOption}
          defaultInputValue={"HEY"}
          />
      )}
    </div>
  );
};

export default SearchableDropdown;
