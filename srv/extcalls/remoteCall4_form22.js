// Backend calls of the Form 22 proxy, aligned with HMCL_TAN_MAINTENANCE (srv/extcalls/remoteCall4_tan.js).
// User rule (same as TAN): id must start with P (internal, unrestricted) or D (dealer, restricted to own Kunnr).
// The dealer's Kunnr is the user id without the leading D (TAN: Customer = id without D).
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

// P user: undefined (no restriction). D user: own Kunnr = user id without the D (as TAN does).
const dealerOf = req => {
  const user = getUser(req)
  return /^D/i.test(user) ? user.replace(/^D/i, '') : undefined
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

// Backend authorization (checkUserAuth): is_authorized gates the whole app, change_visi the Change button.
// ponytail: per-instance cache for 5 min, so a revoked user keeps access until it expires
const AUTH_TTL = 5 * 60 * 1000
const auths = new Map()
const authorize = async req => {
  const user = getUser(req).toUpperCase()
  let hit = auths.get(user)
  if (!hit || hit.until < Date.now()) {
    const service = await ext()
    const auth = await service.tx(req).send({
      method: 'POST',
      path: `ZC_ITEMDETAILS/${NS}.checkUserAuth`,
      data: { lv_user: user, is_authorized: false, change_visi: false, kunnr: '', name1: '' }
    })
    hit = { auth, until: Date.now() + AUTH_TTL }
    auths.set(user, hit)
  }
  if (!hit.auth?.is_authorized) return req.reject(403, 'Access denied: you are not authorized to use Form 22')
  return hit.auth
}

exports.read = wrap('read', async req => {
  await authorize(req)
  const service = await ext()
  const kunnr = dealerOf(req)
  if (kunnr && req.query.SELECT) {
    req.query.where(req.target.name.endsWith('ZC_ITEMDETAILS') ? { Kunnr: kunnr } : { kunnr })
  }
  return service.tx(req).run(req.query)
})

// bound actions: a dealer may only touch his own items
const bound = (tag, action, data, needsChange) => wrap(tag, async req => {
  const auth = await authorize(req)
  if (needsChange && !auth.change_visi) return req.reject(403, 'Access denied: you are not authorized to change frames')
  const service = await ext()
  const kunnr = dealerOf(req)
  const key = req.params[0]
  if (kunnr && key.Kunnr !== kunnr) return req.reject(403, 'Access denied: item belongs to another dealer')
  return service.tx(req).send({ method: 'POST', path: `${item(key)}/${NS}.${action}`, data: data(req) })
})

exports.changeFrame = bound('changeFrame', 'changeFrame', req => req.data, true)
exports.printForm = bound('printForm', 'printForm', () => ({}))

// same P/D rule + checkUserAuth as everything else; the UI shows Change only when canChange
exports.getUserInfo = wrap('getUserInfo', async req => {
  const auth = await authorize(req)
  return { userId: getUser(req), canChange: !!auth.change_visi }
})
