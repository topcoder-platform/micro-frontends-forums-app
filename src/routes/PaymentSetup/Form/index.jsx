import React from "react";
import { navigate } from "@reach/router";

import Page from "components/Page";
import PageContent from "components/PageContent";
import PageH2 from "components/PageElements/PageH2";
import Button from "components/Button";
import BackIcon from "../../../assets/images/arrow-left-turquoise.svg";
import ForwardIcon from "../../../assets/images/icon-forward.svg";
import {
  BUTTON_TYPE,
  PAYMENT_STEPS,
  FORM_DETAILS,
  IRS_W9_URL,
  IRS_W8_BEN_URL,
} from "constants";
import { useSelector } from "react-redux";
import withAuthentication from "hoc/withAuthentication";
import PageDivider from "components/PageDivider";
import StepsIndicator from "components/StepsIndicator";
import PageH1 from "components/PageElements/PageH1";
import PageP from "components/PageElements/PageP";
import IconBackArrow from "../../../assets/images/icon-back-arrow.svg";
import PageFoot from "components/PageElements/PageFoot";
import { getAuthUserProfile } from "@topcoder/micro-frontends-navbar-app";

import "./styles.module.scss";

/**
 * This component shows the different tax forms available
 * @returns
 */
const TaxForm = ({ formName }) => {
  const authUser = useSelector((state) => state.authUser);
  const formDetails = FORM_DETAILS[formName];
  const [myProfileData, setMyProfileData] = React.useState({});

  const goToPaymentSetup = () => {
    navigate("/onboard/payment-setup");
  };

  const onBack = () => {
    navigate("/onboard/payment-setup/tax-form");
  };

  const onGotoTaxInfo = () => {
    navigate(`/onboard/payment-setup/tax-form/${formName}/info`);
  };

  const onCompleteForm = () => {
    window.open(formDetails.formUrl);
    navigate(`/onboard/payment-setup/tax-form/${formName}/confirm`);
  };

  const onSeeInstructions = () => {
    window.open(formName === "w-9" ? IRS_W9_URL : IRS_W8_BEN_URL, "_blank");
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
      <div styleName="tax-form-w9">
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
              <StepsIndicator steps={PAYMENT_STEPS} currentStep="select" />
            </div>
          </div>
          <div styleName="user-name">
            {`${myProfileData?.firstName || ""} ${
              myProfileData?.lastName || ""
            } | ${myProfileData?.handle || ""}`}
          </div>
          <PageDivider styleName="page-divider" />
          <PageH1 styleName="tax-form-title">{`Form ${formName}`}</PageH1>
          <PageP styleName="tax-form-description">
            <div
              dangerouslySetInnerHTML={{ __html: formDetails.description }}
            />
          </PageP>
          <PageDivider styleName="page-divider" />

          <PageH1 styleName="why-complete">{`Why do I need to complete Form ${formName}?`}</PageH1>

          <div styleName="container">
            <div styleName="left-pane">
              <PageP styleName="answer">{formDetails.answer}</PageP>
              {formName === "w-8ben" && (
                <>
                  <div onClick={onGotoTaxInfo} styleName="tax-info">
                    <div styleName="button-text">{formDetails.infoLabel}</div>
                    <div styleName="forward-icon-wrapper">
                      <ForwardIcon />
                    </div>
                  </div>
                  <div
                    styleName="extra-details"
                    dangerouslySetInnerHTML={{
                      __html: formDetails.extraDetails,
                    }}
                  />
                </>
              )}
            </div>
            <div styleName="right-pane">
              <Button
                onClick={onSeeInstructions}
                styleName="see-instructions-desktop"
                type={BUTTON_TYPE.SECONDARY}
              >{`see instructions for form ${formName}`}</Button>
              <Button
                onClick={onSeeInstructions}
                styleName="see-instructions-mobile"
                type={BUTTON_TYPE.SECONDARY}
              >
                see instructions
              </Button>
              <Button
                onClick={onCompleteForm}
                styleName="complete-form-cta"
              >{`COMPLETE FORM ${formName}`}</Button>
            </div>
          </div>

          <PageDivider styleName="page-divider" />

          <PageFoot styleName="footer">
            <Button
              onClick={onBack}
              styleName="footer-back-button"
              type={BUTTON_TYPE.SECONDARY}
            >
              <IconBackArrow />
              <span styleName="footer-back-button-text">Back</span>
            </Button>
          </PageFoot>
        </PageContent>
      </div>
    </Page>
  );
};

export default withAuthentication(TaxForm);
