export function trackEvent(eventType, eventPayload) {
  if (window.analytics && window.analytics.track) {
    console.log("Track event", eventType);
    window.analytics.track(eventType, eventPayload);
  }
}
