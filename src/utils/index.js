import _, { isArray } from "lodash";
import config from "../../config";

/**
 * Extract trait values
 */
export function getTraits(payload) {
  return payload?.traits.data.length > 0 ? payload?.traits.data[0] : null;
}

/**
 * Scroll to top of page
 */
export function scrollToTop() {
  window.scrollTo(0, 0);
}

/**
 * Check if Build My Profile form data is empty
 *
 * @param type {String}
 * @param data {Object}
 */
export function isProfileFormDataEmpty(type, data) {
  switch (type) {
    case "bio":
      let { shortBio, description } = data;
      return (
        (shortBio && shortBio.length) || (description && description.length)
      );
    case "work":
      let { cityTown, company, position, timePeriodFrom, timePeriodTo } = data;
      let response =
        (cityTown && cityTown.length) ||
        (company && company.length) ||
        (position && position.length) ||
        timePeriodFrom instanceof Date ||
        timePeriodTo instanceof Date;

      return response;
    case "education":
      let { major, schoolCollegeName } = data;
      return (
        (major && major.length) ||
        (schoolCollegeName && schoolCollegeName.length) ||
        data?.timePeriodTo instanceof Date ||
        data?.timePeriodFrom instanceof Date
      );
    case "language":
      let { language, spokenLevel, writtenLevel } = data;
      return (
        (language && language.length) ||
        (spokenLevel && spokenLevel.length) ||
        (writtenLevel && writtenLevel.length)
      );
  }
  return true;
}

/**
 * Check if Build Get Started form data is empty
 *
 * @param myInterest {Object}
 */
export function isGetStartedFormDataEmpty(myInterest) {
  return myInterest.length;
}

/**
 * Check if Skill form data is empty
 *
 * @param data {Object}
 */
export function isSkillFormEmpty(data) {
  return data.length;
}

/**
 * Check if array null or empty
 *
 * @param data {Object}
 */
export function isNullOrEmpty(data) {
  return _.isNull(data) || _.isUndefined(data) || data.length === 0;
}

/**
 * Check if Address form data is empty
 *
 * @param data {Object}
 */
export function isAddressFormEmpty(data, basicInfo) {
  return (
    data?.city.length ||
    data?.stateCode.length ||
    data?.streetAddr1.length ||
    data?.streetAddr2.length ||
    data?.zip.length ||
    basicInfo?.country.length ||
    (basicInfo?.description && basicInfo?.description.length) ||
    (basicInfo?.title && basicInfo?.title.length)
  );
}

/**
 * Check if Contact form data is empty
 *
 * @param data {Object}
 */
export function isContactFormEmpty(data) {
  return (
    data?.city.length ||
    data?.country.length ||
    data?.state.length ||
    data?.timeZone.length ||
    data?.zip.length ||
    data?.workingHourEnd.length ||
    data?.workingHourStart.length ||
    data?.zip.length
  );
}

/**
 * Get traits from v3 response object to conform to v5 response
 */
export function extractTraitsFromV3(data) {
  return isArray(data?.result?.content) ? data.result.content : [];
}

export function wrapV3(payload) {
  return {
    param: payload,
  };
}

/**
 * Check if onboarding flow is allowed and
 * if not it redirects user to Topcoder Start Page.
 */
export function checkOnboardFlowPermission() {
  if (config.ONBOARD_FLOW) {
    window.location.href = config.TOPCODER_START_URL;
  }
}
