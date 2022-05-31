import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Readline = require('@serialport/parser-readline')
import SerialPort from "serialport";

export default class Grbl {
    constructor( params ) {
        this.params = params
        this.pos = { x:0, y:0 }
        this.commandDone = 0
        this.commandSent = 0
        this.plotCommandCount = 0
        this.buffer = []
        this.bufferDone = []
        this.penIsDown = true
        this.inited = false
        this.onPathDoneListener = null
        this.plotStarted = -1
        this.isPaused = false
    }

    listDevices() {
        return new Promise(( resolve, reject )=>{                
            SerialPort.list().then(e=>{
                let portsList = []
                e.forEach( p => {
                    portsList.push( p.path )
                })
                resolve( portsList )             
            }).catch(e=>{
                reject(e)
            })            
        });
    }
    
    connect( name, baudRate, listener ) {
        console.log("Grbl: connecting to", name, baudRate )
        this.serialPort = new SerialPort( name, { baudRate: baudRate },
            function (err) {
            if (err) {
                return console.log('Grbl: Error: ', err.message)
            }
        });
        
        this.serialPort.on('error', function(err) {
            console.log('Grbl: Error:', err.message)
        });                
        
        this.parser = this.serialPort.pipe(new Readline({ delimiter: '\r\n' }))
        this.parser.on('data', ( data ) => {
            //console.log( "Grbl: serial in", data );
            if ( data.indexOf("Grbl" != -1 ) && this.inited == false ) {
                console.log("Grbl: connected:", this.params.serialPort, this.params.baudRate )
                this.inited = true
                this.commandDone = 0
                this.commandSent = 0
                this.init()
                this.sendCommandIfNeeded()
            }
            if ( data.indexOf("error") != -1 ) {
                this.commandDone++
                this.sendCommandIfNeeded()
            }
            if ( data.indexOf("ok") != -1 ) {          
                //console.log("Grbl: command done")
                this.commandDone++
                this.sendCommandIfNeeded()       
            }            
        });
        
        this.onPathDoneListener = listener
    }

    togglePause() {
        this.setPause( !this.isPaused )
    }
    setPause( paused ) {        
        this.isPaused = paused;
        if ( this.isPaused == false ) {
            this.sendCommandIfNeeded()
        }
    }

    getPlotTime() {
        if ( this.plotStarted > 0 ) {
            let progress = this.bufferDone.length / this.plotCommandCount
            
            let now = new Date()
            let t = ( now - this.plotStarted ) / 1000
            
            let hours = Math.floor( t / 60 / 60 )
            let minutes = Math.floor( ( t - hours * 60 * 60 ) / 60 )
            let seconds = ( t - minutes * 60 )
            
            let tLeft = Math.max( 0, ( 1 / progress ) * t - t )
            let hoursLeft = Math.floor( tLeft / 60 / 60 )
            let minutesLeft = Math.floor(  ( tLeft - hoursLeft * 60 * 60 ) / 60 )
            let secondsLeft = Math.floor( ( tLeft - minutesLeft * 60 ))
            
            return {
                hours: hours,
                minutes: minutes,
                seconds: seconds,
                progress: progress,
                hoursLeft: hoursLeft,
                minutesLeft: minutesLeft,
                secondsLeft: secondsLeft
            }
        }
  
        return null;
    }

    plot( paths ) {      
        //this.pos = { x:0, y:0 };      
        let p = { x: this.pos.x, y: this.pos.y }
        paths.forEach( path => {
            if ( path.length > 0 ){
                let np = path[0];
                let v = {
                    x: np.x - p.x,
                    y: np.y - p.y
                }
                if ( this.length( v ) > this.params.penLiftMinDst ) {
                    this.setPen({
                        penIsDown: false
                    })
                    this.move( {
                        x: v.x,
                        y: v.y,
                        penIsDown : false
                    })
                    p = np;
                }
                this.setPen({
                    penIsDown: true
                })
                
                for ( let i = 1; i < path.length; i++ ) {
                    let np = path[i];
                    let v = {
                        x: np.x - p.x,
                        y: np.y - p.y
                    }
                    this.move({
                        x: v.x,
                        y: v.y,
                        penIsDown: true
                    })
                    p = np;
                }          
            }
        })
        this.setPen({
            penIsDown: false
        });

        this.plotStarted = new Date()
        this.plotCommandCount = this.buffer.length
        this.isPaused = false

        this.sendCommandIfNeeded()
    }

    stop() {
        
        if ( this.buffer.length == 0 ) {
            this.pos = { x:0, y:0 }
        }

        this.isPaused = false
        this.buffer = []
        this.plotStarted = -1
        this.plotCommandCount = 0        
        
        this.setPen({
            penIsDown: false
        });
        this.sendCommandIfNeeded()
    }

