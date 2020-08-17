import React, {Component} from 'react'
import {fabric} from 'fabric'
import FabricMakeObject from './FabricMakeObject'
import 'fabric-customise-controls'

import pSrc from '../asset/image/add-icon.svg'
import patternline from '../asset/image/pattern-line.png'

class FabricCanvas extends Component{

    __canvas = null;
    __MakeTool = null;

    _focusStt;
    _focusEnd;

    state = {
        sel_x1:0,
        sel_y1:0,
        sel_x2:0,
        sel_y2:0,
    }
    static activeCanvas = null;

    componentDidMount()
    {
        this.__canvas = new fabric.Canvas('c', { selection: false });
        this.__MakeTool = new FabricMakeObject(this.__canvas);

        this.setHandler();

        // var arrow = this.__MakeTool.makeArrow([50, 50, 200, 50], {
        //     strokeWidth: 1,//선 두께
        //     fill: 'black',
        //     stroke: 'black',
        //     strokeDashArray:[2,2],
        //     heads: [3,4],//양 끝 화살표 유무 [1,1]
        //     size:10,//화살표 크기,
        //     angle:20
        // });
        // var arrow2 = this.__MakeTool.makeArrow([50, 50, 200, 50], {
        //     strokeWidth: 1,//선 두께
        //     fill: 'black',
        //     stroke: 'black',
        //     strokeDashArray:[2,2],
        //     heads: [3,4],//양 끝 화살표 유무 [1,1]
        //     size:10,//화살표 크기
        //     originX:'right',
        //     originY:'top',
        //     angle:20,
        // });

        // console.log(arrow);
        // console.log(arrow2);
        
        // var line1 = this.__MakeTool.makeLine([ 250, 125, 400, 125 ], {
        //     fill: 'red',
        //     stroke: 'red',
        //     strokeWidth: 2,
        //     strokeDashArray:[5,5]
        // });
        
        // var line2 = this.__MakeTool.makeLine2([ 250, 300, 400, 300 ], {
        //     fill: 'black',
        //     stroke: 'red',
        //     strokeWidth: 5,
        // });

        // const line3 = this.__MakeTool.makeRotatingLine([ 200, 200, 330, 200 ], {
        //     fill: 'red',
        //     stroke: 'black',
        //     strokeWidth: 5,
        //   });

        var connector = this.__MakeTool.makeCustomLine([100, 100, 300, 100], {
            strokeWidth: 3,//선 두께
            fill: 'black',
            stroke: 'black',
            strokeDashArray:[3,3],
            heads: [0,0],//양 끝 화살표 유무 [1,1]
            size:10,//화살표 크기
        }, this.__canvas);
        
        this.__canvas.add(connector);


        this.__canvas.renderAll();

        FabricCanvas.activeCanvas = this;
        
    }

    static getInstance = () =>{
        return FabricCanvas.activeCanvas;
    }

    setHandler = () =>{
        var canvas = this.__canvas;

        

        // canvas.on('object:selected', (e) =>{
        //     this.onUpdate(e);
        // });
        // canvas.on('selection:updated', this.onUpdate);

        canvas.on('object:selected', (e) =>{
            this.setState({
                selectObj : e.target,
                sel_x1 : e.target.x1,
                sel_y1 : e.target.y1,
                sel_x2 : e.target.x2,
                sel_y2 : e.target.y2,
            });

            console.log(e.target);
        });
        canvas.on('selection:updated', (e) =>{
            this.setState({
                selectObj : e.target,
                sel_x1 : e.target.x1,
                sel_y1 : e.target.y1,
                sel_x2 : e.target.x2,
                sel_y2 : e.target.y2,
            });
            console.log(e.target);
        });
        canvas.on('object:scaling', (e) =>{
            this.setState({
                selectObj : e.target,
                sel_x1 : e.target.x1,
                sel_y1 : e.target.y1,
                sel_x2 : e.target.x2,
                sel_y2 : e.target.y2,
            });
        });


        canvas.on('object:moving', this.onObjectMoving);
        canvas.on('mouse:move', this.onMove);
        canvas.on('mouse:up', this.onMoveUp);
        
        canvas.on('object:scaling', this.onObjectScaling);
        canvas.on('selection:cleared', this.onSelectionCleared);

        canvas.upperCanvasEl.tabIndex = 1000;
        canvas.upperCanvasEl.addEventListener('keydown', this.onKeyDown, false);
    }

    onClickOrigin = (o) =>{
        var sel_obj = this.state.selectObj;
        if(o === 'x'){
            
            if(sel_obj.originX === 'left'){
                sel_obj.set({
                    originX : 'right',
                    left:sel_obj.x2,
                    top:sel_obj.y1
                }).setCoords();
            }
            else{
                sel_obj.set({
                    originX : 'left',
                    left:sel_obj.x1,
                    top:sel_obj.y2
                }).setCoords();
            }
            console.log(sel_obj);
        }
    }

    onKeyDown = (e) =>{
        const code = e.keyCode;
        console.log(e);
        switch(e.code){
            case 'Delete':
                var activeObj = this.__canvas.getActiveObject();
                activeObj && this.__canvas.remove(activeObj);
                this.__canvas.renderAll();
                break;
        }
    }

    onSelectionCleared = (e) =>{
        console.log('empty');

        var deselected = e.deselected;
        if(deselected){
            this.focusOut();
        }
    }

    // onUpdate = (e) => {
    //     var type = e.target.get('type');
    //     console.log(type);
        
    //     if(e.target.name !== 'start' && e.target.name !== 'end')
    //         this.focusOut();

