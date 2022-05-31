import simplify from "simplify-path"
import SVGLoader from "./SVGLoader.js"

export default class Optimizer {
    constructor( params ) {        
        this.params = params
        this.paths = []
        this.ids = []
        this.viewBox = null
    }

    getPaths() {
        if ( this.params.autoFit === true ) {
            this.calcAutoFitParams();
        }
        return this.getPathsTransformed( this.getSimplified( this.paths ))
    }

    getPathsTransformed( paths ) {        
        let pathsTransformed = []  
        paths.forEach( path => {
            let pathTransformed = []
            path.forEach( p => {                
                let pt = {
                    x: p.x,
                    y: p.y
                }
                pt = this.getRotated( pt, this.params.rotation )
                pt.x = ( pt.x + this.params.offsetX ) * this.params.scale
                pt.y = ( pt.y + this.params.offsetY ) * this.params.scale
                pathTransformed.push( pt )
            })            
            pathsTransformed.push( pathTransformed )
        })
        return pathsTransformed;
    }

    getSimplified( paths ) {
        if ( this.params.simplify > 0 ) {
            let pathsSimplified = []
            paths.forEach( path => {
                let pathConverted = []
                path.forEach( p => {
                    pathConverted.push( [ p.x, p.y ])
                })
                
                let pathSimplified = simplify( pathConverted, this.params.simplify )
                if ( pathSimplified.length > 1 ) {
                    pathConverted = []
                    pathSimplified.forEach( p=> {
                        pathConverted.push( {x:p[0], y:p[1] })
                    });
                    pathsSimplified.push( pathConverted )
                }
            })

            return pathsSimplified;
        }
        return paths;
    }    

    getRotated( p, angle ) {
        let theta = angle / 180 * Math.PI
        let cs = Math.cos( theta )
        let sn = Math.sin( theta )
        let px = p.x * cs - p.y * sn
        let py = p.x * sn + p.y * cs
        return { x: px, y: py }
    }

    calcAutoFitParams() {
        this.params.offsetX = 0;
        this.params.offsetY = 0;
        this.params.scale = 1;
        
        let bbox = null;
        if ( this.params.fitGeometry ) {
            this.paths = this.getPathsTransformed( this.paths );
            bbox = this.getBBox( this.paths );
        } else {
            bbox = this.viewBox;
        }
        //console.log(bbox);
        
        let newSize = this.getSizeToFit( bbox.width, bbox.height, this.params.width - this.params.border * 2, this.params.height - this.params.border * 2 );	
        this.params.scale = newSize.width / bbox.width;
        this.params.offsetX = ( this.params.width / 2 - newSize.width / 2 ) / this.params.scale - bbox.x;
        this.params.offsetY = ( this.params.height / 2 - newSize.height / 2 ) / this.params.scale - bbox.y; 
    }

    getBBox() {
        let xMin = 999999;
        let yMin = 999999;
        let xMax = -999999;
        let yMax = -999999;
        this.paths.forEach( path => {
            path.forEach( p => {
                xMin = Math.min( xMin, p.x );
                yMin = Math.min( yMin, p.y );
                xMax = Math.max( xMax, p.x );
                yMax = Math.max( yMax, p.y );
            })
        })
        return {x:xMin, y:yMin, width: (xMax - xMin), height: (yMax - yMin)}
    }
    
    getSizeToFit( srcWidth, srcHeight, dstWidth, dstHeight) {
        var srcRatio = srcWidth/srcHeight;
        var dstRatio = dstWidth/dstHeight;
    
        var width = dstWidth;
        var height = dstHeight;
    
        if (srcRatio > dstRatio) {
          height = dstWidth / srcRatio;
        }
        else if (srcRatio < dstRatio) {
          width = dstHeight * srcRatio;
        }
    
        var size = {};
        size.width = width;
        size.height = height;
    
        return size;
    }

    load( svg ) {        
        return new Promise((resolve, reject ) => {
            let svgLoader = new SVGLoader()
            svgLoader.parseSVG( svg, this.paths, this.ids ).then(e=>{

                if ( this.params.optimisePaths == true ) { 
                    let optimised = this.getOptimisePaths( this.paths );            
                    console.log( "Optimised: " + Math.round( 100 - this.getPathsLength( optimised ) / this.getPathsLength( this.paths ) * 100) + "%" );
                    this.paths = optimised;
                } 
                this.viewBox = svgLoader.viewBox
                console.log(svgLoader.viewBox)

                resolve()
            }).catch( e=>{
                reject(e)
            })
        });
    }


    getPathsLength( paths ) {
        if ( paths.length == 1 ) {
            return this.getPathLength( paths[0] );
        }
        let l = 0;
        for ( let i = 0; i < paths.length - 1; i++ ) {
            l += this.getPathLength( paths[i] );
            l += this.dist( paths[ i ][ paths[i].length - 1 ], paths[ i + 1 ][ 0 ]);
        }    
        return l;
    }

    getPathLength( path ) {
        let l = 0;
        for ( let i = 0; i < path.length - 1; i++ ) {
            l += this.dist( path[ i ], path[i + 1 ] );
        }
        return l;
    }

    getClosest( path, paths ) {
        let closest = null;
        let minDst = 99999999;
        paths.forEach( pth => {
            let d = this.dist( path[ path.length - 1 ], pth[0] );
            if ( d < minDst ) {
                minDst = d;
                closest = pth;
            }
            d = this.dist( path[ path.length - 1 ], pth[ pth.length - 1 ] );
            if ( d < minDst ) {
                minDst = d;
                closest = pth;
                // flip path direction
                // override original path
                let tmpPath = [...pth];
                pth.length = 0; // clear without new reference
                for ( let i = 0; i < tmpPath.length; i++ ) {
                    pth.push( tmpPath[ tmpPath.length - 1 - i ]);
                }
            }
        })        
        return closest;
    }

    getOptimisePaths( paths ) {
        let pathsOrig = [];
        paths.forEach( e => {
            pathsOrig.push( [...e] );
        })
        let pathsSorted = [];
        if ( pathsOrig.length > 1 ) {
            // TODO: pick to closet to the current pen position            
            let n = 0;//Math.floor( Math.random() * pathsOrig.length );
            let path = pathsOrig[ n ];
            pathsSorted.push( path );
            pathsOrig = pathsOrig.filter( e => e != path );

            while ( pathsOrig.length > 0 ) {
                path = this.getClosest( path, pathsOrig );
                pathsSorted.push( path );
                pathsOrig = pathsOrig.filter( e => e != path );
            }
            return pathsSorted;
        } else {
            return paths;
        }        
    }

    dist( p1, p2 ) {
        let vx = p2.x - p1.x;
        let vy = p2.y - p1.y;
        return Math.sqrt( vx * vx + vy * vy );
    }
}