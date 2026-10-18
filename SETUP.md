# Mera Gaav v2 — Setup Guide (Hinglish)

**Naya:** website ab bina login ke khuli hai (feed, notices, mandi, bazaar, polls dekh sakte hain, app install bhi). Login sirf tab maanga jaata hai jab user shikayat jama kare, vote de, comment/support kare, ya bazaar me vishyapan dale ya seller ka number dekhe. Firebase keys dale bina app **demo data** ke saath khulti hai taaki design dekh sako.

> Rules badle hain (public read). Purani rules ki jagah `firestore.rules` dobara **Publish** karna zaroori hai, warna guest ko data nahi dikhega.

Is app me: phone-OTP login, Firebase Firestore database, Google Drive me photos, mobile install (PWA), aur admin panel.

## Step 1 — Firebase project banao
1. https://console.firebase.google.com par jao → **Add project**.
2. **Build → Authentication → Get started → Sign-in method → Phone → Enable**.
3. **Authentication → Settings → Authorized domains** me wo domain add karo jahan app host karoge (Firebase Hosting domain automatic hota hai).
4. **Build → Firestore Database → Create database** (production mode, region `asia-south1` Mumbai).
5. Firestore → **Rules** tab me `firestore.rules` file ka poora content paste karke **Publish** karo.
6. **Project settings → Your apps → Web (</>)** → app register karo → jo `firebaseConfig` mile use `firebase-config.js` me paste karo.

> Dhyan: Phone OTP SMS real numbers par bhejne ke liye Firebase ka **Blaze (pay-as-you-go)** plan chahiye hota hai. Testing ke liye **Authentication → Phone → Phone numbers for testing** me fake number + OTP add kar sakte ho (free).

## Step 2 — Index (agar console me error aaye)
Pehli baar app chalane par agar browser console me "requires an index" link aaye, to us link par click karke index bana do. (Is app me sirf single-field `createdAt` ordering hai, aam taur par zarurat nahi padti.)

## Step 3 — Photos Google Drive me (Apps Script)
1. Google Drive me ek folder banao (jaise `MeraGaav-Photos`). Folder URL ke aakhir ka ID copy karo.
2. https://script.google.com → **New project** → `drive-upload.gs` ka code paste karo.
3. Upar `FOLDER_ID` aur `FIREBASE_API_KEY` bharo.
4. **Deploy → New deployment → Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Authorize karo, phir mila hua **Web app URL** `firebase-config.js` ke `DRIVE_UPLOAD_URL` me daalo.

Security: upload sirf wahi kar sakta hai jiske paas valid Firebase login token ho (script token verify karti hai). Photos "link wale sabhi dekh sakte hain" par save hoti hain, taaki app me dikh sakein.

## Step 4 — Apne gaav ki jaankari
`firebase-config.js` me `VILLAGE` (naam, rajya, wards ki sankhya) badlo.

## Step 5 — Hosting (install button ke liye HTTPS zaroori)
Sabse aasan: Firebase Hosting
```
npm i -g firebase-tools
firebase login
firebase init hosting     # public folder = is project ka folder, single-page app = No
firebase deploy
```
Alternative: Netlify / Vercel / GitHub Pages par folder upload kar do.

## Step 6 — Pehla Admin banao
1. App me apne number se login karke profile bana lo.
2. Firebase Console → Firestore → `users` → apna document (UID wala) → field `role` ko `"admin"` karo.
3. App reload karo — **Admin panel** dikhega (shikayat status badalna, notice, poll, contacts, mandi bhav, CSV export).

## Mobile par install
- **Android Chrome**: app khulne par upar **📲 Install** button dikhega (ya Profile me). Dabao.
- **iPhone Safari**: Share → **Add to Home Screen**.

## Naye features (aapne puchha tha)
- Phone OTP se signup/login, har user ka apna profile
- Photos (3 tak) + GPS location + bol kar shikayat likhna (voice)
- Gaav feed, "mujhe bhi yehi problem hai" upvote, comments, status timeline
- Urgent shikayat flag, search + filters
- Panchayat notices (pin / meeting / urgent), gaav polls (ek user = ek vote)
- Gaav Bazaar (bikri, kiraya, kaam, khoya-paya) with Call/WhatsApp
- Mandi bhav, zaruri numbers + 112 SOS button, sarkari yojana links
- Dark mode, Hindi/English toggle, offline shell (service worker)
- Admin: dashboard, category chart, CSV export

## Aage ke ideas
Push notifications (Firebase Cloud Messaging), multiple villages, Gram Sabha attendance, certificate requests.


## Guest vs login (v2)
| Guest (bina login) | Login chahiye |
|---|---|
| Home, feed, notices, polls results, mandi, bazaar listings, directory, schemes, install | Shikayat jama karna, vote, support/comment, bazaar post, seller ka phone dekhna, profile |

Bazaar me seller ka number alag private document me rakha jaata hai (`bazaar/{id}/private/contact`), isliye guest ko nahi dikhta.
