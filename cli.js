#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const flat = require('./index')

if (process.stdin.isTTY) {
  const filepath = process.argv.slice(2)[0]
  if (!filepath) return usage()
  // Read from file
  const file = path.resolve(process.cwd(), filepath)
  if (!file) return usage()
  if (!fs.existsSync(file)) return usage()
  out(require(file))
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
  process.stdout.write(JSON.stringify(flat(data), null, 2))
}

function usage () {
  console.log(`
Usage:

flat foo.json
cat foo.json | flat
`)

  process.exit()
}
