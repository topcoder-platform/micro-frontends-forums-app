/** Contact details page */
import React, { useState, useEffect } from "react";
import "./styles.module.scss";
import { Link, useNavigate } from "@reach/router";
import { useSelector } from "react-redux";
import withAuthentication from "hoc/withAuthentication";
import { getAuthUserProfile } from "@topcoder/micro-frontends-navbar-app";
// import components and other stuffs
import Page from "components/Page";
import PageContent from "components/PageContent";
import PageDivider from "components/PageDivider";
import PageH1 from "components/PageElements/PageH1";
import PageH2 from "components/PageElements/PageH2";
import PageP from "components/PageElements/PageP";
import PageRow from "components/PageElements/PageRow";
import PageFoot from "components/PageElements/PageFoot";
import Button from "components/Button";
import OnboardProgress from "components/OnboardProgress";
import FormField from "components/FormElements/FormField";
import FormInputText from "components/FormElements/FormInputText";
import Select from "components/ReactSelect";
import LoadingSpinner from "components/LoadingSpinner";
import { BUTTON_SIZE, BUTTON_TYPE, workingHours, timeZones } from "constants";
import { getAllCountries } from "services/countries";
import { addMyAddress, updateMyAddress } from "services/basicInfo";
import {
  getContactDetails,
  createContactDetails,
  updateContactDetails,
} from "services/contactDetails";

import {
  scrollToTop,
  getTraits,
  isAddressFormEmpty,
  isContactFormEmpty,
  isNullOrEmpty,
} from "utils/";
import { sortBy } from "lodash";
import { checkUserTrait } from "services/traits";

