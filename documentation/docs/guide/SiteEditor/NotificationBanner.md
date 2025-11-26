<!-- markdownlint-disable MD033 -->
# Notification Banner — Admin Tool Guide

Use this tool to enable a Notification Banner at the top of each page of your website.
You can choose the text shown in the banner, as well as its background color.
HTML markup is also valid if you want to control the format of the text.

The tool lives in:

- WordPress Admin → Design System → Notification Banner

Click Save Settings to apply changes, and see a preview below the Banner Preview label.

![Notification Banner HOWTO](/images/NOTIFICATION_BANNER_HOWTO.gif)

---

## How the banner tool works

- Enable/Disable the banner using the radio buttons.
- The Banner Content textbox will accept plain text, or HTML Markup:
  - `<strong>strong</strong>`
  - `<b>bold</b>`
  - `<em>emphasis</em>`
  - `<i>italic</i>`

- Choose the background banner color using the color-coded background status colors:
   <span style="background-color:#f8bb47; color:black; padding: 3px">Warning</span>,
   <span style="background-color:#ce3e39; color:white; padding: 3px">Danger</span>,
   <span style="background-color:#42814a; color:white; padding: 3px">Success</span>, or
   <span style="background-color:#053662; color:white; padding: 3px">Info</span>
- To hide the banner, simply click 'Disable' beside 'Enable Banner'.

---

## Common recipes

- Test Site Banner
  - text: `This is the Dev/Test Environment. The content you are viewing is not final and subject to change.`
  - background color: <span style="background-color:#ce3e39; color:white; padding: 3px">Danger</span>

- Site under maintenance
  - text: `This site is under maintenance. Please check back periodically for udpates`
  - background color: <span style="background-color:#f8bb47; color: black; padding: 3px">Warning</span>

- Informational Banner
  - text: `Here are instructions for filling in this form...`
  - background color: <span style="background-color:#053662; color: white; padding: 3px">Info</span>

---

## Testing changes

1. Save Settings.
2. Verify the banner preview matches expectations.
3. Navigate to your homepage and hard-refresh your browser
4. Verify the text and background color of the banner are correct.

![Show Notification Banner](/images/SHOW_NOTIFICATION_BANNER.gif)
