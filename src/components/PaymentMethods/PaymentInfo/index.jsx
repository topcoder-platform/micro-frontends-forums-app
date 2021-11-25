import React from "react";
import cn from "classnames";
import PT from "prop-types";

import "./styles.module.scss";

/**
 * The payment info component which displays the properties of each payment method
 * @param {*}
 * @returns
 */
const PaymentInfo = ({ icon, label, value, isLastChild }) => {
  return (
    <div styleName={cn("payment-info", isLastChild && "last-child")}>
      <div styleName="icon-wrapper">{icon}</div>
      <div styleName="content">
        <div styleName="label">{label}</div>
        <div styleName="value">{value}</div>
      </div>
    </div>
  );
};

PaymentInfo.propTypes = {
  icon: PT.node,
  label: PT.string,
  value: PT.string,
  isLastChild: PT.bool,
};

export default PaymentInfo;
