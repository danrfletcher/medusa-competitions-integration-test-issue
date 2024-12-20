import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { CreateGeoguesserImagesSchema } from "src/api/validators";
import {
  COMPETITION_MODULE,
  CompetitionModuleService,
} from "src/modules/competitions";
import { z } from "zod";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const competitionService: CompetitionModuleService =
    req.scope.resolve(COMPETITION_MODULE);

  const data = CreateGeoguesserImagesSchema.parse(req.body);
  const { productVariant } = req.params;

  try {
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

    res.status(400).json({
      message: error.message,
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
