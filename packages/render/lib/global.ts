import { ctx } from "@hella/global";
import { ComponentRegistry } from "./types";

const context = ctx() as { HELLA_COMPONENTS: ComponentRegistry };

const HELLA_COMPONENTS: ComponentRegistry = new Map();

context.HELLA_COMPONENTS ||= HELLA_COMPONENTS;
