import Button from "components/Button";
import React from "react";
import { navigate } from "@reach/router";

import PaymentInfo from "./PaymentInfo";
import IconDollar from "../../assets/images/icon-dollar.svg";
import IconWorld from "../../assets/images/icon-world.svg";
import IconSpeed from "../../assets/images/icon-speed.svg";
import { PAYMENT_METHOD_MAP, PAYMENT_METHODS } from "constants";

import "./styles.module.scss";

/**
 * List of payments methods shown in provider page
 * @returns
 */
const PaymentMethods = () => {
  const onGoToPaymentMethod = (name) => {
    navigate(`/onboard/payment-setup/payment-provider/${name}`);
  };

  return (
    <div styleName="payment-methods">
      {PAYMENT_METHODS.map((method) => (
        <div styleName="payment-method-card">
          <div styleName="button-wrapper">
            <Button
              styleName="payment-button"
              onClick={() => onGoToPaymentMethod(method.name)}
            >
              {PAYMENT_METHOD_MAP[method.name]}
            </Button>
          </div>
          <div styleName="content-wrapper">
            <PaymentInfo
              icon={<IconDollar />}
              label="Fees"
              value={method.fees}
              isLastChild={false}
            />
            <PaymentInfo
              icon={<IconWorld />}
              label="countries"
              value={`Available in ${method.countries}+ countries`}
              isLastChild={false}
            />
            <PaymentInfo
              icon={<IconSpeed />}
              label="Speed"
              value={`Up to ${method.speed} Business Day`}
              isLastChild={true}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentMethods;
