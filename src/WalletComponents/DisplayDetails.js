import React, { useEffect, useState } from 'react'
import { auth, fs } from '../Config/Config'
import Source from './Source'
import './sources.css'

function DisplayDetails({ type }) {
    const [sources, setSources] = useState([])
    const [user, setUser] = useState(null)

    auth.onAuthStateChanged(curUser => setUser(curUser))

    useEffect(() => {
        const sourceArr = []
        if (!user) return
        type ? fs.collection(`${user.uid}-bankaccount`).get().then((collection) => {
            collection.docs.forEach(doc => sourceArr.push(doc))
            setSources(sourceArr)
        }) : fs.collection(`${user.uid}-card`).get().then((collection) => {
            collection.docs.forEach(doc => sourceArr.push(doc))
            setSources(sourceArr)
        })
    }, [user, sources])

    return (
        <div className='displayDetailsContainer' >
            <h1>{type ? "Bank Accounts" : "Cards"}</h1>
            <div className='sourceContainer'>
                {sources.length > 0 ? sources.map((source) => { return <Source type={type} source={source} sources={sources} setSources={setSources} /> })
                    : <h2>Nothing to display...</h2>}
            </div>
        </div>
    )
}

export default DisplayDetails