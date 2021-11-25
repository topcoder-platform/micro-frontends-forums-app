/**
 * FormInputCheckbox
 *
 * Form Input Checkbox
 */
import React from "react";
import PT from "prop-types";
import cn from "classnames";
import styles from "./styles.module.scss";
import Checkbox from "rc-checkbox";

import "rc-checkbox/assets/index.css";

const FormInputCheckbox = ({
  label,
  onChange = (f) => f,
  styleName,
  ...props
}) => {
  return (
    <label styleName={cn("styles.form-input-checkbox", styleName || "")}>
      <Checkbox
        className={"form-input-rc-checkbox"}
        onChange={onChange}
        {...props}
      />
      <span styleName="styles.label">{label}</span>
    </label>
  );
};

FormInputCheckbox.propTypes = {
  label: PT.string,
};

export default FormInputCheckbox;
