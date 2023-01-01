import type { Action } from '../types/Action';
import type { FunctionCallProps } from '../types/FunctionCallProps';
import { makeFunction } from '../utils/makeFunction';

export type ConditionalOptions = {
  run: Action,
  condition: boolean
}

// run if a condition statement is true
export const conditional = (opts: ConditionalOptions, description?: string) => {
  return {
    type: "conditional",
    opts,
    description,
    fn: async (props: FunctionCallProps) => {

      if (opts.condition) {
        console.log(`\nRunning "${description}"...`)
        await (makeFunction(opts.run))(props)
      } else {
        console.log(`\nSkipping "${description}"...`)
      }
    }
  } as const
}

type _ConditionalFn = ReturnType<typeof conditional>
export interface ConditionalFn extends _ConditionalFn { }