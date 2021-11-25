import React from "react";
import { navigate } from "@reach/router";

import Page from "components/Page";
import PageContent from "components/PageContent";
import PageH2 from "components/PageElements/PageH2";
import Button from "components/Button";
import BackIcon from "../../../assets/images/arrow-left-turquoise.svg";
import { BUTTON_TYPE, PAYMENT_STEPS } from "constants";
import { useSelector } from "react-redux";
import withAuthentication from "hoc/withAuthentication";
import PageDivider from "components/PageDivider";
import StepsIndicator from "components/StepsIndicator";
import PageH1 from "components/PageElements/PageH1";
import PageP from "components/PageElements/PageP";
import PageFoot from "components/PageElements/PageFoot";
import PageH3 from "components/PageElements/PageH3";
import { getAuthUserProfile } from "@topcoder/micro-frontends-navbar-app";

import "./styles.module.scss";

/**
 * Page shown after the successful completion of the tax form submission
 * @returns
 */
const TaxComplete = ({ formName }) => {
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
      <div styleName="tax-complete">
        <PageContent styleName="page-content">
          <div styleName="page-header">
            <div styleName="left-pane">
              <Button
                onClick={goToPaymentSetup}
                type={BUTTON_TYPE.SEGMENT}
                styleName="back-button"
              >
                <div styleName="back-icon-wrapper">
                  <BackIcon />
                </div>
                <span styleName="button-text">Payment set-up</span>
              </Button>
              <PageH2 styleName="complete-tax-title">Complete tax form</PageH2>
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
          <PageH1 styleName="tax-complete-title">Thank You!</PageH1>
          <PageDivider styleName="page-divider" />
          <PageH3 styleName="information">{`Your ${formName} Tax Form was submitted via DocuSign.`}</PageH3>
          <PageP styleName="confirmation-text">
            <p>
              You will receive confirmation from Topcoder via email to
              acknowledge receipt.
            </p>
            After processing, your Member Profile will reflect that you have
            completed this step.
          </PageP>
          <PageFoot styleName="footer">
            <Button
              onClick={goToPaymentSetup}
              styleName="footer-continue-button"
            >
              Continue
            </Button>
          </PageFoot>
        </PageContent>
      </div>
    </Page>
  );
};

export default withAuthentication(TaxComplete);
