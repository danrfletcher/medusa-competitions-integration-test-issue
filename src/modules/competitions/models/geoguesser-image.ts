import { model } from "@medusajs/framework/utils";

const GeoguesserImage = model.define("geoguesser_image", {
  id: model.id().primaryKey(),
  image_id: model.text(),
  product_id: model.text(),
  product_variant_ids: model.array().nullable(),
  map_coordinates: model.text()
});

export default GeoguesserImage;
