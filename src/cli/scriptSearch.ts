import type { ScriptsFn } from "../functions/scripts";
import type { ActionFns } from "../types/Action";
import { makeCommand } from './../utils/makeCommand';

type ScriptFns = ActionFns | ScriptsFn

// recursively search for the script
export const scriptSearch = (getScripts: ScriptsFn, commandParts: string[]): ScriptFns => {
  const scripts = getScripts.opts;

  const [key, ...rest] = commandParts;

  const item = scripts[key];

  if (typeof item === "string" || typeof item === "function") {
    return makeCommand(item)
  }

  if (rest.length === 0) {
    return item;
  }

  if (item.type === "scripts") {
    return scriptSearch(item, rest);
  }

  throw new Error(`Could not find function for command: ${commandParts.join(":")}`);
};
