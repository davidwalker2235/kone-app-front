import ColorCard from "./colorCard";

const colors = [
    'red',
    'blue',
    'green',
    'yellow',
    'purple',
    'orange',
    'pink',
    'brown',
    'black',
    'white',
    'gray'
];

const ColorContainer = ({handleUtensil}: any) => {

    const colorDivs = colors.map((color) => (
        <ColorCard key={color} color={color} handleUtensil={handleUtensil}/>
    ));

    return (
        <div id="color-grid">
            {colorDivs}
        </div>
    );
}

export default ColorContainer;