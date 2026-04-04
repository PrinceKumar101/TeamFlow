import User  from "../models/user.model.js";
import { hash } from "../utils/hash.js";
import { GlobalRole } from "../types/role.type.js";

const DUMMY_USERS = [
  { name: "Alice Johnson", email: "alice@teamflow.dev" },
  { name: "Bob Williams", email: "bob@teamflow.dev" },
  { name: "Charlie Brown", email: "charlie@teamflow.dev" },
  { name: "Diana Garcia", email: "diana@teamflow.dev" },
  { name: "Ethan Martinez", email: "ethan@teamflow.dev" },
  { name: "Fiona Davis", email: "fiona@teamflow.dev" },
  { name: "George Wilson", email: "george@teamflow.dev" },
  { name: "Hannah Lee", email: "hannah@teamflow.dev" },
  { name: "Isaac Thomas", email: "isaac@teamflow.dev" },
  { name: "Julia Robinson", email: "julia@teamflow.dev" },
];

/**
 * Seeds dummy users into the database if they don't already exist.
 * Safe to call on every server start — skips existing emails.
 */
export const seedDummyUsers = async () => {
  const defaultPassword = await hash("password123");

  let created = 0;
  for (const u of DUMMY_USERS) {
    const exists = await User.findOne({ email: u.email });
    if (!exists) {
      await User.create({
        name: u.name,
        email: u.email,
        password: defaultPassword,
        role: GlobalRole.USER,
      });
      created++;
    }
  }

  if (created > 0) {
    console.log(`[seed] Created ${created} dummy user(s)`);
  }
};
