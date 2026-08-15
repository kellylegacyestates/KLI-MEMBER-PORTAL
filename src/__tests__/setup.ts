// Global test setup
// Suppress console.error noise from intentional error-path tests
const originalError = console.error;
beforeEach(() => {
  console.error = () => {};
});
afterEach(() => {
  console.error = originalError;
});
