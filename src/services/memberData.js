/**
 * Topcoder Service
 */
import { axiosInstance as axios } from "./requestInterceptor";
import config from "../../config";

/**
 * Loads member Data (firstName, lastName, handle, photoURL)
 */
export function getMemberData(username) {
  return axios.get(`${config.API.V5}/members/${username}`);
}

/**
 * Upload profile photo
 */
export function uploadProfilePhoto(username, file) {
  let formData = new FormData();
  formData.append("photo", file);
  return axios.post(`${config.API.V5}/members/${username}/photo`, formData);
}
