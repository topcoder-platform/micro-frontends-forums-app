/**
 * ProgressPopup
 *
 * Three dots Progress Popup
 */
import React, { useState } from "react";
import PT from "prop-types";
import cn from "classnames";
import "./styles.module.scss";
import IconCheck from "../../assets/images/icon-check-thin.svg";
import IconCross from "../../assets/images/icon-cross.svg";
import { useNavigate } from "@reach/router";

const ProgressPopup = ({
  level,
  maxStep,
  levels,
  open,
  handleClose = (e) => e,
  styleName,
  ...props
}) => {
  const navigate = useNavigate();
  // add a class to show if it's done or current or notDone yet
  const getLevelClass = (levelIndex) => {
    let levelNumber = levelIndex + 1;
    // last level, everything is done.
    if (level === levels.length) return "done";
    return levelNumber === level
      ? "current"
      : levelNumber <= maxStep
      ? "done"
      : "";
  };
  return (
    <>
      {open && (
        <div styleName={cn("progress-popup", styleName || "")} {...props}>
          <IconCross styleName="close-btn" onClick={(e) => handleClose(e)} />
          <div>
            {levels.map((level, levelIndex) => (
              <div
                styleName={cn("level", getLevelClass(levelIndex))}
                onClick={() => {
                  getLevelClass(levelIndex) !== "" ? navigate(level.url) : null;
                }}
              >
                <div
                  styleName={cn("level-check-icon", getLevelClass(levelIndex))}
                >
                  {getLevelClass(levelIndex) === "done" && (
                    <IconCheck styleName={"icon-check"} />
                  )}
                </div>
                {level.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

ProgressPopup.propTypes = {
  level: PT.number,
  maxStep: PT.number,
  levels: PT.array,
  open: PT.bool,
  handleClose: PT.func,
};

export default ProgressPopup;
