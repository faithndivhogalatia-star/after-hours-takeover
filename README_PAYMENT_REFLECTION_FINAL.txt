AFTER HOURS TAKEOVER — PAYMENT REFLECTION FINAL BUILD

This ZIP is based on your uploaded:
AFTER_HOURS_TAKEOVER_ADMIN_CUSTOMERS_FIXED(2).zip

WHAT THIS BUILD ADDS
1. Live "event tickets remaining" counter on the public website.
2. Counter refreshes automatically every 15 seconds and after a new registration.
3. Public "Check Your Ticket" page using BOTH ticket number + registered phone number.
4. Ticket status shows AWAITING PAYMENT or PAYMENT CONFIRMED.
5. Existing admin dashboard still lets you mark PAID ONLINE or PAID CASH.
6. Supabase SQL includes tickets_remaining() and the secure check_ticket_status() function.
7. Existing images, design, PayRequest links, admin page and registration flow are preserved.

IMPORTANT PAYMENT RULE
A PayRequest proof-of-payment upload is NOT the same as confirmed money in your bank.
The ticket remains AWAITING PAYMENT until you verify the payment in your bank and press
PAID ONLINE in the admin dashboard.

INSTALLATION
1. Upload/replace the files in your GitHub Pages repository with the contents of this ZIP.
   Keep the images/ folder.
2. In Supabase SQL Editor, open SUPABASE_SECURITY_SETUP.sql.
3. Replace REPLACE_WITH_YOUR_ADMIN_EMAIL with the exact email used by your admin login.
4. Run the entire SQL file.
5. Open the live website and test a registration.
6. Confirm the admin dashboard shows the new registration.
7. For an EFT test, use the real PayRequest flow. Do NOT mark a ticket paid merely because
   a proof-of-payment image was uploaded.
8. When the money is visible in the bank, use PAID ONLINE in the admin dashboard.
9. The customer can then use CHECK YOUR TICKET to see PAYMENT CONFIRMED.

WHAT IS NOT AUTOMATIC
This static GitHub Pages site cannot independently verify a bank EFT or PayRequest
proof-of-payment upload. Automatic payment confirmation would require a supported,
verified provider webhook/API integration.

EMAILS
This ZIP does not invent or add a fake email-sending service. If you need automatic
customer/admin emails, connect a real email provider or automation endpoint.

SECURITY
Never put a bank password, OTP, PIN, card details, Supabase service-role key, or
PayRequest password in the website files.
