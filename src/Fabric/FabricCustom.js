import {fabric} from 'fabric'


export var CustomLine = fabric.util.createClass(fabric.Line, {
  type: 'connectline',
  
  sttHandle:null,
  endHandle:null,

  startPoint:null,
  endPoint:null,

  initialize: function (points, options, canvas) {
    const stt = new fabric.Point(points[0], points[1])
    const end = new fabric.Point(points[2], points[3])
    
    this.startPoint = {x : stt.x, y:stt.y};
    this.endPoint = {x:end.x, y:end.y};
    
    options = options || {}
    this.callSuper('initialize', [stt.x, stt.y, end.x, end.y], {
      noScaleCache: false, // false to force cache update while scaling (doesn't redraw parts of line otherwise)
      selectable: true,
      evented: true, // true because you want to select line on click
      //minScaleLimit: 0.25, // has no effect now because we're resetting scale on each scale event
      lockRotation: false,
      // hasRotatingPoint: false, // to disable rotation control
      centeredRotation: false,
      centeredScaling: false,
      
      originX: "center",    // origin of rotation/transformation.      
      originY: "center",    // origin of rotation/transformation.

      // lockMovementX: true,
      // lockMovementY: true,
      lockScalingFlip: true,
      lockScalingX: false,
      lockScalingY: false,
      lockSkewingX: false,
      lockSkewingY: false,
      ...options,
      
    });

    this.sttHandle = new ConnectorHandle('sttHandle', stt, this,{
      originX: "right",
    });
    this.endHandle = new ConnectorHandle('endHandle', end, this,{
      originX: "left",
    });

    this.sttHandle.setPairHandle(this.endHandle);
    this.endHandle.setPairHandle(this.sttHandle);

    this.on('moving', this.onMoving);

    this.on('selected', (e) =>{
      this.sttHandle.set('visible', true);
      this.endHandle.set('visible', true);
    });
    this.on('scaling', this.onScaling);
    this.renderOn(canvas);
  },

  fromObject: function (object, callback) {
    return new CustomLine(object);
  },

  toObject: function() {
    return fabric.util.object.extend(this.callSuper('toObject'), {});
  },

  renderOn:function(canvas){
    canvas.add(this.sttHandle);
    canvas.add(this.endHandle);
    
    canvas.on('selection:cleared', (e) =>{
      console.log('empty2');
      this.sttHandle.set('visible', false);
      this.endHandle.set('visible', false);
    });
  },


  _render: function(ctx) {
    this.ctx = ctx;
    this.callSuper('_render', ctx);

    if(this.heads[0] !== 0 && this.heads[1] !== 0){
      let p = this.calcLinePoints();
      let xDiff = this.x2 - this.x1;
      let yDiff = this.y2 - this.y1;
      let angle = Math.atan2(yDiff, xDiff);
      this.drawArrow(angle, p.x2, p.y2, this.heads[0], this.size);
      ctx.save();
      xDiff = -this.x2 + this.x1;
      yDiff = -this.y2 + this.y1;
      angle = Math.atan2(yDiff, xDiff);
      this.drawArrow(angle, p.x1, p.y1,this.heads[1], this.size);
    }
  },

  onMoving:function(e){
    var _oldCenterX = (this.x1 + this.x2) / 2;
    var _oldCenterY = (this.y1 + this.y2) / 2;
    var _deltaX = this.left - _oldCenterX;
    var _deltaY = this.top - _oldCenterY;

    var x1 = this.x1 + _deltaX,
        y1 = this.y1 + _deltaY,
        x2 = this.x2 + _deltaX,
        y2 = this.y2 + _deltaY;
        
    this.setPosition(x1, x2, y1, y2);
    
  },

  onScaling:function(e){
    var x1 = ((this.x1 - this.left) * this.scaleX) + this.left,
        x2 = ((this.x2 - this.left) * this.scaleX) + this.left,
        y1 = ((this.y1 - this.top) * this.scaleY) + this.top,
        y2 = ((this.y2 - this.top) * this.scaleY) + this.top;

    this.setPosition(x1, x2, y1, y2);
  
  },

  setPosition : function(x1, x2, y1, y2){
    this.set({
      x1: x1, y1: y1, 
      x2: x2, y2: y2
    }).setCoords();

    this.setSttXY(x1, y1);
    this.setEndXY(x2, y2);
    
    var angle = this.getAngle();
    
    this.sttHandle.set({
      left: x1,
      top: y1,
      angle: angle
    }).setCoords();
    
    this.endHandle.set({
      left: x2,
      top: y2,
      angle: angle
    }).setCoords();
  },
  drawArrow: function(angle, xPos, yPos, head, size) {
      this.ctx.save();        
   
      this.ctx.translate(xPos, yPos);
      this.ctx.rotate(angle);
      this.ctx.lineWidth = this.strokeWidth;
      

      //헤드 종류별 렌더링
      if (head === 1)//화살표(채운것)
      {
          this.ctx.beginPath();
          this.ctx.moveTo(0, 0);
          this.ctx.lineTo(-size, size/2);
          this.ctx.lineTo(-size, -size/2);
          this.ctx.closePath();
      }
      else if(head === 2)//동그라미
      {
          this.ctx.beginPath();
          this.ctx.ellipse(-size/2,0,size/2,size/2, 0, 0, 360);
          this.ctx.closePath();
      }
      else if(head === 3)//세로선?
      {
          this.ctx.beginPath();
          this.ctx.moveTo(0, size/2);
          this.ctx.lineTo(0, -size/2);
          this.ctx.closePath();
      }
      else if(head === 4)
      {
          this.ctx.beginPath();
          this.ctx.moveTo(0, 0);
          this.ctx.lineTo(-size, size/2);
          this.ctx.moveTo(0, 0);
          this.ctx.lineTo(-size, -size/2);
          this.ctx.closePath();
      }

      if(head !== 2)
          this.ctx.fill();
    
      this.ctx.stroke();//path선에 스트로크 적용
      this.ctx.fillStyle = this.stroke;
      this.ctx.restore();
  },

  getAngle : function () {
    return Math.atan2(this.endPoint.y - this.startPoint.y, this.endPoint.x - this.startPoint.x) * 180 / Math.PI;
  },

  setSttXY: function(x, y){
    this.startPoint.x = x;
    this.startPoint.y = y;
  },

  setEndXY: function(x, y){
    this.endPoint.x = x;
    this.endPoint.y = y;
  },
})

