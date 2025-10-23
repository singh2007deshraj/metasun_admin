"use client"


export default function QRCodeGenerator({ value, size = 200 }) {

  return (
    <div className="d-inline-block">
      <img
        src={value}
        width={size}
        height={size}
        className="border rounded"
        style={{ maxWidth: "100%", height: "auto" }}
      />
      <div className="text-center mt-2">
        <small className="text-muted">Scan with your authenticator app</small>
      </div>
    </div>
  )
}
