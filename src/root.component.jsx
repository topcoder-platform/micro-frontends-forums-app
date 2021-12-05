import React, { useEffect } from "react";
import { VANILLA_EMBED_JS } from "./constants";
import { disableSidebarForRoute } from "@topcoder/micro-frontends-navbar-app";
import "styles/global.scss";
// import ebmedJs from "./embed-test";

export default function Root() {
  useEffect(() => {
    // ebmedJs();
    disableSidebarForRoute("/forums/*");
    const script = document.createElement("script");
    script.src = VANILLA_EMBED_JS;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <div id="vanilla-comments"></div>
      <noscript>
        Please enable JavaScript to view the
        <a href="http://vanillaforums.com/?ref_noscript">
          discussions powered by Vanilla.
        </a>
      </noscript>
      <div className="vanilla-credit">
        <a className="vanilla-anchor" href="http://vanillaforums.com">
          Discussions by <span className="vanilla-logo">Vanilla</span>
        </a>
      </div>
    </>
  );
}
