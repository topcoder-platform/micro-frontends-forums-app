/**
 * Topcoder Service
 */
import { axiosInstance as axios } from "./requestInterceptor";
import config from "../../config";
import { wrapV3 } from "utils/";
import { trackEvent } from "./analytics";
import { EVENT_TYPE } from "constants/";

/**
 * Create New Traits
 */
export function createTraits(handle, data) {
  for (let d of data) {
    trackEvent(EVENT_TYPE.SAVE_TRAITS, {
      trait: d.traitId,
      data: d.traits.data,
    });
  }
  return axios.post(`${config.API.V3}/members/${handle}/traits`, wrapV3(data));
}

/**
 * Update existing traits
 */
export function updateTraits(handle, data) {
  for (let d of data) {
    trackEvent(EVENT_TYPE.SAVE_TRAITS, {
      trait: d.traitId,
      data: d.traits.data,
    });
  }
  return axios.put(`${config.API.V3}/members/${handle}/traits`, wrapV3(data));
}

export async function checkUserTrait(handle, traitId) {
  let isExists = false;
  let response = await axios.get(
    `${config.API.V3}/members/${handle}/traits?traitIds=${traitId}`
  );
  const dataResponse = response.data;

  if (dataResponse.result && dataResponse.result.content.length > 0) {
    const trait = dataResponse.result.content[0];
    if (trait.createdAt) {
      isExists = true;
    }
  }

  return isExists;
}
