/**
 * SkillsList
 *
 * Displays Skills List
 */
import React from "react";
import PT from "prop-types";
import "./styles.module.scss";
import IconPlus from "../../assets/images/icon-plus.svg";
import IconCross from "../../assets/images/icon-cross.svg";

const SkillsList = ({ selecteds, onNewSkillClicked, handleSkillRemove }) => {
  // skill categories
  const categories = [
    { id: "Design/UX", label: "Design / UX Skills" },
    { id: "Development", label: "Developer Skills" },
    { id: "Data Science", label: "Data Science Skills" },
  ];

  // render selected skills
  const renderSelectedElements = () =>
    selecteds.map((skill) => (
      <div styleName="skill selected" onClick={(e) => handleSkillRemove(skill)}>
        {skill.name} <IconCross styleName="skill-remove-icon" />
      </div>
    ));
  // render categories
  const renderCategoriesElements = () =>
    categories.map((category) => (
      <div styleName="skill" onClick={(e) => onNewSkillClicked(category, e)}>
        {category.label} <IconPlus styleName="skill-add-icon" />
      </div>
    ));
  return (
    <div styleName="skills-list">
      {selecteds.length ? (
        <>
          {renderSelectedElements()}
          <div styleName="skill" onClick={(e) => onNewSkillClicked(null, e)}>
            Add Another Skill <IconPlus styleName="skill-add-icon" />
          </div>
        </>
      ) : (
        renderCategoriesElements()
      )}
    </div>
  );
};

SkillsList.propTypes = {
  selecteds: PT.array,
  onNewSkillClicked: PT.func,
};

export default SkillsList;
