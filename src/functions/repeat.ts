import type { Action } from "../types/Action";
import type { FunctionCallProps } from '../types/FunctionCallProps';
import { makeFunction } from "../utils/makeFunction";

export type RepeatOptions = {
  run: Action,
  times: number
}

export const repeat = (opts: RepeatOptions, description?: string) => {
  return {
    type: "repeat",
    opts,
    description,
    fn: async (props: FunctionCallProps) => {
      // repeat the action a number of times
      const a = [...Array(opts.times).keys()]
      for (const _ of a) {
        await (makeFunction(opts.run))(props)
      }
    }
  } as const
}

type _RepeatFn = ReturnType<typeof repeat>
export interface RepeatFn extends _RepeatFn { }
