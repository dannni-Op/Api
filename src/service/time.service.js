export const getUTCTime = (dateTimeString) => {
    const dt = new Date(dateTimeString);
    const dtNumber = dt.getTime();
    const dtOffset = dt.getTimezoneOffset() * 60000;
    const dtUTC = new Date();
    dtUTC.setTime(dtNumber - dtOffset);

    return dtUTC;
}


//my logic
    // const one = new Date().toLocaleDateString().replaceAll("/","-");

    // const two = new Date().toLocaleTimeString().split(" ")[0];

    // const currentTime = `${one} ${two}`; 
