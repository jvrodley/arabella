/*
 * Copyright (c) John Rodley 2022.
 * SPDX-FileCopyrightText:  John Rodley 2022.
 * SPDX-License-Identifier: MIT
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the
 * Software without restriction, including without limitation the rights to use, copy,
 * modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so, subject to the
 * following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 * OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import pg from 'pg'
import {Octokit} from 'octokit';



const Pool = pg.Pool

const endPool = () => {
    pool.end()
}
let arabella_db_config = {
    "host": "localhost",
    "user": "postgres",
    "password": "postgres",
    "database": "arabella",
    "port": "5432"
}

let pool

try {
    pool = new Pool(arabella_db_config);
} catch(e) {
    console.log("No database connection " + e)
    process.exit(1)
}

export async function getAllNeeds(userid) {
    console.log("needs getAllNeeds")
    return new Promise(function (resolve, reject) {
        let ssql = "select * from need where needid not in (select needid_need from claim where userid_user="+userid+") order by needid desc"
        console.log(ssql)
        pool.query(ssql, (error, results) => {
            if (error) {
                reject(error)
            }
            if (results) {
                resolve(results.rows);
            } else {
                resolve({results: []});
            }
        })
    })
}

export async function getAllClaims(userid) {
    console.log(" getAllClaims")
    return new Promise(function (resolve, reject) {
        let ssql = "select * from claim c join need n on c.needid_need = n.needid where c.userid_user="+userid+" order by c.claimid desc"
        console.log(ssql)
        pool.query(ssql, (error, results) => {
            if (error) {
                reject(error)
            }
            if (results) {
                resolve(results.rows);
            } else {
                resolve({results: []});
            }
        })
    })
}

export async function getClaim(userid,project) {
    console.log(" getAllClaims")
    return new Promise(function (resolve, reject) {
        let ssql = "select * from claim c join need n on c.needid_need = n.needid where n.project=''"+project+"'' and c.userid_user="+userid+" order by c.claimid desc"
        console.log(ssql)
        pool.query(ssql, (error, results) => {
            if (error) {
                reject(error)
            }
            if (results) {
                resolve(results.rows);
            } else {
                resolve({results: []});
            }
        })
    })
}

export async function getLanguages(owner, repo) {
    console.log('getLanguages '+owner+' '+ repo)
    // https://docs.github.com/en/rest/repos/repos#list-repository-languages

    const octokit = new Octokit({
        auth: process.env.MY_GITHUB_TOKEN
    })

    let ret = await octokit.rest.repos.listLanguages({
        owner,
        repo,
    });

    console.log("return from languages call comes from " + JSON.stringify(ret.data))
    let languages = Object.keys(ret.data)
    console.log("return from languages call "+languages)
    return(JSON.stringify(languages))
}

export async function getRepoMetadata(owner, repo) {
    console.log('getRepoMetadata '+owner+' '+ repo)
    // https://docs.github.com/en/rest/repos/repos#get-a-repository
    // Octokit.js
    // https://github.com/octokit/core.js#readme
    const octokit = new Octokit({
        auth: process.env.MY_GITHUB_TOKEN
    })

    let ret = await octokit.rest.repos.get({
        owner,
        repo,
    });
    console.log("return from repo metadata call " + JSON.stringify(ret))
    return( ret.data )
}
export async function setNeedInviteLink(needid,inviteLink) {
    console.log("setNeedInviteLink " + needid + " " + inviteLink)
    return new Promise(function(resolve, reject) {
        pool.query("UPDATE need set invite_link=$1 where needid=$2",
            [inviteLink,needid], (error, results) => {
                if (error) {
                    reject(error)
                } else {
                    resolve({ needid: needid, message: "Need "+needid+" has been updated :"})
                }
            })
    })
}
export async function addNeed(need) {
    console.log("addNeed " + JSON.stringify(need))
    let ret = GetOwnerProjectFromURL(need.original_github_url)
    let metadata = await getRepoMetadata(ret.owner, ret.project)
    need.original_github_description = metadata.description
    console.log("metadata is " + JSON.stringify(metadata))
//    need.original_github_url = ret.owner
    need.languages = await getLanguages(ret.owner, ret.project)
    console.log("languages is " + JSON.stringify(need.languages))
    try {
        need.languages = need.languages.replaceAll('"', '')
        need.languages = need.languages.replaceAll('[', '')
        need.languages = need.languages.replaceAll(']', '')
    } catch(e) {
        console.log("error fixing need.languages " + need.languages+" " + e)
    }

    return new Promise(function(resolve, reject) {
        pool.query("INSERT INTO need (needer_discord_handle,invite_email_address, original_github_url, project, original_github_owner, original_github_description, description, target_os_name,target_os_version, target_name1, target_version1, languages) VALUES ($1,$2,$3,$4,$5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
            [need.needer_discord_handle,need.invite_email_address, need.original_github_url, ret.project, ret.owner, need.original_github_description, need.description,  need.target_os_name, need.target_os_version, need.target_name1, need.target_version1, need.languages], (error, results) => {
                if (error) {
                    reject(error)
                } else {
                    let channelName = ret.owner + "_" + ret.project
                    resolve({channelName: channelName, needid: results.rows[0].needid, message: "A new need has been added :" + results.rows[0].needid})
                }
            })
    })
}

export function GetOwnerProjectFromURL(repo) {
    //		util.Debug(fmt.Sprintf("Repository %s", url ))
    // git+https://github.com/evanw/node-source-map-support.git
    // get the second to last element
    let ret = {
        owner: "",
        project: ""
    }

    let elements = repo.split("/")
    if( elements.length < 2 ) {
        return ret
    }
    ret.owner = elements[elements.length - 2]
    let longproject = elements[elements.length - 1]
    elements = longproject.split(".")
    ret.project = elements[0]

    return ret

}

export async function forkGithubRepo( owner, project, claimid ) {
    console.log("forkGithubRepo "+owner+","+project+","+claimid)
    const octokit = new Octokit({
        auth: process.env.MY_GITHUB_TOKEN
    })

    let ret = await octokit.rest.repos.createFork({
        owner: owner,
        repo: project,
        name: project+"_"+claimid,
        default_branch_only: true
    });

    console.log("return from createFork call "+JSON.stringify(ret))
    return(ret)

}

export async function claimProject( needid, userid ) {
    console.log("claimProject "+needid+","+userid)
    return new Promise(function(resolve, reject) {
        pool.query("INSERT INTO claim (needid_need, userid_user, forked_github_owner, forked_github_url ) VALUES ($1,$2,'','') RETURNING *",
            [needid, userid], (error, results) => {
                if (error) {
                    reject(error)
                } else {
                    resolve({claimid: results.rows[0].claimid} )
                }
            })
    })
}

export async function createBranches(owner,repo, sha) {
    let develop_ref = "refs/heads/develop"
    const octokit = new Octokit({
        auth: process.env.MY_GITHUB_TOKEN
    })

    // Make develop off main
    await octokit.rest.git.createRef({
        owner: owner,
        repo: repo,
        ref: develop_ref,
        sha: sha,
    });

    // Make branch named after the fixer
    let feature_ref = "refs/heads/feature"
    await octokit.rest.git.createRef({
        owner: owner,
        repo: repo,
        ref: feature_ref,
        sha: sha,
    });
}

export async function updateClaim( claimid, forked_github_owner, forked_github_url ) {
    console.log("updateClaim "+claimid+","+forked_github_owner+','+forked_github_url)
    return new Promise(function(resolve, reject) {
        pool.query("UPDATE claim set forked_github_owner=$1, forked_github_url=$2 where claimid=$3",
            [forked_github_owner, forked_github_url, claimid], (error, results) => {
                if (error) {
                    reject(error)
                } else {
                    resolve({claimid: claimid} )
                }
            })
    })
}


