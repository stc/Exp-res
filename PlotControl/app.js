import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import Express, { response, text } from "express"
const fileUpload = require('express-fileupload');
const fs = require("fs");
import Path from 'path';

import Grbl from "./Grbl.js"
import Optimizer from "./Optimizer.js"
import HersheyFont from "./Hershey.js"

const port = 3000
const __dirname = Path.resolve()
const tmpFilePath = __dirname + "/public/svgs/test.svg"
let grbl = null
let optimizer = null
let app = null
let svgData = null
let font = null;

// load params and init
const params = {};
await loadParams().then(e=>{
    init()
}).catch(e=>{
	console.log(e)
})

function init() {
    console.log( "init");
    
    // init grbl serial
    grbl = new Grbl( params )
    grbl.listDevices().then(e=>{
        console.log("serial ports", e )
        let connected = false;
        e.forEach( p=> {
            if ( p == params.serialPort ) {
                grbl.connect( params.serialPort, params.baudRate, onPathDone )
                connected = true;
            }
        })
        if ( !connected ) {
            console.log("device not found:", params.serialPort)
        }
    }).catch(e=>{
        console.error(e)
    });

    font = new HersheyFont(params)    
    optimizer = new Optimizer( params )
    app = Express()
    app.use( fileUpload() )
    app.use( Express.static("public"))
    app.set( "view engine", "ejs" )

    app.get("/", ( request, response) => { 
        updateOptimizer().then(e=>{
            response.render("index", {params:params} );
        });
    })

    app.get("/setParam", (req, res)=>{    
        let param = req.query
        //console.log(param)
        for ( let key in params ) {
            if ( key == param.param ) {
                let type = typeof( params[key])
                params[key] = type == "number" ? Number( param.value ) : ( type == "boolean" ? Boolean( param.value == "true" ? true : false ) : param.value );
                console.log(key, typeof(params[key]), params[key])
            }
        }
        saveParams()
        
        res.send("ok")
    })

    app.get("/getParams", (req, res )=>{
        res.send(params)
    })

    app.get("/getPaths", (req, res )=>{
        let paths = optimizer.getPaths()
        
        if ( params.text.length > 0 ) {
            let textPahts = font.getString( params.text, {x:params.textX, y:params.textY}, params.textWidth )
            paths = paths.concat( textPahts )
        }

        res.send( paths )
    })

    app.get("/getPathsDone", (req, res)=>{
        if ( req.query.index ) {
            res.send( grbl.getPathsDone( req.query.index) )
        } else {
            res.send("error: index")
        }
    })

    app.get("/getPos", (req, res )=>{
        res.send( grbl.getPos() );
    })

    app.get("/plot", (req, res) =>{

        let paths = optimizer.getPaths()
        
        if ( params.text.length > 0 ) {
            let textPahts = font.getString( params.text, {x:params.textX, y:params.textY}, params.textWidth )
            paths = paths.concat( textPahts )
        }

        grbl.plot( paths )
        res.send("ok")
    })

    app.get("/pauseToggle", (req, res) =>{
        grbl.togglePause()
        res.send("ok")
    })

    app.get("/stop", (req, res) =>{
        grbl.stop()
        res.send("ok")
    })

    app.get("/move", (req, res) =>{
        let move = {
            x:Number(req.query.x),
            y:Number(req.query.y),
            isPenDown:(req.query.isPenDown == "true" )
        }
        grbl.move( move )
        res.send("ok")
    })

    app.get("/penToggle", (req, res) =>{
        grbl.penToggle();
        res.send("ok")
    })

    app.get("/home", (req, res )=>{
        grbl.home()
        res.send("ok")
    })

    app.post('/upload', function(req, res) {        
        let fileToUpload = req.files.fileToUpload;

        if (!req.files || Object.keys( req.files ).length === 0 || Path.extname( fileToUpload.name ) != ".svg" ) {
            return res.status(400).send('No files were transferred.')
        }

        fileToUpload.mv( tmpFilePath, function(err) {
            if (err) {
                return res.status(500).send(err)
            }

            reloadSvgData().then(e=>{
                res.redirect('/');
            }).catch(e=>{
                res.redirect('/');
            })
        });    
    });

    // start server
    loadAndProcessSvgData();
    let ip = getIP();
    console.log(`ip: ${ip}` );

    app.listen( port, ()=> {
        console.log( `Serving on: ${port}`)
    })
}

function onPathDone( pathsDone ) {}

function loadAndProcessSvgData() {
    console.log("loadAndProcessSvgData")
    return new Promise((resolve, reject ) => {
        reloadSvgData().then(e=>{
            updateOptimizer().then(e=>{
                resolve();       
            }).catch(e=>{
                console.log(e)
                reject()
            })
        }).catch(e=>{
            reject();
        })
    })
}

function reloadSvgData() {
    return new Promise((resolve, reject ) => {
        fs.readFile( tmpFilePath, 'utf8', function(err, data) {
			if (err) 
			{
				reject(err);
			} else {                
                svgData = data;
                resolve();
            }
        })
    })
}

function updateOptimizer() {
    return new Promise((resolve, reject ) => {
        if ( svgData ) { 
            optimizer.load( svgData ).then((e)=>{
                console.log( "optimizer done" )
                resolve()
            }).catch((e)=>{				
                reject(e)
            })
        } else {
            reject("svgData is empty")
        }
    })
}

function loadParams() {
	return new Promise((resolve, reject ) => {
		console.log("loading params")
		fs.readFile( "./params.json", 'utf8', function(err, data) {
			
			if (err) 
			{
				reject(err)
			}            
			Object.assign( params, JSON.parse( data ))
			resolve()
		})
	})
}

function saveParams() {
    let paramStr = JSON.stringify( params, null, 2 )
    fs.writeFileSync('./params.json', paramStr, "utf-8")
    console.log("params.json saved")
}

function getIP() {
	return Object.values(require('os').networkInterfaces()).reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i.family==='IPv4' && !i.internal && i.address || []), [])), []);
}