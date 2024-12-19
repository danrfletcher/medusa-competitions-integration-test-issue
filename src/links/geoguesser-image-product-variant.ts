import { defineLink } from "@medusajs/utils";
import CompetitionModule from "../modules/competitions";
import ProductModule from "@medusajs/medusa/product";

export default defineLink(ProductModule.linkable.productVariant, {
  linkable: CompetitionModule.linkable.geoguesserImage,
  deleteCascade: true,
});
