#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline'
import { flatten, unflatten } from './index.js'

const args = process.argv.slice(2)
const shouldUnflatten = args.includes('--unflatten')
const filepath = args.find(arg => !arg.startsWith('--'))

if (filepath) {
  // Read from file
  const file = path.resolve(process.cwd(), filepath)
  fs.accessSync(file, fs.constants.R_OK) // allow to throw if not readable
  out(JSON.parse(fs.readFileSync(file)))
} else if (process.stdin.isTTY) {
  usage(0)
} else {
  // Read from newline-delimited STDIN
  const lines = []
  readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  })
    .on('line', line => lines.push(line))
    .on('close', () => out(JSON.parse(lines.join('\n'))))
}

function out (data) {
  const transformed = shouldUnflatten ? unflatten(data) : flatten(data)
  process.stdout.write(JSON.stringify(transformed, null, 2))
}

function usage (code) {
  console.log(`
Usage:

flat [--unflatten] foo.json
cat foo.json | flat [--unflatten]
`)

  process.exit(code || 0)
}
