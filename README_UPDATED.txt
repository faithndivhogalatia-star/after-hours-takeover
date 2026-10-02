AFTER HOURS TAKEOVER — FINAL WEBSITE UPDATE

Changes in this build:
- Removed the large Avenoir/After Hours visual from the opening hero area.
- Event end time added: approximately 10:00–11:00 PM.
- Registration now keeps the ticket/reference number visible after submission and warns the guest not to lose it.
- Added phone + email fields to registration (already present; retained and emphasized).
- Admin dashboard now has payment checkboxes/actions for Online and Cash and separates paid tickets from unpaid tickets.
- Admin dashboard listens for new registrations through Supabase Realtime and can show a browser notification + vibration when a new ticket is registered (permission required; the admin page must be open/active in the browser).
- Added a configurable online payment link. Set ONLINE_PAYMENT_URL in script.js to your Yoco/SnapScan/PayFast payment link when ready.
- Added a temporary EFT option area in the ticket flow only when you configure bank details in script.js. Direct bank-account payments cannot be automatically verified by a static GitHub Pages site without a bank/payment-provider integration.

IMPORTANT:
The website does not contain any bank credentials. Do not put account passwords, PINs, card numbers, or other secrets in script.js.
