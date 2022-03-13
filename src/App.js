import { useEffect, useState } from 'react';
import './App.css';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import { signInWithPopup, signInAnonymously } from "firebase/auth";
import { provider, auth } from './firebase';
import { get, getDatabase, onValue, ref, set } from 'firebase/database';


function App() {

  const defaultImgUrl = "https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png"
  const defaultStatus = 'Hi there'

  const [profiles, setProfiles] = useState({})
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('')
  const [editable, setEditable] = useState(false)

  const onReaction = (key, payload) => {
    const uid = auth.currentUser.uid
    if (profiles[key].thumbs && uid in profiles[key].thumbs) {
      if (profiles[key].thumbs[uid] === payload) 
        return updateThumbs(key, -1)
      else return updateThumbs(key, payload)
    }
    else return updateThumbs(key, payload)
  }
    
  const updateThumbs = (id, value) => { 
    const db = getDatabase()
    set(ref(db, 'users/' + id + '/thumbs/' + auth.currentUser.uid), value)
  }
  
  useEffect(() => {
    const db = getDatabase()
    onValue(ref(db, '/users'), (snapshot) => {
      if(!auth.currentUser) return
      const data = snapshot.val()
      const uid = auth.currentUser.uid
      setUser({ uid: uid, ...data[uid] })
      setStatus(data[uid].status ? data[uid].status : '')
      delete data[uid]
      setProfiles(data)
    })
  }, [])

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        setUser(user)
        setStatus('')
        return
      }

      const {displayName, uid, photoURL}  = user;
      setUser({
        imgUrl: photoURL,
        name: displayName,
        uid
      })


    })
  }, [])

  const onGoogleSignIn = () => {
    signInWithPopup(auth, provider)
    .then((res) => {
      const {displayName, email, uid, photoURL}  = res.user
      const db = getDatabase()
      
      get(ref(db, `users/${uid}`)).then((snapshot) => {
        if (!snapshot.exists()) {
          set(ref(db, 'users/' + uid), {
            name: displayName, 
            email, 
            imgUrl: photoURL,
            status: defaultStatus,
            thumbs: {}
          })
        }
        else {
          get(ref(db, '/users')).then(snapshot => {
            const data = snapshot.val()
            const uid = auth.currentUser.uid
            setUser({ uid: uid, ...data[uid] })
            setStatus(data[uid].status ? data[uid].status : '')
            delete data[uid]
            setProfiles(data)
          })
        }
      })
    })
    .catch((error) => {
        console.log(error.message)
    })
  }

  const onAnonymousSignIn = () => {
    signInAnonymously(auth, provider)
      .then((res) => {

        const { uid } = res.user
        
        fetch('https://randomuser.me/api/')
          .then((response) => response.json())
          .then((data) => {
            const { name, email, picture } = data.results[0]
            const db = getDatabase()
            set(ref(db, 'users/' + uid), {
              name: name.first + ' ' + name.last,
              email,
              imgUrl: picture.medium,
              status: defaultStatus,
              thumbs: {}
            })
        })
      })
      .catch((error) => {
        console.log(error.message)
      })
  }

  const sortProfiles = (data) => {
    const map = {}
    Object.keys(data).forEach((id) => {
     
      const likes = Object.values( data[id].thumbs ? data[id].thumbs : {}).reduce((a, v) => (v === 1 ? a + 1 : a), 0)
      map[id] = likes
    })

    const profilesId = Object.keys(data)
    profilesId.sort(function(a, b) {
      return map[b]-map[a];
    })
    return profilesId
  }
  

  const updateStatus = (event) => setStatus(event.target.value)

  const onStatusEdit = () => setEditable(true)
  
  const onStatusSubmit = () => {
    const db = getDatabase()
    set(ref(db, 'users/' + auth.currentUser.uid + '/status'), status)
    setEditable(false)
  }

  return (
    <div className="App">
      {!user ? <Login onGoogleSignIn={onGoogleSignIn} onAnonymousSignIn={onAnonymousSignIn} /> :
        <div className='profile-page'>
          <div className='current-user'>
            <img src={user.imgUrl ? user.imgUrl : defaultImgUrl} alt='profile'/>
            <div className='details'>
              <div className='name'>{user.name}</div>
              <div className='status'>
                <input className={`status-text ${editable && 'editable'}`} disabled={!editable} onChange={updateStatus} value={status} />
                {
                  editable ? <button onClick={onStatusSubmit}>Done</button> : <button onClick={onStatusEdit}>Edit</button>
                }
              </div>
            </div>
            <div className='logout-btn' onClick={()=>{auth.signOut()}}>Logout</div>
          </div>

          {
            //<Pagination data={profiles} user={user} onReaction={onReaction} />
            sortProfiles(profiles).map((id) =>
              <UserProfile
                id={id}
                {...profiles[id]}
                thumbs={profiles[id].thumbs}
                like={!profiles[id].thumbs ? null : profiles[id].thumbs[auth.currentUser.uid] }
                onReaction={onReaction} />)
          }
        </div>
      }
    </div>
  );
}

export default App;
