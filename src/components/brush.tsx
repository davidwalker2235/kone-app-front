import React from 'react';

const Brush = ({handleUtensil}: any) => {
    return (
        <select id="brush-detail" onChange={(event) => handleUtensil(event.target.value, 'weight')} defaultValue={'normal'}>
            <option value='thin'>Thin</option>
            <option value="normal">Normal</option>
            <option value="thick">Thick</option>
        </select>
    );
}

export default Brush;