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
const log = require("../../bubbles_logger").log

const locals = require("../../config/locals");
const db = require("./database");
const {sql} = require("@databases/pg");

const Pool = require('pg').Pool

log.info('Creating initial arabella database connection' );

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
    log.info("No database connection " + e)
    process.exit(1)
}


exports.getPool = () => {
    return(pool)
}

exports.testConnection = async function(failfunc) {
    log.info("testConnection")
    return new Promise(function (resolve, reject) {
        pool.query("SELECT * FROM public.user",
            function (err, results) {
                if (err) {
                    failfunc(err)
                } else {
                    resolve(results)
                }
            }
        )
    })
}


