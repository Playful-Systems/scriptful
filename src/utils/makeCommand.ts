import { command, type CommandFn } from "../functions/command";
import type { BaseAction } from "../types/Action";

// this takes an action or command and makes it in to a command
// this is necessary because as a shorthand, you can pass just a string or function
// this makes it simpler but you don't get the options you get with the command function
// and its not possible to define a description
export const makeCommand = (action: BaseAction | CommandFn): CommandFn => {
  if (typeof action === "string") {
    return command({
      run: action
    });
  } else if (typeof action === "function") {
    return command({
      run: action
    })
  } else {
    return action;
  }
}