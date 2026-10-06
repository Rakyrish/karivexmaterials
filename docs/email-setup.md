# Email: delivering enquiries to info@karivexsolutionsltd.com

## How it works

Every quotation request, service request and contact-form message is:

1. **saved first** in the database (Admin → Enquiries), so nothing is lost if email fails, then
2. **emailed to info@karivexsolutionsltd.com** (the email in Admin → Site settings), with the
   customer's address as **Reply-To**. Pressing Reply in your inbox answers the customer directly.

To send to a different or extra address, set `ENQUIRY_NOTIFICATION_EMAIL` in the server's
`.env.production`; otherwise the Site settings email is used.

## What is missing: a sending account

`karivexsolutionsltd.com` uses **Cloudflare Email Routing** (MX: `route1/2/3.mx.cloudflare.net`).
That service only **receives** mail and forwards it to another inbox. There is no info@ mailbox the
website can log in to and send from, so the website needs one of these.

### Option A: quickest, no DNS changes (Gmail)

Use this if info@ forwards to a Gmail (or Google Workspace) account.

1. On that Google account, turn on 2-Step Verification, then create an **App password**
   (Google Account → Security → App passwords).
2. In the server's `.env.production`:

   ```
   EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USE_TLS=True
   EMAIL_HOST_USER=<the gmail address>
   EMAIL_HOST_PASSWORD=<the 16-character app password>
   DEFAULT_FROM_EMAIL=KariVex Industrial Materials <the same gmail address>
   ```

   Gmail only sends "From" the account's own address. Customers never see it, because they
   don't receive these notifications.

### Option B: branded sender (transactional email service)

Use this to send from `no-reply@materials.karivexsolutionsltd.com` with better deliverability.

1. Create an account with a transactional email provider that offers SMTP (for example Brevo,
   Mailgun, Resend or SendGrid).
2. Add the sending domain `materials.karivexsolutionsltd.com` there. The provider gives you a few
   DNS records (SPF/DKIM, sometimes a return-path CNAME) to add in Cloudflare.
   - These records are for the `materials` subdomain only.
   - Do **not** change the existing MX, SPF or DMARC records of the main domain, or Email Routing
     could break.
3. Put the provider's SMTP host, port, username and key in `.env.production` (same variable names
   as above), with `DEFAULT_FROM_EMAIL=KariVex Industrial Materials <no-reply@materials.karivexsolutionsltd.com>`.

## Test it (one labelled test email, no fake enquiry)

```sh
docker compose -f deploy/docker-compose.prod.yml --env-file .env.production exec backend \
  python manage.py send_test_email            # sends "[TEST] ..." to info@
```

Use `--to someone@example.com` to send the test elsewhere. If it fails, the command prints the
server's error.

Then submit one real enquiry through the website, clearly marked as a test, and check it arrives at
info@ and that Reply goes to the address you entered.

## If email fails later

Enquiries are still saved. **Admin → Enquiries** shows a warning banner and a "Not delivered"
filter. Fix the settings, then select the enquiries and run **Retry email notification**.
