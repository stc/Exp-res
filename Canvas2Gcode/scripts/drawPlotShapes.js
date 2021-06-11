function drawPlotShapes() {
    noFill();
    for(let i=0; i<30; i++) {
        ellipse(200+i*4, 400, 100, 100 + i);
    }
    
    rect(100, 100, 100, 100);
    rect(200, 200, 100, 100);
      
    // -> fillText !?
    textSize(20);
    fill(0);
    stroke(0);
    text("A", 50, 50);
    noFill();

    beginShape();
    for(let i=0; i<30; i++) {
        vertex(random(100)+400, random(100) + 200);
    }
      
    for(let i=0; i<30; i++) {
        curveVertex(random(40)+400, random(20) + 400);
    }
    endShape();
}