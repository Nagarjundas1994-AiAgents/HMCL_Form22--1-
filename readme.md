# HMCL Form 22

SAP CAP (Node.js, CommonJS) proxy + SAPUI5 app for printing Form 22 and changing frame/engine numbers.
The app stores no data of its own: every call is forwarded to the S/4 OData V4 service `ZSB_ITEMDETAILS0001`
through the `BAS` destination. Same setup as **HMCL_TAN_MAINTENANCE**.

## Project layout

| Path | Purpose |
|---|---|
| `srv/form22Service.cds` | Exposed service `zform22Service` at `/odata/v4/zform22` (login required) |
| `srv/form22Service.js` | Registers the handlers |
| `srv/extcalls/remoteCall4_form22.js` | All backend calls + user/dealer checks |
| `srv/external/ZSB_ITEMDETAILS0001.*` | Imported backend metadata |
| `app/form22ui/` | SAPUI5 app (`hmcl.form22ui`), routes in `xs-app.json` |
| `mta.yaml` | Cloud Foundry deployment descriptor |
| `xs-security.json` | XSUAA config (`hmcl_form22`) |

## API

Service path: `/odata/v4/zform22`

| Operation | Type | Backend call |
|---|---|---|
| `ZC_ITEMDETAILS` | Read | Vehicles of an invoice (Kunnr, invoice, frameno, engineno, status, model, message) |
| `ZI_OVS_VH` | Read | Dealer value help |
| `ZI_OVS_INVOICE_VH` | Read | Invoice value help |
| `ZI_OVS_ENGINE_VH` | Read | Free frame/engine value help |
| `ZC_ITEMDETAILS(...)/zform22Service.changeFrame` | Bound action | `changeFrame(matnr, frameno_in, engineno_in)` |
| `ZC_ITEMDETAILS(...)/zform22Service.printForm` | Bound action | Returns the Form 22 PDF (`ZA_PDF`) |
| `getUserInfo()` | Function | Returns `{ userId, canChange }` of the logged-in user (403 if not authorized) |

Backend base path (destination `BAS`):
`/sap/opu/odata4/sap/zsrv_itemdetails_v4/srvd/sap/zsb_itemdetails/0001/`

## User rules

- User ID must start with **P** (internal, sees everything) or **D** (dealer). Anything else gets `403`.
- **D users** are limited to the Kunnr = user ID without the leading `D` (same as TAN Maintenance):
  - reads are filtered to that Kunnr,
  - `changeFrame` / `printForm` on another dealer's item return `403`.
- No token means `401`.
- Every read and action also calls the backend action `checkUserAuth` (cached 5 min per user):
  `is_authorized = false` gives `403` everywhere, `change_visi = false` gives `403` on `changeFrame`
  and hides the Change button.

## Prerequisites (BTP subaccount / CF space)

- Destination **`BAS`** pointing to the S/4 system (plus Cloud Connector if on-premise).
- Entitlements: `xsuaa` (application), `destination` (lite), `connectivity` (lite), `html5-apps-repo` (app-host).
- No HANA needed.
- Node.js 24 buildpack (`@sap/cds` 10).

## Build and deploy

Run in SAP Business Application Studio (`mbt` needs GNU `make`):

```bash
cf login -a <api-endpoint>
npm ci
npm run build      # creates mta_archives/archive.mtar
npm run deploy     # cf deploy mta_archives/archive.mtar
```

Undeploy (deletes services too): `npm run undeploy`

## Running locally

### Front end with dummy users and data (no BTP, no S/4)

```bash
npm run watch:local          # or: npx cds watch --profile local --port 4005
```

Open the launchpad sandbox <http://localhost:4004/hmcl.form22ui/test/flp.html#app-preview>
or the plain app <http://localhost:4004/hmcl.form22ui/index.html>. The browser asks for a login: any user name works,
the password is ignored. Use a private window per user to switch users.
Not `preview.html`: that Fiori tools variants editor assumes the app is served at `/` and cannot load it under `/hmcl.form22ui/`.

| User | What it tests |
|---|---|
| `P09812` | internal user, may change frames |
| `P00001` | internal user, no Change button (`change_visi = false`) |
| `D1001` | dealer 1001: dealer code locked, sees only his invoices |
| `P99999` | `is_authorized = false`: "No Access" page |
| any other `P…`/`D…` | authorized; Change only for `P…` |
| anything else | rejected by the P/D rule |

Test data (dealer / invoice / VIN): `1001 / 4647347 / MBLHAW220P4B15723` (pending), `1001 / 4647347 / MBLHAW220P4B15724` (printed),
`1001 / 4647348 / MBLJAR031P9C00418`, `1002 / 5550001 / MBLHAR073P5D01234`. Change Frame can switch to the free frames
`MBLHAW220P4B15799` (invoice 4647347) and `MBLJAR031P9C00499` (invoice 4647348).
Data lives in memory in [test/mock-backend.js](test/mock-backend.js): restart to reset printed statuses and changed frames.
The profile swaps the S/4 service for that mock and [server.js](server.js) strips the `/srv-api` prefix the approuter normally removes.

### Against the real services

To run against the real services, bind them first:

```bash
cds bind --to hmcl_Form22-xsuaa-service,hmcl_Form22-destination-service,hmcl_Form22-connectivity
cds watch --profile hybrid
```

Requests then need a valid XSUAA token.

## Sample backend response

`GET .../ZC_ITEMDETAILS?$filter=Kunnr eq '0000000001' and invoice eq '0004647347' and frameno eq 'MBLHAW220P4B15723'`

```json
{
  "value": [{
    "Kunnr": "1", "invoice": "4647347",
    "frameno": "MBLHAW220P4B15723", "engineno": "HA11E7P4B20272",
    "status": "Pending for Printing", "model": "ELECTRIC SC ACPC",
    "msg_flag": "", "message_text": ""
  }]
}
```

When nothing matches, the backend returns one empty row with `message_text` set, e.g.
*"No records found for the Dealer code and Invoice Number. Please check the invoice has a valid form22 printing models"*.
