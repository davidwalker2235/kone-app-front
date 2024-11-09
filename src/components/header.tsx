import Brush from "./brush";
import ColorContainer from "./colorContainer";
import Tools from "./tools";
import './header.css';
import { useState } from "react";

const Header = () => {

    type Utensils = {
        tool: string;
        weight: string;
        color: string;
        [key: string]: string;
    };

    const [utensils, setUtensils] = useState<Utensils>({
        tool: 'brush',
        weight: 'normal',
        color: 'black'
    });

    const [color, setColor] = useState<string>('black');

    const handleUtensils = (updateItem: string, keyHolder: string) => {
        const newUtensils = {...utensils};
        if(updateItem === 'eraser') {
            newUtensils[keyHolder] = updateItem.toLowerCase();
            newUtensils['color'] = 'white';
            setUtensils(newUtensils);
            console.log(newUtensils);
            return;
        }
        if(keyHolder === 'color') {
            setColor(updateItem);
        }
        if(newUtensils['tool'] === 'eraser' && (keyHolder === 'color' || keyHolder === 'tool')) {
            if(keyHolder === 'color') {
                newUtensils['tool'] = 'brush';
                setColor(updateItem);
            } else {
                newUtensils[keyHolder] = updateItem;
                newUtensils['color'] = color;
            }
        }
        newUtensils[keyHolder] = updateItem.toLowerCase();
        setUtensils(newUtensils);

        console.log(newUtensils);
    }

    return (
    <div id='header'>
        <Tools handleUtensil={handleUtensils} />
        <Brush handleUtensil={handleUtensils}/>
        <ColorContainer handleUtensil={handleUtensils}/>
    </div>
    );
};

export default Header;