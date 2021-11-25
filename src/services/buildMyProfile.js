/**
 * Topcoder Service
 */
import { axiosInstance as axios } from "./requestInterceptor";
import config from "../../config";
import { extractTraitsFromV3, wrapV3 } from "utils/";

/**
 * Get build my profile datas
 */
export async function getBuildProfile(myusername) {
  try {
    const response = await axios.get(
      `${config.API.V3}/members/${myusername}/traits`
    ); // TODO: add ?traitIds=basic_info,work,education,languages

    return { data: extractTraitsFromV3(response.data) };
  } catch (err) {
    return { data: [] };
  }
}

/**
 * createWorkExperiences
 */
export function createWorkExperiences(myusername, data) {
  return axios.post(
    `${config.API.V3}/members/${myusername}/traits`,
    wrapV3([
      {
        categoryName: "Work",
        traitId: "work",
        traits: {
          data: data,
        },
      },
    ])
  );
}

/**
 * updateWorkExperiences
 */
export function updateWorkExperiences(myusername, data) {
  return axios.put(
    `${config.API.V3}/members/${myusername}/traits`,
    wrapV3([
      {
        categoryName: "Work",
        traitId: "work",
        traits: {
          data: data,
        },
      },
    ])
  );
}

/**
 * createEducationExperiences
 */
export function createEducationExperiences(myusername, data) {
  return axios.post(
    `${config.API.V3}/members/${myusername}/traits`,
    wrapV3([
      {
        categoryName: "Education",
        traitId: "education",
        traits: {
          data: data,
        },
      },
    ])
  );
}

/**
 * updateEducationExperiences
 */
export function updateEducationExperiences(myusername, data) {
  return axios.put(
    `${config.API.V3}/members/${myusername}/traits`,
    wrapV3([
      {
        categoryName: "Education",
        traitId: "education",
        traits: {
          data: data,
        },
      },
    ])
  );
}

/**
 * createLanguageExperiences
 */
export function createLanguageExperiences(myusername, data) {
  return axios.post(
    `${config.API.V3}/members/${myusername}/traits`,
    wrapV3([
      {
        categoryName: "Languages",
        traitId: "languages",
        traits: {
          data: data,
        },
      },
    ])
  );
}

/**
 * updateLanguageExperiences
 */
export function updateLanguageExperiences(myusername, data) {
  return axios.put(
    `${config.API.V3}/members/${myusername}/traits`,
    wrapV3([
      {
        categoryName: "Languages",
        traitId: "languages",
        traits: {
          data: data,
        },
      },
    ])
  );
}
