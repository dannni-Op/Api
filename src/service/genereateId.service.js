import { v4 as uuidv4 } from 'uuid';

function getId(){
    const uuid = uuidv4();
    return uuid;
}

getId();

export {
    getId,
};
