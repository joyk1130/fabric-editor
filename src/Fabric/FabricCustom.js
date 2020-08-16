import {fabric} from 'fabric'
import 'fabric-customise-controls'


export var LineArrow = fabric.util.createClass(fabric.Line, {
  minLength: 0, // we need to set this thing in px now
  type: 'arrow',

  initialize: function (points, options) {
    const stt = new fabric.Point(points[0], points[1])
    const end = new fabric.Point(points[2], points[3])
    //라인 방향 벡터
    const vectorB = end.subtract(stt);

    // find angle between line's vector and x axis
    let angleRad = Math.atan2(vectorB.y, vectorB.x)
    if (angleRad < 0) {
      angleRad = 2 * Math.PI + angleRad
    }

    const angleDeg = fabric.util.radiansToDegrees(angleRad)


    // find initial horizontal position by rotating the tip back
    const rotatedPos = fabric.util.rotatePoint(end.clone(), stt, -angleRad)

    options = options || {}
    this.callSuper('initialize', [stt.x, stt.y, rotatedPos.x, rotatedPos.y], {
      noScaleCache: false, // false to force cache update while scaling (doesn't redraw parts of line otherwise)
      selectable: true,
      evented: true, // true because you want to select line on click
      //minScaleLimit: 0.25, // has no effect now because we're resetting scale on each scale event
      lockRotation: false,
      hasRotatingPoint: false, // to disable rotation control
      centeredRotation: false,
      centeredScaling: false,
      
      originX: "left",    // origin of rotation/transformation.      
      originY: "top",    // origin of rotation/transformation.

      
      
      // lockMovementX: true,
      // lockMovementY: true,
      lockScalingFlip: true,
      lockScalingX: false,
      lockScalingY: false,
      lockSkewingX: false,
      lockSkewingY: false,
      lockUniScaling: true,
      ...options,
      angle: angleDeg // note that we use the calculated angle no matter what
    })
    
    this.on('scaling', function (e) {
     
      if(e.transform.corner === 'ml'){
        this.set({
          originX: "right",    
        });
      }
      if(e.transform.corner === 'mr'){
        this.set({
          originX: "left",   
        });
      }

      this.canvas._rotateObject(e.pointer.x, e.pointer.y)

      this.set({left: this.x1, top: this.y1})

      const xOffset = (this.x2 - this.x1) * this.scaleX;
      const newLength = Math.max(this.minLength, xOffset)

      this.set({
        scaleX: 1,
        scaleY: 1,
      });

      if(e.transform.corner === 'ml')
        this.set({
          x1: this.x2 - newLength,
          left: this.x2 - newLength,
        });

      if(e.transform.corner === 'mr')
        this.set({x2: this.x1 + newLength});
    })
  },

  _render: function(ctx) {
    this.ctx = ctx;
    this.callSuper('_render', ctx);
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
          this.ctx.ellipse(size/2,0,size/2,size/2, 0, 0, 360);
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

      this.ctx.closePath();
      this.ctx.stroke();//path선에 스트로크 적용

      this.ctx.fillStyle = this.stroke;
      if(head !== 2)
          this.ctx.fill();
      this.ctx.restore();
  },
})



export var LinePicker = fabric.util.createClass(fabric.Circle, {

  type: 'picker',

  initialize: function(element, options) {
    options || (options = {});
    this.callSuper('initialize', element, options);
  },

  toObject: function() {
    return fabric.util.object.extend(this.callSuper('toObject'));
  },

  _getCacheCanvasDimensions() {
      var dim = this.callSuper('_getCacheCanvasDimensions');
      dim.width += 15; // found by trial and error
      dim.height += 15; // found by trial and error
      return dim;
    },

  _render: function(ctx) {
    this.ctx = ctx;
    this.callSuper('_render', ctx);
  },

  
});


