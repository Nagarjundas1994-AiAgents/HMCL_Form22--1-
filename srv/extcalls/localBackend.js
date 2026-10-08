// Local stand-in for the ABAP backend, used only with `npm run watch-mock` (profile "mock"). Ignores filters.
const frames = [{ Kunnr: '11685', invoice: '117446714', frameno: 'MBLJFN438SGG00008', engineno: 'JF17EYSGG00008', status: 'Not Printed', model: 'HDESHDRLMFINRD', msg_flag: '', message_text: '' }]
const tables = {
  ZC_ITEMDETAILS: frames,
  ZI_OVS_VH: [{ kunnr: '11685', name1: 'Mock Dealer', ort01: 'Pune' }],
  ZI_OVS_INVOICE_VH: [{ invoice: '117446714', dt1: '2026-01-15', kunnr: '11685' }],
  ZI_OVS_ENGINE_VH: [{ frameno: 'MBLJFN439SGG00009', engineno: 'JF17EYSGF00009', kunnr: '11685', invoice: '117446714', matnr: 'HDESHDRLMFINRD' }]
}

export default {
  tx: () => ({
    run: async query => tables[Object.keys(tables).reverse().find(t => JSON.stringify(query.SELECT.from).includes(t))] ?? [],
    send: async ({ path, data }) => {
      if (path.endsWith('checkUserAuth')) {
        const dealer = /^D/i.test(data.lv_user)
        return { is_authorized: true, change_visi: true, kunnr: dealer ? '11685' : '', name1: dealer ? 'Mock Dealer' : '' }
      }
      if (path.endsWith('changeFrame')) return { ...frames[0], frameno: data.frameno_in, engineno: data.engineno_in }
      return { filename: 'Form22.pdf', invoice: '117446714', mime_type: 'application/pdf', pdf: '' }
    }
  })
}
