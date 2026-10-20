# Publishing Issue 001, channel by channel

Nothing here posts by itself. `npm run planet -- publish 1 <channel>` records each step against the approved PDF hash, and refuses to run a channel twice.

| Channel | How | What it needs |
| --- | --- | --- |
| Website | `publish 1 website` copies dist/online, the PDFs and the cover into public/guided-planet/issue-001/ on a branch and opens a pull request. Merging it deploys. | Justin merges the pull request. |
| Google Drive | A Claude session uploads the package with the Google Drive connector into "Guided Childhood Research / The Guided Planet / Issue 001". | The connector on the session. |
| Email | `publish 1 mailchimp` creates a DRAFT campaign from email.html; Justin presses send in Mailchimp. Or Resend, through sendEmail, which keeps the one email a week floor. | MAILCHIMP_API_KEY, MAILCHIMP_SERVER, MAILCHIMP_AUDIENCE_ID, or a decision to use Resend. |
| LinkedIn | Justin posts linkedin-carousel.pdf as a document with the caption; the link goes in the first comment. | Justin. |
| Instagram | Justin posts ig-01 to ig-07 as a carousel with the caption; link in bio. | Justin. |
| Facebook | Justin posts ig-01.png as a single image with the caption. | Justin. |
| Schools | school-email.md, sent from Justin's own address to the schools list. | Justin. |

Download link once the website step merges: https://www.guidedchildhood.com/guided-planet/issue-001/guided-planet-001.pdf