export var Line2 = fabric.util.createClass(fabric.Line, {
  type: 'line2',

  initialize: function(points, options) {

    const stt = new fabric.Point(points[0], points[1])
    const end = new fabric.Point(points[2], points[3])
    //라인 방향 벡터
    const vectorB = end.subtract(stt);

    // find angle between line's vector and x axis
    let angleRad = Math.atan2(vectorB.y, vectorB.x)
    if (angleRad < 0) {
      angleRad = 2 * Math.PI + angleRad
    }

    const angleDeg = fabric.util.radiansToDegrees(angleRad)
    const rotatedPos = fabric.util.rotatePoint(end.clone(), stt, -angleRad)


    options || (options = {});
    this.callSuper('initialize', [stt.x, stt.y, rotatedPos.x, rotatedPos.y], {
      ...options,
      angle: angleDeg 
    });

  },

  toObject: function() {
    return fabric.util.object.extend(this.callSuper('toObject'));
  },

  _render: function(ctx) {
    this.ctx = ctx;
    this.callSuper('_render', ctx);
    
  },

});
  

export var RotatingLine = fabric.util.createClass(fabric.Line, {
  minLength: 0, // we need to set this thing in px now
  type:'rotateline',

  initialize: function (points, options) {
    const stt = new fabric.Point(points[0], points[1])
    const end = new fabric.Point(points[2], points[3])
    //라인 방향 벡터
    const vectorB = end.subtract(stt);

    // find angle between line's vector and x axis
    let angleRad = Math.atan2(vectorB.y, vectorB.x)
    if (angleRad < 0) {
      angleRad = 2 * Math.PI + angleRad
    }

    const angleDeg = fabric.util.radiansToDegrees(angleRad)


    // find initial horizontal position by rotating the tip back
    const rotatedPos = fabric.util.rotatePoint(end.clone(), stt, -angleRad)

    options = options || {}
    this.callSuper('initialize', [stt.x, stt.y, rotatedPos.x, rotatedPos.y], {
      noScaleCache: false, // false to force cache update while scaling (doesn't redraw parts of line otherwise)
      selectable: true,
      evented: true, // true because you want to select line on click
      //minScaleLimit: 0.25, // has no effect now because we're resetting scale on each scale event
      lockRotation: false,
      hasRotatingPoint: false, // to disable rotation control
      centeredRotation: false,
      centeredScaling: false,
      
      originX: "left",    // origin of rotation/transformation.      
      originY: "top",    // origin of rotation/transformation.

      
      
      // lockMovementX: true,
      // lockMovementY: true,
      lockScalingFlip: true,
      lockScalingX: false,
      lockScalingY: false,
      lockSkewingX: false,
      lockSkewingY: false,
      lockUniScaling: true,
      ...options,
      angle: angleDeg // note that we use the calculated angle no matter what
    })
    
    
    this.on('moving', function (e) {
      // this.set({
      //   x1:e.target.left, 
      //   y1:e.target.top,
      //   x2:e.target.left+e.target.width,
      //   y2:e.target.top+e.target.height
      // });
    });

    this.on('scaling', function (e) {
      // var x = e.pointer.x, y = e.pointer.y;
      // var t = e.transform,
      //     target = e.target,
      //     constraintPosition = target.translateToOriginPoint(
      //       target.getCenterPoint(), 'left', 'top');

      // var curAngle = Math.atan2(y - constraintPosition.y, x - constraintPosition.x),
      //     rad = curAngle,
      //     angle = fabric.util.radiansToDegrees(rad);
      
      // x -= this.left;
      // y -= this.top;
      // var curAngle = Math.atan2(y, x),
      //     rad = curAngle,
      //     angle = fabric.util.radiansToDegrees(rad);
      // var x2 = Math.cos(rad) * x - Math.sin(rad) * y;
      // var y2 = Math.sin(rad) * x + Math.cos(rad) * y;
      
      // x2 += this.left;
      // y2 += this.top;
     
      if(e.transform.corner === 'tl'){
        this.set({
          originX: "right",    
        });
      }
      if(e.transform.corner === 'br'){
        this.set({
          originX: "left",   
        });
      }

      this.canvas._rotateObject(e.pointer.x, e.pointer.y)

      this.set({left: this.x1, top: this.y1})

      const xOffset = (this.x2 - this.x1) * this.scaleX;
      const newLength = Math.max(this.minLength, xOffset)

      this.set({
        scaleX: 1,
        scaleY: 1,
      });

      if(e.transform.corner === 'tl')
        this.set({
          x1: this.x2 - newLength,
          left: this.x2 - newLength,
        });

      if(e.transform.corner === 'br')
        this.set({x2: this.x1 + newLength});
    })
  }
})




  

