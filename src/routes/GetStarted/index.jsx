/** Get Started page */
import React, { useState, useEffect } from "react";
import "./styles.module.scss";
import { Link, useNavigate } from "@reach/router";
import { useSelector } from "react-redux";
import withAuthentication from "hoc/withAuthentication";
import {
  setUserProfilePhoto,
  getAuthUserProfile,
} from "@topcoder/micro-frontends-navbar-app";

// import components and other stuffs
import Page from "components/Page";
import PageContent from "components/PageContent";
import PageDivider from "components/PageDivider";
import PageH1 from "components/PageElements/PageH1";
import PageH2 from "components/PageElements/PageH2";
import PageH3 from "components/PageElements/PageH3";
import PageP from "components/PageElements/PageP";
import PageUl from "components/PageElements/PageUl";
import PageRow from "components/PageElements/PageRow";
import PageFoot from "components/PageElements/PageFoot";
import PageCard from "components/PageElements/PageCard";
import InterestsList from "components/InterestsList";
import SkillsList from "components/SkillsList";
import Button from "components/Button";
import OnboardProgress from "components/OnboardProgress";
import UploadPhotoModal from "components/UploadPhotoModal";
import AddSkillsModal from "components/AddSkillsModal";
import LoadingSpinner from "components/LoadingSpinner";

import {
  BUTTON_SIZE,
  skills as allSkills,
  interests as allInterests,
} from "constants";

import IconEdit from "../../assets/images/icon-edit.svg";
import IconUpload from "../../assets/images/icon-upload.svg";
import ImgTestimonial1 from "../../assets/images/testimonial-1.png";

import { getAllSkills, getMemberSkills, updateMySkills } from "services/skills";
import {
  getMyBasicInfo,
  addMyPrimaryInterests,
  updateMyPrimaryInterests,
} from "services/basicInfo";
import { uploadProfilePhoto } from "services/memberData";
import _ from "lodash";
import {
  getTraits,
  scrollToTop,
  isGetStartedFormDataEmpty,
  isNullOrEmpty,
} from "utils/";
import { getAllCountries } from "services/countries";
import { checkUserTrait } from "services/traits";
import { trackEvent } from "services/analytics";
import { EVENT_TYPE } from "constants/";

