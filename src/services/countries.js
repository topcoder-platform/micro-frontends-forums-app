/**
 * Topcoder Service
 */
import { axiosInstance as axios } from "./requestInterceptor";
import config from "../../config";

/**
 * get all countries
 */
export function getAllCountries() {
  return axios.get(`${config.API.V3}/members/lookup/countries`);
}
