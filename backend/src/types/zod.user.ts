import * as z from "zod"
import { GlobalRole } from "./role.type.js"


export const userZodRegisterType = z.object({
    name: z.string("Not a string").min(2, "Name should have atleast 2 character"),
    email: z.email("Email not correct format"),
    password: z.string("Password should be in string format.").min(8, "Password should be atleast 8 character long."),
    role: z.enum(GlobalRole),
})

export type userRegisterType = z.infer<typeof userZodRegisterType> 