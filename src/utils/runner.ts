import spawn from "cross-spawn"

type Options = {
  showLogs?: boolean
}

type SpawnOptions = Parameters<typeof spawn>[2]

export const run = (task: string, options?: Options, spawnOptions?: SpawnOptions) => {
  return new Promise((resolve, reject) => {

    const [command, ...args] = task.split(" ")

    const child = spawn(command, args, {
      shell: true,
      stdio: options?.showLogs ? "inherit" : "pipe",
      ...spawnOptions
    })

    child.on("error", (error) => {
      reject(error)
    })

    child.on("close", (code, signal) => {
      resolve({ task, code, signal })
    })
  })
}