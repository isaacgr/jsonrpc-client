import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Downshift from "downshift";

export default function SubscriptionsInput({ ...props }) {
  const { startSubscribe, stopSubscribe, placeholder, tags, ...other } = props;
  const [inputValue, setInputValue] = React.useState("");
  const [selectedItem, setSelectedItem] = React.useState([]);
  useEffect(() => {
    setSelectedItem(tags);
  }, [tags]);

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      const newSelectedItem = [...selectedItem];
      const duplicatedValues = newSelectedItem.indexOf(
        event.target.value.trim()
      );

      if (duplicatedValues !== -1) {
        setInputValue("");
        return;
      }
      if (!event.target.value.replace(/\s/g, "").length) return;

      newSelectedItem.push(event.target.value.trim());
      setSelectedItem(newSelectedItem);
      setInputValue("");
      startSubscribe(event.target.value);
    }
    if (
      selectedItem.length &&
      !inputValue.length &&
      event.key === "Backspace"
    ) {
      setSelectedItem(selectedItem.slice(0, selectedItem.length - 1));
      stopSubscribe(event.target.value);
    }
  }
  function handleChange(item) {
    let newSelectedItem = [...selectedItem];
    if (newSelectedItem.indexOf(item) === -1) {
      newSelectedItem = [...newSelectedItem, item];
    }
    setInputValue("");
    setSelectedItem(newSelectedItem);
  }

  const handleDelete = (item) => () => {
    const newSelectedItem = [...selectedItem];
    newSelectedItem.splice(newSelectedItem.indexOf(item), 1);
    setSelectedItem(newSelectedItem);
    stopSubscribe(item);
  };

  function handleInputChange(event) {
    setInputValue(event.target.value);
  }
  return (
    <React.Fragment>
      <Downshift
        id="downshift-multiple"
        inputValue={inputValue}
        onChange={handleChange}
        selectedItem={selectedItem}
      >
        {({ getInputProps }) => {
          const { onBlur, onChange, onFocus, ...inputProps } = getInputProps({
            onKeyDown: handleKeyDown,
            placeholder
          });
          return (
            <div style={{ width: "25%" }}>
              <TextField
                InputProps={{
                  startAdornment: selectedItem.map((item) => (
                    <Chip
                      sx={{ margin: "0 1rem" }}
                      key={item}
                      tabIndex={-1}
                      label={item}
                      onDelete={handleDelete(item)}
                    />
                  )),
                  onBlur,
                  onChange: (event) => {
                    handleInputChange(event);
                    onChange(event);
                  },
                  onFocus
                }}
                {...other}
                {...inputProps}
              />
            </div>
          );
        }}
      </Downshift>
    </React.Fragment>
  );
}
SubscriptionsInput.defaultProps = {
  tags: []
};
SubscriptionsInput.propTypes = {
  startSubscribe: PropTypes.func.isRequired,
  stopSubscribe: PropTypes.func.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string)
};
