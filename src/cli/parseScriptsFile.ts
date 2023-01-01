
import { create } from "ts-node"
import type { ScriptsFn } from "../functions/scripts";

type opts = {
  file: string,
  filePath: string,
  extension: ".js" | ".ts",
}

const typescript = create({
  compilerOptions: {
    "lib": ["es2022"],
    "module": "commonjs",
    "target": "es2022",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "allowJs": true,
  }
})

export const parseScriptsFile = async (opts: opts) => {
  const javascript = typescript.compile(opts.file, opts.filePath);
  const scripts = eval(javascript)

  if (scripts.type !== "scripts") {
    throw new Error("Scripts file must export a scripts function");
  }

  return scripts as ScriptsFn
}