export async function getNeeds(host, port, userid) {
    console.log("getNeeds calling out to api")

    return new Promise( async (resolve, reject) => {
        const response = await fetch('https://'+host+':'+port+'/needs/'+userid);
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

export async function getClaims(host, port, userid) {
    console.log("getClaims calling out to api")

    return new Promise( async (resolve, reject) => {
        const response = await fetch('https://'+host+':'+port+'/claims/'+userid);
        if(response.ok) {
            let x = await response.json();
            console.log("Got claims " + JSON.stringify(x));
            resolve(x)
        } else {
            console.log("error " + response.status)
            reject( response.status )
        }
    })
}
export async function claimAndFork(host, port, owner, project, needid) {
    console.log("claimAndFork calling out to api "+host+"," +port+"," +owner+"," +project+"," +needid)

    return new Promise( async (resolve, reject) => {
        const response = await fetch('https://'+host+':' + port + '/fork', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({owner: owner, project: project, needid: needid }),
        })
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

