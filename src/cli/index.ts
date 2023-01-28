import { findFunction } from "./findFunction";
import { getCommand } from "./getCommand";
import { HelpScreen } from "./helpScreen";
import { packageScripts } from "./packageScripts";
import { parseScriptsFile } from "./parseScriptsFile";
import { readScriptsFile } from "./readScriptsFile";

export const cli = async () => {

  // get the command the user wants to run
  const command = getCommand();

  // read in the user defined scripts.ts file
  const scriptsFile = await readScriptsFile();

  // run the file and get the tree of scripts
  const getScripts = await parseScriptsFile(scriptsFile);

  // if the user didn't specify a command, or if they specified --help, show the help screen
  if (!command || command === "--help") {
    HelpScreen(getScripts)
    return;
  }

  if (command === "--version") {
    const { version } = require("../../package.json");
    console.log(`v${version}`)
    return;
  }

  if (["--generate", "-g"].includes(command)) {
    packageScripts(getScripts)
    return;
  }

  try {
    // find the function that matches the command requested
    const func = findFunction(getScripts, command);

    // run the function
    await func({ command })
  } catch (error: any) {
    if (error.message?.includes("Could not find command")) {
      console.log(error.message)
      console.log(`Perhaps you are looking for one of these: \n`)
      HelpScreen(getScripts)
      return;
    } else {
      throw error
    }
  }

};
