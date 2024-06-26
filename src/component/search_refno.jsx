import React, { useState, useRef, useEffect} from 'react';
import Sidebar from './sidebar';
import { endpoint, bankName, statusName, formatDate} from '../js/utils';
import MiciLogo from '../assets/mici_logo.svg'
import { useNavigate } from 'react-router-dom';

function SearchRefNo() {
    const navigate = useNavigate();
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [errorRefNo, setErrorRefNo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [refNoFormData, setRefNoFormData] = useState({
        refNo: ''
    });
    const handleRefNoFormDataChange = (e) => {
        const { name, value } = e.target;
        setRefNoFormData({
            ...refNoFormData,
            [name]: value.toUpperCase()
        });
        setErrorRefNo(null);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(refNoFormData.refNo) {
            proceedRefNoSearch();
        }
    };
    const proceedRefNoSearch = async () =>  {
        try {
            setLoading(true);
            const response = await fetch(`${endpoint()}/payment/getStatByRefNo/${refNoFormData.refNo}`, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if(data.isExist) {
                setPaymentDetails(data.paymentDetails);
                console.log(data.paymentDetails);
                console.log(paymentDetails);
                setErrorRefNo(false);
            } else {
                setPaymentDetails(null);
                setErrorRefNo(true);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };
    const formatTextWithLineBreaks = (text) => {
        return text.split(';').map((item, index) => (
            <span key={index}>
                {item}
                <br />
            </span>
        ));
    }
    return(
        <div className="main-container">
            
            <Sidebar isContainerVisible={isSidebarVisible} onClose={()=>setSidebarVisible(false)}/>

            <div className="right-container">
                <div className="action-container2">
                    <div className="back-container2">
                        <img src={MiciLogo} alt=""/>
                        <span>MICI Online Payment</span>
                    </div>
                    <i className="bi bi-list ico-btn" onClick={()=>setSidebarVisible(!isSidebarVisible)}/>
                </div>

                <div className="note-box">
                    <p className="note-title">Where to get my Reference No?</p>
                    <p>After completing a payment transaction, a reference number will be emailed to the client. 
                        This reference number is used to verify the payment status.</p>
                </div>

                <div className="card mt-4">
                    <div className="space-between">
                        <span className="card-title mb-2">Enter your Reference No.:</span>
                    </div>
                    <div>
                        <input type="text" className="form-control text-center" name="refNo" value={refNoFormData.refNo} onChange={handleRefNoFormDataChange} maxLength={10} required/>
                    </div>
                    <div className="text-center mt-3">
                        <button type="button" className="btn btn-success btn-w" onClick={handleSubmit}>
                            {loading ? <><i className="spinner-border spinner-border-sm"></i> Checking...</> : <><i className="bi bi-search"></i> View Status</>}
                        </button>
                    </div>
                </div>
                
                {paymentDetails && (
                    <>
                    <div className='divider'></div>
                    <div className="card">
                        <table className='ref-table'>
                            <tbody>
                                <tr className="tr-even">
                                    <td className='w-30'>Status</td>
                                    <td>{statusName(paymentDetails.Status)}</td>
                                </tr>
                                <tr>
                                    <td>Reference No.</td>
                                    <td>{paymentDetails.RefNo}</td>
                                </tr>
                                <tr className="tr-even">
                                    <td>Transaction ID</td>
                                    <td>{paymentDetails.TxnId}</td>
                                </tr>
                                <tr>
                                    <td>Payment Method</td>
                                    <td>{bankName(paymentDetails.ProcId)}</td>
                                </tr>
                                <tr className="tr-even">
                                    <td>Amount Paid</td>
                                    <td>{paymentDetails.Currency} {paymentDetails.Amount}</td>
                                </tr>
                                <tr>
                                    <td>Settle Date</td>
                                    <td>{formatDate(paymentDetails.SettleDate)}</td>
                                </tr>
                                <tr className='tr-even align-left-top'>
                                    <td>Description</td>
                                    <td>{formatTextWithLineBreaks(paymentDetails.Description)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    </>
                )}

                {errorRefNo && (
                    <div className="text-center">
                        <span className="text-error">(Reference No. not found!)</span>
                    </div>
                )}

            </div>
        </div>
    )
}

export default SearchRefNo