import React from 'react'
import QRCode from 'react-qr-code'
import html2canvas from 'html2canvas';
import { sheetAction } from './GetData';

export default function QRcode({ data, rowIndex, isGenerated = void (e) }) {
    const dNew = JSON.parse(data)

    const data2generate = { eventID: 'ELGLD001', data: dNew.slice(0, 4) }

    function downloadQRCode() {
        const qrCodeElement = document.getElementById('qr-code'); // Assuming the QR code has an id of 'qr-code'
        html2canvas(qrCodeElement)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = `${dNew[1]} | ${dNew[2]}.png`;
                link.href = imgData;
                link.click();
                sheetAction({ foR: "qr", postData: { index: rowIndex, column: "QR_generated" } }).then(e => isGenerated(e))
            })
            .catch((error) => {
                console.error('Error generating QR code image:', error);
            });
    }


    return (
        <>
            <div className='bg-white p-3 w-fit' id='qr-code'>
                <QRCode
                    value={JSON.stringify(data2generate)}
                    size={350}
                    level='H'
                />
                <p className=' text-center'>{dNew[1]} | {dNew[2]}</p>
            </div>
            <button className='bg-orange-600 text-white p-2' onClick={downloadQRCode}>Download QR Code</button>
        </>
    )
}
