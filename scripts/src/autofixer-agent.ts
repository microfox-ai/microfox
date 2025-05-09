import { analyzeSpec } from './autofixer/analyzer'
import { fixSpec } from './autofixer/fixer'
import { generateSdk } from './autofixer/generator'
import { reportFixes } from './autofixer/reporter'
import * as readline from 'readline'

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

rl.question('🌐 Enter OpenAPI spec URL: ', async (url) => {
  console.log('🔍 Analyzing spec...')
  const report = await analyzeSpec(url)

  console.log('🛠️ Applying fixes...')
  const fixedSpec = fixSpec(report)

  console.log('⚙️ Generating SDK...')
  await generateSdk(fixedSpec)

  console.log('📋 Reporting...')
  reportFixes(report)

  rl.close()
})
