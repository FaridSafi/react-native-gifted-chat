import path from "path"
import fs from "fs"
import glob from "glob"
import mkdirp from "mkdirp"
import jscodeshift from "jscodeshift"

import tx from "./MapChild"

const relativeToCwd = it => path.relative(process.cwd(), it)

glob
  .sync("**/*.jsx", {
    cwd: path.resolve(__dirname, "../macros/"),
    ignore: "*.spec.jsx",
  })
  // .slice(0, 1)
  .map(it => {
    const filename = path.resolve(__dirname, "../macros/", it)
    const nextFilename = path.resolve(__dirname, "../components/", it)
    console.log(
      `Generating ${relativeToCwd(nextFilename)} from ${relativeToCwd(
        filename
      )}`
    )

    const source = fs.readFileSync(filename, "utf8")
    const output = tx({ source }, { jscodeshift })
    mkdirp.sync(path.dirname(nextFilename))
    fs.writeFileSync(nextFilename, output)
  })
