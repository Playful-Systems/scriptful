import type { Action } from "../types/Action";
import type { FunctionCallProps } from '../types/FunctionCallProps';
import { makeFunction } from '../utils/makeFunction';

export type SequentialOptions = Array<Action>

export const sequential = (opts: SequentialOptions, description?: string) => {
  return {
    type: "sequential",
    opts,
    description,
    fn: async (props: FunctionCallProps) => {
      for (const action of opts) {
        const fn = makeFunction(action)
        await fn(props)
      }
    }
  } as const
}

type _SequentialFn = ReturnType<typeof sequential>
export interface SequentialFn extends _SequentialFn { }