import React, { useLayoutEffect } from "react";
import {
  disableSidebarForRoute,
  setNotificationPlatform,
  PLATFORM,
} from "@topcoder/mfe-header";
import { VANILLA_EMBED_JS } from "./constants";
import "styles/global.scss";

export default function Root() {
  useLayoutEffect(() => {
    // disableSidebarForRoute(`${APP_BASE_PATH}/*`);
    // setNotificationPlatform(PLATFORM.TAAS);
  }, []);

  return (
    <>
      <script type="text/javascript" src={VANILLA_EMBED_JS}></script>
      <noscript>
        Please enable JavaScript to view the
        <a href="http://vanillaforums.com/?ref_noscript">
          discussions powered by Vanilla.
        </a>
      </noscript>
      <div class="vanilla-credit">
        <a class="vanilla-anchor" href="http://vanillaforums.com">
          Discussions by <span class="vanilla-logo">Vanilla</span>
        </a>
      </div>
    </>
  );
}
