import React, { useState } from "react";
import { navigate } from "@reach/router";
import Checkbox from "rc-checkbox";

import Page from "components/Page";
import PageContent from "components/PageContent";
import PageH2 from "components/PageElements/PageH2";
import Button from "components/Button";
import BackIcon from "../../../assets/images/arrow-left-turquoise.svg";
import { BUTTON_TYPE, PAYMENT_STEPS, FORM_DETAILS } from "constants";
import { useSelector } from "react-redux";
import withAuthentication from "hoc/withAuthentication";
import PageDivider from "components/PageDivider";
import StepsIndicator from "components/StepsIndicator";
import PageH1 from "components/PageElements/PageH1";
import PageP from "components/PageElements/PageP";
import IconBackArrow from "../../../assets/images/icon-back-arrow.svg";
import PageFoot from "components/PageElements/PageFoot";
import { getAuthUserProfile } from "@topcoder/micro-frontends-navbar-app";

import styles from "./styles.module.scss";
import "rc-checkbox/assets/index.css";
import { TAX_FORM } from "constants/";

/**
 * Page shown to get the confirmation from the user on the tax form
 * @param {*} param0
 * @returns
 */
const TaxConfirm = ({ formName }) => {
  const authUser = useSelector((state) => state.authUser);
  const [completedForm, setCompletedForm] = useState(false);
  const [myProfileData, setMyProfileData] = useState({});
  const formDetails = FORM_DETAILS[formName];
  const goToPaymentSetup = () => {
    navigate("/onboard/payment-setup");
  };

  const onBack = () => {
    navigate(`/onboard/payment-setup/tax-form/${formName}`);
  };

  const onChange = (event) => {
    setCompletedForm(event.target.checked);
  };

  const onConfirm = () => {
    localStorage.setItem(`${authUser?.handle}_${TAX_FORM}`, formName);
    navigate(`/onboard/payment-setup/tax-form/${formName}/complete`);
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
    <Page title="Payment Setup" styleName="styles.page-wrapper">
      <div styleName="styles.page-title">Member Onboarding</div>
      <div styleName="styles.tax-confirm">
        <PageContent styleName="styles.page-content">
          <div styleName="styles.page-header">
            <div styleName="styles.left-pane">
              <Button
                onClick={goToPaymentSetup}
                type={BUTTON_TYPE.SEGMENT}
                styleName="styles.back-button"
              >
                <div styleName="styles.back-icon-wrapper">
                  <BackIcon />
                </div>
                <span styleName="styles.button-text">Payment set-up</span>
              </Button>
              <PageH2 styleName="styles.complete-tax-title">
                Complete tax form
              </PageH2>
            </div>
            <div styleName="styles.right-pane">
              <StepsIndicator steps={PAYMENT_STEPS} currentStep="confirm" />
            </div>
          </div>
          <div styleName="styles.user-name">
            {`${myProfileData?.firstName || ""} ${
              myProfileData?.lastName || ""
            } | ${myProfileData?.handle || ""}`}
          </div>
          <PageDivider styleName="styles.page-divider" />
          <PageH1 styleName="styles.tax-confirm-title">{`Form ${formName}`}</PageH1>
          <PageP styleName="styles.tax-confirm-description">
            <div
              dangerouslySetInnerHTML={{ __html: formDetails.description }}
            />
          </PageP>
          <PageDivider styleName="styles.page-divider" />

          <PageH1 styleName="styles.did-you-complete">
            Did you complete your DocuSign Tax Form?
          </PageH1>

          <div styleName="styles.container">
            <div styleName="styles.left-pane">
              Great! Check that box and click CONTINUE. If not,{" "}
              <a
                href={formDetails.formUrl}
                target="_blank"
              >{`please complete Form ${formName.toUpperCase()}`}</a>
            </div>
            <div styleName="styles.right-pane">
              <label styleName="styles.form-input-checkbox">
                <Checkbox
                  checked={completedForm}
                  className="confirm-tax-rc-checkbox"
                  onChange={onChange}
                />
                <span styleName="styles.label">{`Yes, I have completed Form ${formName.toUpperCase()}`}</span>
              </label>
            </div>
          </div>

          <PageDivider styleName="styles.page-divider" />

          <PageFoot styleName="styles.footer">
            <Button
              onClick={onBack}
              styleName="styles.footer-back-button"
              type={BUTTON_TYPE.SECONDARY}
            >
              <IconBackArrow />
              <span styleName="styles.footer-back-button-text">Back</span>
            </Button>
            <div styleName="styles.confirm-button-wrapper">
              <Button
                onClick={onConfirm}
                disabled={!completedForm}
                styleName="styles.footer-confirm-button"
              >
                Confirm
              </Button>
            </div>
          </PageFoot>
        </PageContent>
      </div>
    </Page>
  );
};

export default withAuthentication(TaxConfirm);