export var ConnectorHandle = fabric.util.createClass(fabric.Circle, {

  type: "connectorHandle",
  id:'',

  connLine:null,//해당 핸들이 영향을 주는 라인
  pairHandle:null,//해당 핸들과 짝이되는 핸들 (stt - end)

	initialize: function (id, point, line, options) {
  
  	options = options || {};
  
  	this.id = id;
    this.connLine = line;

  	this.callSuper('initialize', {
      left: point.x,
      top: point.y,
      strokeWidth: 2,
      radius: 6,
      fill: '#fff',
      stroke: '#000',//'#f3f1f9',
      originX: "center",
      originY: "center",
      selectable: true,
      lockScalingX: true,
      lockScalingY: true,
      lockRotation: true,
      hasBorders: false,
      padding:5,
      hasControls: false,     	
      hoverCursor: "pointer",
      visible:false,
      ...options,
    });

    this.on('moving', this.onMoving);
    
    this.on('deselected', (e) =>{
      this.set('visible', false);
      this.pairHandle.set('visible', false);
    });
  },

  setPairHandle: function(pair){
    this.pairHandle = pair;
  },

  fromObject: function (object, callback) {
    return new ConnectorHandle(object);
  },

  toObject: function() {
    return fabric.util.object.extend(this.callSuper('toObject'), {});
  },

  onMoving:function(e){
    var x = this.left, y = this.top; 

    if(this.id === 'sttHandle'){
      this.connLine.set({
        x1: x, y1: y
      }).setCoords();
      this.connLine.setSttXY(x, y);
    }
    else if(this.id === 'endHandle'){
      this.connLine.set({
        x2: x, y2: y
      }).setCoords();
      this.connLine.setEndXY(x, y);
    }
    
    var angle = this.connLine.getAngle();
    
    
    this.set({
      left: x,
      top: y,
      angle: angle
    }).setCoords();

    this.pairHandle.set({
      angle: angle
    }).setCoords();
    
  }
});
// export var LineArrow = fabric.util.createClass(fabric.Line, {
//   type: 'arrow',
  
