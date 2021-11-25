/** Contact details page */
import React, { useState, useEffect } from "react";
import "./styles.module.scss";
import { useSelector } from "react-redux";
import withAuthentication from "hoc/withAuthentication";
import { toastr } from "react-redux-toastr";
import { getAuthUserProfile } from "@topcoder/micro-frontends-navbar-app";
// import components and other stuffs
import IconCheck from "../../assets/images/icon-check.svg";
// import components and other stuffs
import Page from "components/Page";
import PageContent from "components/PageContent";
import PageDivider from "components/PageDivider";
import PageH1 from "components/PageElements/PageH1";
import PageH2 from "components/PageElements/PageH2";
import PageP from "components/PageElements/PageP";
import Button from "components/Button";
import OnboardProgress from "components/OnboardProgress";
import { BUTTON_SIZE, BUTTON_TYPE } from "constants";
import config from "../../../config";
import { scrollToTop } from "utils/";
import { MAX_COMPLETED_STEP } from "constants/";
import { PAYMENT_PROVIDER } from "constants/";
import { TAX_FORM } from "constants/";

const Complete = () => {
  const [myProfileData, setMyProfileData] = useState({});
  const authUser = useSelector((state) => state.authUser);

  useEffect(() => {
    scrollToTop();
  });

  // Get Member data from redux (firstName, lastName, handle, photoURL) and store it on myProfileData
  useEffect(() => {
    if (!authUser || !authUser.handle) return;
    getAuthUserProfile()
      .then((result) => {
        setMyProfileData(result);
      })
      .catch((e) => {
        toastr.error("Error", "failed to get profile basic infos!");
        console.log(e);
      });
  }, [authUser]);

  return (
    <>
      <Page title="Contact Details" styleName="complete">
        <PageContent>
          <PageH2>ONBOARDING COMPLETE!</PageH2>
          {`${myProfileData?.firstName || ""} ${
            myProfileData?.lastName || ""
          } | ${authUser?.handle}`}
          <PageDivider />
          <PageH1>LET THE FUN BEGIN.</PageH1>
          <br />
          <div styleName="congrats-box">
            <PageH2>
              <IconCheck styleName="icon-check" />
              CONGRATULATIONS!
            </PageH2>
            <PageP>
              Now it's time to put your skills to good use. Go explore your new
              Topcoder home and discover the ways you can earn, learn, and
              connect with great people in the Topcoder Community.
            </PageP>
            <br />
            <a href={config.TOPCODER_COMMUNITY_WEBSITE_URL + "/home"}>
              <Button
                onClick={() => {
                  localStorage.removeItem(MAX_COMPLETED_STEP);
                  localStorage.removeItem(
                    `${authUser?.handle}_${PAYMENT_PROVIDER}`
                  );
                  localStorage.removeItem(`${authUser?.handle}_${TAX_FORM}`);
                }}
                size={BUTTON_SIZE.MEDIUM}
                type={BUTTON_TYPE.SECONDARY}
              >
                EXPLORE TOPCODER HOME
              </Button>
            </a>
          </div>
          <OnboardProgress level={5} />
        </PageContent>
      </Page>
    </>
  );
};

export default withAuthentication(Complete);
