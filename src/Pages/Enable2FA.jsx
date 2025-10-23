import React, { useState } from "react";
import axios from "axios";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { base_url } from "../config";
import { getToken } from "../api";
import TwoFactorAuth from "./TwoFactorAuth";

function Enable2FA() {
  return (
    <TwoFactorAuth />
    // <div className="container mt-4">
    //   <button className="btn btn-primary" onClick={handleEnable2FA}>
    //     Enable 2FA
    //   </button>

    //   {/* Modal */}
    //   {showModal && (
    //     <div
    //       className="modal d-block"
    //       tabIndex="-1"
    //       style={{ background: "rgba(0,0,0,0.5)" }}
    //     >
    //       <div className="modal-dialog modal-dialog-centered">
    //         <div className="modal-content">
    //           <div className="modal-header">
    //             <h5 className="modal-title">Scan QR to Enable 2FA</h5>
    //             <button
    //               type="button"
    //               className="btn-close"
    //               onClick={() => setShowModal(false)}
    //             />
    //           </div>
    //           <div className="modal-body text-center">
    //             <img src={qrCodeUrl} alt="QR Code" className="img-fluid mb-3" />
    //             <div className="input-group">
    //               <input
    //                 type="text"
    //                 className="form-control"
    //                 value={secret}
    //                 readOnly
    //               />
    //               <CopyToClipboard
    //                 text={secret}
    //                 onCopy={() => {
    //                   setCopied(true);
    //                   setTimeout(() => setCopied(false), 2000);
    //                 }}
    //               >
    //                 <button className="btn btn-outline-secondary" type="button">
    //                   {copied ? "Copied!" : "Copy"}
    //                 </button>
    //               </CopyToClipboard>
    //             </div>
    //           </div>
    //           <div className="modal-footer">
    //             <button
    //               className="btn btn-danger"
    //               onClick={() => setShowModal(false)}
    //             >
    //               Close
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>
  );
}

export default Enable2FA;
