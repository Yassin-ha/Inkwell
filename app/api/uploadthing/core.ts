import { createUploadthing, type FileRouter } from "uploadthing/next"
import { auth } from "@/auth"
import { isAuthor } from "@/app/lib/permissions"

const f = createUploadthing()

export const ourFileRouter = {
  coverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth()
      if (!session?.user?.id) throw new Error("Unauthorized")
      if (!isAuthor(session)) throw new Error("Only authors can upload cover images")
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url }
    }),
  profileImage: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth()
      if (!session?.user?.id) throw new Error("Unauthorized")
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
