export { command, type CommandOptions, type CommandFn } from './functions/command';
export { conditional, type ConditionalOptions, type ConditionalFn } from './functions/conditional';
export { lifecycle, type LifecycleOptions, type LifecycleFn } from './functions/lifecycle';
export { optional, type OptionalOptions, type OptionalFn } from './functions/optional';
export { parallel, type ParallelOptions, type ParallelFn } from './functions/parallel';
export { repeat, type RepeatOptions, type RepeatFn } from './functions/repeat';
export { scripts, scripts as variants, type ScriptsOptions, type ScriptsOptions as VariantsOptions, type ScriptsFn, type ScriptsFn as VariantsFn } from './functions/scripts';
export { sequential, type SequentialOptions, type SequentialFn } from './functions/sequential';

export type { BaseAction, ActionFns, Action } from './types/Action';


// your not supposed to use these, but if you want to, im not going to stop you
export { cli } from './cli/index';
export { findFunction } from './cli/findFunction';
export { getCommand } from './cli/getCommand';
export { HelpScreen, printHelpItems } from './cli/helpScreen';
export { parseScriptsFile } from './cli/parseScriptsFile';
export { readScriptsFile } from './cli/readScriptsFile';
export { scriptSearch } from './cli/scriptSearch';
