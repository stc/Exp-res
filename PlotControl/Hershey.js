import SVGLoader from "./SVGLoader.js"


export default class HersheyFont {
    constructor( params ) {
        this.params = params
        this.params.fontScale = this.params.fontScale
        this.letterSpacing = 5
        this.spaceSize = 15
        this.lineHeight = 35
// TODO: dont scale font by default, use scale at getGlyph( g, p )-transforms
        this.svgGlyphVerticalSpacing = 43.2;
        this.svg = {}
        this.glyphs = []       
        let svgLoader = new SVGLoader()
        let paths = []
        let ids = []
        
        // load fotn file into paths and ids array
        svgLoader.loadFile("Hershey.font", paths, ids ).then(e=>{
            // create Glyphs structure: {"id":id, paths:[], bbox: }
            // TODO: scale ++++ g.mOffsetY = ( i / 13 + 1) * mSvgGlyphVerticalSpacing;
            for ( let i = 0; i < ids.length; i++ ) {
                let glyph = this.getGlyphById( ids[i] )                
                // create new glyph or add to existing one
                if ( glyph ) {
                    glyph.paths.push( paths[i] )
                } else {
                    glyph = { id: ids[i], paths: [ paths[i] ]}
                    this.glyphs.push( glyph )                    
                }
            }

            for ( let i = 0; i < this.glyphs.length; i++ ) {
                // scale and offset glyph paths points   
                //console.log( this.glyphs[i].id, Math.floor(i/13))
                let transformed = []
                let minX = 99999999
                let minY = 99999999
                let maxX = -99999999
                let maxY = -99999999
                let offsetY = ( Math.floor( i / 13 ) + 1 ) * this.svgGlyphVerticalSpacing
                this.glyphs[i].paths.forEach( path=>{
                    path.forEach( p=>{
                        p.y -= offsetY                        
                        minX = Math.min( minX, p.x )
                        minY = Math.min( minY, p.y )
                        maxX = Math.max( maxX, p.x )
                        maxY = Math.max( maxY, p.y )
                    })
                })
                // calc bounding box
                this.glyphs[i].bbox = { x: minX, y: minY, w: ( maxX - minX ), h: (maxY - minY ) }

                this.glyphs[i].paths.forEach( path=>{
                    path.forEach( p=>{
                        p.x -= this.glyphs[i].bbox.x
                    })
                })
                this.glyphs[i].bbox.x = 0                
            }            
        }).catch(e=>{
            console.log("SingleLineFont:", e)
        })                
    }  

    getGlyphById( id ) {
        for ( let i = 0; i < this.glyphs.length; i++ ) {
            if ( this.glyphs[i].id == id ) {
                return this.glyphs[i]
            }
        }
        return null
    }       

    getGlyph( g, p ) {
        let paths = []
        g.paths.forEach( path=>{
            let transformed = []
            path.forEach( pt=>{
                transformed.push( {x: p.x + pt.x * this.params.fontScale, y: p.y + pt.y * this.params.fontScale})
            })
            paths.push( transformed )
        })
        return paths;
    }

    getString( str, p, width ) {
        let paths = []
        let words = str.split(" ")        
        let startX = p.x
        for ( let i = 0; i < words.length; i++ ) {
            if ( p.x + this.getWordWidth( words[i] ) > startX + width && p.x > startX ) {
                p.y += this.lineHeight * this.params.fontScale
                p.x = startX
            }
            
            for ( let j = 0; j < words[i].length; j++ ) {
                let g = this.getGlyphById( words[i][j] )    
                if ( g ) {            
                    let gTransformed = this.getGlyph( g, p )
                    gTransformed.forEach( path=>{
                        paths.push( path )
                    })
                    p.x += g.bbox.w * this.params.fontScale + this.letterSpacing * this.params.fontScale
                }
            }
            p.x += this.spaceSize * this.params.fontScale
        }
        return paths
    }

    getWordWidth( str ) {
        let w = 0
        for ( let i = 0; i < str.length; i++ ) {
            let g = this.getGlyphById( str[i] )
            if ( g ) {
                w += g.bbox.w * this.params.fontScale + this.letterSpacing * this.params.fontScale
            }
        }
        return w
    }
}