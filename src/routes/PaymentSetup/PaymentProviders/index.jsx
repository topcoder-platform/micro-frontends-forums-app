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
import PageH1 from "components/PageElements/PageH1";
import PageP from "components/PageElements/PageP";
import PaymentMethods from "components/PaymentMethods";
import StepsIndicator from "components/StepsIndicator";
import { getAuthUserProfile } from "@topcoder/micro-frontends-navbar-app";

import "./styles.module.scss";

/**
 * The page shown where the payment providers are shown
 * @returns
 */
const PaymentProviders = () => {
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
      <div styleName="payment-providers">
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
              <PageH2 styleName="payment-service-title">
                select your payment service
              </PageH2>
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
          <PageH1 styleName="connect-service-title">
            Connect a Payment Service Provider
          </PageH1>
          <PageP styleName="description">
            Topcoder currently supports 3 payment providers - Payoneer, PayPal,
            and Western Union. After you set up an account with a provider, you
            must complete the process by emailing the provider and account
            details to Topcoder support. See More Information about each
            provider below and at the provider’s website.
          </PageP>
          <PageP styleName="select-info-desktop">
            Select a provider below to get more information to set up an
            account. Make sure your legal name and address are accurate in your
            profile in order to be paid.
          </PageP>
          <PageP styleName="select-info-mobile-part-one">
            Select a provider below to get more information to set up an
            account.
          </PageP>
          <PageP styleName="select-info-mobile-part-two">
            Make sure your legal name and address are accurate in your profile
            in order to be paid.
          </PageP>
          <PaymentMethods />
          <PageP styleName="footer-note">
            The information above is gathered from each payment provider's
            respective website. We encourage you to do any additional
            information gathering you see fit prior to making a payment provider
            decision.{" "}
          </PageP>
        </PageContent>
      </div>
    </Page>
  );
};

export default withAuthentication(PaymentProviders);
