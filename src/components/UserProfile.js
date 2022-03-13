import React from 'react'
import './UserProfile.css'

const UserProfile = ({id, status, name, imgUrl, thumbs={}, onReaction, like}) => {
    
    const onThumbsUp = () => onReaction(id, 1)
    const onThumbsDown = () => onReaction(id, 0)

    let up = 0, down = 0
    Object.values(thumbs).forEach((val)=>{
        if (val==1) up ++
        else if (val==0) down ++
    })

    return <div className='user-profile'>
        <div className='intro'>
            <img src={imgUrl} />
            <div className='intro-text'>
                <div className='name'>{name}</div>
                <div className='status'>{status}</div>
            </div>
        </div>
        <div className='thumbs'>
            <span className={`up ${like == 1 ? 'active' : ''}`} onClick={onThumbsUp}> <span>&#128077;</span> { up }</span>
            <span className={`up ${like == 0 ? 'active' : ''}`} onClick={onThumbsDown}><span>&#128078;</span> { down }</span>
        </div>
    </div>
}

export default UserProfile