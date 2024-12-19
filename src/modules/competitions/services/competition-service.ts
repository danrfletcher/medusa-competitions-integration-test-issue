import { MedusaService } from "@medusajs/framework/utils";
import { DAL } from "@medusajs/framework/types";
import GeoguesserImage from "../models/geoguesser-image";
import GeoguesserGuess from "../models/geoguesser-guess";
import { GeoguesserImageType } from "../types";

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService;
};

class CompetitionModuleService extends MedusaService({
  GeoguesserImage,
  GeoguesserGuess,
}) {
  protected baseRepository_: DAL.RepositoryService;

  constructor({ baseRepository }: InjectedDependencies) {
    super(...arguments);
    this.baseRepository_ = baseRepository;
  }

}

export default CompetitionModuleService;
