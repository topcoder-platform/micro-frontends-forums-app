import React from "react";
import cn from "classnames";
import IconArrowDown from "../../assets/images/icon-arrow-down.svg";
import "./styles.module.scss";

const ScrollToBottom = () => {
  const onScroll = () => {
    window.scroll({
      top: document.body.offsetHeight,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <div styleName="scroll-to-bottom" onClick={onScroll}>
      <div styleName="icon-wrapper">
        <IconArrowDown />
      </div>
      <div styleName={cn("icon-wrapper", "no-margin")}>
        <IconArrowDown />
      </div>
      <span styleName="scroll-label">Scroll down to confirm</span>
      <div styleName="icon-wrapper">
        <IconArrowDown />
      </div>
      <div styleName="icon-wrapper">
        <IconArrowDown />
      </div>
    </div>
  );
};

export default ScrollToBottom;