//   minLength: 0, // we need to set this thing in px now
  
//   prevStt:null,
//   prevEnd:null,
//   rotX : 0, //회전한 결과 값
//   rotY : 0, //회전한 결과 값

//   getRadian: function(stt, end){
//     //라인 방향 벡터
//     const vectorB = end.subtract(stt);

//     // find angle between line's vector and x axis
//     let angleRad = Math.atan2(vectorB.y, vectorB.x)
//     if (angleRad < 0) {
//       angleRad = 2 * Math.PI + angleRad
//     }
//     return angleRad;
//   },
  
//   getDegree: function(stt, end){
//     const angleRad = this.getRadian(stt, end);
//     const angleDeg = fabric.util.radiansToDegrees(angleRad);

//     return angleDeg;
//   },


//   initialize: function (points, options) {
//     const stt = new fabric.Point(points[0], points[1])
//     const end = new fabric.Point(points[2], points[3])
    
//     const angleRad = this.getRadian(stt, end);
//     const angleDeg = this.getDegree(stt, end);

//     // find initial horizontal position by rotating the tip back
//     const rotatedPos = fabric.util.rotatePoint(end.clone(), stt, -angleRad)

//     options = options || {}
//     this.callSuper('initialize', [stt.x, stt.y, rotatedPos.x, rotatedPos.y], {
//       noScaleCache: false, // false to force cache update while scaling (doesn't redraw parts of line otherwise)
//       selectable: true,
//       evented: true, // true because you want to select line on click
//       //minScaleLimit: 0.25, // has no effect now because we're resetting scale on each scale event
//       lockRotation: false,
//       // hasRotatingPoint: false, // to disable rotation control
//       centeredRotation: false,
//       centeredScaling: false,
      
//       originX: "left",    // origin of rotation/transformation.      
//       originY: "top",    // origin of rotation/transformation.

//       // lockMovementX: true,
//       // lockMovementY: true,
//       lockScalingFlip: true,
//       lockScalingX: false,
//       lockScalingY: false,
//       lockSkewingX: false,
//       lockSkewingY: false,
      
//       // lockUniScaling: true,
//       angle: angleDeg, // note that we use the calculated angle no matter what
//       ...options,
      
//     })

//     this.prevStt = stt;
//     this.prevEnd = end;

//     this.on('moving', this.onMoving);
    
//     this.on('scaling', this.onScaling);

//     this.on('mouseup', this.onMouseUp);
//   },

//   _render: function(ctx) {
//     this.ctx = ctx;
//     this.callSuper('_render', ctx);
//     let p = this.calcLinePoints();
//     let xDiff = this.x2 - this.x1;
//     let yDiff = this.y2 - this.y1;
//     let angle = Math.atan2(yDiff, xDiff);
//     this.drawArrow(angle, p.x2, p.y2, this.heads[0], this.size);
//     ctx.save();
//     xDiff = -this.x2 + this.x1;
//     yDiff = -this.y2 + this.y1;
//     angle = Math.atan2(yDiff, xDiff);
//     this.drawArrow(angle, p.x1, p.y1,this.heads[1], this.size);
//   },

//   drawArrow: function(angle, xPos, yPos, head, size) {
//       this.ctx.save();        
   
//       this.ctx.translate(xPos, yPos);
//       this.ctx.rotate(angle);
//       this.ctx.lineWidth = this.strokeWidth;
      

