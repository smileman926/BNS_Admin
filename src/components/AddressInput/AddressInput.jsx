import React, { useEffect } from "react";
import { Input } from "antd";
import { useState } from "react";

function AddressInput(props) {
  const { onChange, ...rest } = props;
  const { google } = window;
  const autocompleteInput = React.createRef();

  useEffect(() => {
    if (google) {
      const autoComplete = new google.maps.places.Autocomplete(
        autocompleteInput.current.input,
        { types: ["geocode"], componentRestrictions: { country: "us" } }
      );
      autoComplete.addListener("place_changed", () => {
        onChange(autoComplete.getPlace().formatted_address);
      });
    }
  }, [google]);

  return <Input {...rest}
            onChange={({ target }) => onChange(target.value)} 
            ref={autocompleteInput} />;
}

export default AddressInput;
