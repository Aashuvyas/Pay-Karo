import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { auth, fs } from '../Config/Config'
import { useNavigate } from 'react-router-dom'
import './sources.css'
import { MNavbar } from '../MainComponents/MNavbar'

function AddMoneyToWallet() {

    const history = useNavigate()

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

    const usernav = GetCurrentUser();

    const [sources, setSources] = useState([])
    const [selectedSource, setSelectedSource] = useState("")
    const [amount, setAmount] = useState(0)
    const [user, setUser] = useState(null)

    auth.onAuthStateChanged(curUser => setUser(curUser))

    useEffect(() => {
        const getSources = () => {
            if (!user) return
            const sourcesArr = []
            fs.collection(`${user.uid}-bankaccount`).get().then((accounts) => {
                accounts.docs.forEach(account => sourcesArr.push({ sourceData: account.data(), type: 'Bank Account' }))
                fs.collection(`${user.uid}-card`).get().then((cards) => {
                    cards.docs.forEach(card => sourcesArr.push({ sourceData: card.data(), type: 'Card' }))
                    setSources(sourcesArr)
                    //sourcesArr.forEach((src) => console.log(src.type, "=>", src.sourceData))
                })
            })
        }
        getSources()
    }, [user])


    const handleSourceChange = (e) => {
        var curSrc = e.target.value
        const user = auth.currentUser
        if (!user) return
        const type = curSrc.slice(0, curSrc.indexOf('-'))
        const docID = curSrc.slice(curSrc.indexOf('-') + 1, curSrc.length)
        type !== "Card" ? fs.collection(`${user.uid}-bankaccount`).doc(`${docID}`).get().then((doc) => {
            const curSelectedSrc = { sourceData: doc.data(), type: 'Bank Account' }
            setSelectedSource(curSelectedSrc)
        }) : fs.collection(`${user.uid}-card`).doc(`${docID}`).get().then((doc) => {
            const curSelectedSrc = { sourceData: doc.data(), type: 'Card' }
            setSelectedSource(curSelectedSrc)
        })
    }

    const handleAddMoney = () => {
        const user = auth.currentUser
        if (!user || !amount) return
        selectedSource.type !== "Card" ? fs.collection(`${user.uid}-bankaccount`).doc(`${selectedSource.sourceData.AcountNumber}`).get().then((doc) => {
            const availableBal = parseInt(doc.data().Amount)
            if (availableBal >= amount) {
                fs.collection(`${user.uid}-bankaccount`).doc(`${selectedSource.sourceData.AcountNumber}`).update({ Amount: availableBal - amount }).then(() => {
                    fs.collection('users').doc(user.uid).get().then((userDoc) => {
                        const walletBalance = parseInt(userDoc.data().balance)
                        fs.collection('users').doc(user.uid).update({ balance: parseInt(parseInt(walletBalance) + parseInt(amount)) }).then(() => {
                            toast.success("Money added")
                            history('/wallet')
                        })
                    })
                }).catch(e => toast.error(e.message))
            }
            else {
                console.log(availableBal, amount);
                toast.error("Insufficient funds")
            }
        }) : fs.collection(`${user.uid}-card`).doc(`${selectedSource.sourceData.CardNumber}`).get().then((doc) => {
            const availableBal = parseInt(doc.data().Amount)
            if (availableBal >= amount) {
                fs.collection(`${user.uid}-card`).doc(`${selectedSource.sourceData.CardNumber}`).update({ Amount: availableBal - amount }).then(() => {
                    fs.collection('users').doc(user.uid).get().then((userDoc) => {
                        const walletBalance = parseInt(userDoc.data().balance)
                        fs.collection('users').doc(user.uid).update({ balance: parseInt(parseInt(walletBalance) + parseInt(amount)) }).then(() => {
                            toast.success("Money added")
                            history('/wallet')
                        })
                    })
                }).catch(e => toast.error(e.message))
            }
            else {
                console.log(availableBal, amount);
                toast.error("Insufficient funds")
            }
        })
    }

    return (
        <>
            <MNavbar user={usernav} />
            <div className='addMoneyContainer'>
                <div className='addMoneyDiv'>
                    <h1 style={{ textAlign: 'center', paddingTop: '100px' }}>Add money to wallet</h1>
                    <div>
                        <label htmlFor="source">Select a source:</label>
                        <select name="sources" onChange={e => handleSourceChange(e)}>
                            {sources.map((source) => {
                                return <option value={`${source.type}-${source.type !== "Card" ? source.sourceData.AcountNumber :
                                    source.sourceData.CardNumber}`} onChange={(e) => console.log(e.target.value)}>{`${source.type}-${source.type !== "Card" ? source.sourceData.AcountNumber :
                                        source.sourceData.CardNumber}`}</option>
                            })}
                        </select>
                    </div>
                    {selectedSource && <div>
                        <input type="number" placeholder='Enter amount' onChange={e => setAmount(e.target.value)} />
                        <button className='btn btn-success btn-md addMoney' onClick={handleAddMoney} >Add money</button>
                    </div>}
                </div>
            </div>
        </>
    )
}

export default AddMoneyToWallet