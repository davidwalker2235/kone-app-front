import React from 'react';

const Tools = ({handleUtensil}:any) => {
    return (
        <div>
            <button name="brush" onClick={(event) => handleUtensil(event.currentTarget.name, 'tool')}>&#9997;</button>
            <button name="eraser" onClick={(event) => handleUtensil(event.currentTarget.name, 'tool')}>&#10060;</button>
        </div>
    );
}

export default Tools;