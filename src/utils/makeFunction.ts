import { makeCommand } from './makeCommand';
import { Action } from '../types/Action';

export const makeFunction = (script: Action) => {
  if (typeof script === "string" || typeof script === "function") {
    return makeCommand(script).fn
  }
  return script.fn
}