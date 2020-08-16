import React, {Component} from 'react'
import {fabric} from 'fabric'
import FabricMakeObject from './FabricMakeObject'


class FabricCanvas extends Component{

    __canvas = null;
    __MakeTool = null;



    


    componentDidMount()
    {
        this.__canvas = new fabric.Canvas('c', { selection: false });
        var canvas = this.__canvas;
        this.__MakeTool = new FabricMakeObject(this.__canvas);


        const line1 = this.__MakeTool.makeRotatingLine([ 200, 200, 330, 200 ], {
            fill: 'red',
            stroke: 'red',
            strokeWidth: 5,
          });

        canvas.add(line1);


        // Disables group selection.
        canvas.on('selection:created', (e) => {
            if(e.target.type === 'activeSelection') {
            canvas.discardActiveObject();
            } else {
            //do nothing
            }
        })
  
        // Keeps objects inside canvas. undos move/rotate/scale out of canvas.
        canvas.on('object:modified', function (options) {
            let obj = options.target;
            let boundingRect = obj.getBoundingRect(true);
            if (boundingRect.left < 0
                || boundingRect.top < 0
                || boundingRect.left + boundingRect.width > canvas.getWidth()
                || boundingRect.top + boundingRect.height > canvas.getHeight()) {
                obj.top = obj._stateProperties.top;
                obj.left = obj._stateProperties.left;
                obj.angle = obj._stateProperties.angle;
                obj.scaleX = obj._stateProperties.scaleX;
                obj.scaleY = obj._stateProperties.scaleY;
                obj.setCoords();
                obj.saveState();
            }
        });
    }

    render()
    {
        const canvasStyle = { 
            border:'1px solid #000',
            float:'left',
        };
        return(
            <>
              <canvas id = 'c' resize = 'true' width ='800' height='500' style = {canvasStyle}></canvas>  
            </>
        );
    }
}

export default FabricCanvas;