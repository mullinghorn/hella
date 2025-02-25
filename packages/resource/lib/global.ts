import { ctx } from "@hella/core";
import { ResourceHella } from "./types";

const HELLA_RESOURCE: ResourceHella = {
  cache: new Map(),
  activeRequests: new Map(),
};

const context = ctx();

context.HELLA_RESOURCE ||= HELLA_RESOURCE;

export const resourceContext = context.HELLA_RESOURCE as ResourceHella;
