import React, {Component} from 'react'
import {fabric} from 'fabric'
import FabricMakeObject from './FabricMakeObject'
import 'fabric-customise-controls'

import pSrc from '../asset/image/add-icon.svg'
import patternline from '../asset/image/pattern-line.png'

class FabricCanvas extends Component{

    __canvas = null;
    __MakeTool = null;

    static activeCanvas = null;

    state = {
        sel_x1:0,
        sel_y1:0,
        sel_x2:0,
        sel_y2:0,
    }
    

    componentDidMount()
    {
        this.__canvas = new fabric.Canvas('c', { selection: false });
        this.__MakeTool = new FabricMakeObject(this.__canvas);

        this.setHandler();
        //#region test 
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
        //#endregion

        var connector = this.__MakeTool.makeCustomLine([100, 100, 300, 100], {
            strokeWidth: 3,//선 두께
            fill: 'black',
            stroke: 'black',
            strokeDashArray:[3,3],
            heads: [1,3],//양 끝 화살표 유무 [1,1]
            size:10,//화살표 크기
        }, this.__canvas);
        
        var connector2 = this.__MakeTool.makeCustomLine([100, 200, 300, 200], {
            strokeWidth: 3,//선 두께
            fill: 'black',
            stroke: 'black',
            strokeDashArray:[3,3],
            heads: [2,2],//양 끝 화살표 유무 [1,1]
            size:10,//화살표 크기
        }, this.__canvas);

        this.__canvas.add(connector);
        this.__canvas.add(connector2);

        this.__canvas.renderAll();

        FabricCanvas.activeCanvas = this;
        
    }

    static getInstance = () =>{
        return FabricCanvas.activeCanvas;
    }

    setHandler = () =>{
        var canvas = this.__canvas;

        canvas.on('object:selected', (e) =>{
            this.onSelectItem(e);
            this.onMoving(e);
        });
        canvas.on('selection:updated', (e) =>{
            this.onSelectItem(e);
            this.onMoving(e);
        });
        canvas.on('object:added', (e) => {
            this.onSelectItem(e);
        });

        canvas.on('object:moving', (e) =>{this.onMoving(e)});

        canvas.on('selection:cleared', this.onSelectionCleared);

        canvas.upperCanvasEl.tabIndex = 1000;
        canvas.upperCanvasEl.addEventListener('keydown', this.onKeyDown, false);

        // canvas.on('after:render', function() {
        //     canvas.contextContainer.strokeStyle = '#555';
        
        //     canvas.forEachObject(function(obj) {
        //       var bound = obj.getBoundingRect();
        
        //       canvas.contextContainer.strokeRect(
        //         bound.left + 0.5,
        //         bound.top + 0.5,
        //         bound.width,
        //         bound.height
        //       );
        //     })
        //   });
    }

    onMoving = (e) =>{
        var select;
        var type = e.target.get('type');
        if(type === 'connectorHandle'){
            select = e.target.connLine;
        }
        else{
            select = e.target;
        }

        this.setState({
            selectObj : select,
            sel_x1 : select.x1,
            sel_y1 : select.y1,
            sel_x2 : select.x2,
            sel_y2 : select.y2,
        });
    }
    //객체 선택했을 때, 선택한 객체 위치값 업데이트
    onSelectItem = (e) =>{
        var type = e.target.get('type');
        
        if(type === 'connectorHandle')
            return;

        console.log('onSelectItem : ', type);

        var canvas = this.__canvas;

        var filtered = canvas._objects.filter(item => item.id ==='sttHandle' || item.id === 'endHandle');
        filtered = filtered.filter(handle => handle.connLine !== e.target);
        filtered.map(item => item.set('visible', false));
    }
    
    //이벤트 : 키 입력
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

    //이벤트 : 
    onSelectionCleared = (e) =>{
        console.log('empty');

        var deselected = e.deselected;
        if(deselected){
            
        }
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