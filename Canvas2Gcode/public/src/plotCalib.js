function drawPlotCalib( p ) {
    p.rect(0,0,p.width,p.height);
    p.line(p.width/2,0,p.width/2,p.height);

    p.line(p.width/2,0,p.width,p.height);
    p.line(p.width/2,p.height,p.width,0);
}