import PageH3 from "components/PageElements/PageH3";
import { PAYMENT_METHOD_DETAILS_MAP, PAYMENT_METHOD_MAP } from "constants";
import React from "react";
import "./styles.module.scss";

/**
 * This component shows the steps to be done to
 * subscribe to this payment method
 * @returns
 */
const EmailDetails = ({ paymentMethod }) => {
  const { instructions } = PAYMENT_METHOD_DETAILS_MAP[paymentMethod];

  return (
    <div styleName="email-details">
      <PageH3 styleName="title">
        Do you have your {PAYMENT_METHOD_MAP[paymentMethod]} account details?
        Great!
      </PageH3>
      <ul styleName="instructions">
        {instructions.map((instruction) => (
          <li>
            <span dangerouslySetInnerHTML={{ __html: instruction.label }} />
            <ul styleName="instructions">
              {instruction.children &&
                instruction.children.map((child) => (
                  <li dangerouslySetInnerHTML={{ __html: child }} />
                ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmailDetails;
