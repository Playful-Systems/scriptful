import type { ScriptsFn } from "../functions/scripts";
import { scriptSearch } from "./scriptSearch";

export const findFunction = (getScripts: ScriptsFn, command: string) => {
  const commandParts = command.split(":");

  const script = scriptSearch(getScripts, commandParts);

  if (script === undefined) {
    throw new Error(`Could not find command: ${command}`);
  }

  return script.fn;
};
