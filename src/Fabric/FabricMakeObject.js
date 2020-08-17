import React, {Component} from 'react'
import {fabric} from 'fabric'
import * as fabricCustom from './FabricCustom'

class FabricMakeObject extends Component{
    __canvas;
    __hideControls = {
      'tl':false,
      'tr':false,
      'bl':false,
      'br':false,
      'ml':true,
      'mt':false,
      'mr':true,
      'mb':false,
      'mtr':true
    };

    constructor(canvas){
        super();

        this.__canvas = canvas;
    }


   
    //원 생성
    makeCircle = (left, top, line1, line2, line3, line4) => {
        var c = new fabric.Circle({
            left: left,
            top: top,
            strokeWidth: 5,
            radius: 12,
            fill: '#fff',
            stroke: '#666',
        });
        c.hasControls = c.hasBorders = true;

        c.line1 = line1;
        c.line2 = line2;
        c.line3 = line3;
        c.line4 = line4;

        this.__canvas.add(c);
        this.__canvas.renderAll();
        //return c;
    }
    
    //라인 생성
    makeLine = (coords, optional) => {
      var line = new fabric.Line(coords, {
          ...optional,
        });
      //line.setControlsVisibility(this.__hideControls);
      return line;
    }

    //화살표
    makeCustomLine = (coords, optional, canvas)=>{
      var connector = new fabricCustom.CustomLine(coords, {
        ...optional,
        padding:5,
        hasBorders:false,
        hasControls:false,
      });
      
      connector.renderOn(canvas);
      //line.setControlsVisibility(this.__hideControls);
      return connector;
    }
    // loadPattern = (url, shape) => {
    //     fabric.util.loadImage(url, function(img) {
    //       shape.set('fill', new fabric.Pattern({
    //         source: img,
    //         repeat: 'repeat'
    //       }));
    //     });
    //   }

    // makePatternLine = (src, pos, padding, callback) =>
    // {
    //     var shape = new fabric.Rect({
    //         width: 200,
    //         height: 50,
    //         left: pos[0],
    //         top: pos[1],
    //         originX: 'left',
    //         originY: 'top',
    //       });
        
    //     this.loadPattern(src, shape);

    //     return shape;
       

    // }


    // makePatternLine2 = async (src, pos, callback) =>
    // {
    //     fabric.loadSVGFromURL(src, (objects, options) => {
    //         var obj;
    //         if (objects.length > 1) {
    //           obj = fabric.util.groupSVGElements(objects, options);
    //         } else {
    //           obj = objects[0];
    //         }
    //         obj.objectCaching = false;
            
    //         var shape = new fabric.Rect({
    //             width: 200,
    //             height: 300,
    //             left: pos[0],
    //             top: pos[1],
    //             originX: 'left',
    //             originY: 'top',
    //             backgroundColor:'blue',
    //         });
            
    //         shape.set('fill', new fabric.Pattern({
    //             source: obj,
    //             repeat: 'repeat'
    //         }));
    //         callback(shape);    
    //       });

      
    // }
}

export default FabricMakeObject;