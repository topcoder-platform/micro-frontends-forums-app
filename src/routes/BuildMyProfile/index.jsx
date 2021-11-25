/** Build My Profile page */
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
import PageH2 from "components/PageElements/PageH2";
import PageH3 from "components/PageElements/PageH3";
import PageP from "components/PageElements/PageP";
import PageRow from "components/PageElements/PageRow";
import PageFoot from "components/PageElements/PageFoot";
import PageCard from "components/PageElements/PageCard";
import PageListInput from "components/PageListInput";
import Button from "components/Button";
import OnboardProgress from "components/OnboardProgress";
import FormField from "components/FormElements/FormField";
import FormInputText from "components/FormElements/FormInputText";
import FormInputCheckbox from "components/FormElements/FormInputCheckbox";
import FormInputTextArea from "components/FormElements/FormInputTextArea";
import Select from "components/ReactSelect";
import DateInput from "components/DateInput";
import LoadingSpinner from "components/LoadingSpinner";
import ImgTestimonial2 from "../../assets/images/testimonial-2.png";
import IconCross from "../../assets/images/icon-cross.svg";

import {
  industries,
  languages as languagesList,
  spokenLevels,
  writtenLevels,
  BUTTON_SIZE,
  BUTTON_TYPE,
} from "constants";

import { getBuildProfile } from "services/buildMyProfile";
import { getTraits, scrollToTop, isProfileFormDataEmpty } from "utils/";

import moment from "moment";
import _ from "lodash";
import { createTraits, updateTraits } from "services/traits";

const formatDate = (date) => {
  let ret = new Date(
    `${date.getMonth() + 1} ${date.getDate()} ${date.getFullYear()} 06:00 UTC`
  ).getTime();

  return ret;
};

