# Website review and launch notes

**Project:** Rakesh Puri & Associates · `rkpurilaw.com` (intended domain)

## Page review

The site has 15 generated pages, including the 404 page. Each route was opened at desktop and mobile widths to check its main heading and horizontal layout. The disclaimer heading was shortened after a mobile overflow was found. The home, practice-area, profile, contact, insights and legal pages use a consistent navy, ivory and gold design.

| Pages | Review result |
|---|---|
| Home, About, Professional Profile | Clear professional narrative and accessible page hierarchy. Official portrait still needed. |
| Practice Areas, Criminal Law, Writ Jurisdiction | Focus areas have dedicated pages; other areas are presented as an index without inventing specialist credentials. |
| Investigation Expertise, Courts & Forums | Experience is described as prior professional work; no current government authority is implied. |
| Insights and reserved article route | Editorial topics are visible. The unreviewed article route is excluded from the sitemap and marked `noindex`. |
| Contact, Privacy, Terms, Disclaimer | Contact and legal information are present. The WhatsApp form requires the visitor to review the prepared message before sending. |
| 404 | A clear route back to the homepage is present. |

The site build checks local links, page titles, structured data, the social image, sitemap and robots file. These checks do **not** replace a legal review or a production Lighthouse audit.

## Information to obtain from the client

### Required for a fully approved public site

1. **Professional portrait:** a current, approved high-resolution photograph of Rakesh Kumar Puri. The existing RKP monogram remains until it is supplied. A chamber photograph would also improve the profile if available.
2. **Professional facts:** confirmation or documents for 5,000+ cases investigated/supervised, 300+ commendations, the 2016 Bar Council enrolment, 11 years of legal practice and the 1979 education detail. These disputed or unverified numbers are withheld from prominent public copy.
3. **Advocate review:** sign-off on profile wording, practice-area descriptions, courts and forums, disclaimer, privacy policy and future articles. No case results or rankings have been invented.
4. **Domain and launch:** confirm control of `rkpurilaw.com`, connect DNS/hosting, and run production accessibility, performance and social-preview checks. A GitHub push alone does not make the website live at that domain.

### Needed for richer contact and social presence

5. **Official chamber address and email** if they should be public. At present, only the supplied phone number is published. The enquiry form hands off to WhatsApp and does not send email.
6. **Approved profile URLs** for LinkedIn, Instagram and Facebook. `socialLinks` near the top of `src/App.jsx` is ready for these links; only populated HTTPS links appear in the footer. See [SOCIAL_BIOS.md](SOCIAL_BIOS.md) for suggested bios.
7. **Editorial material:** advocate-reviewed insights with author, sources, publication dates and review dates. The reserved article page is not indexed until approved copy exists.

## Photo and contact handling

- The real Rajasthan High Court photograph is licensed under CC BY-SA 4.0 and credited on the site. It is an illustrative court image, not Rakesh Puri’s portrait or an endorsement.
- The home and About images are temporary AI-generated illustrations. Replace them with approved professional photography before treating them as factual depictions of the practice.
- The WhatsApp form creates a URL containing the visitor’s entered information. Clicking **Continue in WhatsApp** shares that URL with WhatsApp. The site does not store form values, and the visitor chooses whether to send the chat message. The page asks visitors not to enter confidential case information.
- The footer’s IITdeveloper credit links to `https://iitdeveloper.com/`.
