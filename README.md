This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


A doubt-clearance platform where users can register and log in, post their doubts as text, edit or delete their own doubts, and view doubts posted by others. Any authenticated user can provide solutions in the form of text or video links uploaded via Cloudinary. The application uses Next.js as a full-stack framework with server-side rendering, MongoDB for data storage, secure API routes for backend logic, and Cloudinary for media handling, ensuring scalability, security, and clean separation of concerns.


Packages 

npm install mongoose
npm install bcryptjs
npm install jsonwebtoken
npm install cloudinary
npm install zod          # validation
npm install next-auth    # if you prefer auth handled for you



Folder structure

app/
 ├─ (auth)/
 │   ├─ login/
 │   │   └─ page.js
 │   ├─ register/
 │   │   └─ page.js
 │
 ├─ doubts/
 │   ├─ page.js              // list doubts
 │   ├─ create/
 │   │   └─ page.js
 │   └─ [id]/
 │       └─ page.js          // single doubt + answers
 │
 ├─ api/
 │   ├─ auth/
 │   │   ├─ login/
 │   │   │   └─ route.js
 │   │   └─ register/
 │   │       └─ route.js
 │   │
 │   ├─ doubts/
 │   │   ├─ route.js         // GET, POST
 │   │   └─ [id]/
 │   │       └─ route.js     // GET, PUT, DELETE
 │   │
 │   ├─ answers/
 │   │   └─ route.js
 │   │
 │   └─ upload/
 │       └─ route.js         // Cloudinary upload
 │
 ├─ lib/
 │   ├─ db.js                // MongoDB connection
 │   ├─ cloudinary.js        // Cloudinary config
 │   ├─ auth.js              // JWT helpers
 │   └─ validators.js
 │
 ├─ models/
 │   ├─ User.js
 │   ├─ Doubt.js
 │   └─ Answer.js
 │
 ├─ components/
 │   ├─ Navbar.jsx
 │   ├─ DoubtCard.jsx
 │   ├─ AnswerBox.jsx
 │   └─ AuthForm.jsx
 │
 ├─ middleware.js            // protect routes
 ├─ layout.js
 └─ page.js


