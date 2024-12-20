import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { CreateGeoguesserImagesSchema } from "src/api/validators";
import {
  COMPETITION_MODULE,
  CompetitionModuleService,
} from "src/modules/competitions";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { MedusaError } from "@medusajs/framework/utils";
import { z } from "zod";
import { getErrorStatusCode } from "src/utils/errors";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const competitionService: CompetitionModuleService =
    req.scope.resolve(COMPETITION_MODULE);
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  try {
    const data = CreateGeoguesserImagesSchema.parse(req.body);
    const { productVariant } = req.params;

    const { image_id, map_coordinates } = data;

    if (!/^-?\d+\.?\d*\s*,\s*-?\d+\.?\d*$/.test(map_coordinates)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Invalid map coordinates format"
      );
    }

    const { data: variants } = await query.graph({
      entity: "product_variant",
      fields: ["id", "product_id"],
      filters: {
        id: productVariant,
      },
    });
    console.log("⚡ ~ variants:", variants);

    if (variants.length !== 1) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Product variant not found"
      );
    }

    const validatedProductVariant = variants[0];
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["images.*"],
      filters: {
        id: validatedProductVariant.product_id!,
      },
    });

    const productImages = products[0].images;
    if (!productImages.find((image) => image.id === image_id)) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "Image not found");
    }

    const newGeoguesserImg = await competitionService.createGeoguesserImages({
      ...data,
      product_variant_id: productVariant,
    });

    res.json({
      geoguesser_image: newGeoguesserImg,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.flatten().fieldErrors,
      });
    }

    if (error instanceof MedusaError) {
      const statusCode = getErrorStatusCode(error.type);
      return res.status(statusCode).json({
        message: error.message,
        type: error.type,
      });
    }

    return res.status(500).json({
      message: "An unexpected error occurred",
      error: error.message,
    });
  }
};

// export const PATCH = async (req: MedusaRequest, res: MedusaResponse) => {
//   const competitionService: CompetitionModuleService =
//     req.scope.resolve(COMPETITION_MODULE);

//   const data = CreateGeoguesserImagesSchema.parse(req.body);
//   const { productVariant } = req.params;
//   const {  }

//   try {
//     const updateGeoguesserImg = await competitionService.updateGeoguesserImages([],{
//       ...data,
//       product_variant_id: productVariant,
//     });

//     res.json({
//       geoguesser_image: updateGeoguesserImg,
//     });
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return res.status(400).json({
//         message: "Validation failed",
//         errors: error.flatten().fieldErrors,
//       });
//     }

//     res.status(400).json({
//       message: error.message,
//     });
//   }
// };
