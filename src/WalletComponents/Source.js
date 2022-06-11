
import React, { useState } from 'react'
import './sources.css'
import { auth, fs } from '../Config/Config'
import { Icon } from 'react-icons-kit'
import { eye } from 'react-icons-kit/icomoon/eye'
import { eyeBlocked } from 'react-icons-kit/icomoon/eyeBlocked'
import { bin } from 'react-icons-kit/icomoon/bin'
import { toast } from 'react-toastify'

function Source({ type, source, sources, setSources }) {
    const [display, setDisplay] = useState(false)

    const unlinkSourceHandler = () => {
        const user = auth.currentUser
        if (!user) return
        if (!window.confirm("Are you sure to unlink this account?")) return
        const collection = `${user.uid}${type ? "-bankaccount" : "-card"}`
        const docID = type ? source.data().AcountNumber : source.data().CardNumber
        fs.collection(collection).doc(docID).get().then((doc) => console.log(doc.data()))
        fs.collection(collection).doc(docID).delete().then(() => {
            toast.success("Successfully unliked the source")
            const arr = [...sources]
            arr.filter(curSource => type ? curSource.data().CardNumber !== source.data().CardNumber :
                curSource.data().AcountNumber !== source.data().AcountNumber)
            console.log(arr);
            setSources(arr)
        }).catch(e => toast.error(e.message))
    }

    return (
        <div className='displayContainers'>
            <div className='amountDisplayDiv'>
                <h3>{type ? `Account Number: ${source.data().AcountNumber}` : `Card Number: ${source.data().CardNumber}`}</h3>
                <Icon icon={bin} onClick={unlinkSourceHandler} size={20} />
            </div>
            <h3>{type ? `Account Holder: ${source.data().NameofAccountHolder}` : `Expiry Date: ${source.data().ExpiryDate}`}</h3>
            <h3>{type ? `IFSC Code: ${source.data().IFSC}` : `CVV: ${source.data().CVV}`}</h3>
            <div className='amountDisplayDiv'>
                <h3>Balance: <span style={{ fontFamily: 'Arial' }}>&#8377;</span>{display ? `${source.data().Amount}/-` : '---'}</h3>
                <Icon icon={display ? eyeBlocked : eye} onClick={() => setDisplay(!display)} size={20} />
            </div>
        </div>
    )
}

export default Source