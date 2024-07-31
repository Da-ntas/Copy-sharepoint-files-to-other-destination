import { z } from "zod";

const siteInfoSchema = z.object({
    tenant: z.string().min(4, {message: "tenant is required"}),
    name: z.string().min(4, {message: "name is required"})
})

const siteChildrenSchema = z.object({
    id: z.string().min(4, {message: "id is required"})
})

const siteSubfolderIdSchema = z.object({
    folderId: z.string().min(4, {message: "folderId is required"}),
    path: z.string().min(4, {message: "path is required"}),
})

const siteItemsSchema = z.object({
    folderId: z.string().min(4, {message: "folderId is required"}),
    id: z.string().min(4, {message: "id is required"}),
})

const sitePathsSchema = z.object({
    rootFolderId: z.string().min(4, {message: "rootFolderId is required"}),
    folderId: z.string().min(4, {message: "folderId is required"}),
    pathSubFolderSharepoint: z.string().min(4, {message: "pathSubFolderSharepoint is required"}),
    pathSubFolderDestino: z.string().min(1, {message: "pathSubFolderDestino is required"}),
})

const siteFileContentSchema = z.object({
    folderId: z.string().min(4, {message: "folderId is required"}),
    fileId: z.string().min(4, {message: "rootFolderId is required"}),
})

export {
    siteInfoSchema,
    siteChildrenSchema,
    siteSubfolderIdSchema,
    siteItemsSchema,
    sitePathsSchema,
    siteFileContentSchema
}