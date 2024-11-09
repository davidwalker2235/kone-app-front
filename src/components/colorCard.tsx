import React from 'react';

const ColorCard = ({color, handleUtensil}: any) => {
    return (
        <div
            className='color-icon'
            style={{backgroundColor: `${color}`}}
            onClick={() => handleUtensil(color, 'color')}>
        </div>
    );
}

export default ColorCard;