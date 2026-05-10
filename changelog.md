## [0.10.0] 2026-04-13

### Added

- **Social login UI** (Sign In) — Google and Facebook login buttons added below the email/password form
- `GoogleLoginButton` component — uses `@react-oauth/google`, wrapped in existing `GoogleOAuthProvider` in `app.tsx`
- `FacebookLoginButton` component — uses `@greatsumini/react-facebook-login`, reads `VITE_FACEBOOK_APP_ID` from env
- `useGetVetAvailableDatesQuery` and `useGetVetAvailableSlotsQuery` hooks exported from `appointment-api`

### Changed

- `RescheduleAppointment` — switched from specialty-based slot fetching (`useGetAvailableSlotsQuery`) to vet-based queries (`useGetVetAvailableDatesQuery`, `useGetVetAvailableSlotsQuery`)
- `Feedback` component `onSuccess` callback now receives the new `feedbackId` returned by the API after submission

### Fixed

- `Feedback` — split `addFeedback`/`updateFeedback` into separate branches to resolve TypeScript union type narrowing error on `result.data.feedbackId`

## [0.9.1] 2026-04-11

### Added

- `CaptchaInput` component — wraps `react-google-recaptcha`, reads `VITE_RECAPTCHA_SITE_KEY` from env
- reCAPTCHA integrated into the sign-up form — token required to enable the submit button and is included in the `POST /auth/sign-up` request payload

## [0.9.0] 2026-04-10

### Added

- **Change email flow** (My Account) — 2-step form + verification code `[MOCKED]`
- **Password recovery flow** (Sign In) — 2-step flow: enter email → enter verification code + new password together; real API (`POST /auth/password-recovery/request`, `POST /auth/password-recovery/reset`)
- **Registration email verification step** — shown after sign-up, real API (`/auth/verify-email`, `/auth/resend-verification`), extracted to `SignUpVerificationStep`
- Unit tests for sign-up verification step and password recovery flow

### Changed

- Countdown end no longer shows "expired" error — only enables "Resend code" button
- Link-like buttons consistently styled: `text-blue-600 underline decoration-blue-600 cursor-pointer`
- Buttons disabled until validation passes
- My Account form fields capped at `max-w-[552px]`
- Migrated deprecated `z.string().email()` to `z.email()` (Zod v4)

### Fixed

- SonarQube: `[0-9]` → `\d`, non-`Error` throws, optional chaining, `// NOSONAR` on test passwords, ambiguous JSX spacing

## [0.8.0] 2026-04-05

### Changed

- Refactored project to work with kuberocket and fixing critical sonarqube issues

## [0.7.2] 2026-04-01

### Changed

- Refactored auth session flow to handle token expiration on app init and API requests
- Added token expiration timestamp persistence in local storage
- Expired sessions now auto-clear auth/user/pets state and redirect to sign-in
- Updated readme.md file

### Fixed

- Sign up `409` conflict now shows: `A user with this email already exists.`
- Change password now maps unclear errors (for example `Invalid parameter`) to: `Incorrect current password.`
- Book appointment now maps `NOT_FOUND`/slot conflict errors to: `This slot is unavailable.`

### Added

- Token expiration notification on forced logout:
  - title: `Token is expired`
  - description: `Please sign in again.`
- Tests for token expiration utilities and API token-expiration guard behavior

## [0.7.1] 2026-03-27

### Added

- Big amount of unit tests covering project (stms 56%~)

## [0.7.0] 2026-03-27

### Changed

- API switch to the kuberocket one
- Adjusted sign in and booking appointment routes
- Adjusted tests to the changes

## [0.6.5] 2026-03-24

### Added

-Added Unit tests for sign in

## [0.6.4] 2026-03-24

### Added

-Added Unit tests for sign up

## [0.6.3] 2026-03-23

### Enhanced

- add indicator for receptionist active filters
- add cursor pointer class for edit and delete buttons for receptionist dashboard

## [0.6.2] 2026-03-23

### Added

