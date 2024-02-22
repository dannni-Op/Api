export const getUTCTime = () => {
    // const dt = new Date(dateTimeString);
    // const dtNumber = dt.getTime();
    // const dtOffset = dt.getTimezoneOffset() * 60000;
    // const dtUTC = new Date();
    // dtUTC.setTime(dtNumber - dtOffset);

    // return dtUTC;
    //////////////////////////

    const abc = new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta"} );
    const result = new Date(abc);
    return result;
}


//my logic
    // const one = new Date().toLocaleDateString().replaceAll("/","-");

    // const two = new Date().toLocaleTimeString().split(" ")[0];

    // const currentTime = `${one} ${two}`; 
