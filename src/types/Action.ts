import type { CommandFn } from "../functions/command"
import type { ConditionalFn } from "../functions/conditional"
import type { LifecycleFn } from "../functions/lifecycle"
import type { OptionalFn } from "../functions/optional"
import type { ParallelFn } from "../functions/parallel"
import type { RepeatFn } from "../functions/repeat"
import type { SequentialFn } from "../functions/sequential"

export type BaseAction = string | (() => any) | (() => Promise<any>)
export type ActionFns = CommandFn | ConditionalFn | LifecycleFn | OptionalFn | ParallelFn | RepeatFn | SequentialFn
export type Action = BaseAction | ActionFns