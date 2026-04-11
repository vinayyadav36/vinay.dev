#!/usr/bin/env node
// DB Health Check + Self-Heal for JSON data files
// Usage: node scripts/mlai/db-health-check.js [--heal]

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, '../../Backend/server/data')
const HEAL = process.argv.includes('--heal')

const COLLECTION_FILES = ['users.json', 'posts.json', 'guestbook.json', 'logs.json']
const ALL_FILES = [...COLLECTION_FILES, 'visitors.json', 'contacts.json']

const DEFAULTS = {
  'visitors.json': { count: 0, visits: [] },
  'contacts.json': [],
  'users.json': [],
  'posts.json': [],
  'guestbook.json': [],
  'logs.json': []
}

function box(lines) {
  const width = Math.max(...lines.map(l => l.length)) + 4
  const border = '╔' + '═'.repeat(width - 2) + '╗'
  const bottom = '╚' + '═'.repeat(width - 2) + '╝'
  console.log('\n' + border)
  lines.forEach(l => {
    const pad = width - 2 - l.length
    console.log('║ ' + l + ' '.repeat(Math.max(0, pad - 1)) + '║')
  })
  console.log(bottom)
}

function backup(file) {
  const ts = Date.now()
  const bak = file + '.bak.' + ts
  try {
    fs.copyFileSync(file, bak)
    return bak
  } catch {
    return null
  }
}

const results = []
let hasErrors = false

box([
  '  DB HEALTH CHECK 1996  ',
  `  Data dir: ${DATA_DIR}`,
  `  Heal mode: ${HEAL ? 'ON' : 'OFF'}`,
  ''
])

// Ensure data dir exists
if (!fs.existsSync(DATA_DIR)) {
  if (HEAL) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
    console.log('  ✅ Created missing data directory')
  } else {
    console.log('  🚨 DATA DIRECTORY MISSING:', DATA_DIR)
    process.exit(1)
  }
}

for (const filename of ALL_FILES) {
  const filepath = path.join(DATA_DIR, filename)
  const checks = []
  let data = null
  let healed = false

  // Check 1: File exists
  if (!fs.existsSync(filepath)) {
    checks.push({ ok: false, msg: 'File missing' })
    if (HEAL) {
      fs.writeFileSync(filepath, JSON.stringify(DEFAULTS[filename], null, 2), 'utf8')
      healed = true
      checks[checks.length - 1].msg += ' → CREATED with default'
    } else {
      hasErrors = true
    }
  } else {
    // Check 2: Valid JSON
    let raw = ''
    try {
      raw = fs.readFileSync(filepath, 'utf8')
      data = JSON.parse(raw)
      checks.push({ ok: true, msg: 'Valid JSON' })
    } catch {
      checks.push({ ok: false, msg: 'Invalid JSON' })
      hasErrors = true
      if (HEAL) {
        const bak = backup(filepath)
        fs.writeFileSync(filepath, JSON.stringify(DEFAULTS[filename], null, 2), 'utf8')
        data = DEFAULTS[filename]
        healed = true
        checks[checks.length - 1].msg += ` → HEALED (backup: ${bak ? path.basename(bak) : 'none'})`
        hasErrors = false
      }
    }

    if (data !== null) {
      // Check 3: visitors.json shape
      if (filename === 'visitors.json') {
        if (typeof data !== 'object' || data === null || !('count' in data) || !Array.isArray(data.visits)) {
          checks.push({ ok: false, msg: 'visitors.json wrong shape (expected {count, visits[]})' })
          hasErrors = true
          if (HEAL) {
            const bak = backup(filepath)
            fs.writeFileSync(filepath, JSON.stringify(DEFAULTS['visitors.json'], null, 2), 'utf8')
            healed = true
            checks[checks.length - 1].msg += ` → HEALED (backup: ${bak ? path.basename(bak) : 'none'})`
            hasErrors = false
          }
        } else {
          checks.push({ ok: true, msg: `Shape OK (count=${data.count}, visits=${data.visits.length})` })
        }
      }

      // Check 4: Collection files must be arrays
      if (COLLECTION_FILES.includes(filename)) {
        if (!Array.isArray(data)) {
          checks.push({ ok: false, msg: 'Expected array for collection file' })
          hasErrors = true
          if (HEAL) {
            const bak = backup(filepath)
            fs.writeFileSync(filepath, '[]', 'utf8')
            data = []
            healed = true
            checks[checks.length - 1].msg += ` → HEALED (backup: ${bak ? path.basename(bak) : 'none'})`
            hasErrors = false
          }
        } else {
          checks.push({ ok: true, msg: `Is array (${data.length} items)` })

          // Check 5: No item missing 'id' field
          if (Array.isArray(data)) {
            const missingId = data.filter(item => item.id === undefined || item.id === null)
            if (missingId.length > 0) {
              checks.push({ ok: false, msg: `${missingId.length} items missing 'id' field` })
              hasErrors = true
              if (HEAL) {
                const bak = backup(filepath)
                let nextId = data.reduce((max, item) => Math.max(max, item.id || 0), 0) + 1
                missingId.forEach(item => { item.id = nextId++ })
                fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8')
                healed = true
                checks[checks.length - 1].msg += ` → IDs assigned (backup: ${bak ? path.basename(bak) : 'none'})`
                hasErrors = false
              }
            } else if (data.length > 0) {
              checks.push({ ok: true, msg: 'All items have id field' })
            }
          }
        }
      }

      // Check 4b: contacts.json is array
      if (filename === 'contacts.json') {
        if (!Array.isArray(data)) {
          checks.push({ ok: false, msg: 'contacts.json expected to be an array' })
          hasErrors = true
          if (HEAL) {
            const bak = backup(filepath)
            fs.writeFileSync(filepath, '[]', 'utf8')
            healed = true
            checks[checks.length - 1].msg += ` → HEALED (backup: ${bak ? path.basename(bak) : 'none'})`
            hasErrors = false
          }
        } else {
          checks.push({ ok: true, msg: `contacts.json is array (${data.length} items)` })
        }
      }
    }
  }

  const status = healed ? '🔧' : checks.every(c => c.ok) ? '✅' : '🚨'
  console.log(`\n  ${status} ${filename}`)
  checks.forEach(c => {
    console.log(`     ${c.ok ? '✓' : '✗'} ${c.msg}`)
  })
  results.push({ filename, ok: checks.every(c => c.ok) || healed, healed })
}

const passing = results.filter(r => r.ok).length
const healed = results.filter(r => r.healed).length

box([
  '  HEALTH CHECK SUMMARY  ',
  '',
  `  Files checked: ${results.length}`,
  `  Passing:       ${passing}/${results.length}`,
  healed > 0 ? `  Healed:        ${healed} file(s)` : '  No healing needed',
  '',
  hasErrors ? '  STATUS: ⚠  ERRORS FOUND — run with --heal to fix' : '  STATUS: ✅ ALL HEALTHY'
])

process.exit(hasErrors ? 1 : 0)
