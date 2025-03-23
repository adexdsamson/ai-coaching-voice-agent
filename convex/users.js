import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const CreateUser = mutation({
  args: { name: v.string(), email: v.string() },
  handler: async (ctx, args) => {
    const userData = await ctx.db
      .query("users")
      .filter((doc) => doc.eq(doc.field("email"), args.email))
      .collect();

    if (userData.length === 0) {
      const payload = {
        name: args.name,
        email: args.email,
        credits: 50000,
      };

      const result = await ctx.db.insert("users", payload);
      
      return payload;
    }

    return userData[0];
  },
});
