import { HelpScreen } from '../cli/helpScreen';
import type { FunctionCallProps } from '../types/FunctionCallProps';
import { Action } from '../types/Action';

export type ScriptsOptions = Record<string, Action | ScriptsFn>

export const scripts = <CustomScripts extends ScriptsOptions = ScriptsOptions,>(opts: CustomScripts) => {
  return {
    type: "scripts",
    opts,
    fn: (props: FunctionCallProps) => {
      HelpScreen({
        type: "scripts",
        opts,
        fn: (props: FunctionCallProps) => { }
      })
    }
  } as const
}

type _ScriptsFn = ReturnType<typeof scripts>
export interface ScriptsFn extends _ScriptsFn { }
