#!/usr/bin/env node

var statsFile = process.env['HOME'] + '/.ko.json'
  , fs = require('fs')
  , program = require('commander')

program

  .option('-s, --sleep <hours>', 'Add sleep', parseInt)
  .option('-c, --coffee', 'Add coffee')
  .option('-p, --soda', 'Add soda / pop')
  .option('-r, --redbull', 'Add redbull\n')
  .option('-b, --beer', 'Add beer\n')

  .option('-l, --list', 'Show current stats')
  .option('-i, --install', 'Install pre-commit hook')
  .option('-R, --reset', 'Reset stats')
  .parse(process.argv)

var options = {
  sleep: 'Hours of sleep',
  coffee: 'Cups of coffee',
  soda: 'Cans of soda',
  redbull: 'Cans of redbull',
  beer: 'Bottles of beer',
}

var takesArgs = {
  sleep: true
}

//
//
//

var optionKeys = Object.keys(options)

var initial = load()
  , stats = load()

// Figure out what the user asked to do
if (program.list) {
  list()
} else if (program.install) {
  install()
} else if (program.reset) {
  reset()
} else if (!optionKeys.some(function(e) { return program[e] })) {
  list()
  console.log('\nChoose what to add:')
  program.choose(optionKeys, function(i, e) {
    if (takesArgs[e]) {
      program.promptForNumber(options[e] + ': ', function(num) {
        program[e] = num
        process.stdin.destroy();
        add()
      })
    } else {
      program[e] = true
      process.stdin.destroy();
      add()
    }
  })
} else {
  add()
}

function add() {
  var found = optionKeys.some(function(option) {
    if (program[option]) {
      stats[option] = (stats[option] || 0) + program[option]
      return true
    }
  })
  
  if (!found) throw new Error('Nothing to add')

  save(stats)
  list()
}
  
function load() {
  var stats = {}

  optionKeys.forEach(function(option) {
    stats[option] = 0
  })

  try {
    if (fs.statSync(statsFile).isFile()) {
      stats = JSON.parse(fs.readFileSync(statsFile, 'utf8'))
    }
  } catch (err) {
    if (err.errno !== 2) throw err
  }

  return stats
}

function save(stats) {
  fs.writeFileSync(statsFile, JSON.stringify(stats))
}

function list() {
  console.log('\n' + optionKeys.map(function(key) {
    var value = (stats[key] || 0) + (stats[key] !== initial[key] ? ' <<' : '')
    return options[key] + ': ' + value
  }).join('\n'))
}

function install() {
  function installScript(file, script) {
    fs.writeFileSync(file, script)
    fs.chmodSync(file, fs.statSync(file).mode | 0111)
    console.log(' -> ' + file)
  }

  installScript('.git/hooks/prepare-commit-msg',
      '#!/bin/sh\ngrep -qs "^'+options[optionKeys[0]]+'" "$1" || ko -l >> "$1"')
  installScript('.git/hooks/commit-msg',
      '#!/bin/sh\n(head -n 1 "$1" | grep -qs "^.\\+$") || echo > "$1"')
}

function reset() {
  try {
    fs.unlinkSync(statsFile)
  } catch (err) {
    if (err.errno !== 2) throw err
  }
  initial = load()
  stats = load()
  list()
}
