/**
 * Topcoder Service
 */
import { axiosInstance as axios } from "./requestInterceptor";
import config from "../../config";
import { extractTraitsFromV3, wrapV3 } from "utils/";
import { trackEvent } from "./analytics";
import { EVENT_TYPE } from "constants/";

const TRAIT_BASIC_INFO = "basic_info";
const CATEGORY_NAME = "Basic Info";

/**
 * Loads my basic info (To get interests)
 */
export async function getMyBasicInfo(myusername) {
  try {
    const response = await axios.get(
      `${config.API.V3}/members/${myusername}/traits?traitIds=basic_info`
    );

    return { data: extractTraitsFromV3(response.data) };
  } catch (err) {
    return { data: [] };
  }
}

/**
 * Add my interests
 */
export function addMyPrimaryInterests(
  myusername,
  previousBasicInfo,
  interestsFlat
) {
  const traitData = { primaryInterestInTopcoder: interestsFlat };
  trackEvent(EVENT_TYPE.SAVE_TRAITS, {
    trait: TRAIT_BASIC_INFO,
    data: traitData,
  });

  return axios.post(
    `${config.API.V3}/members/${myusername}/traits`,
    wrapV3([
      {
        traitId: TRAIT_BASIC_INFO,
        categoryName: CATEGORY_NAME,
        traits: {
          data: [
            {
              ...previousBasicInfo,
              ...traitData,
            },
          ],
        },
      },
    ])
  );
}

/**
 * Update my interests
 */
export function updateMyPrimaryInterests(
  myusername,
  prevBasicInfo,
  interestsFlat
) {
  const traitData = { primaryInterestInTopcoder: interestsFlat };
  trackEvent(EVENT_TYPE.SAVE_TRAITS, {
    trait: TRAIT_BASIC_INFO,
    data: traitData,
  });

  return axios.put(
    `${config.API.V3}/members/${myusername}/traits`,
    wrapV3([
      {
        traitId: TRAIT_BASIC_INFO,
        categoryName: CATEGORY_NAME,
        traits: {
          data: [
            {
              ...prevBasicInfo,
              ...traitData,
            },
          ],
        },
      },
    ])
  );
}

/**
 * Add my address, if the basicInfo not exists
 */
export function addMyAddress(myusername, address, country) {
  const traitData = { addresses: [address], ...country };
  trackEvent(EVENT_TYPE.SAVE_TRAITS, {
    trait: TRAIT_BASIC_INFO,
    data: traitData,
  });

  return axios.post(
    `${config.API.V3}/members/${myusername}/traits`,
    wrapV3([
      {
        traitId: TRAIT_BASIC_INFO,
        categoryName: CATEGORY_NAME,
        traits: {
          data: [
            {
              ...traitData,
            },
          ],
        },
      },
    ])
  );
}

/**
 * Update my address
 */
export function updateMyAddress(myusername, prevBasicInfo, address, country) {
  const traitData = { addresses: [address], ...country };
  trackEvent(EVENT_TYPE.SAVE_TRAITS, {
    trait: TRAIT_BASIC_INFO,
    data: traitData,
  });

  return axios.put(
    `${config.API.V3}/members/${myusername}/traits`,
    wrapV3([
      {
        traitId: TRAIT_BASIC_INFO,
        categoryName: CATEGORY_NAME,
        traits: {
          data: [
            {
              ...prevBasicInfo,
              ...traitData,
            },
          ],
        },
      },
    ])
  );
}

/**
 * Add my title and bio, if the basicInfo not exists
 */
export function addMyTitleAndBio(myusername, data) {
  trackEvent(EVENT_TYPE.SAVE_TRAITS, {
    trait: TRAIT_BASIC_INFO,
    data,
  });

  return axios.post(
    `${config.API.V3}/members/${myusername}/traits`,
    wrapV3([
      {
        traitId: TRAIT_BASIC_INFO,
        categoryName: CATEGORY_NAME,
        traits: {
          data: [data],
        },
      },
    ])
  );
}

/**
 * Update my title and bio
 */
export function updateMyTitleAndBio(myusername, prevBasicInfo, data) {
  trackEvent(EVENT_TYPE.SAVE_TRAITS, {
    trait: TRAIT_BASIC_INFO,
    data,
  });

  return axios.put(
    `${config.API.V3}/members/${myusername}/traits`,
    wrapV3([
      {
        traitId: TRAIT_BASIC_INFO,
        categoryName: CATEGORY_NAME,
        traits: {
          data: [
            {
              ...prevBasicInfo,
              ...data,
            },
          ],
        },
      },
    ])
  );
}
