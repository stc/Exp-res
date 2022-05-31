
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fs = require("fs");
import { parse, stringify } from 'svgson'
import SVGPathParser from 'svg-pathdata';
import pkg from 'transformation-matrix';
const {fromString, compose, transform, applyToPoint} = pkg;

//import {fromString, compose, transform, applyToPoint} from 'transformation-matrix';

import decode from 'unescape'

export default class SVGLoader {
    constructor(){        
    }
    
    loadFile( fileName, paths, ids ) {
        let thiz = this
        return new Promise((resolve, reject ) => {
            fs.readFile( fileName, 'utf8', function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    thiz.parseSVG( data, paths, ids )
                    resolve();
                }
            })
        })
    }

    parseSVG( svg, paths, ids ) {
        return new Promise((resolve, reject ) => {            
            parse( svg ).then( json => {
                //console.log(JSON.stringify(json, null, 2))                
                this.createPathsFromJson( json, paths, ids );                
                resolve("Optimizer:load:paths created");
            }).catch((e)=>{
                reject(e);
            })
        });
    }

    createPathsFromJson( json, paths, ids ) {        
        let viewParams = json.attributes.viewBox.split(' ');        
        this.viewBox = {x:Number(viewParams[0]), y:Number(viewParams[1]), width:Number(viewParams[2]), height:Number(viewParams[3])};        
        ids.splice(0, ids.length)
        paths.splice(0, paths.length)
        this.parseSVGElement( json, paths, ids, null, null );
    }

    parseSVGElement( jsonElement, paths, ids, matrix, parentId ) {
        if ( jsonElement.children.length ) {
            jsonElement.children.forEach( c=> {
                // recursivly multiply parent matrices
                let id = null
                // find parentID and assosiate all children with their parent id
                if ( c.attributes.id && jsonElement.attributes.id && c.children.length == 0 ) {
                    if ( jsonElement.attributes["serif:id"] ) {
                        id = decode(jsonElement.attributes["serif:id"])
                    }  else {
                        id = jsonElement.attributes.id
                    }                    
                }
                let m = matrix
                if ( c.attributes ) {
                    if ( c.attributes.transform ) {
                        let mat = fromString( c.attributes.transform )
                        if ( m ) {                            
                            m = transform([m, mat])
                        } else {
                            m = mat
                        }          
                    }
                }
                this.parseSVGElement( c, paths, ids, m, id );
            })
        } else {            
            this.parseSVGPathData( jsonElement, paths, ids, matrix, parentId );            
        }
    }

    parseSVGPathData( jsonElement, paths, ids, matrix, parentId ) {
        
        if ( jsonElement.attributes.d ) {            
            // TODO: use https://www.npmjs.com/package/svg-path-parser
            // and parse the whole d attrib    
            let rows = jsonElement.attributes.d.split("\n")
            rows.forEach( row => {
                let pathData = SVGPathParser.SVGPathData( row );
                            
                let path = []
                pathData.commands.forEach( cmd => {                
                    if ( cmd.type == 2 || cmd.type == 16 ) {

                        // apply matrix transform if needed
                        if ( matrix ){                            
                            let mp = applyToPoint(matrix, cmd)
                            cmd.x = mp.x
                            cmd.y = mp.y                            
                        }           
                        // new path
                        if ( cmd.type == 2 ) {
                            // if there was a prev. path store it
                            if ( path.length > 1 ) {
                                paths.push( path )
                                ids.push( parentId )
                            }
                            // create a new path with a first point
                            path = [{x:cmd.x, y:cmd.y}]
                        } else if ( cmd.type == 16 ) {
                            // keep adding points
                            path.push( {x:cmd.x, y:cmd.y} );
                        }                    
                    }
                })
                // add the last path, if its valid
                if ( path.length > 1 ) {
                    paths.push( path )
                    ids.push( parentId )
                }
            })
        }
    }    
}