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


const express = require('express');
const app = express()

// Allow cross origin access.
const cors = require('cors')
app.use(cors());

const util = require("./util")
const fileUpload = require('express-fileupload');

const favicon = require('serve-favicon');
const morgan_logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');

global.__root   = __dirname + '/';

const config_routes = require('./routes/routes/config_routes').router;
const automation_routes = require('./routes/routes/automation_routes').router;
const device_routes = require('./routes/routes/device_routes').router;
const video_routes = require('./routes/routes/video_routes').router;
const module_routes = require('./routes/routes/module_routes').router;
const edge_control_routes = require('./routes/routes/edgecontrol_routes').router;
const edge_measurement_routes = require('./routes/routes/edgemeasurement_routes').router;
const user_routes = require('./routes/routes/user_routes').router;
const auth_routes = require('./routes/routes/authcontroller_routes').router;
const station_routes = require('./routes/routes/station_routes').router;
const site_routes = require('./routes/routes/site_routes').router;
const health_check = require('./routes/routes/health_check_routes').router;
const event_routes = require('./routes/routes/event_routes').router;
const bubbles_db = require('./routes/models/bubbles_db');

log.info("starting router")
const router = express.Router();
log.silly("after router")
app.locals = {};
app.locals.config = require('./config/locals.js');
log.log('silly',"after locals")
app.locals.units = require('./routes/services/formatted_units.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

ports = util.get_server_ports_for_environment( process.env.NODE_ENV )

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
    next();
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.locals.moment = require('moment');
app.locals.sprintf = require("sprintf-js").sprintf;
app.locals.config = require('./config/locals.js');
app.locals.units = require('./routes/services/formatted_units.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(morgan_logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/config', config_routes);
app.use('/api/healthcheck', health_check);
app.use('/api/users', user_routes);
app.options('/api/auth', cors()) // enable pre-flight requests
app.use('/api/auth', auth_routes);

app.use('/api/device', device_routes);
app.use('/api/video', video_routes);
app.use("/api/edgecontrol", edge_control_routes);
app.use("/api/measurement", edge_measurement_routes);
app.use("/api/station", station_routes);
app.use("/api/site", site_routes);
app.use("/api/module", module_routes);
app.use("/api/automation", automation_routes);
app.use("/api/events", event_routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
//    res.render('error');
});

// Test the database connection
bubbles_db.testConnection( function(err) { log.error("!!!!!!!!!!!!!!!!!! ", err); process.exit(1)})

let listening = false

const hostname = '0.0.0.0'
let runningServer = app.listen(ports.api_server_port, hostname, () => {
    log.log('info',`API server listening on ${hostname} ${ports.api_server_port}.`)
    listening = true
});

function close() {
    let ret
    runningServer.close( function(err) {
        if (typeof err !== 'undefined') {
            log.error('close error! ' + err)
            ret = err
        } else {
            log.info('server closed')
        }
    })
    return(ret);
}


module.exports = {
    listening,
    runningServer,
    close,
    app: app
};