const BuildMyProfile = () => {
  const authUser = useSelector((state) => state.authUser);
  const [isLoading, setIsLoading] = useState(false);
  const [myProfileData, setMyProfileData] = useState({});
  // form states
  const [formData, setFormData] = useState({
    title: "",
    bio: "",
  });
  const { title, bio } = formData;
  // get an empty job item
  const emptyJob = () => ({
    company: "",
    position: "",
    industry: "",
    city: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
  });
  // get an empty education item
  const emptyEducation = () => ({
    collegeName: "",
    major: "",
    startDate: "",
    endDate: "",
    graduated: false,
  });
  // get an empty language item
  const emptyLanguage = () => ({
    language: "",
    spokenLevel: "",
    writtenLevel: "",
  });
  // get an empty item by name
  const emptyListInputItem = (listInputName) => {
    switch (listInputName) {
      case "jobs":
        return emptyJob();
      case "educations":
        return emptyEducation();
      case "languages":
        return emptyLanguage();
    }
  };

  // a list input is a dynamic group of inputs, like jobs
  const [listInputs, setListInputs] = useState({
    jobs: [emptyListInputItem("jobs")],
    educations: [emptyListInputItem("educations")],
    languages: [emptyListInputItem("languages")],
  });
  const [errors, setErrors] = useState({
    jobs: [], // {index, field}
    educations: [],
    languages: [],
  });
  const { jobs, educations, languages } = listInputs;
  // handle form simple input changes
  const handleInputChange = (name, value) => {
    setFormData((formData) => ({ ...formData, [name]: value }));
  };
  // handle list input changes
  const handleListInputChange = (listInputName, index, inputName, value) => {
    setListInputs((listInputs) => {
      let listInput = listInputs[listInputName];
      let newListInput = listInput.map((item, i) => {
        if (i !== index) return item;
        else return { ...item, [inputName]: value };
      });
      return { ...listInputs, [listInputName]: newListInput };
    });
  };

  const validateDate = (listInputName, index, startDate, endDate) => {
    setErrors((errs) => {
      const err = [...errs[listInputName]];
      const isInValid =
        endDate && startDate && moment(endDate).isSameOrBefore(startDate);
      const item = err.find((x) => x.index === index && x.field);
      if (!isInValid) {
        _.remove(err, {
          index: index,
          field: "startDate",
        });
      } else {
        if (!item) {
          err.push({
            index: index,
            field: "startDate",
          });
        }
      }

      return { ...errs, [listInputName]: err };
    });
  };

  const hasError = (listInputName, index, inputName) => {
    return (
      errors &&
      errors[listInputName].length > 0 &&
      errors[listInputName].some(
        (x) => x.index === index && x.field === inputName
      )
    );
  };

  // add an item to a list input
  const addListInputItem = (listInputName) => {
    setListInputs((listInputs) => {
      let listInput = listInputs[listInputName];
      let newListInput = [...listInput, emptyListInputItem(listInputName)];
      return { ...listInputs, [listInputName]: newListInput };
    });
  };

  // remove an item from list input
  const removeListInputItem = (listInputName, index) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    setListInputs((listInputs) => {
      let listInput = listInputs[listInputName];
      let newListInput = listInput.filter((item, i) => {
        return i !== index;
      });
      return { ...listInputs, [listInputName]: newListInput };
    });
  };
  const dateTimeToDate = (s) => (s ? new Date(s) : "");
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

  // Get build profile
  useEffect(() => {
    setIsLoading(true);
    getBuildProfile(authUser.handle)
      .then((result) => {
        setIsLoading(false);
        // find datas we need
        // get traits values
        let traits = result?.data;
        let basicInfo = traits.find((t) => t.traitId === "basic_info");
        let workExp = traits.find((t) => t.traitId === "work");
        let educationExp = traits.find((t) => t.traitId === "education");
        let languagesExp = traits.find((t) => t.traitId === "languages");
        let basicInfoValue = basicInfo?.traits?.data[0];
        let workExpValue = workExp?.traits?.data;
        let educationExpValue = educationExp?.traits?.data;
        let languagesExpValue = languagesExp?.traits?.data;

        // fill title and bio to state
        if (basicInfoValue) {
          // Using shortBio as title has to do with v3 using this mapping
          const { description, shortBio: title } = basicInfoValue;
          setFormData((formData) => ({
            ...formData,
            title: title || "",
            bio: description || "",
          }));
        }
        if (workExpValue) {
          // workExpValue is array of jobs. fill it to state
          setListInputs((listInputs) => ({
            ...listInputs,
            jobs: workExpValue.map((j) => ({
              company: j.company,
              position: j.position,
              industry: j.industry,
              city: j.cityTown,
              startDate: dateTimeToDate(j.timePeriodFrom),
              endDate: dateTimeToDate(j.timePeriodTo),
              currentlyWorking: j.working,
            })),
          }));
        }
        if (educationExpValue) {
          // educationExpValue is array of educations. fill it to state
          setListInputs((listInputs) => ({
            ...listInputs,
            educations: educationExpValue.map((e) => ({
              collegeName: e.schoolCollegeName,
              major: e.major,
              startDate: dateTimeToDate(e.timePeriodFrom),
              endDate: dateTimeToDate(e.timePeriodTo),
              graduated: e.graduated,
            })),
          }));
        }
        if (languagesExpValue) {
          // languagesExpValue is array of languages. fill it to state
          setListInputs((listInputs) => ({
            ...listInputs,
            languages: languagesExpValue.map((l) => ({
              language: l.language,
              spokenLevel: l.spokenLevel,
              writtenLevel: l.writtenLevel,
            })),
          }));
        }
      })
      .catch((e) => {
        setIsLoading(false);
        // eslint-disable-next-line no-console
        console.log(e);
      });
    scrollToTop();
  }, []);

  // save title / bio
  const getTitleAndBioData = (basicInfo) => {
    const { title, bio } = formData;
    // mapped data
    let data = {
      shortBio: title,
      description: bio,
    };
    // check if basic info already exists. if so, update(put data). otherwise, post data.
    if (basicInfo == null && isProfileFormDataEmpty("bio", data)) {
      return {
        action: "create",
        data: {
          categoryName: "Basic Info",
          traitId: "basic_info",
          traits: {
            data: [data],
          },
        },
      };
      // return addMyTitleAndBio(authUser.handle, data);
    } else {
      if (isProfileFormDataEmpty("bio", data)) {
        // return updateMyTitleAndBio(authUser.handle, basicInfo, data);
        return {
          action: "update",
          data: {
            categoryName: "Basic Info",
            traitId: "basic_info",
            traits: {
              data: [
                {
                  ...basicInfo,
                  ...data,
                },
              ],
            },
          },
        };
      } else {
        return null;
      }
    }
  };

  // save jobs
  const getJobsData = (workExp) => {
    // mapped data
    let data = jobs.map((job) => {
      const {
        company,
        position,
        industry,
        city,
        startDate,
        endDate,
        currentlyWorking,
      } = job;
      return {
        company: company,
        industry: industry,
        position: position,
        cityTown: city,
        timePeriodFrom: startDate ? formatDate(startDate) : "",
        timePeriodTo: endDate ? formatDate(endDate) : "",
        working: currentlyWorking,
      };
    });

    const payload = {
      categoryName: "Work",
      traitId: "work",
      traits: {
        data: data,
      },
    };

    // create if not exists, update if exists
    if (!workExp && isProfileFormDataEmpty("work", data[0])) {
      // return createWorkExperiences(authUser.handle, data);
      return { action: "create", data: payload };
    } else {
      if (isProfileFormDataEmpty("work", data[0])) {
        // return updateWorkExperiences(authUser.handle, data);
        return { action: "update", data: payload };
      } else {
        // return Promise.resolve();
        return null;
      }
    }
  };

  // save educations
  const getEducationData = (educationExp) => {
    // mapped data
    let data = educations.map((education) => {
      const { collegeName, major, startDate, endDate, graduated } = education;
      return {
        schoolCollegeName: collegeName,
        major: major,
        timePeriodFrom: startDate ? formatDate(startDate) : "",
        timePeriodTo: endDate ? formatDate(endDate) : "",
        graduated: graduated,
      };
    });

    const payload = {
      categoryName: "Education",
      traitId: "education",
      traits: {
        data: data,
      },
    };

    // create if not exists, update if exists
    if (!educationExp && isProfileFormDataEmpty("education", data[0])) {
      // return createEducationExperiences(authUser.handle, data);
      return { action: "create", data: payload };
    } else {
      if (isProfileFormDataEmpty("education", data[0])) {
        // return updateEducationExperiences(authUser.handle, data);
        return {
          action: "update",
          data: payload,
        };
      } else {
        return null;
      }
    }
  };

  // save languages
  const getLanguagesData = (languagesExp) => {
    // mapped data
    let data = languages.map((language_) => {
      const { language, spokenLevel, writtenLevel } = language_;
      return {
        language,
        spokenLevel,
        writtenLevel,
      };
    });

    const payload = {
      categoryName: "Languages",
      traitId: "languages",
      traits: {
        data: data,
      },
    };

    // create if not exists, update if exists
    if (!languagesExp && isProfileFormDataEmpty("language", data[0])) {
      // return createLanguageExperiences(authUser.handle, data);
      return { action: "create", data: payload };
    } else {
      if (isProfileFormDataEmpty("language", data[0])) {
        // return updateLanguageExperiences(authUser.handle, data);
        return {
          action: "update",
          data: payload,
        };
      } else {
        // return Promise.resolve();
        return null;
      }
    }
  };

  const canSubmit = () => {
    return !(
      errors &&
      (errors.jobs.length > 0 ||
        errors.educations.length > 0 ||
        errors.languages.length > 0)
    );
  };

  // reach router, navigate programmatically
  const navigate = useNavigate();
  // on submit, save form and then navigate
  const handleSubmit = async (e) => {
    if (!canSubmit()) {
      return;
    }
    setIsLoading(true);
    // save address (basic info) then contact details before navigate
    e.preventDefault();

    const result = await getBuildProfile(authUser.handle);

    const languageExperience = result?.data?.find(
      (t) => t.traitId === "languages"
    );
    const educationExperience = result?.data?.find(
      (t) => t.traitId === "education"
    );
    const workExperience = result?.data?.find((t) => t.traitId === "work");

    const basicInfo = result?.data?.find((t) => t.traitId === "basic_info");
    const basicInfoTraits = getTraits(basicInfo);

    const traitsToCreate = [];
    const traitsToUpdate = [];

    const functions = [
      {
        val: basicInfoTraits,
        func: getTitleAndBioData,
      },
      {
        val: workExperience,
        func: getJobsData,
      },
      {
        val: educationExperience,
        func: getEducationData,
      },
      {
        val: languageExperience,
        func: getLanguagesData,
      },
    ];

    for (let f of functions) {
      let data = f.func(f.val);
      if (data != null) {
        if (data.action === "create") {
          traitsToCreate.push(data.data);
        } else {
          traitsToUpdate.push(data.data);
        }
      }
    }

    if (traitsToCreate.length > 0) {
      try {
        await createTraits(authUser.handle, traitsToCreate);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log("Failed to create traits", err);
      }

      try {
        await updateTraits(authUser.handle, traitsToCreate);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log("Failed to create traits", err);
      }
    }

    if (traitsToUpdate.length > 0) {
      try {
        await updateTraits(authUser.handle, traitsToUpdate);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log("Failed to update traits", err);
      }
    }

    setIsLoading(false);
    navigate("/onboard/complete");
  };

  return (
    <>
      <LoadingSpinner show={isLoading} />
      <Page title="Build Your Profile" styleName="build-my-profile">
        <PageContent>
          <PageH2>Build Your Profile</PageH2>
          {`${myProfileData?.firstName || ""} ${
            myProfileData?.lastName || ""
          } | ${authUser?.handle}`}
          <PageDivider />

          <br />
          <PageRow half={true}>
            <PageCard>
              <PageH2>Why build your profile?</PageH2>
              <PageP>
                Topcoder offers freelance gig opportunities with great
                companies. if you're interested in Freelance work, be sure to
                complete this part of your profile!
              </PageP>
            </PageCard>
            <PageCard colorStyle="secondary" hasImage={true}>
              <img src={ImgTestimonial2} alt={"Testimonial"} />
              <div>
                <PageH3>
                  "It's the opportunity to work with large global companies on
                  real projects with very specific timelines."
                </PageH3>
                <PageP>Chekspir, Topcoder member since 2009</PageP>
              </div>
            </PageCard>
          </PageRow>

          <br />
          <br />
          <PageDivider />
          <PageH3>Your title & bio</PageH3>
          <PageRow half={true} styleName="form-row">
            <div>
              <PageP styleName="form-description">
                Some customers search for candidates by role (eg., "Front-End
                Developer" or "UI Designer"). Enter your Title and a short bio
                to help customers find you.
              </PageP>
            </div>
            <div>
              <FormField label={"Title"}>
                <FormInputText
                  placeholder={"Enter your title"}
                  value={title}
                  name="title"
                  onChange={(e) =>
                    handleInputChange(e.target.name, e.target.value)
                  }
                />
              </FormField>
              <FormField label={"Bio"}>
                <FormInputTextArea
                  placeholder={"Enter your bio"}
                  value={bio}
                  name="bio"
                  onChange={(e) =>
                    handleInputChange(e.target.name, e.target.value)
                  }
                />
              </FormField>
            </div>
          </PageRow>

          <PageDivider />
          <PageListInput
            listInput={jobs}
            name="jobs"
            title="Job"
            heading="Work experience"
            desc={
              "Enter your work experience to show customers the roles and responsibilities " +
              "you have held in the past."
            }
            addListInputItem={addListInputItem}
          >
            {jobs.map((job, index) => {
              const {
                company,
                position,
                industry,
                city,
                startDate,
                endDate,
                currentlyWorking,
              } = job;
              const name = "jobs";
              return (
                <div styleName="listinput-item">
                  {index !== 0 && (
                    <>
                      <PageDivider />
                      <br />
                    </>
                  )}
                  <FormField label={"Company"}>
                    <FormInputText
                      placeholder={"Enter company"}
                      value={company}
                      name="company"
                      onChange={(e) =>
                        handleListInputChange(
                          name,
                          index,
                          e.target.name,
                          e.target.value
                        )
                      }
                    />
                  </FormField>
                  <FormField label={"Position"}>
                    <FormInputText
                      placeholder={"Enter position"}
                      value={position}
                      name="position"
                      onChange={(e) =>
                        handleListInputChange(
                          name,
                          index,
                          e.target.name,
                          e.target.value
                        )
                      }
                    />
                  </FormField>
                  <PageRow half={true}>
                    <FormField label={"Industry"}>
                      <Select
                        value={
                          industry && {
                            value: industries.find((v) => v === industry),
                            label: industries.find((v) => v === industry),
                          }
                        }
                        onChange={(option) =>
                          handleListInputChange(
                            name,
                            index,
                            "industry",
                            option.value
                          )
                        }
                        options={_.sortBy(industries).map((v) => ({
                          value: v,
                          label: v,
                        }))}
                        style2={true}
                        placeholder={"Select industry"}
                      />
                    </FormField>
                    <FormField label={"City"}>
                      <FormInputText
                        placeholder={"Enter city"}
                        value={city}
                        name="city"
                        onChange={(e) =>
                          handleListInputChange(
                            name,
                            index,
                            e.target.name,
                            e.target.value
                          )
                        }
                      />
                    </FormField>
                  </PageRow>
                  <PageRow half={true}>
                    <FormField
                      label={"Start Date"}
                      error={
                        errors && hasError(name, index, "startDate")
                          ? "Start Date should be before End Date"
                          : ""
                      }
                    >
                      <DateInput
                        value={startDate}
                        onChange={(v) => {
                          handleListInputChange(name, index, "startDate", v);
                          validateDate(name, index, v, endDate);
                        }}
                        style2={true}
                        placeholder={"Select start date"}
                      />
                    </FormField>
                    <FormField label={"End Date"}>
                      <DateInput
                        disabled={currentlyWorking}
                        value={endDate}
                        onChange={(v) => {
                          handleListInputChange(name, index, "endDate", v);
                          validateDate(name, index, startDate, v);
                        }}
                        style2={true}
                        placeholder={"Select end date"}
                      />
                    </FormField>
                  </PageRow>
                  <div>
                    <FormInputCheckbox
                      label={"I am currently working in this role"}
                      checked={currentlyWorking}
                      onChange={(e) =>
                        handleListInputChange(
                          name,
                          index,
                          "currentlyWorking",
                          e.target.checked
                        )
                      }
                    />
                  </div>
                  <br />
                  {jobs.length > 1 && (
                    <div styleName="remove-listinput-item-button">
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(_e) => removeListInputItem(name, index)}
                      >
                        <IconCross styleName="icon-remove" />
                        <span>Delete This Job</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </PageListInput>

          <PageDivider />
          <PageListInput
            listInput={educations}
            name="educations"
            title="School / Degree"
            heading="Education"
            desc={"Enter information about your schooling and degrees."}
            addListInputItem={addListInputItem}
          >
            {educations.map((education, index) => {
              const {
                collegeName,
                major,
                startDate,
                endDate,
                graduated,
              } = education;
              const name = "educations";
              return (
                <div styleName="listinput-item">
                  {index !== 0 && (
                    <>
                      <PageDivider />
                      <br />
                    </>
                  )}
                  <FormField label={"Name of College or University"}>
                    <FormInputText
                      placeholder={"Enter name"}
                      value={collegeName}
                      name="collegeName"
                      onChange={(e) =>
                        handleListInputChange(
                          name,
                          index,
                          e.target.name,
                          e.target.value
                        )
                      }
                    />
                  </FormField>
                  <FormField label={"Major"}>
                    <FormInputText
                      placeholder={"Enter major"}
                      value={major}
                      name="major"
                      onChange={(e) =>
                        handleListInputChange(
                          name,
                          index,
                          e.target.name,
                          e.target.value
                        )
                      }
                    />
                  </FormField>
                  <PageRow half={true}>
                    <FormField
                      label={"Start Date"}
                      error={
                        errors && hasError(name, index, "startDate")
                          ? "Start Date should be before End Date"
                          : ""
                      }
                    >
                      <DateInput
                        value={startDate}
                        onChange={(v) => {
                          handleListInputChange(name, index, "startDate", v);
                          validateDate(name, index, v, endDate);
                        }}
                        style2={true}
                        placeholder={"Select start date"}
                      />
                    </FormField>
                    <FormField label={"End Date (or expected)"}>
                      <DateInput
                        value={endDate}
                        onChange={(v) => {
                          handleListInputChange(name, index, "endDate", v);
                          validateDate(name, index, startDate, v);
                        }}
                        style2={true}
                        placeholder={"Select end date"}
                        allowFutureDate
                      />
                    </FormField>
                  </PageRow>
                  <div>
                    <FormInputCheckbox
                      label={"Graduated"}
                      checked={graduated}
                      onChange={(e) =>
                        handleListInputChange(
                          name,
                          index,
                          "graduated",
                          e.target.checked
                        )
                      }
                    />
                  </div>
                  <br />
                  {educations.length > 1 && (
                    <div styleName="remove-listinput-item-button">
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => removeListInputItem(name, index)}
                      >
                        <IconCross styleName="icon-remove" />
                        <span>Delete This School / Degree</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </PageListInput>

          <PageDivider />
          <PageListInput
            listInput={languages}
            name="languages"
            title="Language"
            heading="Language Skills"
            desc={
              "Let customers know the languages you speak. Multilingual? Magnifique."
            }
            addListInputItem={addListInputItem}
          >
            {languages.map((languageSkill, index) => {
              const { language, spokenLevel, writtenLevel } = languageSkill;
              const name = "languages";
              return (
                <div styleName="listinput-item">
                  {index !== 0 && (
                    <>
                      <PageDivider />
                      <br />
                    </>
                  )}
                  <FormField label={"Language"}>
                    <Select
                      value={
                        language && {
                          value: languagesList.find((v) => v === language),
                          label: languagesList.find((v) => v === language),
                        }
                      }
                      onChange={(option) =>
                        handleListInputChange(
                          name,
                          index,
                          "language",
                          option.value
                        )
                      }
                      options={_.sortBy(languagesList).map((v) => ({
                        value: v,
                        label: v,
                      }))}
                      style2={true}
                      placeholder={"Select language"}
                    />
                  </FormField>
                  <PageRow half={true}>
                    <FormField label={"Spoken Level"}>
                      <Select
                        value={
                          spokenLevel && {
                            value: spokenLevels.find((v) => v === spokenLevel),
                            label: spokenLevels.find((v) => v === spokenLevel),
                          }
                        }
                        onChange={(option) =>
                          handleListInputChange(
                            name,
                            index,
                            "spokenLevel",
                            option.value
                          )
                        }
                        options={spokenLevels.map((v) => ({
                          value: v,
                          label: v,
                        }))}
                        style2={true}
                        placeholder={"Select spoken level"}
                      />
                    </FormField>
                    <FormField label={"Written Level"}>
                      <Select
                        value={
                          writtenLevel && {
                            value: writtenLevels.find(
                              (v) => v === writtenLevel
                            ),
                            label: writtenLevels.find(
                              (v) => v === writtenLevel
                            ),
                          }
                        }
                        onChange={(option) =>
                          handleListInputChange(
                            name,
                            index,
                            "writtenLevel",
                            option.value
                          )
                        }
                        options={writtenLevels.map((v) => ({
                          value: v,
                          label: v,
                        }))}
                        style2={true}
                        placeholder={"Select written level"}
                      />
                    </FormField>
                  </PageRow>
                  {languages.length > 1 && (
                    <div styleName="remove-listinput-item-button">
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(_) => removeListInputItem(name, index)}
                      >
                        <IconCross styleName="icon-remove" />
                        <span>Delete This Language</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </PageListInput>

          <PageDivider />
          <PageFoot></PageFoot>
          <PageFoot align="between">
            <Link to="/onboard/payment-setup">
              <Button size={BUTTON_SIZE.MEDIUM} type={BUTTON_TYPE.SECONDARY}>
                {"< "}Back
              </Button>
            </Link>
            <Link
              to={errors && canSubmit() ? "/onboard/complete" : "#"}
              onClick={(e) => handleSubmit(e)}
            >
              <Button
                disabled={errors && !canSubmit()}
                size={BUTTON_SIZE.MEDIUM}
              >
                COMPLETE YOUR PROFILE
              </Button>
            </Link>
          </PageFoot>
          <OnboardProgress level={4} />
        </PageContent>
      </Page>
    </>
  );
};

export default withAuthentication(BuildMyProfile);
