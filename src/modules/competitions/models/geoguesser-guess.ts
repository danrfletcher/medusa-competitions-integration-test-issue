import { model } from "@medusajs/framework/utils";

const GeoguesserGuess = model.define("geoguesser_guess", {
  id: model.id().primaryKey(),
  order_item_id: model.text(),
  map_coordinates: model.array()
});

export default GeoguesserGuess;
