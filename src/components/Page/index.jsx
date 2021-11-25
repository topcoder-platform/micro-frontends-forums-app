/**
 * Page
 *
 * Handles common stuff for pages.
 * Should wrap each page.
 */
import React, { useEffect } from "react";
import PT from "prop-types";
import cn from "classnames";
import "./styles.module.scss";

const Page = ({ children, title, styleName, ...props }) => {
  // set page title and triggering analytics
  useEffect(() => {
    // call analytics if the parent Frame app initialized it
    if (window.analytics && typeof window.analytics.page === "function") {
      window.analytics.page();
    }
  }, [title]);

  return (
    <div styleName={cn("page", styleName || "")} {...props}>
      {children}
    </div>
  );
};

Page.propTypes = {
  children: PT.node,
  title: PT.string,
};

export default Page;
