"use server"
import { GoogleSpreadsheet } from "google-spreadsheet";

import { JWT } from "google-auth-library";

const serviceAccountAuth = new JWT({
    email: process.env.NEXT_PUBLIC_EMAIL,
    key: process.env.NEXT_PUBLIC_API_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
})
const doc = new GoogleSpreadsheet(process.env.NEXT_PUBLIC_SHEET_ID, serviceAccountAuth)

export async function sheetAction({foR, postData=null}){
    await doc.loadInfo()
    const sheet = await doc.sheetsByIndex[0]
    const rows = await sheet.getRows()
    const allRows = []
    rows.forEach(item => {
        allRows.push(item._rawData)
    })

    const head = await sheet.headerValues

    if (foR=="event"){
        rows[postData.index].set(postData.eventName, "✔️")
        rows[postData.index].save()
        return {allRows, sucess:"OK"}
    }
    else if(foR=='qr'){
        rows[postData.index].set(postData.column, "✔️")
        rows[postData.index].save()
        return {allRows, sucess:"OK"}
    }

    return {head, allRows}
}