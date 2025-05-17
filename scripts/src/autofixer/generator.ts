import { generate } from 'openapi-typescript-codegen'
import fs from 'fs'

export async function generateSdk(spec: any) {
  const specPath = './temp-fixed-spec.json'
  fs.writeFileSync(specPath, JSON.stringify(spec, null, 2))

  await generate({
    input: specPath,
    output: './generated-sdk',
    httpClient: 'fetch',
  })
}
