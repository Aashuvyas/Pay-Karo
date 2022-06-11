import React, { useState, useEffect, useRef } from 'react'
import { auth, fs } from '../Config/Config'
import { useNavigate } from 'react-router-dom'
import { Icon } from 'react-icons-kit'
import { creditCard } from 'react-icons-kit/icomoon/creditCard'
import { ic_account_balance_outline } from 'react-icons-kit/md/ic_account_balance_outline'
import { ic_account_balance_wallet_outline } from 'react-icons-kit/md/ic_account_balance_wallet_outline'
import { arrowRight } from 'react-icons-kit/fa/arrowRight'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MNavbar } from '../MainComponents/MNavbar'


export const PayBills = () => {

    const history = useNavigate();

    function GetUserUid() {
        const [uid, setUid] = useState(null);
        useEffect(() => {
            auth.onAuthStateChanged(user => {
                if (user) {
                    setUid(user.uid);
                }
            })
        }, [])
        return uid;
    }

    const uid = GetUserUid();

    // getting current user function
    function GetCurrentUser() {
        const [user, setUser] = useState(null);
        useEffect(() => {
            auth.onAuthStateChanged(user => {
                if (user) {
                    fs.collection('users').doc(user.uid).get().then(snapshot => {
                        setUser(snapshot.data().FullName);
                    })
                }
                else {
                    setUser(null);
                }
            })
        }, [])
        return user;
    }

    const user = GetCurrentUser();

    //const mobileNumRef = useRef(null)

    const billamt = new Map([
        ["9490938361", 2398],
        ["280814", 3589],
        ["6281370941", 5902],
        ["987654", 6789],
        ["123456", 2689],
        ["246801", 8990],
        ["135790", 9245],
        ["654321", 5490],
        ["112233", 7146]
    ]);

    const [paymentMode, setPaymentMode] = useState(null)
    const [sources, setSources] = useState([])
    const [selectedSource, setSelectedSource] = useState(null)

    useEffect(() => {
        const user = auth.currentUser
        if (!paymentMode || !user) {
            setSources([])
            return
        }
        const arr = []
        fs.collection(`${user.uid}-${paymentMode}`).get().then((collection) => {
            collection.docs.forEach(doc => arr.push(doc))
            setSources(arr)
        }).catch(e => alert(e.message))
    }, [paymentMode])


    const promos = new Map([
        ["PAYKARO500", 500],
        ["FIRST100", 100],
        ["SUMMER1000", 1000]
    ]);

    const [Provider, setProvider] = useState('');
    const [PhoneAccountNumber, setPhoneAccountNumber] = useState('');
    const [Promocode, setPromocode] = useState(' ');
    const [Amount, setAmount] = useState(0);

    var totalBill = billamt.get(PhoneAccountNumber) - promos.get(Promocode)

    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handlePayBills = (e) => {
        e.preventDefault();
        auth.onAuthStateChanged(user => {
            fs.collection('PayBills').doc(user.uid).set({
                Provider: Provider,
                PhoneAccountNumber: PhoneAccountNumber,
                Promocode: Promocode,
                Amount: totalBill
            }).then(() => {
                setSuccessMsg("Bill is paid, You'll be redirected to Home Page!")
                fs.collection('userCardInfo').doc(user.uid).get().then((snapshot) => {
                    const userData = snapshot.data()
                    if (parseInt(userData.Amount) >= totalBill)
                        fs.collection('userCardInfo').doc(user.uid).update({ Amount: parseInt(userData.Amount) - totalBill }).then(() => {
                            toast.success("Payment done with wallet")
                        }).catch(e => toast.error(e.message))
                    else toast.error("Insufficient funds")
                }).catch(e => toast.error(e.message))
                setSuccessMsg("Your Bill is Paid! You'll be redirected to homepage");
                setProvider('');
                setPhoneAccountNumber('');
                setPromocode('');
                setAmount(0);
                setErrorMsg('');
                setTimeout(() => {
                    setSuccessMsg('');
                    setErrorMsg('');
                    history('/');
                }, 3000)
            })
        })
    }

    const payWithWalletHandler = () => {
        const user = auth.currentUser
        setPaymentMode(null)
        if (!user) return
        const amount = (billamt.get(PhoneAccountNumber)) - promos.get(Promocode)
        fs.collection('users').doc(user.uid).get().then((snapshot) => {
            const userData = snapshot.data()
            if (parseInt(userData.balance) < amount) {
                toast.error('Insufficient funds')
                return
            }
            else {
                fs.collection('users').doc(user.uid).update({ balance: parseInt(parseInt(userData.balance) - amount) })
                    .then(() => {
                        toast.success("Payment done using wallet.")
                        history('/')
                    })
                    .catch(e => toast.error(e.message))
            }
        })
    }

    const paymentHandler = () => {
        const user = auth.currentUser
        if (!user || !paymentMode) return
        const amount = (billamt.get(PhoneAccountNumber)) - promos.get(Promocode)
        const docID = selectedSource.slice(selectedSource.indexOf('-') + 1, selectedSource.length)
        fs.collection(`${user.uid}-${paymentMode}`).doc(`${docID}`).get().then((snapshot) => {
            const sourceData = snapshot.data()
            if (parseInt(sourceData.Amount) < amount) {
                toast.error('Insufficient funds')
                return
            }
            else {
                fs.collection(`${user.uid}-${paymentMode}`).doc(`${docID}`).update({ Amount: parseInt(parseInt(sourceData.Amount) - amount) })
                    .then(() => {
                        toast.success(`Payment done using ${paymentMode}.`)
                        setPaymentMode(null)
                        setSources([])
                        setSelectedSource(null)
                        history('/')
                    })
                    .catch(e => toast.error(e.message))
            }
        })
    }

    //const mobileNumberHandler = () => {
    //    const curVal = mobileNumRef.current.target.value
    //    setPhoneAccountNumber(curVal.toString())
    //}

    function getRandomArbitrary() {
        return Math.floor(Math.random() * (10000 - 3000) + 1000);
    }
    const amt = getRandomArbitrary();
    return (
        <>
            <MNavbar user={user} />
            <div className='container'>
                <br></br>
                <br></br>
                <h1>Pay Electricity Bills</h1>
                <hr></hr>
                {successMsg && <>
                    <div className='success-msg'>{successMsg}</div>
                    <br></br>
                </>}
                <form className='form-group' autoComplete="off">
                    <br></br>
                    <label>Choose Service Provider </label>
                    <select name="state" id="state" class="form-control" onChange={(e) => setProvider(e.target.value)} value={Provider}>
                        <option value="Andhra Pradesh Power Generation Corporation">Andhra Pradesh Power Generation Corporation</option>
                        <option value="Assam State Electricity Board">Assam State Electricity Board</option>
                        <option value="Bihar State Power Holding Company Limited">Bihar State Power Holding Company Limited</option>
                        <option value="Chhattisgarh State Power Generation Company Limited">Chhattisgarh State Power Generation Company Limited</option>
                        <option value="Gujarat Urja Vikas Nigam Ltd.">Gujarat Urja Vikas Nigam Ltd.</option>
                        <option value="Haryana Power Generation Corporation">Haryana Power Generation Corporation</option>
                        <option value="Delhi Electricity Regulatory Commission">Delhi Electricity Regulatory Commission</option>
                        <option value="TPDDL">TPDDL</option>
                        <option value="IPGCL">IPGCL</option>
                        <option value="Jharkhand State Electricity Board">Jharkhand State Electricity Board</option>
                        <option value="Karnataka Power Corporation Limited">Karnataka Power Corporation Limited</option>
                        <option value="Telangana Power Generation Corporation">Telangana Power Generation Corporation</option>
                    </select>
                    <br></br>
                    <label>Enter Phone Number/Account Number</label>
                    <input type="number" className='form-control' required
                        onChange={(e) => setPhoneAccountNumber(e.target.value)} value={PhoneAccountNumber}></input>
                    <br></br>
                    <label>Select a Promocode</label>
                    <select name="Promocode" id="promo" class="form-control" onChange={(e) => setPromocode(e.target.value)} value={Promocode}>
                        <option value="PAYKARO500">PAYKARO500</option>
                        <option value="FIRST100">FIRST100</option>
                        <option value="SUMMER1000">SUMMER1000</option>
                    </select>
                    <br></br>
                    <div className='summary-box'>
                        <h5>Bill Summary</h5>
                        <br></br>
                        <div>
                            Phone/Account Number: <span>{PhoneAccountNumber}</span>
                        </div>
                        <div>
                            Price to Pay: <span>₹ {billamt.get(PhoneAccountNumber)}</span>
                        </div>
                        <div>
                            Discount: <span><b>-</b>₹ {promos.get(Promocode)}</span>
                        </div>
                        <div>
                            Total Price to Pay: <span>₹ {(billamt.get(PhoneAccountNumber)) - promos.get(Promocode)}</span>
                        </div>
                        <br></br>
                        <div style={{ display: 'flex', flexFlow: 'column wrap' }} >
                            <div className='btn btn-success btn-md addMoney' onClick={() => setPaymentMode("card")} style={{ display: 'flex', width: '15vw', margin: '5px 10px', justifyContent: 'space-around' }}>
                                <Icon icon={creditCard} flex={1} size={20} />
                                <h7>Pay using card</h7>
                                <Icon icon={arrowRight} size={20} />
                            </div>
                            <div className='btn btn-success btn-md addMoney' onClick={() => setPaymentMode("bankaccount")} style={{ display: 'flex', width: '15vw', margin: '5px 10px', justifyContent: 'space-around' }}>
                                <Icon icon={ic_account_balance_outline} size={20} />
                                <h7>Pay using bank account</h7>
                                <Icon icon={arrowRight} size={20} />
                            </div>
                            <div className='btn btn-success btn-md addMoney' onClick={payWithWalletHandler} style={{ display: 'flex', width: '15vw', margin: '5px 10px', justifyContent: 'space-around' }}>
                                <Icon icon={ic_account_balance_wallet_outline} size={20} />
                                <h7>Pay using wallet</h7>
                                <Icon icon={arrowRight} size={20} />
                            </div>
                            {paymentMode && <>
                                <h5>Select a {paymentMode === "card" ? "Card" : "Bank Account"}</h5>
                                <select onChange={(e) => setSelectedSource(e.target.value)} >
                                    {sources.map(source => { return <option value={paymentMode === "card" ? `Card-${source.data().CardNumber}` : `Bank Account-${source.data().AcountNumber}`}>{paymentMode === "card" ? `Card-${source.data().CardNumber}` : `Bank Account-${source.data().AcountNumber}`}</option> })}
                                </select>
                                <div className='btn btn-success btn-md addMoney' onClick={paymentHandler} style={{ display: 'flex', width: '15vw', margin: '5px 10px', justifyContent: 'space-around' }}>
                                    {`Pay ₹${billamt.get(PhoneAccountNumber) - promos.get(Promocode)}/-`}
                                </div>
                            </>}
                        </div>
                    </div>
                </form>
                {
                    errorMsg && <>
                        <br></br>
                        <div className='error-msg'>{errorMsg}</div>
                    </>
                }
            </div >
        </>
    )
}
