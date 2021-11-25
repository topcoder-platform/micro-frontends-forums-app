/** Payment setup page */
import React, { useState } from "react";
import "./styles.module.scss";
import { Link, useNavigate } from "@reach/router";
import { useSelector } from "react-redux";
import withAuthentication from "hoc/withAuthentication";

// import components and other stuffs
import Page from "components/Page";
import PageContent from "components/PageContent";
import PageH1 from "components/PageElements/PageH1";
import PageH2 from "components/PageElements/PageH2";
import PageDivider from "components/PageDivider";
import PageFoot from "components/PageElements/PageFoot";
import PageP from "components/PageElements/PageP";
import Button from "components/Button";
import OnboardProgress from "components/OnboardProgress";
import {
  BUTTON_SIZE,
  BUTTON_TYPE,
  TAX_FORM,
  PAYMENT_PROVIDER,
  PAYMENT_METHOD_MAP,
} from "constants";
import { getAuthUserProfile } from "@topcoder/micro-frontends-navbar-app";

import IconCheck from "../../assets/images/check.svg";

const PaymentSetup = () => {
  const authUser = useSelector((state) => state.authUser);
  const navigate = useNavigate();

  const [isTaxFormCompleted, setIsTaxFormCompleted] = useState(false);
  const [isPaymentServiceSelected, setIsPaymentServiceSelected] = useState(
    false
  );
  const [myProfileData, setMyProfileData] = useState({});
  const taxForm = localStorage.getItem(`${authUser?.handle}_${TAX_FORM}`);
  const paymentService = localStorage.getItem(
    `${authUser?.handle}_${PAYMENT_PROVIDER}`
  );

  function completeTaxForm() {
    navigate("/onboard/payment-setup/tax-form");
  }

  function selectPaymentService() {
    navigate("/onboard/payment-setup/payment-provider");
  }

  React.useEffect(() => {
    setIsTaxFormCompleted(
      !!localStorage.getItem(`${authUser?.handle}_${TAX_FORM}`)
    );
    setIsPaymentServiceSelected(
      !!localStorage.getItem(`${authUser?.handle}_${PAYMENT_PROVIDER}`)
    );
  }, []);

  // Get Member data from redux (firstName, lastName, handle, photoURL) and store it on myProfileData
  React.useEffect(() => {
    if (!authUser || !authUser.handle) return;
    getAuthUserProfile()
      .then((result) => {
        setMyProfileData(result);
      })
      .catch((e) => {
        // toastr.error('Error', 'failed to get profile basic infos!');
        console.log(e);
      });
  }, [authUser]);

  return (
    <>
      <Page title="Payment Setup" styleName="payment-setup">
        <PageContent>
          <PageH2>Payment Setup</PageH2>
          {`${myProfileData?.firstName || ""} ${
            myProfileData?.lastName || ""
          } | ${myProfileData?.handle || ""}`}
          <PageDivider />
          <PageH1>Get paid for your work.</PageH1>
          <PageP styleName="para">
            In order to be paid, you must complete BOTH steps below.
          </PageP>
          <div styleName="cards">
            {!isTaxFormCompleted && (
              <div styleName="card">
                <PageP>
                  All members must have a tax form on file before they can be
                  paid. There are two options: a W-9 or a W-8BEN.
                </PageP>
                <PageP>
                  We will walk you through completing your tax form.
                </PageP>
                <Button
                  onClick={() => completeTaxForm()}
                  size={BUTTON_SIZE.MEDIUM}
                >
                  Complete tax form
                </Button>
              </div>
            )}
            {isTaxFormCompleted && (
              <SuccessMessage
                message={`You have submitted a ${taxForm.toUpperCase()} Tax Form.`}
              />
            )}
            {!isPaymentServiceSelected && (
              <div styleName="card">
                <PageP>
                  Topcoder is partnered with several payment providers to send
                  payments to our community members. Once setup, payments
                  automatically flow into your chosen payment provider at the
                  completion of work.
                </PageP>
                <PageP>
                  Currently, members can be paid through one of the following
                  providers: Payoneer®, PayPal®, or Western Union.
                </PageP>
                <Button
                  onClick={() => selectPaymentService()}
                  size={BUTTON_SIZE.MEDIUM}
                >
                  Select Your Payment Service
                </Button>
              </div>
            )}
            {isPaymentServiceSelected && (
              <SuccessMessage
                message={`You have submitted account details to use ${PAYMENT_METHOD_MAP[paymentService]} as your Payment Service Provider.`}
              />
            )}
          </div>
          <PageP styleName="para">
            Once Payments Set-up has been completed, you will be able to manage
            payments from your Topcoder account. For more information, see:{" "}
            <a
              href="https://www.topcoder.com/thrive/articles/payment-policies-and-instructions"
              styleName="link"
              target="_blank"
            >
              Topcoder Payment Policies
            </a>
          </PageP>
          <PageDivider />
          <PageFoot align="between">
            <Link to="/onboard/contact-details">
              <Button size={BUTTON_SIZE.MEDIUM} type={BUTTON_TYPE.SECONDARY}>
                {"< "}Back
              </Button>
            </Link>
            <Link to="/onboard/build-my-profile">
              <Button size={BUTTON_SIZE.MEDIUM}>
                CONTINUE TO BUILD MY PROFILE
              </Button>
            </Link>
          </PageFoot>
          <OnboardProgress level={3} />
        </PageContent>
      </Page>
    </>
  );
};

function SuccessMessage({ message }) {
  return (
    <div styleName="success-container">
      <IconCheck />
      <div>{message}</div>
    </div>
  );
}

export default withAuthentication(PaymentSetup);
