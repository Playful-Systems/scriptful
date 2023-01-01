import type { ScriptsFn } from "../functions/scripts";
import { Action } from "../types/Action";

export const HelpScreen = (getScripts: ScriptsFn) => {
  console.log("Available scripts:");

  const scripts = getScripts.opts

  for (const [key, item] of Object.entries(scripts)) {
    printHelpItems(null, key, item);
  }

};

export const printHelpItems = (parentKey: string | null, key: string, item: Action | ScriptsFn) => {
  const compoundKey = parentKey ? [parentKey, key].join(":") : key;
  if (typeof item === "string") {
    console.log(`  - "${compoundKey}"`);
  } else if (typeof item === "function") {
    console.log(`  - "${compoundKey}"`);
  } else if (item.type === "command") {
    console.log(`  - "${compoundKey}" ${item?.description ? `${item.description}` : ""}`);
  } else if (item.type === "lifecycle") {
    console.log(`  - "${compoundKey}" ${item?.description ? `${item.description}` : ""}`);
  } else if (item.type === "optional") {
    console.log(`  - "${compoundKey}" ${item?.description ? `${item.description}` : ""}`);
  } else if (item.type === "parallel") {
    console.log(`  - "${compoundKey}" ${item?.description ? `${item.description}` : ""}`);
  } else if (item.type === "sequential") {
    console.log(`  - "${compoundKey}" ${item?.description ? `${item.description}` : ""}`);
  } else if (item.type === "scripts") {
    for (const entry of Object.entries(item.opts)) {
      printHelpItems(compoundKey, entry[0], entry[1]);
    }
  }
}