    //     if(type === 'line' || type === 'arrow'){
    //         this._focusStt = this.makeFocusPicker('start');
    //         this._focusEnd = this.makeFocusPicker('end');

    //         var o1 = 'right', o2 = 'left';
    //         if(e.target.x1 > e.target.x2){
    //             o1 = 'left';
    //             o2 = 'right';
    //         }

    //         this._focusStt.set({left:e.target.x1, top:e.target.y1, originX:o1}).setCoords();
    //         this._focusEnd.set({left:e.target.x2, top:e.target.y2, originX:o2}).setCoords();
    //         this._focusStt.line1 = e.target;
    //         this._focusEnd.line2 = e.target;

    //         this.__canvas.add(this._focusStt);
    //         this.__canvas.add(this._focusEnd);
    //         this.__canvas.renderAll();
    //     }
    // }

    isLineUpdate = false;
    lineUpdateDir = '';
    onLineMoving = (e, direction) =>{
        console.log('move - ', direction);

        this.lineUpdateDir = direction;
        this.isLineUpdate = true;
    }


    // onMove = (e) =>{
    //     if(this.isLineUpdate){
    //         var x = e.pointer.x, y = e.pointer.y;
    //         var obj = e.target;

    //         //console.log(obj._calcLinePoints());
    //         if(this.lineUpdateDir === 'moveStart'){
    //             var angle = this.getAngle(e.pointer, obj);
    //             obj.set({
    //                 angle:angle,
    //                 //x1:x, y1:y,
    //             }).setCoords();
    //         }
    //         else if(this.lineUpdateDir === 'moveEnd'){
    //             var angle = this.getAngle(obj, e.pointer);
    //             obj.set({
    //                 angle:angle,
    //                 //x2:x, y2:y,
    //             }).setCoords();
    //         }
    //         this.__canvas.renderAll();
    //     }
    //     // if(!e.target)
    //     //     return;

    //     // if(e.target.get('type') === 'line2' || e.target.get('type') === 'arrow'){
    //     //     console.log('moving'); 
    //     // }
    // }

    onMoveUp = (e) => {
        this.isLineUpdate = false;
        
    }


    onObjectMoving  = (e) =>{
        this.setState({
            selectObj : e.target,
            sel_x1 : e.target.x1,
            sel_y1 : e.target.y1,
            sel_x2 : e.target.x2,
            sel_y2 : e.target.y2,
        });
        //console.log(e.target);

        // var o1='right', o2='left';
        // if(e.target.get('type') === 'arrow' || e.target.get('type') === 'line2')
        // {
        //     var line = e.target;
        //     var x1, x2, y1, y2;
        //     if(this._focusStt.top < this._focusEnd.top){
        //         if(this._focusStt.left < this._focusEnd.left){
        //             x1 = line.left;
        //             y1 = line.top;
        //             x2 = line.left + line.width;
        //             y2 = line.top + line.height;
        //         }
        //         else{
        //             x1 = line.left + line.width;
        //             y1 = line.top;
        //             x2 = line.left;
        //             y2 = line.top + line.height;
        //             o1='left';
        //             o2='right';
        //         }
        //     }
        //     else{
        //         if(this._focusStt.left < this._focusEnd.left){
        //             x1 = line.left;
        //             y1 = line.top + line.height;
        //             x2 = line.left + line.width;
        //             y2 = line.top;
        //         }
        //         else{
        //             x1 = line.left + line.width;
        //             y1 = line.top + line.height;
        //             x2 = line.left;
        //             y2 = line.top;
        //             o1='left';
        //             o2='right';
        //         }
        //     }

        //     line.set({x1:x1, x2:x2, y1:y1, y2:y2}).setCoords();

        //     // var angle = this.getAngle(this._focusStt, this._focusEnd);

        //     this._focusStt.set({left:x1, top:y1, originX:o1}).setCoords();
        //     this._focusEnd.set({left:x2, top:y2, originX:o2}).setCoords();

        // }
        // else if(e.target.get('type') === 'circle'){
        //     var focus = e.target;
        //     if (focus.name === 'start') 
        //     {
        //         focus.line1.set({
        //             x1: focus.left,
        //             y1: focus.top,
        //             x2: this._focusEnd.left,
        //             y2: this._focusEnd.top,
                    
        //         }).setCoords();
        //     }
        //     else if(focus.name === 'end'){
        //         focus.line2.set({
        //             x2: focus.left,
        //             y2: focus.top,
        //             x1: this._focusStt.left,
        //             y1: this._focusStt.top,
        //             selectable: true
        //         }).setCoords();
        //     }
        //     var angle = this.getAngle(this._focusStt, this._focusEnd);
        //     this._focusStt.set({angle : angle, originX:o1}).setCoords();
        //     this._focusEnd.set({angle : angle, originX:o2}).setCoords();
            
        // }

        // this.__canvas.renderAll();
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
            stroke:'#000',
            //stroke:'#f3f1f9',
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
        const canvasStyle = { 
            border:'1px solid #000',
            float:'left',
        };
        const {sel_x1, sel_y1, sel_x2, sel_y2} = this.state;

        return(
            <>
                <canvas id = 'c' resize = 'true' width ='800' height='500' style = {canvasStyle}></canvas>  
                <p>x1 : {sel_x1}</p>
                <p>y1 : {sel_y1}</p>
                <p>x2 : {sel_x2}</p>
                <p>y2 : {sel_y2}</p>
            </>
        );
    }
}

export default FabricCanvas;