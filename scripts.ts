import { scripts } from "scriptful"

export default scripts({
  "build": "tsc",
  "dev": "tsc -w",
  "test": "vitest",
  "release": "bumpp"
})