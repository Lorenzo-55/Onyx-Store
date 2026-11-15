import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import ts from 'typescript'
import { messages } from '../src/i18n/messages'
import { productMessages } from '../src/i18n/products'

function luminance(hex: string) {
  const channels = hex
    .match(/[a-f0-9]{2}/gi)!
    .map((v) => parseInt(v, 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
}

describe('theme and translation checks', () => {
  it('provides readable text token contrast in both palettes', () => {
    const css = readFileSync('src/index.css', 'utf8')
    const dark = css.match(/:root\s*\{\s*--page:([^}]+)\}/)![0]
    const light = css.match(/:root\[data-theme=["\x27]light["\x27]\]\s*\{([^}]+)\}/)![0]
    for (const [theme, block] of [
      ['dark', dark],
      ['light', light],
    ]) {
      const colors = Object.fromEntries(
        [...block.matchAll(/(--[\w-]+):\s*(#[a-f0-9]{6})(?=;|})/g)].map((m) => [
          m[1],
          m[2],
        ]),
      )
      for (const ink of ['--text', '--muted', '--accent', '--error']) {
        for (const surface of ['--page', '--surface', '--surface-alt', '--notice']) {
          const a = luminance(colors[ink])
          const b = luminance(colors[surface])
          const contrast = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
          expect(contrast, `${theme}: ${ink} on ${surface}`).toBeGreaterThanOrEqual(4.5)
        }
      }
    }
  })
  it('covers literal interface translation keys in both language packs', () => {
    const dictionary = { ...messages, ...productMessages }
    const missing = new Set<string>()
    const files = [
      'src/App.tsx',
      ...['components', 'pages'].flatMap((dir) =>
        readdirSync(`src/${dir}`)
          .filter((f) => f.endsWith('.tsx'))
          .map((f) => `src/${dir}/${f}`),
      ),
    ]
    for (const file of files) {
      const source = ts.createSourceFile(
        file,
        readFileSync(file, 'utf8'),
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX,
      )
      function visit(node: ts.Node) {
        if (
          ts.isCallExpression(node) &&
          ts.isIdentifier(node.expression) &&
          node.expression.text === 't' &&
          node.arguments[0] &&
          ts.isStringLiteral(node.arguments[0])
        ) {
          const key = node.arguments[0].text
          if (!dictionary[key]) missing.add(key)
        }
        ts.forEachChild(node, visit)
      }
      visit(source)
    }
    expect([...missing]).toEqual([])
  })
})
