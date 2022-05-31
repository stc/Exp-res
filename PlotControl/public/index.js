let canvas
let params = {}
let canvasDiv
let paths = []
let pathsDone = []
let pos = {x:0, y:0}
let progress = false

function setup() {	
    canvasDiv = document.getElementById("canvas")
    //canvas = createCanvas( canvasDiv.offsetWidth, canvasDiv.offsetHeight )
    canvas = createCanvas(500,500);
    canvas.parent("canvas")

    loadParams()
    loadPaths()

    setInterval(()=>{
        if ( pathsDone ) {
            load("/getPathsDone?index="+pathsDone.length, e=>{
                p = JSON.parse(e)
                if ( p.length > 0 ) {
                    p.forEach( path =>{
                        pathsDone.push( path )
                    })
                    progress = true
                }
            });
        }
    }, 500 )

    setInterval(()=>{
        load("/getPos", e=>{
            let p = JSON.parse(e)       
            if ( dist( p.x, p.y, pos.x, pos.y ) > 0 ) {
                pos = p
                progress = true
            }
        })
    }, 200 )    

    //document.getElementById("title").innerHTML = Math.floor( data.progress * 100) + "% ~ " + data.hoursLeft + ":" + data.minutesLeft + ":" + data.secondsLeft;    
    pos = {x:0, y:0}
}

function draw() {
    if ( progress ) {        
        background( 255 );
        if ( params ) {
            push();
            
            let screenRatio = width / height
            let areaRatio = params.width / params.height
            translate( width / 2, height / 2)
            if ( screenRatio <= areaRatio ) {
                scale( width / params.width )
            } else {            
                scale( height / params.height );           
            }
            translate( -params.width / 2, -params.height / 2 )
            noStroke(); fill(0, 20); rect(0, 0, params.width, params.height);            
            if ( paths.length > 0 ) {
                paths.forEach( path => {			
                    beginShape();
                    path.forEach( p => {
                        vertex( p.x, p.y )
                    })
                    strokeWeight( 0.2 )
                    stroke( color( 0, 200 ) )
                    noFill();
                    endShape(OPEN);
                })
            }
    
            if ( pathsDone.length > 0 ) {
                pathsDone.forEach( path => {			
                    beginShape();			
                    path.forEach( p => {
                        vertex( p.x, p.y )
                    });
                    strokeWeight( 1 )
                    stroke( color( 255, 0, 0, 100 ))
                    endShape(OPEN)
                })
            }
        
            strokeWeight( 0.5 )
            stroke( color( 255, 0, 0, 200 ))
            line( 0, pos.y, params.width, pos.y )
            line( pos.x, 0, pos.x, params.height )            

            pop()
        }
        progress = false
    }
}

function windowResized() {
    resizeCanvas( canvasDiv.offsetWidth, canvasDiv.offsetHeight )
    progress = true
  }

function loadParams() {
    load("/getParams", (e)=>{        
        params = JSON.parse(e)
        progress = true
    })
}

function loadPaths() {
    load("/getPaths", (e)=>{
        paths = JSON.parse(e)     
        progress = true
    })
}

function onPlay() {
    load("/plot", (e)=>{
        console.log("onPlay", e)
    })
}

function onPauseToggle() {
    load("/pauseToggle", (e)=>{
        console.log("onPause", e)
    })
}

function onStop() {
    load("/stop", (e)=>{
        console.log("onStop", e)
    })
}

function onPenToggle() {
    load("/penToggle", (e)=>{
        console.log("onPenToggle", e)
    })
}

function onHome() {
    load("/home", (e)=>{
        console.log("onHome", e)
    })
}

function move( x, y, isPenDown ) {
    load("/move?x="+x+"&y="+y+"&isPenDown="+isPenDown, (e)=>{ 
        console.log("move", e)    
    })
}

function onBBox() {
    move( params.width, 0, false )
    move( 0, params.height, false )
    move( -params.width, 0, false )
    move( 0, -params.height, false )
}

function load(url, callback) {
    var xhr = new XMLHttpRequest()  
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        callback(xhr.response)
      }
    }
  
    xhr.open('GET', url, true)
    xhr.send('')

    return xhr.response
  }


function onParamChanged( e, param, type ) {    
    load( "/setParam?param="+ param +"&type=" + type + "&value=" + (type=="boolean" ? Boolean(e.checked ? true : false) : (type=="number" ? Number(e.value) : e.value)), (res) =>{
        loadParams()
        loadPaths()
    })     
}

function keyPressed() {
	if ( keyCode == LEFT_ARROW ) {
		move( -10, 0 ,false );
	}
	if ( keyCode == RIGHT_ARROW ) {
		move( 10, 0 ,false );
	}
	if ( keyCode == UP_ARROW ) {
		move( 0, -10 ,false );
	}
	if ( keyCode == DOWN_ARROW ) {
		move( 0, 10 ,false );
	}
}