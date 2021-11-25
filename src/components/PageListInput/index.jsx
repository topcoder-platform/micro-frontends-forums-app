/**
 * PageListInput
 *
 * A List Of grouped Inputs, used in build my profile page
 */
import React from "react";
import PT from "prop-types";
import cn from "classnames";
import "./styles.module.scss";
import PageDivider from "components/PageDivider";
import PageH1 from "components/PageElements/PageH1";
import PageH2 from "components/PageElements/PageH2";
import PageH3 from "components/PageElements/PageH3";
import PageP from "components/PageElements/PageP";
import PageUl from "components/PageElements/PageUl";
import PageRow from "components/PageElements/PageRow";
import IconPlus from "../../assets/images/icon-plus.svg";

const PageListInput = ({
  items,
  name,
  title,
  heading,
  desc,
  addListInputItem,
  styleName,
  children,
}) => {
  return (
    <div styleName={cn("page-list-input", styleName || "")}>
      <PageH3>{heading}</PageH3>
      <PageRow half={true} styleName="form-row">
        <div>
          <PageP styleName="form-description">{desc}</PageP>
        </div>
        <div>
          <div styleName="listinput-itemslist">{children}</div>
          <div styleName="add-listinput-item-button">
            <div onClick={(e) => addListInputItem(name)}>
              <IconPlus styleName="icon-add" />
              <span>Add Another {title}</span>
            </div>
          </div>
        </div>
      </PageRow>
    </div>
  );
};

PageListInput.propTypes = {
  addListInputItem: PT.func,
  items: PT.array,
  name: PT.string,
  children: PT.node,
};

export default PageListInput;
