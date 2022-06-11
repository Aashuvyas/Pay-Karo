import React, { useState, useEffect } from 'react'
import { auth, fs } from '../Config/Config'
import { Link } from 'react-router-dom'
import StripeCheckout from 'react-stripe-checkout';
import { useNavigate } from 'react-router-dom'
import { Icon } from 'react-icons-kit'
import { creditCard } from 'react-icons-kit/icomoon/creditCard'
import { ic_account_balance_outline } from 'react-icons-kit/md/ic_account_balance_outline'
import { ic_account_balance_wallet_outline } from 'react-icons-kit/md/ic_account_balance_wallet_outline'
import { arrowRight } from 'react-icons-kit/fa/arrowRight'
import { toast } from 'react-toastify';
import { MNavbar } from '../MainComponents/MNavbar'
import 'react-toastify/dist/ReactToastify.css';


export const BookBus = () => {

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

    const [From, setFrom] = useState('');
    const [To, setTo] = useState('');
    const [Date, setDate] = useState('');
    const [Time, setTime] = useState('');
    const [Traveller, setTraveller] = useState('');
    const [Type, setType] = useState('');
    const [Seats, setSeats] = useState(0);
    const [Name, setName] = useState('');
    const [Age, setAge] = useState('');
    const [Mobile, setMobile] = useState('');
    const [Promocode, setPromocode] = useState(' ');
    const [Amount, setAmount] = useState(0);

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

    let basefare = 1000;

    const promos = new Map([
        ["PAYKARO500", 500],
        ["FIRST100", 100],
        ["HOLIDAY200", 200]
    ]);

    let fare = (Seats * basefare) - promos.get(Promocode)

    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleBookBus = (e) => {
        e.preventDefault();
        auth.onAuthStateChanged(user => {
            fs.collection('BookBus').doc(user.uid).set({
                From: From,
                To: To,
                Date: Date,
                Time: Time,
                Traveller: Traveller,
                Type: Type,
                Seats: Seats,
                Name: Name,
                Age: Age,
                Mobile: Mobile,
                Promocode: Promocode,
                Amount: fare
            }).then(() => {
                setSuccessMsg('Bus Tickets Booked, You\'ll be redirected to Home Page!');
                fs.collection('userCardInfo').doc(user.uid).get().then((snapshot) => {
                    const userData = snapshot.data()
                    if (parseInt(userData.Amount) >= fare)
                        fs.collection('userCardInfo').doc(user.uid).update({ Amount: parseInt(userData.Amount) - fare }).then(() => {
                            toast.success("Payment done with wallet")
                        }).catch(e => toast.error(e.message))
                    else toast.error("Insufficient funds")
                }).catch(e => toast.error(e.message))
                setFrom('');
                setTo('');
                setDate('');
                setTime('');
                setTraveller('');
                setType('');
                setSeats('');
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
        fs.collection('users').doc(user.uid).get().then((snapshot) => {
            const userData = snapshot.data()
            if (parseInt(userData.balance) < fare) {
                toast.error('Insufficient funds')
                return
            }
            else {
                fs.collection('users').doc(user.uid).update({ balance: parseInt(parseInt(userData.balance) - fare) })
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
        const docID = selectedSource.slice(selectedSource.indexOf('-') + 1, selectedSource.length)
        fs.collection(`${user.uid}-${paymentMode}`).doc(`${docID}`).get().then((snapshot) => {
            const sourceData = snapshot.data()
            if (parseInt(sourceData.Amount) < fare) {
                toast.error('Insufficient funds')
                return
            }
            else {
                fs.collection(`${user.uid}-${paymentMode}`).doc(`${docID}`).update({ Amount: parseInt(parseInt(sourceData.Amount) - fare) })
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

    return (
        <>
            <MNavbar user={user} />
            <div className='container'>
                <br></br>
                <br></br>
                <h1>Bus Ticket Booking</h1>
                <hr></hr>
                {successMsg && <>
                    <div className='success-msg'>{successMsg}</div>
                    <br></br>
                </>}
                <form className='form-group' autoComplete="off">
                    <label>From: </label>
                    <select name="state" id="state" class="form-control" onChange={(e) => setFrom(e.target.value)} value={From}>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                        <option value="Assam">Assam</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Chandigarh">Chandigarh</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Dadar and Nagar Haveli">Dadar and Nagar Haveli</option>
                        <option value="Daman and Diu">Daman and Diu</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Lakshadweep">Lakshadweep</option>
                        <option value="Puducherry">Puducherry</option>
                        <option value="Goa">Goa</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                        <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Manipur">Manipur</option>
                        <option value="Meghalaya">Meghalaya</option>
                        <option value="Mizoram">Mizoram</option>
                        <option value="Nagaland">Nagaland</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Sikkim">Sikkim</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Tripura">Tripura</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Uttarakhand">Uttarakhand</option>
                        <option value="West Bengal">West Bengal</option>
                    </select>
                    <br></br>
                    <label>To: </label>
                    <select name="state" id="state" class="form-control" onChange={(e) => setTo(e.target.value)} value={To}>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                        <option value="Assam">Assam</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Chandigarh">Chandigarh</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Dadar and Nagar Haveli">Dadar and Nagar Haveli</option>
                        <option value="Daman and Diu">Daman and Diu</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Lakshadweep">Lakshadweep</option>
                        <option value="Puducherry">Puducherry</option>
                        <option value="Goa">Goa</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                        <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Manipur">Manipur</option>
                        <option value="Meghalaya">Meghalaya</option>
                        <option value="Mizoram">Mizoram</option>
                        <option value="Nagaland">Nagaland</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Sikkim">Sikkim</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Tripura">Tripura</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Uttarakhand">Uttarakhand</option>
                        <option value="West Bengal">West Bengal</option>
                    </select>
                    <br></br>
                    <label>Travelling Date</label>
                    <input type="date" className='form-control' required
                        onChange={(e) => setDate(e.target.value)} value={Date}></input>
                    <br></br>
                    <label>Time of Travel</label>
                    <input type="time" className='form-control' required
                        onChange={(e) => setTime(e.target.value)} value={Time}></input>
                    <br></br>
                    <label>Travel Company</label>
                    <select name="travel" id="state" class="form-control" onChange={(e) => setTraveller(e.target.value)} value={Traveller}>
                        <option value="Orange Bus">Orange Bus</option>
                        <option value="Airavat Travels">Airavat Travels</option>
                        <option value="KSRTC">KSRTC</option>
                    </select>
                    <br></br>
                    <label>Seat Type</label>
                    <select name="SeatType" id="type" class="form-control" onChange={(e) => setType(e.target.value)} value={Type}>
                        <option value="Sleeper">Sleeper</option>
                        <option value="Seater">Seater</option>
                        <option value="Semi-Sleeper">Semi-Sleeper</option>
                    </select>
                    <br></br>
                    <label>No of Seats(maximum 10)</label>
                    <input type="number" className='form-control' required
                        onChange={(e) => setSeats(e.target.value)} value={Seats}></input>
                    <br></br>
                    <h3>Details of Anyone member booking the tickets</h3>
                    <label>Name</label>
                    <input type="text" className='form-control' required
                        onChange={(e) => setName(e.target.value)} value={Name}></input>
                    <br></br>
                    <label>Age</label>
                    <input type="number" className='form-control' required
                        onChange={(e) => setAge(e.target.value)} value={Age}></input>
                    <br></br>
                    <label>Contact Number</label>
                    <input type="number" className='form-control' required
                        onChange={(e) => setMobile(e.target.value)} value={Mobile}></input>
                    <br></br>
                    <label>Select a Promocode</label>
                    <select name="Promocode" id="promo" class="form-control" onChange={(e) => setPromocode(e.target.value)} value={Promocode}>
                        <option value="PAYKARO500">PAYKARO500</option>
                        <option value="FIRST100">FIRST100</option>
                        <option value="HOLIDAY200">HOLIDAY200</option>
                    </select>
                    <br></br>
                    <div className='summary-box'>
                        <h5>Ticket Summary</h5>
                        <br></br>
                        <div>
                            No of Seats: <span>{Seats}</span>
                        </div>
                        <div>
                            Price to Pay: <span>₹ {Seats * basefare}</span>
                        </div>
                        <div>
                            Discount: <span><b>-</b>₹ {promos.get(Promocode)}</span>
                        </div>
                        <div>
                            Total Price to Pay: <span>₹ {(Seats * basefare) - promos.get(Promocode)}</span>
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
                                    {`Pay ₹${fare}/-`}
                                </div>
                            </>}
                        </div>
                    </div>
                </form>
                {errorMsg && <>
                    <br></br>
                    <div className='error-msg'>{errorMsg}</div>
                </>}
            </div>
        </>
    )
}
