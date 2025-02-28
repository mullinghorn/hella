import { ctx } from "@hella/core";
import { ComponentRegistry } from "./types";

const HELLA_COMPONENTS: ComponentRegistry = new Map();

const context = ctx();

context.HELLA_COMPONENTS ||= HELLA_COMPONENTS;

export const renderContext = context.HELLA_COMPONENTS as ComponentRegistry;
