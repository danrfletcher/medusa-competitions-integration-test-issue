
import { defineMiddlewares } from "@medusajs/framework/http";
import { z } from "zod";

export default defineMiddlewares({
  routes: [
    {
      method: "POST",
      matcher: "/admin/products/:id/variants/:variant_id",
      additionalDataValidator: {
        geoguesser_image_id: z.string().optional(),
      },
    },
  ],
});