const ContactDetails = () => {
  const authUser = useSelector((state) => state.authUser);
  const [isLoading, setIsLoading] = useState(false);
  const [myProfileData, setMyProfileData] = useState({});
  // form states
  const [formDate, setFormData] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    timeZone: "",
    startTime: "",
    endTime: "",
  });
  const {
    addressLine1,
    addressLine2,
    city,
    state,
    zipCode,
    country,
    timeZone,
    startTime,
    endTime,
  } = formDate;
  // countries
  const [countries, setCountries] = useState([]);
  // workingHours
  const handleInputChange = (name, value) => {
    setFormData((formDate) => ({ ...formDate, [name]: value }));
  };

  // Get all live skills
  useEffect(() => {
    getAllCountries()
      .then((result) => {
        let res = result?.data?.result?.content;
        if (res) {
          // res = res.map((c) => c.country);
          setCountries(sortBy(res, "country"));
        }
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.log(e);
      });

    scrollToTop();
  }, []);

  // Get Member data from redux (firstName, lastName, handle, photoURL) and store it on myProfileData
  useEffect(() => {
    if (!authUser || !authUser.handle) return;
    getAuthUserProfile()
      .then((result) => {
        setMyProfileData(result);
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.log(e);
      });
  }, [authUser]);

  // Get contact details
  useEffect(() => {
    setIsLoading(true);
    getContactDetails(authUser.handle)
      .then((result) => {
        setIsLoading(false);
        // find datas we need
        let traits = result?.data;

        let basicInfo = traits.find((t) => t.traitId === "basic_info");
        let connectInfo = traits.find((t) => t.traitId === "connect_info");

        let address = basicInfo?.traits?.data[0].addresses;
        if (address?.length) address = address[0];
        let contactDetails = connectInfo?.traits?.data[0];

        let memberHomeCountry = contactDetails?.country;

        if (isNullOrEmpty(memberHomeCountry)) {
          memberHomeCountry = basicInfo?.traits?.data[0].country;
        }

        if (address) {
          // store the fetched datas in state
          const { streetAddr1, streetAddr2 } = address;
          setFormData((formData) => ({
            ...formData,
            addressLine1: streetAddr1,
            addressLine2: streetAddr2,
          }));
        }

        if (contactDetails) {
          // store the fetched datas in state
          const {
            zip,
            country,
            city,
            timeZone,
            state,
            workingHourStart,
            workingHourEnd,
          } = contactDetails;

          setFormData((formData) => ({
            ...formData,
            city: city,
            state: state,
            zipCode: zip,
            country: country,
            timeZone: timeZone,
            startTime: workingHourStart,
            endTime: workingHourEnd,
          }));
        }

        if (memberHomeCountry != null) {
          setFormData((formData) => ({
            ...formData,
            country: memberHomeCountry,
          }));
        }
      })
      .catch((e) => {
        setIsLoading(false);
        // eslint-disable-next-line no-console
        console.log(e);
      });
  }, [countries, authUser]);

  const saveMyAddress = async (basicInfo) => {
    // update address
    let addressMapped = {
      streetAddr1: addressLine1 || "",
      streetAddr2: addressLine2 || "",
      city: city || "",
      stateCode: state || "",
      zip: zipCode || "",
      type: "HOME",
    };

    let countryObj = {
      country,
      competitionCountryCode: null,
      homeCountryCode: null,
    };

    if (!isNullOrEmpty(country)) {
      const code = countries.find((c) => c.country == country);
      if (code != null) {
        countryObj.competitionCountryCode = code.countryCode;
        countryObj.homeCountryCode = code.countryCode;
      }
    }

    // hack to check if the user has an existing basic_info trait object
    const exists = await checkUserTrait(authUser.handle, "basic_info");
    if (
      isAddressFormEmpty(addressMapped, basicInfo) &&
      (!exists || basicInfo.primaryInterestInTopcoder == null) // we created primaryInterestInTopcoder in the previous step
    ) {
      try {
        await addMyAddress(
          authUser.handle,
          addressMapped,
          country != null ? countryObj : null
        );
      } catch (err) {
        // try updating if create fails
        await updateMyAddress(
          authUser.handle,
          basicInfo,
          addressMapped,
          country != null ? countryObj : null
        );
      }
    } else {
      if (isAddressFormEmpty(addressMapped, basicInfo)) {
        await updateMyAddress(
          authUser.handle,
          basicInfo,
          addressMapped,
          country != null ? countryObj : null
        );
      } else {
        return Promise.resolve();
      }
    }
  };

  const saveContactDetails = async (contactDetailsOnServer) => {
    // saving contact details
    // map data before passing to server
    let contactDetailsMapped = {
      city: city || "",
      state: state || "",
      zip: zipCode || "",
      country: country || "",
      timeZone: timeZone || "",
      workingHourStart: startTime || "",
      workingHourEnd: endTime || "",
    };
    // check if contact details already exists. if so, update(put data). otherwise, post data.
    if (
      contactDetailsOnServer == null &&
      isContactFormEmpty(contactDetailsMapped)
    ) {
      try {
        await createContactDetails(authUser.handle, contactDetailsMapped);
      } catch (err) {
        await updateContactDetails(
          authUser.handle,
          contactDetailsOnServer,
          contactDetailsMapped
        );
      }
    } else {
      if (isContactFormEmpty(contactDetailsMapped)) {
        await updateContactDetails(
          authUser.handle,
          contactDetailsOnServer,
          contactDetailsMapped
        );
      } else {
        return Promise.resolve();
      }
    }
  };

  // reach router, navigate programmatically
  const navigate = useNavigate();
  // on submit, save form and then navigate
  const handleSubmit = async (e) => {
    setIsLoading(true);
    // save address (basic info) then contact details before navigate
    e.preventDefault();

    const result = await getContactDetails(authUser.handle);
    const contactDetails = result?.data?.find(
      (t) => t.traitId === "connect_info"
    );
    const contactDetailsTraits = getTraits(contactDetails);

    const basicInfo = result?.data?.find((t) => t.traitId === "basic_info");
    const basicInfoTraits = getTraits(basicInfo);

    try {
      await saveMyAddress(basicInfoTraits);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log("Failed to save address in basic_info", err);
    }

    try {
      await saveContactDetails(contactDetailsTraits);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log("Failed to save address in connect_info", err);
    }

    setIsLoading(false);
    // toastr.success("Success", "Successfully saved contact details!");
    navigate("/onboard/payment-setup");
  };

  const selectedCountryObj =
    country != null ? countries.find((c) => c.country == country) : null;

  return (
    <>
      <LoadingSpinner show={isLoading} />
      <Page title="Contact Details" styleName="contact-details">
        <PageContent>
          <PageH2>Contact Details</PageH2>
          {`${myProfileData?.firstName || ""} ${
            myProfileData?.lastName || ""
          } | ${authUser?.handle}`}
          <PageDivider />
          <PageH1>Where can we reach you?</PageH1>
          <br />
          <PageRow half={true} styleName="form-row">
            <div>
              <PageP styleName="form-description">
                We may contact you about relevant freelance opportunities at
                Topcoder, or even surprise you with a cool T-shirt. Sharing your
                contact details will never result in robocalls about health
                insurance plans or junk mail.
              </PageP>
            </div>
            <div>
              <FormField label={"Address Line 1"}>
                <FormInputText
                  placeholder={"Enter address line 1"}
                  value={addressLine1}
                  name="addressLine1"
                  onChange={(e) =>
                    handleInputChange(e.target.name, e.target.value)
                  }
                />
              </FormField>
              <FormField label={"Address Line 2"}>
                <FormInputText
                  placeholder={"Enter address line 2"}
                  value={addressLine2}
                  name="addressLine2"
                  onChange={(e) =>
                    handleInputChange(e.target.name, e.target.value)
                  }
                />
              </FormField>
              <FormField label={"City / District"}>
                <FormInputText
                  placeholder={"Enter City / District"}
                  value={city}
                  name="city"
                  onChange={(e) =>
                    handleInputChange(e.target.name, e.target.value)
                  }
                />
              </FormField>
              <PageRow half={true}>
                <FormField label={"State / Province"}>
                  <FormInputText
                    placeholder={"Enter State / Province"}
                    value={state}
                    name="state"
                    onChange={(e) =>
                      handleInputChange(e.target.name, e.target.value)
                    }
                  />
                </FormField>
                <FormField label={"Zip / Postal Code"}>
                  <FormInputText
                    placeholder={"Enter Zip / Postal Code"}
                    value={zipCode}
                    name="zipCode"
                    onChange={(e) =>
                      handleInputChange(e.target.name, e.target.value)
                    }
                  />
                </FormField>
              </PageRow>
              <PageRow half={true}>
                <FormField label={"Country"}>
                  <Select
                    value={
                      country &&
                      selectedCountryObj && {
                        value: selectedCountryObj.country,
                        label: selectedCountryObj.country,
                      }
                    }
                    onChange={(option) =>
                      handleInputChange("country", option.value)
                    }
                    options={countries.map((v) => ({
                      value: v.country,
                      label: v.country,
                    }))}
                    style2={true}
                    placeholder={"Select country"}
                  />
                </FormField>
                <div></div>
              </PageRow>
              <FormField label={"Time Zone"}>
                <Select
                  value={
                    timeZone && {
                      value: timeZones.find((v) => v.zoneName === timeZone)
                        ?.zoneName,
                      label: timeZones.find((v) => v.zoneName === timeZone)
                        ?.zoneName,
                    }
                  }
                  onChange={(option) =>
                    handleInputChange("timeZone", option.value)
                  }
                  options={timeZones.map((v) => ({
                    value: v.zoneName,
                    label: v.zoneName,
                  }))}
                  style2={true}
                  placeholder={"Select time zone"}
                />
              </FormField>
              <PageP styleName={"form-p"}>What are your working hours?</PageP>
              <PageRow half={true}>
                <FormField label={"Start Time"}>
                  <Select
                    value={
                      startTime && {
                        value: workingHours.find((v) => v === startTime),
                        label: workingHours.find((v) => v === startTime),
                      }
                    }
                    onChange={(option) =>
                      handleInputChange("startTime", option.value)
                    }
                    options={workingHours.map((v) => ({ value: v, label: v }))}
                    style2={true}
                    placeholder={"00:00"}
                  />
                </FormField>
                <FormField label={"End Time"}>
                  <Select
                    value={
                      endTime && {
                        value: workingHours.find((v) => v === endTime),
                        label: workingHours.find((v) => v === endTime),
                      }
                    }
                    onChange={(option) =>
                      handleInputChange("endTime", option.value)
                    }
                    options={workingHours.map((v) => ({ value: v, label: v }))}
                    style2={true}
                    placeholder={"00:00"}
                  />
                </FormField>
              </PageRow>
              {/*<FormField label={"Start Date"}>
                <DateInput
                  value={null}
                  onChange={e => e}
                  style2={true}
                  placeholder={"Select start date"}
                />
              </FormField>*/}
              {/*<div>
                <FormInputCheckbox label={"Graduated"} />
              </div>*/}
            </div>
          </PageRow>
          <PageDivider />
          <PageFoot></PageFoot>
          <PageFoot align="between">
            <Link to="/onboard">
              <Button size={BUTTON_SIZE.MEDIUM} type={BUTTON_TYPE.SECONDARY}>
                {"< "}Back
              </Button>
            </Link>
            <Link to="/onboard/payment-setup" onClick={(e) => handleSubmit(e)}>
              <Button size={BUTTON_SIZE.MEDIUM}>
                CONTINUE TO PAYMENT SETUP
              </Button>
            </Link>
          </PageFoot>
          <OnboardProgress level={2} />
        </PageContent>
      </Page>
    </>
  );
};

export default withAuthentication(ContactDetails);
