import { createAccessControl } from "better-auth/plugins";
import { adminAc, defaultStatements, userAc } from "better-auth/plugins/admin/access";



export const ac = createAccessControl(defaultStatements)

export const user = ac.newRole({
    ...userAc.statements,
    user: [...userAc.statements.user, "list"]
})

export const admin = ac.newRole(adminAc.statements)

// export const ac = createAccessControl({
//     ...defaultStatements,
//     projects: ["create"]
// })

// export const user = ac.newRole({
//     ...userAc.statements,
//     user: [...userAc.statements.user, "list"],
//     projects: ["create"]
// })

// export const admin = ac.newRole(adminAc.statements)