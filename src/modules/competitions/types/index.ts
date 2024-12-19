import { InferTypeOf } from "@medusajs/framework/types";
import GeoguesserImageId from "../models/geoguesser-image";

export type ProductVariantGeoguesserImageId = InferTypeOf<
  typeof GeoguesserImageId
>;
