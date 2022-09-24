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

export async function getAllNeeds() {
    console.log("needs getAllNeeds")
    return new Promise(function (resolve, reject) {
        let ssql = "select * from need order by needid desc"
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

export async function addNeed(need) {
    console.log("addNeed " + JSON.stringify(need))
    let ret = GetOwnerProjectFromURL(need.original_github_url)
    let metadata = await getRepoMetadata(ret.owner, ret.project)
    need.original_github_description = metadata.description
    console.log("metadata is " + JSON.stringify(metadata))
//    need.original_github_url = ret.owner
    need.languages = await getLanguages(ret.owner, ret.project)
    console.log("languages is " + JSON.stringify(need.languages))
    need.languages = need.languages.replaceAll('"', '')
    need.languages = need.languages.replaceAll('[', '')
    need.languages = need.languages.replaceAll(']', '')

    return new Promise(function(resolve, reject) {
        pool.query("INSERT INTO need (needer_discord_handle, original_github_url, project, original_github_owner, original_github_description, description, target_os_name,target_os_version, target_name1, target_version1, languages) VALUES ($1,$2,$3,$4,$5, $6, $7, $8, $9, $10, $11) RETURNING *",
            [need.needer_discord_handle, need.original_github_url, ret.project, ret.owner, need.original_github_description, need.description,  need.target_os_name, need.target_os_version, need.target_name1, need.target_version1, need.languages], (error, results) => {
                if (error) {
                    reject(error)
                } else {
                    resolve({needid: results.rows[0].needid, message: "A new need has been added :" + results.rows[0].needid})
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
