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

export async function claimAndFork(host, port, owner, project, claimid) {
    console.log("claimAndFork calling out to api")

    fetch('https://'+host+':' + props.port + '/fork', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({owner: owner, project: project, claimid: claimid }),
    })
        .then(response => {
            return response.text();
        })
        .then(data => {
            console.log("data = " + data )
        });
}