const GetStarted = () => {
  // states
  const authUser = useSelector((state) => state.authUser);
  const [isLoading, setIsLoading] = useState(false);
  const [allSkillsLive, setAllSkillsLive] = useState([]);
  const [myProfileData, setMyProfileData] = useState({});
  const [myInterests, setMyInterests] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [initialMySkills, setInitialMySkills] = useState([]);
  const [skillsModalShow, setSkillsModalShow] = useState(false);
  const [uploadPhotoModalShow, setUploadPhotoModalShow] = useState(false);
  const [profilePhotoSrc, setProfilePhotoSrc] = useState("");
  const [profilePhotoSrcBeforeSave, setProfilePhotoSrcBeforeSave] = useState(
    ""
  );
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [skillsModalInitialCategory, setSkillsModalInitialCategory] = useState(
    null
  );
  // track page load
  const [loadedDatas, setLoadedDatas] = useState({
    memberData: false,
    basicInfo: false,
    allSkills: false,
    mySkills: false,
  });

  // at start, set loading to true
  useEffect(() => {
    setIsLoading(true);

    scrollToTop();
  }, []);

  // count loaded datas, if it's equal to all datas, set loading to false
  useEffect(() => {
    const loadedCount = Object.values(loadedDatas).reduce(
      (a, c) => (c ? a + 1 : a),
      0
    );
    if (loadedCount === Object.values(loadedDatas).length) {
      setIsLoading(false);
    }
  }, [loadedDatas]);

  const handleInterestSelect = (selectedInterest) => {
    // if exists, delete it. otherwise, add it
    if (
      myInterests.find(
        (myInterest) => myInterest.name === selectedInterest.name
      )
    )
      setMyInterests(
        myInterests.filter(
          (myInterest) => myInterest.name !== selectedInterest.name
        )
      );
    else setMyInterests([...myInterests, selectedInterest]);
  };
  const handleSelectedSkillRemove = (skill) => {
    setSelectedSkills(selectedSkills.filter((s) => s.id !== skill.id));
  };

  // when profilePhotoSrc changes, tell the navbar to update it
  useEffect(() => {
    if (!profilePhotoSrc) return;
    setUserProfilePhoto(profilePhotoSrc);
  }, [profilePhotoSrc]);

  // Get all live skills
  useEffect(() => {
    setLoadedDatas({ ...loadedDatas, allSkills: false });
    getAllSkills()
      .then((result) => {
        setLoadedDatas((loadedDatas) => ({ ...loadedDatas, allSkills: true }));
        setAllSkillsLive(result?.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        // eslint-disable-next-line no-console
        console.log(e);
      });
  }, []);

  // Get Member data from redux (firstName, lastName, handle, photoURL) and store it on myProfileData
  useEffect(() => {
    if (!authUser || !authUser.handle) return;
    setLoadedDatas({ ...loadedDatas, memberData: false });
    getAuthUserProfile()
      .then((result) => {
        setLoadedDatas((loadedDatas) => ({ ...loadedDatas, memberData: true }));
        setMyProfileData(result);
      })
      .catch((e) => {
        setIsLoading(false);
        // eslint-disable-next-line no-console
        console.log(e);
      });
  }, [authUser]);

  // Get skills from server and map them to my selected skills
  useEffect(() => {
    if (!authUser || !authUser.handle || !allSkillsLive.length) return;
    setLoadedDatas({ ...loadedDatas, mySkills: false });
    // Get skills from server
    getMemberSkills(authUser.handle)
      .then((result) => {
        // set loadedDatas to track page load
        setLoadedDatas((loadedDatas) => ({ ...loadedDatas, mySkills: true }));
        let myskills = result?.data?.skills;
        if (myskills) myskills = Object.values(myskills);
        // map and store on state
        const finalMySkills = myskills
          .map((myskill) =>
            allSkillsLive.find((s) => s.name === myskill.tagName)
          )
          .filter((s) => s);

        setSelectedSkills(finalMySkills);
        setInitialMySkills(finalMySkills);
      })
      .catch((e) => {
        setIsLoading(false);
        // toastr.error('Error', 'failed to get profile skills!');
      });
  }, [authUser, allSkillsLive]);

  // Get Basic Info to get users interests, and map them to my interests
  useEffect(() => {
    if (!authUser || !authUser.handle) return;
    setLoadedDatas({ ...loadedDatas, basicInfo: false });
    getMyBasicInfo(authUser.handle)
      .then((result) => {
        // set loadedDatas to track page load
        setLoadedDatas((loadedDatas) => ({ ...loadedDatas, basicInfo: true }));
        let myInterestsOnServer =
          result?.data[0]?.traits?.data[0]?.primaryInterestInTopcoder || "";
        // convert myInterests strin to array
        myInterestsOnServer = myInterestsOnServer
          .split(",")
          .map((interest) => ({ name: interest.trim() }));
        setMyInterests(
          myInterestsOnServer
            .map((myInterest) => {
              return allInterests.find(
                (interest) => interest.name === myInterest.name
              );
            })
            .filter((s) => s)
        );
      })
      .catch((e) => {
        setIsLoading(false);
        // eslint-disable-next-line no-console
        console.log(e);
      });
  }, [authUser]);

  // fill user profile photo
  useEffect(() => {
    if (myProfileData?.photoURL) setProfilePhotoSrc(myProfileData.photoURL);
  }, [myProfileData]);

  // Save profile photo
  useEffect(() => {
    setIsLoading(true);
    if (profilePhotoFile) {
      uploadProfilePhoto(authUser.handle, profilePhotoFile)
        .then((result) => {
          if (result?.data?.photoURL) {
            setIsLoading(false);
            // toastr.success("Success", "Profile photo updated successfully!");
            setProfilePhotoSrc(result.data.photoURL);
          }
        })
        .catch((e) => {
          setIsLoading(false);
          // toastr.error('Error', 'failed to save profile photo!');
          // revert image to last image
          setProfilePhotoSrc(profilePhotoSrcBeforeSave);
          // eslint-disable-next-line no-console
          console.log(e);
        });
    }
  }, [profilePhotoFile, authUser]);

  const saveMyInterests = () => {
    // saving myInterests
    // convert myInterests to string
    let myInterestsFlat = myInterests
      .map((interest) => interest.name)
      .join(", ");
    // check if basic info already exists. if so, update(put data). otherwise, post data.
    return getMyBasicInfo(authUser.handle)
      .then(async (result) => {
        const basicInfoTraits = getTraits(result?.data[0]);

        if (
          // v3 requires a create call (for traitId = "basic_info") if country is missing
          (basicInfoTraits == null || isNullOrEmpty(basicInfoTraits.country)) &&
          isGetStartedFormDataEmpty(myInterestsFlat)
        ) {
          if (isNullOrEmpty(basicInfoTraits.country)) {
            const response = await getAllCountries();
            const country = response.data?.result.content.find(
              (country) =>
                country.countryCode == basicInfoTraits.homeCountryCode
            );
            if (country != null) {
              basicInfoTraits.country = country.country;
            }
          }

          return addMyPrimaryInterests(
            authUser.handle,
            basicInfoTraits, // we could get here if basicInfoTraits.country == null
            myInterestsFlat
          );
        } else {
          if (isGetStartedFormDataEmpty(myInterestsFlat)) {
            return updateMyPrimaryInterests(
              authUser.handle,
              basicInfoTraits,
              myInterestsFlat
            );
          } else {
            return Promise.resolve();
          }
        }
      })
      .catch((e) => {
        setIsLoading(false);
        // toastr.error('Error', 'failed to save profile interests!');
        // eslint-disable-next-line no-console
        console.log(e);
      });
  };

  const saveMySkills = (skills) => {
    // get deleted skills
    const deletedSkills = initialMySkills.filter(
      (s) => !skills.find((x) => x.name === s.name)
    );
    let deletedSkillsLegacyIds = deletedSkills.map((skill) => {
      return allSkills.find((s) => s.label === skill.name)?.legacyId;
    });
    deletedSkillsLegacyIds = deletedSkillsLegacyIds.filter((s) => s);

    // saving mySkills
    // map
    let mySkillsLegacyIds = skills.map((skill) => {
      return allSkills.find((s) => s.label === skill.name)?.legacyId;
    });
    // remove the ones that we dont know the legacy ids
    mySkillsLegacyIds = mySkillsLegacyIds.filter((s) => s);
    if (
      !(
        isNullOrEmpty(mySkillsLegacyIds) &&
        isNullOrEmpty(deletedSkillsLegacyIds)
      )
    ) {
      return updateMySkills(
        authUser.handle,
        mySkillsLegacyIds,
        deletedSkillsLegacyIds
      ).catch((e) => {
        setIsLoading(false);
        // toastr.error('Error', 'failed to save my skills!');
        // eslint-disable-next-line no-console
        console.log(e);
      });
    } else {
      return Promise.resolve();
    }
  };

  // reach router, navigate programmatically
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    setIsLoading(true);
    // save interests before navigate
    e.preventDefault();
    saveMyInterests()
      .then(() => {
        return saveMySkills(selectedSkills);
      })
      .then(() => {
        setIsLoading(false);
        navigate("/onboard/contact-details");
      });
  };
  return (
    <>
      <LoadingSpinner show={isLoading} />
      <Page title="Get Started">
        <PageContent>
          <PageH2>GET STARTED</PageH2>
          {`${myProfileData?.firstName || ""} ${
            myProfileData?.lastName || ""
          } | ${authUser?.handle}`}
          <PageDivider />
          <PageH1>WELCOME {myProfileData?.firstName}!</PageH1>

          <PageRow half={true}>
            <PageCard>
              <PageH2>DO MORE WITH A GREAT PROFILE.</PageH2>
              <PageP>
                Members with completed profiles are 7x more likely to be
                selected for Topcoder freelance opportunities. The more
                information you share, the more customized, useful, and valuable
                Topcoder will be to you.
              </PageP>
            </PageCard>
            <PageCard colorStyle="secondary" hasImage={true}>
              <img src={ImgTestimonial1} alt={"Testimonial"} />
              <div>
                <PageH2>
                  "Topcoder is the best place to learn from the best of the
                  best."
                </PageH2>
                <PageP>Ravijune, Topcoder member since 2014</PageP>
              </div>
            </PageCard>
          </PageRow>

          <PageDivider />
          <PageRow>
            <div>
              <PageH3>Add YOUR IMAGE</PageH3>
              <PageP>
                <PageP>
                  Show the community who you are. Don't worry, you look great.
                </PageP>
                <strong>Requirements:</strong>
                <PageUl>
                  <li>PNG or JPG format.</li>
                  <li>Maximum size: 2MB.</li>
                </PageUl>
              </PageP>
            </div>
            <div>
              {!profilePhotoSrc && (
                <div styleName="upload-profile-photo">
                  <div styleName="profile-photo-void"></div>
                  <Button
                    size={BUTTON_SIZE.MEDIUM}
                    onClick={(e) => setUploadPhotoModalShow(true)}
                  >
                    <IconUpload styleName="icon-upload" />
                    UPLOAD
                  </Button>
                </div>
              )}
              {profilePhotoSrc && (
                <div styleName="upload-profile-photo">
                  <div
                    style={{ backgroundImage: `url(${profilePhotoSrc})` }}
                    styleName="profile-photo"
                  ></div>
                  <Button
                    size={BUTTON_SIZE.MEDIUM}
                    onClick={(e) => setUploadPhotoModalShow(true)}
                  >
                    <IconEdit styleName="icon-edit" />
                    UPLOAD NEW PHOTO
                  </Button>
                  {/* TODO: implement delete after member Api implements Delete functionality  */}
                  {/* <Button size={BUTTON_SIZE.MEDIUM} type={BUTTON_TYPE.SECONDARY} onClick={e => setProfilePhotoSrc('')} >
                  <IconDelete styleName="icon-delete" />DELETE PHOTO
                </Button> */}
                </div>
              )}
            </div>
          </PageRow>
          <PageDivider />
          <PageRow>
            <div>
              <PageH3>Select your interests at topcoder</PageH3>
              <PageP>
                <PageP>
                  What do you want to do at Topcoder? Compete? Learn? Earn extra
                  money? Get a full time gig? There are no wrong answers.
                </PageP>
              </PageP>
            </div>
            <InterestsList
              myInterests={myInterests}
              onSelect={handleInterestSelect}
            />
          </PageRow>
          <PageDivider />
          <PageRow>
            <div>
              <PageH3>Add your skills</PageH3>
              <PageP>
                <PageP>
                  Add skills to your profile. You can add or update your skills
                  any time.
                </PageP>
              </PageP>
            </div>
            <SkillsList
              selecteds={selectedSkills}
              onNewSkillClicked={(category, e) => {
                if (category) setSkillsModalInitialCategory(category);
                setSkillsModalShow(true);
              }}
              handleSkillRemove={(skill) => handleSelectedSkillRemove(skill)}
            />
          </PageRow>
          <PageDivider />
          <PageFoot>
            <Link
              to="/onboard/contact-details"
              onClick={(e) => handleSubmit(e)}
            >
              <Button size={BUTTON_SIZE.MEDIUM}>
                CONTINUE TO CONTACT DETAILS
              </Button>
            </Link>
          </PageFoot>
          <OnboardProgress level={1} />
        </PageContent>
      </Page>
      <UploadPhotoModal
        show={uploadPhotoModalShow}
        handleClose={(e) => setUploadPhotoModalShow(false)}
        onPhotoSaved={(photoSrc, photoFile) => {
          // save image to handle error
          setProfilePhotoSrcBeforeSave(profilePhotoSrc);
          setProfilePhotoSrc(photoSrc);
          setProfilePhotoFile(photoFile);
        }}
      />
      <AddSkillsModal
        show={skillsModalShow}
        handleClose={(e) => setSkillsModalShow(false)}
        onSkillsSaved={(skills) => {
          setSelectedSkills(skills);
          setInitialMySkills(skills);
          saveMySkills(skills);
        }}
        initialSelectedSkills={selectedSkills}
        initialSelectedCategory={skillsModalInitialCategory}
        allSkillsLive={allSkillsLive}
      />
    </>
  );
};

export default withAuthentication(GetStarted);
