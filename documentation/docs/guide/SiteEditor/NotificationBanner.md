<!-- markdownlint-disable MD033 -->
# Notification Banner — Admin Tool Guide


Use this tool to control which sources your WordPress site can load for scripts, styles, images, fonts, media, XHR/WebSocket connections, and frames. Tight CSP rules improve security and reduce the risk of cross‑site scripting (XSS).

Use this tool to enable a Notification Banner at the top of each page of your website.
You can choose the text shown in the banner, as well as its background color.
HTML code is also valid if you want to add additional structure.

The tool lives in:

- WordPress Admin → Design System → Notification Banner

Click Save Settings to apply changes, and see a preview below the Banner Preview label.

![Notification Banner HOWTO](/images/NOTIFICATION_BANNER_HOWTO.gif)

---

## How the banner tool works

- Enable/Disable the banner using the radio buttons.
- The Banner Content textbox will accept plain text, or even HTML tags:
  - `<strong>strong</strong>`
  - `<b>bold</b>`
  - `<em>emphasis</em>`
  - `<i>italic</i>`
- Choose the background banner color using the color-coded background status colors:
  - <span style="background-color:#f8bb47; color:green; padding: 3px">Warning</span>
  - <span style="background-color:#ce3e39; color:blue; padding: 3px">Danger</span>
  - <span style="background-color:#42814a; color:purple; padding: 3px">Success</span>
  - <span style="background-color:#053662; color:red; padding: 3px">Info</span>
- To hide the banner, simply click 'Disable' beside 'Enable Banner'.

---

## Common recipes

- Test Site Banner
  - text: `This is the Dev/Test Environment. The content you are viewing is not final and subject to change.`
  - background color: <span style="background-color:#ce3e39; padding: 3px">Danger</span>

- Site under maintenance
  - text: `This site is under maintenance. Please check back periodically for udpates`
  - background color: <span style="background-color:#f8bb47; color: navy; padding: 3px">Warning</span>

- Informational Banner
  - text: `Here are instructions for filling in this form...`
  - background color: <span style="background-color:#053662; padding: 3px">Information</span>

---

## Testing changes

1. Save Settings.
2. Verify the banner preview matches expectations.
3. Navigate to your homepage and hard-refresh your browser
4. Verify the text and background color of the banner are correct.

![Show Notification Banner](/images/SHOW_NOTIFICATION_BANNER.gif)

---

## FAQ

- How do I reset to defaults?
  - Clear the field and click Save Settings.

- Can I disable a resource type completely?
  - Enter 'none' in that directive and save.

- Do I need commas?
  - No. Use spaces between entries.