//       //헤드 종류별 렌더링
//       if (head === 1)//화살표(채운것)
//       {
//           this.ctx.beginPath();
//           this.ctx.moveTo(0, 0);
//           this.ctx.lineTo(-size, size/2);
//           this.ctx.lineTo(-size, -size/2);
//           this.ctx.closePath();
//       }
//       else if(head === 2)//동그라미
//       {
//           this.ctx.beginPath();
//           this.ctx.ellipse(size/2,0,size/2,size/2, 0, 0, 360);
//           this.ctx.closePath();
//       }
//       else if(head === 3)//세로선?
//       {
//           this.ctx.beginPath();
//           this.ctx.moveTo(0, size/2);
//           this.ctx.lineTo(0, -size/2);
//           this.ctx.closePath();
//       }
//       else if(head === 4)
//       {
//           this.ctx.beginPath();
//           this.ctx.moveTo(0, 0);
//           this.ctx.lineTo(-size, size/2);
//           this.ctx.moveTo(0, 0);
//           this.ctx.lineTo(-size, -size/2);
//           this.ctx.closePath();
//       }

//       this.ctx.closePath();
//       this.ctx.stroke();//path선에 스트로크 적용

//       this.ctx.fillStyle = this.stroke;
//       if(head !== 2)
//           this.ctx.fill();
//       this.ctx.restore();
//   },

//   onScaling: function(e){
//     if(e.transform.corner === 'ml'){
//       if(this.originX !== 'right'){
//         var prevOrigin = this.originX;
//         this.set({
//           originX: 'right'
//         });

//         var point = this.getPointByOrigin(this.originX, this.originY);
//         this.setPositionByOrigin(point, prevOrigin, this.originY);
//         this.setCoords();
//       }
//     }
//     else if(e.transform.corner === 'mr'){
//       if(this.originX !== 'left'){
//         var point = this.getPointByOrigin(this.originX, this.originY);
//         this.set({
//           originX: 'left'
//         });
//         this.setPositionByOrigin(point, this.originX, this.originY);
//         this.setCoords();
        
//       }
//     }

//     const stt = new fabric.Point(this.x1, this.y1);
//     const end = new fabric.Point(this.x2, this.y2);
//     this.angle = this.getDegree(stt, end);

//     this.canvas._rotateObject(e.pointer.x, e.pointer.y)

//     if(this.originX === 'left'){
//       this.set({left: this.x1, top: this.y1}).setCoords();
//     }
//     else{
//       this.set({left: this.x2, top: this.y2}).setCoords();
//     }
//     const xOffset = (this.x2 - this.x1) * this.scaleX;

//     const newWidth = Math.max(this.minLength, xOffset);

//     this.set({scaleX: 1, scaleY: 1}).setCoords();
    
//     if(this.originX === 'right')
//       this.set({x1: this.x2 - newWidth}).setCoords();

//     if(this.originX === 'left')
//       this.set({x2: this.x1 + newWidth}).setCoords();

//   },
//   onMoving : function(e){
//     var x1, y1, x2, y2;
//       if(this.originX === 'left'){
//         x1 = e.target.left;
//         y1 = e.target.top;
//         x2 = e.target.left + e.target.width;
//         y2 = e.target.top + e.target.height;
//       }
//       else{
//         x1 = e.target.left - e.target.width;
//         y1 = e.target.top - e.target.height;
//         x2 = e.target.left;
//         y2 = e.target.top;
//       }

//       this.set({
//         x1 : x1,
//         y1 : y1,
//         x2 : x2,
//         y2 : y2,
//       }).setCoords();
//   },
//   onMouseUp:function(e){

//     // console.log('angle : ', this.angle);
//     // console.log('ml, mr', this.oCoords.ml, this.oCoords.mr);

//     // if(this.originX === 'right'){
//     //   this.rotX = this.x1;
//     //   this.rotY = this.oCoords.ml.y+0.5; 
//     // }
//     // else if(this.originX === 'left')
//     // {
//     //   this.rotX = this.x2;
//     //   this.rotY = this.oCoords.mr.y + 0.5;
//     // }
//     // // if(this.originX === 'right')
//     // //   this.set({y1: rotY}).setCoords();

//     // // if(this.originX === 'left')
//     // //   this.set({y2: rotY}).setCoords();
//   },
// })



