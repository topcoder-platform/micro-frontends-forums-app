import React from "react";
import { useSelector } from "react-redux";
import { navigate } from "@reach/router";

import Page from "components/Page";
import BackIcon from "../../../assets/images/arrow-left-turquoise.svg";
import PageContent from "components/PageContent";
import PageH2 from "components/PageElements/PageH2";
import Button from "components/Button";
import { BUTTON_TYPE, PAYMENT_STEPS } from "constants";
import PageDivider from "components/PageDivider";
import withAuthentication from "hoc/withAuthentication";
import PageH1 from "components/PageElements/PageH1";
import PageH3 from "components/PageElements/PageH3";
import PageP from "components/PageElements/PageP";
import PageFoot from "components/PageElements/PageFoot";
import StepsIndicator from "components/StepsIndicator";
import { getAuthUserProfile } from "@topcoder/micro-frontends-navbar-app";

import "./styles.module.scss";

const PaymentComplete = () => {
  const authUser = useSelector((state) => state.authUser);
  const [myProfileData, setMyProfileData] = React.useState({});

  const goToPaymentSetup = () => {
    navigate("/onboard/payment-setup");
  };

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
    <Page title="Payment Setup" styleName="page-wrapper">
      <div styleName="page-title">Member Onboarding</div>
      <div styleName="payment-complete">
        <PageContent styleName="page-content">
          <div styleName="page-header">
            <div styleName="left-pane">
              <Button
                onClick={goToPaymentSetup}
                type={BUTTON_TYPE.SEGMENT}
                styleName="back-button"
              >
                <BackIcon />
                <span styleName="button-text">Payment set-up</span>
              </Button>
              <PageH2 styleName="payment-service-title">
                select your payment service
              </PageH2>
            </div>
            <div styleName="right-pane">
              <StepsIndicator steps={PAYMENT_STEPS} currentStep="complete" />
            </div>
          </div>

          <div styleName="user-name">
            {`${myProfileData?.firstName || ""} ${
              myProfileData?.lastName || ""
            } | ${myProfileData?.handle || ""}`}
          </div>
          <PageDivider styleName="page-divider" />
          <PageH1 styleName="thank-you">Thank You!</PageH1>
          <PageDivider styleName="page-divider" />

          <PageH3 styleName="submitted-text">
            You have submitted account details to topcoder support
          </PageH3>
          <PageP styleName="instructions">
            Once Payments Set-up has been confirmed, you will be able to manage
            payments from your Topcoder account. For more information, see:{" "}
            <a
              href="https://www.topcoder.com/thrive/articles/payment-policies-and-instructions"
              target="_blank"
              styleName="link"
            >
              Topcoder Payment Policies
            </a>
          </PageP>

          <PageFoot styleName="complete-page-footer">
            <Button onClick={goToPaymentSetup} styleName="continue-button">
              Continue
            </Button>
          </PageFoot>
        </PageContent>
      </div>
    </Page>
  );
};

export default withAuthentication(PaymentComplete);
