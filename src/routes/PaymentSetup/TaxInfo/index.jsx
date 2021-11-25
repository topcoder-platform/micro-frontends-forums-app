import React, { useEffect } from "react";
import { navigate } from "@reach/router";
import cn from "classnames";

import Page from "components/Page";
import PageContent from "components/PageContent";
import PageH2 from "components/PageElements/PageH2";
import Button from "components/Button";
import BackIcon from "../../../assets/images/arrow-left-turquoise.svg";
import {
  BUTTON_TYPE,
  PAYMENT_STEPS,
  TAX_INFO_CONTENT,
  IRS_W8_BEN_URL,
} from "constants";
import { useSelector } from "react-redux";
import withAuthentication from "hoc/withAuthentication";
import PageDivider from "components/PageDivider";
import StepsIndicator from "components/StepsIndicator";
import PageH1 from "components/PageElements/PageH1";
import PageFoot from "components/PageElements/PageFoot";
import { getAuthUserProfile } from "@topcoder/micro-frontends-navbar-app";

import "./styles.module.scss";
import { FORM_DETAILS } from "constants/";

/**
 * The page shows the information on w-8ben tax form
 */
const TaxInfo = ({ formName }) => {
  const authUser = useSelector((state) => state.authUser);
  const [myProfileData, setMyProfileData] = React.useState({});
  const formDetails = FORM_DETAILS[formName];

  useEffect(() => {
    // Scroll to top on load of the page
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  const goToPaymentSetup = () => {
    navigate("/onboard/payment-setup");
  };

  const onCompleteForm = () => {
    window.open(formDetails.formUrl);
    navigate("/onboard/payment-setup/tax-form/w-8ben/confirm");
  };

  const onSeeInstructions = () => {
    window.open(IRS_W8_BEN_URL, "_blank");
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
      <div styleName="tax-info">
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

          <PageH1 styleName="tax-info-title">
            Topcoder Tax Information for Form W-8BEN
          </PageH1>
          <PageDivider styleName={cn("page-divider", "title-divider")} />

          <div
            styleName="static-content"
            dangerouslySetInnerHTML={{ __html: TAX_INFO_CONTENT }}
          ></div>

          <PageFoot styleName="footer">
            <div>
              <Button onClick={onCompleteForm} styleName="complete-form">
                COMPLETE FORM W-8BEN
              </Button>
            </div>
            <div>
              <Button
                onClick={onSeeInstructions}
                styleName="see-instructions-desktop"
                type={BUTTON_TYPE.SECONDARY}
              >
                see instructions for form w-8BEN
              </Button>
              <Button
                onClick={onSeeInstructions}
                styleName="see-instructions-mobile"
                type={BUTTON_TYPE.SECONDARY}
              >
                see instructions
              </Button>
            </div>
          </PageFoot>
        </PageContent>
      </div>
    </Page>
  );
};

export default withAuthentication(TaxInfo);
