import { z } from "zod";

const siteInfoSchema = z.object({
    tenant: z.string().min(4, {message: "tenant is required"}),
    name: z.string().min(4, {message: "name is required"})
})

const siteChildrenSchema = z.object({
    id: z.string().min(4, {message: "id is required"})
})

export {
    siteInfoSchema,
    siteChildrenSchema
}