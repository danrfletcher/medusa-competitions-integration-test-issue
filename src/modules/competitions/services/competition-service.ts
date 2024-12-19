import { MedusaService } from "@medusajs/framework/utils";
import GeoguesserImage from "../models/geoguesser-image";
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

}

export default CompetitionModuleService;
