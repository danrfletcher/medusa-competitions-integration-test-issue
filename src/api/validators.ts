import { z } from "zod";

export const CreateGeoguesserImagesSchema = z.object({
  image_id: z.string(),
  product_variant_id: z.string(),
  map_coordinates: z.string(),
});
