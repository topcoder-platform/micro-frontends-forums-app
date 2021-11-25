/**
 * InterestsList
 *
 * Display Interests List
 */
import React from "react";
import PT from "prop-types";
import cn from "classnames";
import "./styles.module.scss";
import { interests as allInterests } from "constants";

const InterestsList = ({ myInterests, onSelect }) => {
  return (
    <div styleName="interests-list">
      {allInterests.map((interest) => (
        <div
          styleName={cn(
            "interest",
            myInterests.find((myInterest) => myInterest.name === interest.name)
              ? "selected"
              : ""
          )}
          onClick={(e) => {
            onSelect(interest);
          }}
        >
          {interest.name}
        </div>
      ))}
    </div>
  );
};

InterestsList.propTypes = {
  myInterests: PT.array,
};

export default InterestsList;
