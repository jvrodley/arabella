export async function getNeeds(host, port) {
    console.log("getNeeds calling out to api")

    return new Promise( async (resolve, reject) => {
        const response = await fetch('https://'+host+':'+port+'/needs');
        if(response.ok) {
            let x = await response.json();
            console.log("Got needs " + JSON.stringify(x));
            resolve(x)
        } else {
            console.log("error " + response.status)
            reject( response.status )
        }
    })
}
