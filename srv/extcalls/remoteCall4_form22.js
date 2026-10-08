// Backend calls of the Form 22 proxy, aligned with HMCL_TAN_MAINTENANCE (srv/extcalls/remoteCall4_tan.js).
// User rule (same as TAN): id must start with P (internal, unrestricted) or D (dealer, restricted to own Kunnr).
// The dealer's Kunnr comes from the backend's checkUserAuth action.
const cds = require('@sap/cds')

const NS = 'com.sap.gateway.srvd.zsb_itemdetails.v0001'
const ext = () => cds.connect.to('ZSB_ITEMDETAILS0001')
const q = v => String(v).replace(/'/g, "''")
const item = k => `ZC_ITEMDETAILS(Kunnr='${q(k.Kunnr)}',invoice='${q(k.invoice)}',frameno='${q(k.frameno)}',engineno='${q(k.engineno)}')`

const getUser = req => {
  const user = req.user?.attr?.logonName || req.user?.name || req.user?.id
  if (!user || !/^[PD]/i.test(user)) return req.reject(403, 'Access denied: User is not recognized as a valid ID')
  return user
}

const auth = (service, req, lv_user) => service.tx(req).send({
  method: 'POST', path: `ZC_ITEMDETAILS/${NS}.checkUserAuth`,
  data: { is_authorized: false, change_visi: false, kunnr: '', name1: '', lv_user }
})

// P user: undefined (no restriction). D user: the Kunnr the backend assigns, or 403.
const dealerOf = async (service, req) => {
  const user = getUser(req)
  if (!/^D/i.test(user)) return undefined
  const res = await auth(service, req, user)
  if (!res?.is_authorized || !res.kunnr) return req.reject(403, 'Access denied: User is not authorized for any dealer')
  return res.kunnr
}

const wrap = (tag, fn) => async req => {
  try {
    return await fn(req)
  } catch (error) {
    cds.log('form22').error(`[FORM22:${tag}] Execution failed: `, error.message)
    const s = error.status || error.statusCode || error.code // keep 403s from the user check
    return req.reject(Number.isInteger(s) && s >= 400 && s < 600 ? s : 400, error.message)
  }
}

exports.read = wrap('read', async req => {
  const service = await ext()
  const kunnr = await dealerOf(service, req)
  if (kunnr && req.query.SELECT) {
    req.query.where(req.target.name.endsWith('ZC_ITEMDETAILS') ? { Kunnr: kunnr } : { kunnr })
  }
  return service.tx(req).run(req.query)
})

// bound actions: a dealer may only touch his own items
const bound = (tag, action, data) => wrap(tag, async req => {
  const service = await ext()
  const kunnr = await dealerOf(service, req)
  const key = req.params[0]
  if (kunnr && key.Kunnr !== kunnr) return req.reject(403, 'Access denied: item belongs to another dealer')
  return service.tx(req).send({ method: 'POST', path: `${item(key)}/${NS}.${action}`, data: data(req) })
})

exports.changeFrame = bound('changeFrame', 'changeFrame', req => req.data)
exports.printForm = bound('printForm', 'printForm', () => ({}))

// the user always comes from the logged-in session, never from the client (the request body is not forwarded)
exports.checkUserAuth = wrap('checkUserAuth', async req => auth(await ext(), req, getUser(req)))

exports.getUserInfo = wrap('getUserInfo', async req => ({ userId: getUser(req) }))
