import type { Action } from '../types/Action';
import type { FunctionCallProps } from '../types/FunctionCallProps';
import { makeFunction } from "../utils/makeFunction";

export type LifecycleOptions = {
  start?: Action
  stop?: Action
  run: Action
}

export const lifecycle = (opts: LifecycleOptions, description?: string) => {
  return {
    type: "lifecycle",
    opts,
    description,
    fn: async (props: FunctionCallProps) => {

      // run the start up script
      if (opts.start) {
        await (makeFunction(opts.start))(props)
      }

      const handler = async () => {
        if (opts.stop) {
          await (makeFunction(opts.stop))(props)
        }
      }

      // register the stop script
      if (opts.stop) {
        process.addListener("SIGINT", handler)
        process.addListener("SIGTERM", handler)
      }

      // run the main script
      await (makeFunction(opts.run))(props)

      // if the main script exits, run the stop script
      if (opts.stop) {
        await (makeFunction(opts.stop))(props)

        // deregister the stop script
        process.removeListener("SIGINT", handler)
        process.removeListener("SIGTERM", handler)
      }

    }
  } as const
}

type _LifecycleFn = ReturnType<typeof lifecycle>
export interface LifecycleFn extends _LifecycleFn { }