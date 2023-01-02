import type { ScriptsFn, ScriptsOptions } from "../functions/scripts";
import { Action } from "../types/Action";

export const packageScripts = (getScripts: ScriptsFn) => {
  console.log("replace your package.json scripts with this (or just add to it):");

  const scripts = collectionItems(null, getScripts.opts);
  const json = generateJson(scripts);

  console.log(json)

};

const generateJson = (items: Items) => {
  let obj = {}

  for (const item of items) {
    obj = { ...obj, [item.key]: item.value }
  }

  return JSON.stringify({ scripts: obj }, null, 2)
}

const collectionItems = (parentKey: string | null, scripts: ScriptsOptions): Items => {
  let items: Items = []

  for (const [key, item] of Object.entries(scripts)) {
    items = [...items, ...collectItem(parentKey, key, item)]
  }

  return items;
}


type Items = { key: string, value: string }[]

export const collectItem = (parentKey: string | null, key: string, item: Action | ScriptsFn): Items => {
  const compoundKey = parentKey ? [parentKey, key].join(":") : key;
  let items: Items = []

  if (typeof item === "string" || typeof item === "function") {
    items.push({
      key: compoundKey,
      value: `trouble ${compoundKey}`
    })
  } else if (item.type === "scripts") {
    return items = [...items, ...collectionItems(compoundKey, item.opts)];
  } else {
    items.push({
      key: compoundKey,
      value: `trouble ${compoundKey}`
    })
  }

  return items
}