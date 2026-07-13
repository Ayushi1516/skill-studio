/**
 * This module provides a simple event bus for authentication events.
 * It allows non-React parts of the app (like the api service) to signal
 * an event (like a 401 error) that React components can listen for.
 */

export const authEvents = new EventTarget();

export function dispatchLogoutEvent() {
  // Dispatch a custom event that the AuthProvider can listen for.
  authEvents.dispatchEvent(new Event('logout'));
}