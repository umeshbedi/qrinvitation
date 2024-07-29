import { useEffect, useRef, useState } from "react";
// Qr Scanner
import QrScanner from "qr-scanner";



export default function ScanQR({isScanned=void(e=true), setData=void(e=null)}) {
    
    // QR States
    const videoEl = useRef(null);
    const qrBoxEl = useRef(null);
    const scanner = useRef();
    const [qrOn, setQrOn] = useState(true);

    useEffect(() => {
        if (videoEl?.current && !scanner.current) {
            // 👉 Instantiate the QR Scanner
            scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
                onDecodeError: onScanFail,
                // 📷 This is the camera facing mode. In mobile devices, "environment" means back camera and "user" means front camera.
                preferredCamera: "environment",
                // 🖼 This will help us position our "QrFrame.svg" so that user can only scan when qr code is put in between our QrFrame.svg.
                highlightScanRegion: true,
                // 🔥 This will produce a yellow (default color) outline around the qr code that we scan, showing a proof that our qr-scanner is scanning that qr code.
                highlightCodeOutline: true,
                // 📦 A custom div which will pair with "highlightScanRegion" option above 👆. This gives us full control over our scan region.
                overlay: qrBoxEl?.current || undefined,
            });

            // 🚀 Start QR Scanner
            scanner?.current
                ?.start()
                .then(() => setQrOn(true))
                .catch((err) => {
                    if (err) setQrOn(false);
                });
        }

        // 🧹 Clean up on unmount.
        // 🚨 This removes the QR Scanner from rendering and using camera when it is closed or removed from the UI.
        return () => {
            if (!videoEl?.current) {
                scanner?.current?.stop();
            }
        };
    }, []);

      // ❌ If "camera" is not allowed in browser permissions, show an alert.
  useEffect(() => {
    if (!qrOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
  }, [qrOn]);

    // Success
    const onScanSuccess = (result) => {
        // 🖨 Print the "result" to browser console.
        // console.log(result.data);
        // ✅ Handle success.
        // 😎 You can do whatever you want with the scanned result.
        setData(result.data);
        isScanned(false)
    };

    // Fail
    const onScanFail = (err) => {
        // 🖨 Print the "err" to browser console.
        console.log(err);
    };

    return (
        <div>
            <div className="qr-reader">
                {/* QR */}
                <video ref={videoEl}></video>
                <div ref={qrBoxEl} className="qr-box">
                    <img
                        src={"qr-frame.svg"}
                        alt="Qr Frame"
                        width={256}
                        height={256}
                        className="qr-frame"
                    />
                </div>
            </div>

            
        </div>
    )

}
