import type { Action } from "../types/Action";
import type { FunctionCallProps } from '../types/FunctionCallProps';
import { makeFunction } from "../utils/makeFunction";

export type ParallelOptions = Array<Action>

export const parallel = (opts: ParallelOptions, description?: string) => {
  return {
    type: "parallel",
    opts,
    description,
    fn: async (props: FunctionCallProps) => {
      await Promise.allSettled(opts.map(action => (makeFunction(action))(props)))
    }
  } as const
}

type _ParallelFn = ReturnType<typeof parallel>
export interface ParallelFn extends _ParallelFn { }
