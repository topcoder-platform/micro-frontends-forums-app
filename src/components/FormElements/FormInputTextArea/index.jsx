/**
 * FormInputTextArea
 *
 * Form Input textarea
 */
import React from "react";
import PT from "prop-types";
import cn from "classnames";
import "./styles.module.scss";

const FormInputTextArea = ({ styleName, ...props }) => {
  return (
    <textarea
      styleName={cn("form-input-textarea", styleName || "")}
      {...props}
      cols={10}
    />
  );
};

FormInputTextArea.propTypes = {};

export default FormInputTextArea;
