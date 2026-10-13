// Stand-in for the S/4 service ZSB_ITEMDETAILS0001, used only by `npm run watch:local` (cds profile "local").
// Implements just what srv/extcalls/remoteCall4_form22.js calls: tx(req).run(SELECT) and tx(req).send({ path, data }).
// Data lives in memory: restart the server to get it back to the start state.
const cds = require('@sap/cds')

const DEALERS = [
  { kunnr: '1001', name1: 'Hero Motors Delhi', ort01: 'New Delhi' },
  { kunnr: '1002', name1: 'Speed Wheels Mumbai', ort01: 'Mumbai' }
]
const INVOICES = [
  { invoice: '4647347', dt1: '2026-10-01', kunnr: '1001' },
  { invoice: '4647348', dt1: '2026-10-05', kunnr: '1001' },
  { invoice: '5550001', dt1: '2026-09-20', kunnr: '1002' }
]
const item = (Kunnr, invoice, frameno, engineno, model, status = 'Pending for Printing') =>
  ({ Kunnr, invoice, frameno, engineno, model, status, msg_flag: '', message_text: '' })
const ITEMS = [
  item('1001', '4647347', 'MBLHAW220P4B15723', 'HA11E7P4B20272', 'ELECTRIC SC ACPC'),
  item('1001', '4647347', 'MBLHAW220P4B15724', 'HA11E7P4B20273', 'ELECTRIC SC ACPC', 'Printed'),
  item('1001', '4647348', 'MBLJAR031P9C00418', 'JA05EFP9C00511', 'SPLENDOR PLUS'),
  item('1002', '5550001', 'MBLHAR073P5D01234', 'HA10AGP5D04321', 'PASSION PRO')
]
// frames of an invoice that are not on Form 22: what Change Frame can switch to
const FREE = [
  { kunnr: '1001', invoice: '4647347', frameno: 'MBLHAW220P4B15799', engineno: 'HA11E7P4B20299', matnr: 'ELECTRIC SC ACPC' },
  { kunnr: '1001', invoice: '4647348', frameno: 'MBLJAR031P9C00499', engineno: 'JA05EFP9C00599', matnr: 'SPLENDOR PLUS' }
]
const SETS = {
  ZC_ITEMDETAILS: () => ITEMS,
  ZI_OVS_VH: () => DEALERS,
  ZI_OVS_INVOICE_VH: () => INVOICES,
  ZI_OVS_ENGINE_VH: () => ITEMS
    .map(i => ({ kunnr: i.Kunnr, invoice: i.invoice, frameno: i.frameno, engineno: i.engineno, matnr: i.model }))
    .concat(FREE)
}

const fail = (status, message) => { throw Object.assign(new Error(message), { status }) }

// tiny CQN where -> predicate, enough for the filters the UI sends (=, !=, contains, and/or, parentheses)
const OPS = { '=': '===', '!=': '!==', '<>': '!==', and: '&&', or: '||', not: '!' }
const js = xs => xs.map(x =>
  typeof x === 'string' ? OPS[x.toLowerCase()] ?? fail(501, `mock backend: operator ${x} not supported`)
  : x.ref ? `r[${JSON.stringify(x.ref.at(-1))}]`
  : 'val' in x ? JSON.stringify(x.val)
  : x.xpr ? `(${js(x.xpr)})`
  : x.func === 'contains' ? `String(${js([x.args[0]])}).includes(${js([x.args[1]])})`
  : fail(501, `mock backend: filter ${JSON.stringify(x)} not supported`)
).join(' ')
const matches = where => where?.length ? new Function('r', `return ${js(where)}`) : () => true

// one-page PDF showing the given lines
const pdf = lines => {
  const text = lines.map((l, i) => `BT /F1 ${i ? 12 : 20} Tf 72 ${760 - i * 28} Td (${l.replace(/[()\\]/g, '\\$&')}) Tj ET`).join('\n')
  const objs = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${text.length} >>\nstream\n${text}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'
  ]
  let out = '%PDF-1.4\n'
  const offsets = objs.map((o, i) => { const at = out.length; out += `${i + 1} 0 obj\n${o}\nendobj\n`; return at })
  const xref = out.length
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + offsets.map(o => `${String(o).padStart(10, '0')} 00000 n \n`).join('')
  out += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`
  return Buffer.from(out, 'latin1')
}

module.exports = class MockBackend extends cds.Service {
  tx () { return this }

  async run (query) {
    const { from, where, limit, one, count } = query.SELECT
    const [target] = from.ref
    const name = (target.id || target).split('.').pop()
    let rows = SETS[name]().filter(matches(target.where)).filter(matches(where))
    // like the real backend: "no records" is one empty row carrying message_text
    if (name === 'ZC_ITEMDETAILS' && !rows.length) rows = [{
      ...item('', '', '', '', '', ''),
      message_text: 'No records found for the Dealer code and Invoice Number. Please check the invoice has a valid form22 printing models'
    }]
    if (one) return rows[0]
    const offset = limit?.offset?.val ?? 0
    const result = rows.slice(offset, limit?.rows ? offset + limit.rows.val : undefined).map(r => ({ ...r }))
    if (count) result.$count = rows.length
    return result
  }

  async send ({ path, data }) {
    const action = path.split('.').pop()
    const key = Object.fromEntries([...path.matchAll(/(\w+)='((?:[^']|'')*)'/g)].map(([, k, v]) => [k, v.replace(/''/g, "'")]))
    const it = ITEMS.find(i => ['Kunnr', 'invoice', 'frameno', 'engineno'].every(k => i[k] === key[k]))
      ?? fail(404, `Frame ${key.frameno} not found`)
    if (action === 'printForm') {
      if (it.status === 'Printed') fail(400, `Form 22 was already printed for frame ${it.frameno}`)
      it.status = 'Printed'
      const content = pdf(['FORM 22 (TEST PRINT)', `Dealer: ${it.Kunnr}`, `Invoice: ${it.invoice}`,
        `Model: ${it.model}`, `Frame No.: ${it.frameno}`, `Engine No.: ${it.engineno}`])
      return { filename: `Form22_${it.frameno}.pdf`, invoice: it.invoice, mime_type: 'application/pdf', pdf_content: content.toString('base64url') }
    }
    if (action === 'changeFrame') {
      const i = FREE.findIndex(f => f.frameno === data.frameno_in && f.invoice === it.invoice)
      if (i < 0) fail(400, `Frame ${data.frameno_in} is not available for invoice ${it.invoice}`)
      const [next] = FREE.splice(i, 1)
      FREE.push({ kunnr: it.Kunnr, invoice: it.invoice, frameno: it.frameno, engineno: it.engineno, matnr: it.model })
      Object.assign(it, { frameno: next.frameno, engineno: next.engineno })
      return { ...it }
    }
    fail(501, `mock backend: ${action} not supported`)
  }
}