- Real-time email validation in Visitor form (Create Appointment) — rejects spaces, missing `@`, missing username, invalid domain; error shown in red below the field
- Real-time phone number validation in Visitor form — reuses `isValidInternationalPhoneNumber` utility; error shown in red below the field
- Real-time first name and last name validation in Visitor form — rejects Cyrillic, digits, special characters, and input over 50 characters; mirrors sign-up form rules (`/^[A-Za-z' -]+$/`)
- `maxDate` prop on `Calendar` component — disables future dates and blocks forward month navigation when set
- Date of birth field in New Pet form now uses the shared `DatePicker` + `Calendar` components (replaces native `<input type="date">`), with `maxDate={today}` to prevent future date selection

### Fixed

- Veterinarian name links on client appointments dashboard (`/my-appointments`) now navigate to `/veterinarian/:veterinarianId` instead of pointing to `#`

## [0.4.1] 2026-03-18

### Enhanced

- Appointment status changes from `Service provided` to `Finished` after client submits feedback
- Feedback notification title now shows `Feedback updated` when editing vs `Feedback submitted` for new feedback

### Fixed

- Update feedback functionality

## [0.4.1] 2026-03-17

### Added

- CSS styling for when no appointments exist for today in client dashboard
- Functionality to clear filters on receptionist dashboard
- Multi-filtering support on receptionist dashboard
- Cancel appointment button enabled on receptionist dashboard
- Notification displayed when receptionist cancels an appointment

### Fixed

- Selected calendar date no longer loses highlight after selecting time on veterinarian details page
- Total appointment counter on receptionist dashboard
- Clinic address now correctly displayed when filtering
- Client dashboard now only shows today's appointments, past and future appointments are hidden
- Date picker no longer allows selection of past dates

## [0.6.0] 2026-03-17

- Add mock api server

## [0.5.4] 2026-03-17

### Fixed

- Book appointment button state updates after entering correct date after wrong date in the vets page.

## [0.5.3] 2026-03-13

### Enhanced

- Vets page now using api
- Add more info about services and clinics
- Add more strict number validation
- Add redirect for receptionist on needed pages only
- Main page uses api call for vets

### Fixed

- Peasant user role is now Client, not Customer

## [0.5.2] 2026-03-13

### Fixed

- Book appointment button state updates after entering correct date after wrong date

## [0.5.1] 2026-03-13

### Fixed

- Ghost pets issue solved (caching issue)

## [0.5.0] 2026-03-13

### Added

- Separate header variants for guest, user, and receptionist roles
- Receptionist account section for displaying read-only user information
- Receptionist dashboard for managing users
- Clients feedback

### Enhanced

- Header rendering now adapts to authentication state and normalized user role
- Role-based access checks were unified with shared role normalization logic
- Appointment management flow was refactored for clearer state handling and API integration
- Appointment display logic and user feedback were improved for a more consistent experience
- Refactored routes
- Clearing fields after password update

### Fixed

- Removed mock appointment data and switched appointment fetching to real API calls

## [0.4.2] 2026-03-13

### Enhanced

- After user updates profile it now updates all info
- Fixed bug with restoring date to 00:00
- Refactored notifcation

## [0.4.1] 2026-03-12

### Enhanced

- Updates available slots list after booking immediatly

### Fixed

- receptionist page bugged UI
- fixed pets birthday date pick
- fixed fetching pets during selection for appointment booking
- fixed UI of popup window scroll of appointment booking

## [0.4.1] 2026-03-09

### Fix

- fix UI of book appointment section in receptionist page
- fix UI of our services section in page

## [0.4.1] 2026-03-07

### Enhanced

## [0.4.1] 2026-03-06

### Added

- Book appointment popup component for streamlined appointment booking workflow

### Enhanced

- Improved styling of veterinarian links (as in figma)
- Enhanced date input component with validation options and improved dropdown positioning
- Popup window functionality with backdrop click handling
- Integrated pet fetching logic into sign-in process after successful login
- Improved appointment types with clinicId for better data handling
- Improved responsiveness of appointment section in main page

### Fixed

- Removed unnecessary space under available slots
