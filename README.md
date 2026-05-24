# CIS1202 Web Dev - Group A Cooperative Website

This is our multi-page website project for our Cooperative assignment. The site connects to the Sanity CMS database to pull real-time data for our pages like the history timeline, services, loans, and member info.

---

## Design Guidelines
Everyone needs to use these main theme colors from global.css so our pages look consistent:
* Background: White
* Header/Footer & Brand Color: Earth Green (#23743B)
* Accents: Light Beige (#F5E6C8) and Cream (#FFFDD0)

---

## Git Branch Rules
To avoid merge conflicts, please don't push directly to main. Create and work inside your own branch using your lastname/task:

* Member 1 (Balbuena): balbuena/home-navbar
* Member 2 (Bautista): bautista/about-history
* Member 3 (Hera): hera/about-leadership
* Member 4 (Loberiano): loberiano/membership-store
* Member 5 (Abao): abao/investments-loans
* Member 6 (Culanag): culanag/helpdesk-calc
* Member 7 (Abangan): abangan/application-footer

---

## Folder Structure & Assignments

📁 CIS1202_11_GROUPA_JAN2026/
│
├── index.html                       (Member 1)
├── about-history.html               (Member 2)
├── about-profile.html               (Member 2)
├── about-bod.html                   (Member 3)
├── about-officers.html              (Member 3)
├── about-awards.html                (Member 3)
├── about-gallery.html               (Member 3)
├── membership.html                  (Member 4)
├── coopmart.html                    (Member 4)
├── investments.html                 (Member 5)
├── loans-regular.html               (Member 5)
├── loans-special.html               (Member 5)
├── support-helpdesk.html            (Member 6)
├── support-calculator.html          (Member 6)
├── support-application.html         (Member 7)
│
├── 📁 styles/
│   ├── global.css                   (Member 1)
│   ├── home.css                     (Member 1)
│   ├── about-history-profile.css    (Member 2)
│   ├── about-leadership-awards.css  (Member 3)
│   ├── members-store.css            (Member 4)
│   ├── loans.css                    (Member 5)
│   ├── helpdesk.css                 (Member 6)
│   └── application.css              (Member 7)
│
└── 📁 js/
├── sanity-config.js             (Member 1)
├── navbar.js                    (Member 1)
├── home.js                      (Member 1)
├── about-history.js             (Member 2)
├── about-profile.js             (Member 2)
├── about-bod.js                 (Member 3)
├── about-officers.js            (Member 3)
├── about-awards.js              (Member 3)
├── about-gallery.js             (Member 3)
├── membership.js                (Member 4)
├── coopmart.js                  (Member 4)
├── loans-regular.js             (Member 5)
├── loans-special.js             (Member 5)
├── support-helpdesk.js          (Member 6)
├── support-calc.js              (Member 6)
├── application.js               (Member 7)
└── footer.js                    (Member 7)

---

## Task Checklist

### Member 1: Balbuena 
* Set up the base sanity-config.js connection and global.css files.
* Build the shared navbar script to load the header layout.
* Build the Home page sections using the hero, service, and post schemas.

### Member 2: Bautista
* History Page: Pull and list the co-op timeline milestones.
* Company Profile Page: Fetch the Vision, Mission, and Goals arrays from Sanity and design the member counter section.

### Member 3: Hera
* BOD & Officers: Create the profile cards using data from the director schema.
* Awards & Gallery: Set up the achievements list and the community events photo grid.

### Member 4: Loberiano
* Membership Info Page: Add the joining qualifications and steps.
* CoopMart Page: Pull the specific store data from the service schema.

### Member 5: Abao
* Investments Page: Display the cooperative's investment tiers.
* Loans Pages: Build the Regular and Special loan pages by filtering the loanCategory schema for rates and terms.

### Member 6: Culanag
* Help Desk: Build the FAQ accordion dropdowns and the contact message form.
* Loan Calculator: Code the math script to estimate payments based on the loan data.

### Member 7: Abangan
* Online Application Page: Code the multi-input membership registration form layout.
* Global Footer Script: Build the shared footer script to automatically load the address, phone contacts, and social links across all pages from siteSettings.