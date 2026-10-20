This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Content ordering

Education, jobs, projects, skillsets, certificates, comments, blog posts, and
insights each have independent, contiguous positions starting at 1. The admin
Order selector defaults new items to the end; editing offers positions 1 through
the current item count. Inserting or moving an item shifts its neighbors, and
deleting closes the gap. API list responses already have the configured order.

Before using ordering with an existing database, run:

```sh
npm run migrate:content-order:check
npm run migrate:content-order
```
The command loads the same environment files as Next.js. The preview performs no
writes. The migration fills positions and missing skillset emoji fields, preserves
existing configured positions and emojis, and leaves content timestamps unchanged.
Each collection is migrated atomically and recorded in schema_migrations. It is
safe to rerun after interruption or completion. Deployments must run the migration
against their own configured database before accepting edits. List requests never
write or migrate data. Legacy lists remain readable before the migration.


Ordering writes use MongoDB transactions and a per-collection lock document to
protect concurrent edits. Use MongoDB Atlas or a replica set; a standalone MongoDB
server does not support these transactions.

Run `npm run test:ordering` to test against an isolated temporary MongoDB replica
set. The first run downloads a MongoDB test binary. Tests never use `.env.local`
or the portfolio database.


## Certificate logos and skillset images

Run `npm run migrate:content-images:check` to preview existing records, then
`npm run migrate:content-images` to fill missing skillset images and certificate
logos with `/assets/images/logo1.png`. Run the ordering migration first on older
databases. The image migration preserves existing images, intentionally removed
certificate logos, ordering, and content timestamps, and is safe to rerun.

Certificate logos are optional; removing a logo displays a building icon.
Skillsets require a nonempty image in both the admin form and API. New forms
start with the placeholder selected, which can be replaced using the image uploader.
Legacy emoji values are preserved in storage but no longer displayed or edited.


## Education and job logos

Education and job logos are required by the database, API, and admin forms.
The About page displays the saved logo, with `/assets/images/logo1.png` as
the fallback for missing values. New admin forms start with that placeholder.

Before editing older records, run `npm run migrate:education-job-logos:check`,
then `npm run migrate:education-job-logos`. This repeatable migration fills
missing or blank logos without changing custom logos, content timestamps, or order.
