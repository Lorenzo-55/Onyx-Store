// Original vector placeholders. No third-party product photography is used.
import { mkdir, writeFile } from 'node:fs/promises'
import { products } from '../src/data/products.ts'

await mkdir(new URL('../public/images/', import.meta.url), { recursive: true })

const escapeXml = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;')

function getColumnCount(productId) {
  if (productId === 'slate') return 16
  if (productId === 'arc') return 18
  return 14
}

function getKeyLabel(row, column, isBlank) {
  if (isBlank) return ''
  if (row === 0) {
    return [
      'esc',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '0',
      '−',
      '=',
      '⌫',
      'del',
      'end',
      'pg',
      '↑',
    ][column]
  }
  if (row === 1) return 'QWERTYUIOP[]'.charAt(column)
  if (row === 2) return 'ASDFGHJKL;'.charAt(column)
  if (row === 3) return 'ZXCVBNM,./'.charAt(column)
  return '·'
}

for (const product of products) {
  for (const [index, variant] of product.variants.entries()) {
    for (const view of [0, 1]) {
      const color = variant.color
      const light = index === 1 ? '#eee6cd' : '#a2b294'
      const dark = index === 1 ? '#96917f' : '#374a3b'
      let shape = ''
      if (
        product.category === 'Keyboards' ||
        product.category === 'Barebones' ||
        product.category === 'Keycaps'
      ) {
        const rows = product.category === 'Keycaps' ? 4 : 5
        const columnCount = getColumnCount(product.id)
        const width = columnCount * 34 + 24
        const height = rows * 36 + 36
        const x = (640 - width) / 2
        const y = (440 - height) / 2
        shape = `<g transform="rotate(${view ? 0 : -12} 320 220)">
          <rect
            x="${x}"
            y="${y + 10}"
            width="${width}"
            height="${height}"
            rx="14"
            fill="#10170f" />
          <rect
            x="${x}"
            y="${y}"
            width="${width}"
            height="${height}"
            rx="14"
            fill="${color}"
            stroke="${light}"
            stroke-opacity=".4"
            stroke-width="2"
        />`
        for (let row = 0; row < rows; row++) {
          for (let column = 0; column < columnCount; column++) {
            if (row === rows - 1 && column > 3 && column < 9) continue
            const space = row === rows - 1 && column === 3
            const keyWidth = space ? 198 : 29
            const keyX = x + 14 + column * 34
            const keyY = y + 21 + row * 36
            const accent =
              (row === 0 && column === 0) || (column === columnCount - 1 && row === 2)
            const bare = product.category === 'Barebones'
            const label = getKeyLabel(row, column, bare || space)
            let keyColor = light
            if (bare) keyColor = dark
            else if (accent) keyColor = '#d1e6aa'

            const keyContent = bare
              ? `<rect
                  x="${keyX + 9}"
                  y="${keyY + 8}"
                  width="10"
                  height="10"
                  fill="#101b14"
                  rx="2"
                />`
              : `<text
                  x="${keyX + 7}"
                  y="${keyY + 12}"
                  fill="${dark}"
                  font-family="Arial"
                  font-size="7"
                  >${escapeXml(label)}</text
                >`
            shape += `<rect
                x="${keyX}"
                y="${keyY + 3}"
                width="${keyWidth}"
                height="29"
                rx="4"
                fill="${dark}"
              />
              <rect
                x="${keyX}"
                y="${keyY}"
                width="${keyWidth}"
                height="27"
                rx="4"
                fill="${keyColor}"
                stroke="#ffffff"
                stroke-opacity=".13"
              />${keyContent}`
          }
        }
        shape += '</g>'
      } else if (product.category === 'Switches') {
        shape = `<g transform="rotate(${view ? 0 : -12} 320 220)">`
        for (let row = 0; row < 3; row++) {
          for (let column = 0; column < 4; column++) {
            let x = 165 + column * 81
            let y = 102 + row * 79
            shape += `<path
                d="M${x} ${y + 12}l57 0 8 12v38h-65z"
                fill="${dark}"
              />
              <rect
                x="${x}"
                y="${y}"
                width="65"
                height="55"
                rx="8"
                fill="${color}"
                stroke="${light}"
                stroke-width="2"
              />
              <rect
                x="${x + 11}"
                y="${y + 9}"
                width="43"
                height="35"
                rx="5"
                fill="${light}"
                opacity=".5"
              />
              <path
                d="M${x + 27} ${y + 12}h11v10h10v10h-10v10h-11v-10h-10v-10h10z"
                fill="#d5e7b8"
              />`
          }
        }
        shape += '</g>'
      } else if (product.id === 'coil') {
        shape = `<g
          transform="rotate(${view ? 0 : -12} 320 220)"
          fill="none"
          stroke="${light}"
          stroke-width="13"
          stroke-linecap="round"
        >
          <path
            d="M110 240h65"
          />${Array.from({ length: 10 }, (_, i) => `<ellipse cx="${180 + i * 23}" cy="220" rx="18" ry="42" />`).join('')}<path
            d="M405 240h110"
          />
          <path d="M100 240h25M515 240h25" stroke="${color}" stroke-width="24" />
        </g>`
      } else if (product.id === 'rest') {
        shape = `<g transform="rotate(${view ? 0 : -12} 320 220)">
          <rect x="80" y="177" width="480" height="108" rx="12" fill="#443a27" />
          <rect
            x="80"
            y="167"
            width="480"
            height="105"
            rx="12"
            fill="${index ? '#b59a6d' : '#806043'}"
          />${Array.from({ length: 10 }, (_, i) => `<path d="M95 ${175 + i * 9}q140 -9 230 0t220 0" fill="none" stroke="#382d20" opacity=".2" />`).join('')}</g
        >`
      } else {
        shape = `<g transform="rotate(${view ? 0 : -12} 320 220)">
          <rect x="144" y="100" width="350" height="240" rx="18" fill="${color}" />
          <rect x="155" y="110" width="327" height="220" rx="12" fill="${dark}" />
          <path
            d="M210 270v-100q0-35 35-35t35 35v100M330 275v-110l25-18M400 275v-110"
            fill="none"
            stroke="${light}"
            stroke-width="10"
          />
          <rect x="383" y="145" width="34" height="60" rx="4" fill="#d0c8b2" />
        </g>`
      }
      const svg = `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="640"
        height="440"
        viewBox="0 0 640 440"
      >
        <title>
          ${escapeXml(product.name)} — ${escapeXml(variant.name)} — illustrative
          ${view ? 'top' : 'angled'} view
        </title>
        <defs>
          <radialGradient id="bg">
            <stop stop-color="${color}" stop-opacity=".24" />
            <stop offset="1" stop-color="#191f19" />
          </radialGradient>
          <filter id="shadow">
            <feDropShadow dx="0" dy="18" stdDeviation="15" flood-opacity=".35" />
          </filter>
        </defs>
        <rect width="640" height="440" fill="#191f19" />
        <rect width="640" height="440" fill="url(#bg)" />
        <g filter="url(#shadow)">${shape}</g>
      </svg>`
      await writeFile(
        new URL(
          `../public/images/${product.id}-${variant.id}-${view}.svg`,
          import.meta.url,
        ),
        svg,
      )
    }
  }
}

console.log(`Generated original placeholder galleries for ${products.length} products.`)
