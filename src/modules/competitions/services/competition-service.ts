import { MedusaService } from "@medusajs/framework/utils";
import { EntityManager } from "@mikro-orm/core";
import { ProductVariant as ProductVariantType } from ".medusa/types/remote-query-entry-points";
import { ProductVariantGeoguesserImageId } from "../types";
import {
  InjectTransactionManager,
  InjectManager,
  MedusaContext,
} from "@medusajs/framework/utils";
import { Context } from "@medusajs/framework/types";
import GeoguesserImage from "../models/geoguesser-image";
import GeoguesserImageImage from "../../../links/geoguesser-image-image";
import geoguesserImageProductVariant from "../../../links/geoguesser-image-product-variant";
import { DAL } from "@medusajs/framework/types";

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService;
};

class CompetitionModuleService extends MedusaService({
  GeoguesserImage,
}) {
  protected baseRepository_: DAL.RepositoryService;

  constructor({ baseRepository }: InjectedDependencies) {
    super(...arguments);
    this.baseRepository_ = baseRepository;
  }

  @InjectTransactionManager()
  protected async updateGeoguesserImageId_(
    geoguesserImageId: string,
    productVariantId: string,
    @MedusaContext() sharedContext?: Context<EntityManager>
  ) {
    if (!sharedContext?.transactionManager) {
      throw new Error("Transaction manager is required");
    }

    const productVariant = await sharedContext.transactionManager.findOne<
      ProductVariantType & Partial<ProductVariantGeoguesserImageId>
    >("product_variant", {
      id: productVariantId,
    });

    if (!productVariant) {
      throw new Error(`Product variant with id ${productVariantId} not found`);
    }

    productVariant.geoguesser_image_id = geoguesserImageId;

    await sharedContext.transactionManager.persistAndFlush(productVariant);

    return productVariant;
  }

  @InjectManager()
  async updateGeoguesserImageId(
    geoguesserImageId: string,
    productVariantId: string,
    @MedusaContext() sharedContext?: Context<EntityManager>
  ) {
    return await this.updateGeoguesserImageId_(
      geoguesserImageId,
      productVariantId,
      sharedContext
    );
  }
}

export default CompetitionModuleService;
