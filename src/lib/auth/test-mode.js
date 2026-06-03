/**
 * In-memory auth for local/testing. Never enabled in production.
 * Set AUTH_TEST_MODE=true in .env
 */
export function isAuthTestMode() {
  return (
    process.env.AUTH_TEST_MODE === "true" &&
    process.env.NODE_ENV !== "production"
  );
}