    home() {
        this.move( {
            x: -this.pos.x,
            y: -this.pos.y,
            penIsDown : false
        })
        this.sendCommandIfNeeded()
    }

    dist( p1, p2 ) {
        let vx = p2.x - p1.x;
        let vy = p2.y - p1.y
        return Math.sqrt( vx * vx + vy * vy )
    }

    length( v ) {
        return Math.sqrt( v.x * v.x + v.y * v.y )
    }

    sendCommandIfNeeded() {
        //console.log("sendCommandIfNeeded", this.buffer.length, this.commandSent, this.commandDone, this.isPaused );
        if ( this.buffer.length > 0 && this.commandSent == this.commandDone && this.isPaused == false ) {
            let cmd = this.buffer.shift()
            let msg = this.getCommand( cmd )
            this.sendMsg( msg )
            this.bufferDone.push( cmd )
            this.commandSent++
            //this.sendPathsDone();           
        }
        if ( this.buffer.length == 0 ) {
            //console.log("Grbl: finished processing");
            // TODO: send finished message
            this.bufferDone = []
        }       
    }    

    getPathsDone( n ) {
        if ( n == undefined ) {
            n = 0
        }
        let paths = [];
        if ( this.bufferDone.length > 0 && n < this.bufferDone.length ) {
            for ( let i = n; i < this.bufferDone.length; i++ ) {
                let cmd = this.bufferDone[i]
                if ( cmd.type == "move" && cmd.penIsDown == true ) {
                    paths.push( [
                        { x: cmd.posA.x, y: cmd.posA.y },
                        { x: cmd.posB.x, y: cmd.posB.y }])
                }
            }
        }
        return paths;
    }

    getPos() {        
        if ( this.bufferDone.length > 0 ) {
            for ( let i = this.bufferDone.length - 1; i >= 0; i-- ) {
                let cmd = this.bufferDone[ i ];
                if ( cmd.type == "move" ) {
                    return cmd.posB
                }
            }
        }
        return this.pos        
    }

    // sendPathsDone() {
    //     let paths = [];
    //     if ( this.bufferDone.length > 0 ) {            
    //         this.bufferDone.forEach( cmd=> {
    //             if ( cmd.type == "move" && cmd.penIsDown == true ) {
    //                 paths.push( [
    //                     { x: cmd.posA.x, y: cmd.posA.y },
    //                     { x: cmd.posB.x, y: cmd.posB.y }]);
    //             }
    //         })            
    //     }
    //     if ( this.onPathDoneListener != null ) {
    //         this.onPathDoneListener( paths );
    //     }
    // }

    init() {
        // lock all stepper positions
        this.sendMsg("$1=255");
        this.commandSent++;

        this.setPen({
            penIsDown: false
        })
    }

    sendMsg( msg ) {
        if ( this.inited == true ) {
            this.serialPort.write( msg + "\n", function(err) {
                if (err) {
                    return console.log('Grbl: Error on write: ', err.message);
                }
                //console.log('Grbl: serial out', msg );
            });	
        }
    }

    move( data ) {
        this.buffer.push( {
            type: "move",
            posA: { x:this.pos.x, y:this.pos.y },
            posB: { x:this.pos.x + data.x, y:this.pos.y + data.y },
            penIsDown: data.penIsDown,
            isDone: false
        });
        this.pos.x += data.x;
        this.pos.y += data.y;

        this.sendCommandIfNeeded();
    }

    setPen( data )
    {        
        this.penIsDown = data.penIsDown;
        this.buffer.push( {
            type: "pen",        
            penIsDown: data.penIsDown,
            isDone: false
        });

        this.sendCommandIfNeeded();
    }

    penToggle() {
        this.penIsDown = !this.penIsDown;
        this.setPen({
            penIsDown: this.penIsDown
        })
    }

    getCommand( cmd ) {
        let msg = "";
        if ( cmd.type == "move" )
        {
            let vx = cmd.posB.x - cmd.posA.x;
            let vy = cmd.posB.y - cmd.posA.y;
            let stepsx = vx * this.params.unitMultiplyer;
            let stepsy = vy * this.params.unitMultiplyer;
            let xStr = stepsx.toFixed(10);
            let yStr = -stepsy.toFixed(10);    
            
            msg = "G91 G01 X" + xStr + " Y" + yStr + " F" + (cmd.penIsDown ? this.params.feedRateSlow : this.params.feedRateFast);
            
        }
        else if ( cmd.type == "pen" )
        {        
            msg = "G90 G01 Z" + (cmd.penIsDown ? this.params.penDown : this.params.penUp) + " F" + this.params.feedRateSlow;
        }        
        cmd.isDone = true;
        return msg;
    }
}