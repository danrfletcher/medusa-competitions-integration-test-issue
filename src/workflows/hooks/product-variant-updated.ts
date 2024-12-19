import { updateProductVariantsWorkflow } from "@medusajs/medusa/core-flows";
import { COMPETITION_MODULE } from "src/modules/competitions";
import CompetitionModuleService from "src/modules/competitions/services/competition-service";

updateProductVariantsWorkflow.hooks.productVariantsUpdated(
  async ({ product_variants, additional_data }, { container }) => {
    if (!additional_data?.geoguesser_image_id) return;

    const { geoguesser_image_id } = additional_data as {
      geoguesser_image_id: string;
    };

    const competitionService: CompetitionModuleService =
      container.resolve(COMPETITION_MODULE);

    for (const variant of product_variants) {
      try {
        await competitionService.updateGeoguesserImageId(
          geoguesser_image_id,
          variant.id
        );
      } catch (error) {
        console.error(`Failed to update variant ${variant.id}:`, error);
      }
    }
  }
);
