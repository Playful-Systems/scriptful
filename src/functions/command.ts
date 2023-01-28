import dotenv from "dotenv";
import { readFile } from "fs/promises";
import path from "path";
import type { BaseAction } from "../types/Action";
import type { FunctionCallProps } from '../types/FunctionCallProps';
import { run } from "../utils/runner";
import { sleep } from '../utils/sleep';

export type CommandOptions = {
  run: BaseAction
  envFile?: string // tell it to read in an env file
  delay?: number // delay in ms before running
  env?: Record<string, string> // env vars to set
  cwd?: string // the directory to run the command in
  hideLogs?: boolean // hide or show the logs
  continueOnFailure?: boolean // defaults to false
}

const combineEnv = async (env: Record<string, string> = {}, envFile?: string) => {
  // this needs to combine process.env, envFile and env, in that order

  let combinedEnv = { ...process.env } // start with process.env

  if (envFile) {

    const envPath = path.join(process.cwd(), envFile)
    const envFileContents = await readFile(envPath, "utf8")

    const parsedEnvFile = dotenv.parse(envFileContents)

    combinedEnv = { ...combinedEnv, ...parsedEnvFile }
  }

  combinedEnv = { ...combinedEnv, ...env }

  return combinedEnv
}

export const command = (opts: CommandOptions, description?: string) => {
  return {
    type: "command",
    opts,
    description,
    fn: async (props: FunctionCallProps) => {

      const cwd = opts.cwd ? path.join(process.cwd(), opts.cwd) : process.cwd()
      const env = await combineEnv(opts.env, opts.envFile)

      if (opts.delay) {
        await sleep(opts.delay)
      }

      try {

        // an action can either be a function or a string
        // if its a function, just run it
        // if its a string, spawn a shell to run it in

        if (typeof opts.run === "function") {

          // save the original state
          const originalCwd = process.cwd()
          const originalEnv = process.env

          // change the state to whats requested
          process.chdir(cwd);
          process.env = env;

          // run the function
          const output = await opts.run()

          // reset the state
          process.chdir(originalCwd);
          process.env = originalEnv;

          return output
        }

        const output = await run(opts.run, {
          showLogs: !opts.hideLogs,
        }, {
          cwd,
          env
        })

        return output

      } catch (error: any) {

        const shouldContinue = opts.continueOnFailure ?? false

        if (shouldContinue) {
          console.error(`Command failed: ${opts.run} continuing`)
        } else {
          throw new Error(`Command failed: ${opts.run} stopping`)
        }

      }
    }
  } as const
}

type _CommandFn = ReturnType<typeof command>
export interface CommandFn extends _CommandFn { }