import React, {Component} from 'react'
import {fabric} from 'fabric'
import FabricMakeObject from './FabricMakeObject'
import 'fabric-customise-controls'

import pSrc from '../asset/image/add-icon.svg'
import patternline from '../asset/image/pattern-line.png'

class FabricCanvas extends Component{
    
    __canvas = null;
    __selectedLine = null;
    __MakeTool = null;

    _focusStt;
    _focusEnd;

    componentDidMount(){
        this.__canvas = new fabric.Canvas('c', { selection: false });
        this.__MakeTool = new FabricMakeObject();

      
       this.setHandler();

        var arrow = this.__MakeTool.makeArrow([50, 50, 200, 50], {
            strokeWidth: 1,//선 두께
            fill: 'black',
            stroke: 'black',
            strokeDashArray:[2,2],
            heads: [3,4],//양 끝 화살표 유무 [1,1]
            size:10,//화살표 크기
        });
        this.__canvas.add(arrow);
        var line1 = this.__MakeTool.makeLine([ 250, 125, 400, 125 ], {
            fill: 'red',
            stroke: 'red',
            strokeWidth: 2,
            strokeDashArray:[5,5]
        });
        this.__canvas.add(line1);
        this.__canvas.renderAll();
    }

    setHandler = () =>{
        var canvas = this.__canvas;
        canvas.on('object:selected', this.onUpdate);
        canvas.on('selection:updated', this.onUpdate);

        canvas.on('object:moving', this.onObjectMoving);
        canvas.on('selection:cleared', this.onSelectionCleared);
    }

    onSelectionCleared = (e) =>{
        var deselected = e.deselected;
        if(deselected){
            this.focusOut();
        }
    }



    onUpdate = (e) => {
        var type = e.target.get('type');
        
        if(e.target.name !== 'start' && e.target.name !== 'end')
            this.focusOut();

        if(type === 'line' || type === 'arrow'){
            this.focusOut();
               


            this._focusStt = this.makeFocusPicker('start');
            this._focusEnd = this.makeFocusPicker('end');

            var o1 = 'right', o2 = 'left';
            if(e.target.x1 > e.target.x2){
                o1 = 'left';
                o2 = 'right';
            }

            this._focusStt.set({left:e.target.x1, top:e.target.y1, originX:o1}).setCoords();
            this._focusEnd.set({left:e.target.x2, top:e.target.y2, originX:o2}).setCoords();
            this._focusStt.line1 = e.target;
            this._focusEnd.line2 = e.target;

            this.__canvas.add(this._focusStt);
            this.__canvas.add(this._focusEnd);
            
        }
    }


    onObjectMoving  = (e) =>{
        console.log(e.target);

        var o1='right', o2='left';
        if(e.target.get('type') === 'arrow' || e.target.get('type') === 'line')
        {
            var line = e.target;
            var x1, x2, y1, y2;
            if(this._focusStt.top < this._focusEnd.top){
                if(this._focusStt.left < this._focusEnd.left){
                    x1 = line.left;
                    y1 = line.top;
                    x2 = line.left + line.width;
                    y2 = line.top + line.height;
                }
                else{
                    x1 = line.left + line.width;
                    y1 = line.top;
                    x2 = line.left;
                    y2 = line.top + line.height;
                    o1='left';
                    o2='right';
                }
            }
            else{
                if(this._focusStt.left < this._focusEnd.left){
                    x1 = line.left;
                    y1 = line.top + line.height;
                    x2 = line.left + line.width;
                    y2 = line.top;
                }
                else{
                    x1 = line.left + line.width;
                    y1 = line.top + line.height;
                    x2 = line.left;
                    y2 = line.top;
                    o1='left';
                    o2='right';
                }
            }

            line.set({x1:x1, x2:x2, y1:y1, y2:y2}).setCoords();

            // var angle = this.getAngle(this._focusStt, this._focusEnd);

            this._focusStt.set({left:x1, top:y1, originX:o1}).setCoords();
            this._focusEnd.set({left:x2, top:y2, originX:o2}).setCoords();

        }
        else if(e.target.get('type') === 'circle'){
            var focus = e.target;
            if (focus.name === 'start') 
            {
                focus.line1.set({
                    x1: focus.left,
                    y1: focus.top,
                    x2: this._focusEnd.left,
                    y2: this._focusEnd.top,
                    
                }).setCoords();
            }
            else if(focus.name === 'end'){
                focus.line2.set({
                    x2: focus.left,
                    y2: focus.top,
                    x1: this._focusStt.left,
                    y1: this._focusStt.top,
                    selectable: true
                }).setCoords();
            }
            var angle = this.getAngle(this._focusStt, this._focusEnd);
            this._focusStt.set({angle : angle, originX:o1}).setCoords();
            this._focusEnd.set({angle : angle, originX:o2}).setCoords();
            
        }

        this.__canvas.renderAll();
    }

    focusOut = () => {
        this._focusStt && this.__canvas.remove(this._focusStt);
        this._focusEnd && this.__canvas.remove(this._focusEnd);
    }

    getAngle = (s, e) =>{
        return Math.atan2(e.top - s.top, e.left - s.left) * 180 / Math.PI;
    }

    makeFocusPicker = (name) =>{
        var picker = new fabric.Circle({
            radius:3,
            strokeWidth:1,
            stroke:'#f3f1f9',
            fill:'white',
            hasControls:false,
            hasBorders:false,
            selectable:true,
            originX : name === 'start' ? 'right' : 'left',
            originY : 'center',
            name: name,
          });
        return picker;
    }

    render()
    {
        const canvasStyle = { 'border':'1px solid #000'};
        return(
            <>
              <canvas id = 'c' resize = 'true' width ='1000' height='1000' style = {canvasStyle}></canvas>  
            </>
        );
    }
}

export default FabricCanvas;