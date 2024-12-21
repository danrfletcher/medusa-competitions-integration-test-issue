import { z } from "zod";

export const GeoguesserImagesSchema = z.object({
  image_id: z.string(),
  map_coordinates: z.string(),
});
