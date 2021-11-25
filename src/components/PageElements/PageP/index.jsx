/**
 * PageP
 *
 * page content paragraph tag
 */
import React from "react";
import PT from "prop-types";
import cn from "classnames";
import "./styles.module.scss";

const PageP = ({ children, styleName, ...props }) => {
  return (
    <p styleName={cn("page-p", styleName || "")} {...props}>
      {children}
    </p>
  );
};

PageP.propTypes = {
  children: PT.node,
};

export default PageP;
