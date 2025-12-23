# EmailJS Setup Guide

This guide will help you set up EmailJS for the contact form in your portfolio.

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click **Sign Up** and create a free account
3. Verify your email address

## Step 2: Add Email Service

1. After logging in, go to **Email Services** in the dashboard
2. Click **Add New Service**
3. Choose your email provider:
   - **Gmail** (recommended for personal use)
   - **Outlook/Office 365**
   - **Custom SMTP** (for other providers)
4. Follow the authentication flow to connect your email account
5. Copy the **Service ID** (you'll need this later)

## Step 3: Create Email Template

1. Go to **Email Templates** in the dashboard
2. Click **Create New Template**
3. Set up your template with these variables:

```
To: {{to_email}} (your email address where you want to receive messages)
From: {{from_name}} <{{from_email}}>
Subject: Portfolio Contact: {{subject}}

Name: {{name}}
Email: {{email}}
Subject: {{subject}}

Message:
{{message}}
```

4. **Important:** Make sure to use these exact variable names in your template:
   - `{{name}}` - Sender's name
   - `{{email}}` - Sender's email
   - `{{subject}}` - Message subject
   - `{{message}}` - Message content

5. Click **Save** and copy the **Template ID**

## Step 4: Get Public Key

1. Go to **Account** → **General**
2. Find your **Public Key** (also called User ID)
3. Copy this key

## Step 5: Update Environment Variables

1. Open your `.env.local` file (create it if it doesn't exist)
2. Add these variables:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id_here
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
```

3. Replace the placeholder values with your actual IDs from EmailJS

## Step 6: Update EmailJS Template Variables

Make sure your EmailJS template matches these form field names:
- `name` → `{{name}}`
- `email` → `{{email}}`
- `subject` → `{{subject}}`
- `message` → `{{message}}`

## Step 7: Test the Contact Form

1. Start your development server: `npm run dev`
2. Navigate to the contact page: `http://localhost:3000/contact`
3. Fill out the form and submit
4. Check your email inbox for the message

## Troubleshooting

### Error: "EmailJS configuration is missing"
- Make sure all three environment variables are set in `.env.local`
- Restart your development server after adding environment variables

### Email not received
- Check your EmailJS dashboard for failed requests
- Verify your email service is properly connected
- Check spam/junk folder
- Ensure template variables match form field names exactly

### CORS or network errors
- Verify your Public Key is correct
- Check EmailJS dashboard for rate limits (free plan: 200 emails/month)
- Make sure you're using the correct Service ID and Template ID

## Free Plan Limits

EmailJS free plan includes:
- 200 emails per month
- 1 email service
- 2 email templates
- Basic support

For higher limits, consider upgrading to a paid plan.

## Security Notes

- Never commit your `.env.local` file to git
- The public key is safe to use in client-side code
- Service ID and Template ID can also be public
- For production, set these variables in your Vercel/hosting dashboard

## Production Deployment

When deploying to Vercel:

1. Go to your project settings in Vercel
2. Navigate to **Environment Variables**
3. Add all three EmailJS variables:
   - `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
   - `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
   - `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`
4. Redeploy your application

## Additional Resources

- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS React Integration](https://www.emailjs.com/docs/sdk/installation/)
- [EmailJS Dashboard](https://dashboard.emailjs.com/)
