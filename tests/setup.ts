
import spawn from "cross-spawn"
import fs, { constants } from "fs/promises"

export const setup = async (script: string) => {

  const rootTestDir = ".tmp-test-dir/"

  try {
    // if the root dir doesn't exist, create it
    await fs.mkdir(rootTestDir)
  } catch {
    // if the dir already exists, ignore the error
  }

  // create temp directory
  const tempFolder = await fs.mkdtemp(rootTestDir)

  const writeFile = async (path: string, content: string) => {
    return fs.writeFile(`${tempFolder}/${path}`, content)
  }

  // write the script to the temp directory
  await writeFile(`scripts.ts`, script)

  const runCli = (task: string) => {
    return new Promise<{ stdout: string, stderr: string }>((resolve, reject) => {

      let stdout = ""
      let stderr = ""

      const [command, ...args] = task.split(" ")

      const child = spawn(command, args, {
        shell: true,
        cwd: tempFolder,
      })

      child.stdout?.on("data", (data) => {
        stdout += data.toString()
      })

      child.stderr?.on("data", (data) => {
        stderr += data.toString()
      })

      child.on("close", (code) => {
        if (code === 0) {
          resolve({ stdout, stderr })
        } else {
          reject({ stdout, stderr })
        }
      })

    })
  }

  const cleanup = async () => {
    await fs.rm(tempFolder, { recursive: true })
  }

  return {
    runCli,
    cleanup,
    tempFolder,
    writeFile
  }
}