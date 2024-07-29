"use client"

import { useEffect, useState } from "react";

import { sheetAction } from "./GetData";
import QRcode from "./QRcode";
import ScanQR from "./ScanQR";
import { eventCode } from "./event";

export default function Home() {

  const [column, setColumn] = useState([])
  const [row, setRow] = useState([])
  const [rowIndex, setrowIndex] = useState(-1)
  const [qrData, setQrData] = useState(null)
  const [isScan, setIsScan] = useState(false)
  const [forEvent, setForEvent] = useState('')
  const [eventName, setEventName] = useState(null)

  function callSheetAction(foR, data) {
    sheetAction({ foR: foR, postData: data })
      .then(data => {
        foR == 'get' ? setColumn(data.head) : alert("Successfully Done!")
        setRow(data.allRows)
        console.log(data)
      })
      .catch(e => console.log(e))
  }

  function updateEvent(data) {
    const dget = JSON.parse(data)
    if (dget.eventID == undefined && dget.eventID != 'ELGLD001') return alert("Wrong QR Code")

    const columnIndex = column.findIndex(f => f == eventName)
    const index = row.findIndex(i => i[0] == dget.data[0])

    if (row[index][columnIndex] == "❌") {
      callSheetAction('event', { index, eventName })
    } else {
      alert(`Already Scanned for ${eventName}\n
      Name: ${row[index][1]}\n
      Firm Name: ${row[index][2]}\n
      Mobile: ${row[index][3]}
      `)
    }

    // console.log(index)
  }


  function checkEvent() {
    const check = eventCode.find(f => f.code == forEvent)
    if (check == undefined) {
      alert("Wrong Event ID")
    } else {
      setEventName(check.name)
      setIsScan(true)
    }

  }


  useEffect(() => {
    return () => callSheetAction('get')
  }, [])


  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between">
      {!isScan &&

        <div>
          <h1>Table</h1>
          {column.length == 0
            ?
            (<>loading table...</>)
            :
            (
              <table>
                <tbody>
                  <tr>
                    {column.map((item, i) => (
                      <th key={i}>{item}</th>
                    ))}
                    <th>Action</th>
                  </tr>
                  {row.map((item, i) => (
                    <tr key={i}>
                      {item.map((itm, j) => (
                        <td key={j}>{itm}</td>
                      ))}
                      <td>
                        <button className='bg-green-600 text-white p-1' onClick={() => { setQrData(item); setrowIndex(i) }}>generate QR</button>
                      </td>

                    </tr>
                  ))}

                </tbody>
              </table>
            )
          }
          
          {/* <button onClick={checkFilter}>check filter</button> */}
          {qrData != null && <QRcode data={JSON.stringify(qrData)} rowIndex={rowIndex} isGenerated={(data) => setRow(data.allRows)} />}



        </div>
      }

      {isScan && <ScanQR isScanned={(e) => setIsScan(e)} setData={(e) => updateEvent(e)} />}

      <div className="fixed bottom-7 bg-white p-2 rounded-full shadow-md">
        {eventName == null &&
          <input type="text" name="" id="" placeholder="Enter Event ID" className=" pl-4 w-[150px] active:border-0" onBlur={(e) => setForEvent(e.target.value)} />
        }
        <button
          className={`${isScan ? 'bg-red-600' : 'bg-teal-900'} text-white py-3 px-5 rounded-full`}
          onClick={isScan ? () => setIsScan(false) : checkEvent}>
          {isScan ? 'Cancel' : 'Scan QR'} {eventName != null ? `for ${eventName}` : null}
        </button>
      </div>
    </main>
  );
}
