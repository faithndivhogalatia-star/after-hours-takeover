AFTER HOURS TAKEOVER — FINAL BUILD

This ZIP is based on the latest Kiss-fixed website version.

Included:
- Dark black / dark-brown leopard finish
- After Hours Kiss artwork beside the main AFTER HOURS title
- Large old After Hours player/guy artwork is NOT included in the hero/about area
- Customer form: name, age, school, phone, email, ticket type, quantity, payment method
- R100 Ridgefield Student PayRequest link
- R80 Outside Student PayRequest link
- R50 Re-entry PayRequest link
- Ticket number confirmation and DO NOT LOSE warning
- Private admin login with unpaid / paid-online / paid-cash sections
- Browser registration alerts while admin page is open

IMPORTANT:
1. Upload the contents of this ZIP to the GitHub Pages repository.
2. Run SUPABASE_SECURITY_SETUP.sql in Supabase SQL Editor after replacing REPLACE_WITH_YOUR_ADMIN_EMAIL with your admin email.
3. The current PayRequest links use fixed references. The site therefore limits online EFT to one ticket per registration.
4. Automatic payment confirmation and phone push notification after a PayRequest payment still require a verified payment callback/webhook or equivalent provider integration. Do not mark payments paid automatically from a screenshot alone.
5. Never share your PayRequest password, OTP, PIN, or banking login.


IMPORTANT — REGISTRATION + ADMIN ALERT SETUP
1. The website can only save registrations if the Supabase tickets table allows public INSERT. Run SUPABASE_SECURITY_SETUP.sql in Supabase SQL Editor.
2. Replace REPLACE_WITH_YOUR_ADMIN_EMAIL in that SQL file with the exact email used to log into the admin dashboard, then run it.
3. In Supabase, enable Realtime for public.tickets (Database -> Publications -> supabase_realtime -> tickets). Supabase documents that Postgres Changes needs the table in the supabase_realtime publication.
4. The admin dashboard now has a 5-second polling fallback, so new registrations can still appear even if Realtime is not configured.
5. Browser phone notifications still require notification permission and an open admin page. Use TEST ALERT in the admin dashboard to verify notification/vibration on that device.
6. Customer browser notifications likewise require permission. The customer still gets the on-page registration confirmation and ticket number.
