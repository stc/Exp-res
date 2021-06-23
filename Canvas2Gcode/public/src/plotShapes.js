let worldShapes = [];
let screenShapes = [];
let num = 120;
let w = 5;
  
function setupPlotShapes( p ) {
    for(let i=0; i<num; i++) {
        let s = [ p.createVector(0,0), p.createVector(w,0), p.createVector(w,w), p.createVector(0,w)];
        let s_copy = [ p.createVector(0,0), p.createVector(w,0), p.createVector(w,w), p.createVector(0,w)];
        worldShapes.push(s);
        screenShapes.push(s_copy);
    }
}

function drawPlotShapes( p ) {
    // original shape transformations
    for(let i=0;i<num;i++) {
        p.push();
        p.translate(p.width/2,p.height/2);
        p.rotate(i*1.56);
        p.scale(i/4,i/4);
        p.beginShape();
    
        p.stroke(0,30);
        for(let j=0;j<4;j++) {
        //p.vertex(worldShapes[i][j].x, worldShapes[i][j].y);
        screenShapes[i][j] = p.screenPosition(worldShapes[i][j]);
        }
        p.endShape();
        p.pop();
    }
  
    // world-to-screen projection to plot
    p.stroke(0);
    p.strokeWeight(2);
    for(let i=0;i<num;i++) {
    
        if(i%5==0) {
            p.beginShape();
            for(let j=0;j<4;j++) {
                p.vertex(screenShapes[i][j].x,screenShapes[i][j].y);
            }
            p.curveVertex(screenShapes[i][0].x,screenShapes[i][0].y);
            p.endShape();
        } else {
            p.beginShape();
            for(let j=0;j<4;j++) {
                p.curveVertex(screenShapes[i][j].x,screenShapes[i][j].y);
            }
            p.endShape();
        }
    }
}