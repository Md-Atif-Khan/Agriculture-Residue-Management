import React, { useContext } from 'react'
// import JobContext from '../context/jobcontext/JobContext';
import DeepContext from '../context/DeepContext';
const Alert = (props) => {
    const { alert } = useContext(DeepContext);
    const capitalize = (word) => {
        if (word === undefined) {
            return '';
        }
        const lower = word.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    }
    // console.log("alert component", alert);
    return (
        <>
            {alert &&
                <div className={`alert alert-${alert.type}`} role="alert" style={{ height: '50px' }}>
                    <strong>{capitalize(alert.type)}</strong> {alert.msg}
                </div>
            }
        </>
    )
}

export default Alert