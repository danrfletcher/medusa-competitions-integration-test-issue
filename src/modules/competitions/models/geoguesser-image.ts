import { model } from "@medusajs/framework/utils";

const GeoguesserImage = model.define("geoguesser_image", {
  id: model.id({ prefix: "geogimg" }).primaryKey(),
  image_id: model.text(),
  product_variant_id: model.text().unique(),
  map_coordinates: model.text(),
});

export default GeoguesserImage;
