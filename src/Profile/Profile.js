import React, { useState, useEffect } from 'react'
import { auth, fs, storage } from '../Config/Config'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import './style.css'
import { ProfileNavbar } from './ProfileNavbar'

export const Profile = () => {


    const [fullName, setFullName] = useState("")

    const [dob, setDob] = useState("")

    function GetCurrentUser() {
        const [userDoc, setUserDoc] = useState(null);
        useEffect(() => {
            auth.onAuthStateChanged(user => {
                if (user) {
                    fs.collection('users').doc(user.uid).get().then(snapshot => {
                        setUserDoc(snapshot.data());
                    })
                }
                else {
                    setUserDoc(null);
                }
            })
        }, [userDoc])
        return userDoc;
    }

    const userDocVar = GetCurrentUser();

    const fullNameChangeHandler = (e, defaultVal) => {
        if (e.target.value === "") setFullName(defaultVal)
        else setFullName(e.target.value)
    }

    const fullNameUpdateHandler = () => {
        const user = auth.currentUser
        if (!user || !fullName) return
        try {
            fs.collection('users').doc(user.uid).update({
                FullName: fullName
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    const dobChangeHandler = (e, defaultVal) => {
        if (e.target.value === "") setDob(defaultVal)
        else setDob(e.target.value)
    }

    const dobUpdateHandler = () => {
        const user = auth.currentUser
        if (!user) return
        try {
            fs.collection('users').doc(user.uid).update({
                Date: dob
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    const kycUploadInput = (e) => {
        const uploadedFile = e.target.files[0];
        if (!uploadedFile) return
        const currentUser = auth.currentUser
        if (!currentUser) return
        const storageRef = ref(storage, `/${currentUser.email}`)
        uploadBytesResumable(storageRef, uploadedFile).then(() => {
            getDownloadURL(storageRef).then(url => {
                console.log('Uploaded:', url)
                try {
                    fs.collection('users').doc(currentUser.uid).update({
                        kyc: true
                    })
                } catch (error) {
                    console.log(error.message);
                }
            }
            ).catch(err => {
                alert(err.message)
            })
        })
    }


    return (
        <>
            <ProfileNavbar />
            <div className='profileDiv'>
                {userDocVar && <div className='profiles'>
                    {/*<h1>Here are your details:</h1>*/}
                    <div className="fullnameDiv">
                        <h2>Fullname:
                            <input type="text" className='fullname' defaultValue={userDocVar.FullName} placeholder={userDocVar.FullName} onChange={(e) => fullNameChangeHandler(e, userDocVar.FullName)} />
                        </h2>
                        <button onClick={fullNameUpdateHandler} className='saveDetails' >Save</button>
                    </div>
                    <div className="dobDiv">
                        <h2>DOB:
                            <input type="date" className='dob' defaultValue={userDocVar.Date} placeholder={userDocVar.Date} onChange={e => dobChangeHandler(e, userDocVar.Date)} />
                        </h2>
                        <button onClick={dobUpdateHandler} className='saveDetails' >Save</button>
                    </div>
                    <h2>Email: {userDocVar.Email}</h2>
                    <div className="kycUploadDiv">
                        <h2>KYC Upload: </h2>
                        {!userDocVar.kyc ? <div> <input type="file" id="files" className="hidden" onChange={e => kycUploadInput(e)} accept='.pdf' />
                            <label className='inputLabel' htmlFor="files">Upload file</label> </div> : <h2>Done</h2>}
                    </div>
                </div>}
            </div>
        </>
    )
}
