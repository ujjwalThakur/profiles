import React, { useState } from 'react'
import UserProfile from './UserProfile'

const Pagination = ({data, user, onReaction, numPerPage, numButtons}) => {
    
    const numPages = Math.floor(Object.keys(data).length/numPerPage)

    const [page, setPage] = useState(1)

    return <div className='container'>
        
        <div className='element-list'>
            {
                Object.keys(data.slice((page-1)*numPerPage, page*numPerPage)).map((id) =>
                    <UserProfile id={id} {...data[id]} like={data[id].thumbs[user.uid]} onReaction={onReaction} />)
            }
        </div>

        <div className='pagination-section'>
            {
                Array.from({ length: numPages }, (v, i) => i + 1).map((num) => {
                    
                })
            }
        </div>

    </div>


}

export default Pagination