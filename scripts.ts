import { scripts, variants } from "scriptful"

export default scripts({
  "build": "tsc",
  "dev": "tsc -w",
  "release": "bumpp"
})