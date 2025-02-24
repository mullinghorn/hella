import { ctx } from "@hella/global";
import { ResourceHella } from "./types";

const HELLA_RESOURCE: ResourceHella = {
  cache: new Map(),
  activeRequests: new Map(),
};

const context = ctx() as { HELLA_RESOURCE: ResourceHella };

context.HELLA_RESOURCE = HELLA_RESOURCE;
