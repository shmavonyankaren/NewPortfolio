import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { isAdmin } from "@/lib/auth/admin";

async function authorizeUpload() {
  if (!await isAdmin()) throw new UploadThingError("UNAUTHORIZED");
  return { admin: true };
}

const f = createUploadthing();

export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  }).middleware(authorizeUpload).onUploadComplete(async ({ file }) => {
    // This code RUNS ON YOUR SERVER after upload

    console.log("file url", file.url);

    // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
    return { url: file.url };
  }),
  cvUploader: f({
    pdf: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  }).middleware(authorizeUpload).onUploadComplete(async ({ file }) => {
    return { url: file.url };
  }),
  certificateUploader: f({
    pdf: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  }).middleware(authorizeUpload).onUploadComplete(async ({ file }) => {
    console.log("Certificate uploaded:", file.url);
    return { url: file.url };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
