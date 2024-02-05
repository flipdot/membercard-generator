import { readFileSync } from 'node:fs'

import { jsPDF as JsPDF } from 'jspdf'
import Symbology from 'symbology' // eslint-disable-line import/default
import SymbologyType from 'symbology/dist/types/enums/SymbologyType'

const { createStream, EncodingMode, OutputType } = Symbology

// ISO standardised size of ID card
const width = 85.6
const height = 53.98

const logoPath = 'server/api/assets/images/flipdot.png'
const fontPath = 'server/api/assets/fonts/ISOCPEUR.ttf'

const blackHex = '#000000'
const yellowHex = '#F5C600'

// Some fine tuned constants to make the layout work
const codeHeight = 0.075 * height // how big the barcode is
const scale = 0.875 // ratio of canvas without padding to card size
const logoScale = 0.67 // ratio of flipdot logo to card size
const padding = (width * (1 - scale)) / 2
const logoPaddingX = (width * (1 - logoScale)) / 2
const logoPaddingY = ((height - codeHeight - padding) * (1 - logoScale)) / 3

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const paybackCode =
    runtimeConfig.public.flipdot.memberCardGenerator.paybackCode

  const username = getQuery(event).username
  if (!username) throw new Error('no username given')
  if (typeof username !== 'string')
    throw new Error('username must be of type string')

  // Get image data as base64-string-encoded png
  const flipdotLogo = readFileSync(logoPath, { encoding: 'base64' })
  const paybackCodeImage = await encodeStringToPNG(
    paybackCode,
    SymbologyType.EANX,
  )
  const nameCodeImage = await encodeStringToPNG(username, SymbologyType.CODE128)

  // Create PDF-builder
  const doc = initializePDF(width, height, fontPath, yellowHex, blackHex)

  if (username.length > 10) {
    // dynamic font-size for very long names
    doc.setFontSize(Math.floor(420 / username.length))
  }

  // Add content to PDF-builder
  generateLogoPage(doc, flipdotLogo, paybackCodeImage)
  doc.addPage()
  generateUsernamePage(doc, username, nameCodeImage)

  return doc.output('blob')
})

// Generates a barcode png from a given string `str`
// The barcode ia returned as a base64-encoded string
const encodeStringToPNG = async (str: string, enc: SymbologyType) => {
  const { data } = await createStream(
    {
      symbology: enc,
      scale: 5,
      encoding: EncodingMode.UNICODE_MODE,
      backgroundColor: 'F5C600FF',
      showHumanReadableText: false,
      whitespaceWidth: 6,
    },
    str,
    OutputType.PNG,
  )
  return data
}

const initializePDF = (
  width: number,
  height: number,
  fontPath: string,
  fgcolor: string,
  bgcolor: string,
) => {
  const doc = new JsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [width, height],
  })
  const font = readFileSync(fontPath, { encoding: 'base64' })
  doc.addFileToVFS(font, font)
  doc.addFont(font, 'MYFONT', 'normal')
  doc.setFont('MYFONT')
  doc.setFontSize(32)
  doc.setFillColor(bgcolor)
  doc.setTextColor(fgcolor)
  return doc
}

const generateLogoPage = (doc: JsPDF, logo: string, code?: string) => {
  if (!code) throw new Error('code is undefined')

  doc.rect(0, 0, width, height, 'F')

  doc.addImage(
    logo,
    'PNG',
    logoPaddingX,
    logoPaddingY,
    width * logoScale,
    height * logoScale,
    '',
    'NONE',
    0,
  )

  doc.addImage(
    code,
    'PNG',
    padding,
    height - (codeHeight + padding),
    width - 2 * padding,
    codeHeight,
    '',
    'NONE',
    0,
  )
}

const generateUsernamePage = (doc: JsPDF, username: string, code?: string) => {
  if (!code) throw new Error('QR code is undefined')

  doc.rect(0, 0, width, height, 'F')

  doc.text(username, width / 2, height / 3, {
    align: 'center',
    baseline: 'middle',
  })

  doc.addImage(
    code,
    'PNG',
    padding,
    (height * 2) / 3 - codeHeight / 2,
    width - 2 * padding,
    codeHeight,
    '',
    'NONE',
    0,
  )
}
