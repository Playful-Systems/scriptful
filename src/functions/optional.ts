import readline from 'readline';
import type { BaseAction } from "../types/Action";
import type { FunctionCallProps } from '../types/FunctionCallProps';
import { makeFunction } from "../utils/makeFunction";
import type { CommandFn } from './command';
import type { ConditionalFn } from './conditional';
import type { LifecycleFn } from './lifecycle';
import type { ParallelFn } from './parallel';
import type { RepeatFn } from './repeat';
import type { SequentialFn } from './sequential';

export type OptionalOptions = BaseAction | CommandFn | ConditionalFn | LifecycleFn | ParallelFn | RepeatFn | SequentialFn

export const optional = (opts: OptionalOptions, description?: string) => {
  return {
    type: "optional",
    opts,
    description,
    fn: (props: FunctionCallProps) => {
      return new Promise((resolve) => {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

        rl.question(`\nDo you want to run "${description}"? (y/n) `, async (choice) => {

          if (["y", "Y", "yes", "Yes"].includes(choice)) {
            await (makeFunction(opts))(props)
          }

          rl.close();

          resolve(undefined);

        });
      })

    }
  } as const
}

type _OptionalFn = ReturnType<typeof optional>
export interface OptionalFn extends _OptionalFn { }