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
| `getUserInfo()` | Function | Returns `{ userId }` of the logged-in user |

Backend base path (destination `BAS`):
`/sap/opu/odata4/sap/zsrv_itemdetails_v4/srvd/sap/zsb_itemdetails/0001/`

## User rules

- User ID must start with **P** (internal, sees everything) or **D** (dealer). Anything else gets `403`.
- **D users** are limited to the Kunnr = user ID without the leading `D` (same as TAN Maintenance):
  - reads are filtered to that Kunnr,
  - `changeFrame` / `printForm` on another dealer's item return `403`.
- No token means `401`.

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

Login is always XSUAA, there are no mock users or mock data. To run against the real services, bind them first:

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
