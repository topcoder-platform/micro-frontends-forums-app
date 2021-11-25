import React from "react";
import { navigate } from "@reach/router";
import cn from "classnames";

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
import { getAuthUserProfile } from "@topcoder/micro-frontends-navbar-app";

import "./styles.module.scss";

/**
 * This component shows the different tax forms available
 * @returns
 */
const TaxForm = () => {
  const authUser = useSelector((state) => state.authUser);
  const [myProfileData, setMyProfileData] = React.useState({});

  const goToPaymentSetup = () => {
    navigate("/onboard/payment-setup");
  };

  const navigateToTaxForm = (name) => {
    navigate(`/onboard/payment-setup/tax-form/${name}`);
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
      <div styleName="tax-form">
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
          <PageH1 styleName="tax-form-title">Select a Tax Form</PageH1>
          <PageP styleName="tax-form-description">
            All members need to have a tax form on file before they can be paid.
            There are two options: a W-9 or a W-8BEN. <br /> Select a form below
            for more information.
          </PageP>
          <div styleName="forms-list">
            <div styleName={cn("form-item", "with-margin")}>
              <Button
                onClick={() => navigateToTaxForm("w-9")}
                styleName="select-form"
              >
                SELECT w-9
              </Button>
              <PageP styleName="form-condition">
                For individuals who are a US citizen or other US person (such as
                a resident alien).{" "}
              </PageP>
            </div>
            <div styleName="form-item">
              <Button
                onClick={() => navigateToTaxForm("w-8ben")}
                styleName="select-form"
              >
                SELECT w-8ben
              </Button>
              <PageP styleName="form-condition">
                For individuals who are NOT a US citizen or other US person
                (such as a foreign person, non-resident alien or foreign
                national).{" "}
              </PageP>
            </div>
          </div>
        </PageContent>
      </div>
    </Page>
  );
};

export default withAuthentication(TaxForm);
