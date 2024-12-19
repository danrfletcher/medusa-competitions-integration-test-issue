import { Module} from "@medusajs/utils";
import CompetitionModuleService from "./services/competition-service";

export const COMPETITION_MODULE = "competitions";

export default Module(COMPETITION_MODULE, {
    service: CompetitionModuleService,
});
