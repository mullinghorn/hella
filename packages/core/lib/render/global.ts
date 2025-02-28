import { ctx } from "../context";
import { Context } from "../types";
import { ComponentRegistry } from "./types";

const HELLA_COMPONENTS = new Map();

const context: Context<{
  HELLA_COMPONENTS?: ComponentRegistry;
}> = ctx();


context.HELLA_COMPONENTS ??= HELLA_COMPONENTS;

export const renderContext = context.HELLA_COMPONENTS;
