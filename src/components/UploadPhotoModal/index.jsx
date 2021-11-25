/**
 * UploadPhotoModal
 *
 * Modal for Input And Upload Photo
 */
import React, { useState, useEffect } from "react";
import PT from "prop-types";
import cn from "classnames";
import "./styles.module.scss";

import PageDivider from "components/PageDivider";
import PageH3 from "components/PageElements/PageH3";
import PageP from "components/PageElements/PageP";
import PageFoot from "components/PageElements/PageFoot";

import Button from "components/Button";
import Modal from "components/Modal";
import { BUTTON_SIZE, BUTTON_TYPE } from "constants";

import { useDropzone } from "react-dropzone";

const UploadPhotoModal = ({
  show = false,
  handleClose = (f) => f,
  onPhotoSaved = (f) => f,
}) => {
  // react dropzone hooks
  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
  } = useDropzone({
    multiple: false,
    accept: "image/jpg, image/jpeg, image/png",
    minSize: 1,
    maxSize: 2097152,
  });
  const [photoSrc, setPhotoSrc] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (acceptedFiles && acceptedFiles.length) {
      setPhotoSrc(URL.createObjectURL(acceptedFiles[0]));
    }
  }, [acceptedFiles]);

  useEffect(() => {
    if (fileRejections && fileRejections.length) {
      setErrorMessage("(Maximum File Size: 2MB)");
    } else {
      setErrorMessage("");
    }
  }, [fileRejections]);

  const handleBackClick = (e) => {
    if (!photoSrc) handleClose(e);
    else setPhotoSrc("");
  };
  // handle save photo (tell the parent the saved photo and close modal)
  const handleSaveClick = (e) => {
    onPhotoSaved(photoSrc, acceptedFiles[0]);
    handleClose(e);
    setPhotoSrc("");
  };
  return (
    <Modal show={show} handleClose={handleClose}>
      <PageH3>
        <span styleName="mute">Add your image</span> > Upload Photo
      </PageH3>
      <PageP>
        {photoSrc && (
          <div
            style={{ backgroundImage: `url(${photoSrc})` }}
            styleName="photo"
          />
        )}
        {!photoSrc && (
          <div {...getRootProps()} styleName="dropzone">
            <input {...getInputProps()} />
            <p>
              Drag & Drop your photo here
              <br />
              OR
              <br />
              choose a photo to upload
              {errorMessage && <p styleName="error-message">{errorMessage}</p>}
            </p>
            <br />
            <Button size={BUTTON_SIZE.MEDIUM}>BROWSE FILES</Button>
          </div>
        )}
      </PageP>
      <PageDivider />
      <PageFoot align="between">
        <Button
          size={BUTTON_SIZE.MEDIUM}
          type={BUTTON_TYPE.SECONDARY}
          onClick={handleBackClick}
        >
          {"< "}Back
        </Button>
        <Button
          size={BUTTON_SIZE.MEDIUM}
          disabled={!photoSrc}
          onClick={handleSaveClick}
        >
          Save
        </Button>
      </PageFoot>
    </Modal>
  );
};

UploadPhotoModal.propTypes = {
  show: PT.bool,
  handleClose: PT.func,
  onPhotoSaved: PT.func,
};

export default UploadPhotoModal;
