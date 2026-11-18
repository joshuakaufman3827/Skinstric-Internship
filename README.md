# Skinstric

Frontend Simplified internship: an A.I. skincare intake flow built with Next.js, TypeScript and Tailwind.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production check
```

## Flow

| Route | What it does | Phase |
|---|---|---|
| `/` | Landing page: "Sophisticated skincare" | 1 |
| `/testing` | Name, then city. Both are validated (letters only, no numbers), saved to localStorage and POSTed to `skinstricPhaseOne` | 1 |
| `/result` | Choose camera or gallery. An uploaded image is resized, converted to base64 and POSTed to `skinstricPhaseTwo` | 2 |
| `/camera` | Live selfie with the front camera, then capture, retake or use the photo. Sent to the same Phase 2 API | 3 |
| `/select` | A.I. analysis menu (Demographics is the active tile) | 2 |
| `/summary` | Demographics: Race, Age and Sex scores sorted high to low, shown to 2 decimals. Click a score to correct the left sidebar | 2 |

## Where the logic lives

- `lib/api.ts`: both API calls
- `lib/validation.ts`: name and city validation
- `lib/image.ts` and `lib/analyze.ts`: resize, base64 and submit (shared by upload and selfie)
- `lib/storage.ts`: localStorage keys (`skinstric_name`, `skinstric_location`, `skinstric_demographics`, `skinstric_selections`)

The camera needs `https` or `localhost`. To test it on a phone, deploy to Vercel first.
