import { defineLink } from "@medusajs/utils";
import CompetitionModule from "../modules/competitions";
import ProductModule from "@medusajs/medusa/product";

export default defineLink(ProductModule.linkable.product, {
  linkable: CompetitionModule.linkable.geoguesserImage,
  isList: true,
  deleteCascade: true,
});
