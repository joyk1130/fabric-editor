import {fabric} from 'fabric'

// Extended fabric line class
var LineArrow = fabric.util.createClass(fabric.Line, {

    type: 'arrow',
  
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
  });
  
   
//   LineArrow.fromObject = function(object, callback) {
//     callback && callback(new fabric.LineArrow([object.x1, object.y1, object.x2, object.y2], object));
//   };
  
//   LineArrow.async = true;
  
  
//   var Arrow = (function() 
//   {
//     function Arrow(canvas) {
//       this.canvas = canvas;
//       this.className = 'Arrow';
//       this.isDrawing = false;
//       this.bindEvents();
//     }
  
//     Arrow.prototype.bindEvents = function() {
//       var inst = this;
//       inst.canvas.on('mouse:down', function(o) {
//         inst.onMouseDown(o);
//       });
//       inst.canvas.on('mouse:move', function(o) {
//         inst.onMouseMove(o);
//       });
//       inst.canvas.on('mouse:up', function(o) {
//         inst.onMouseUp(o);
//       });
//       inst.canvas.on('object:moving', function(o) {
//         inst.disable();
//       })
//     }
  
//     Arrow.prototype.onMouseUp = function(o) {
//       var inst = this;
//       this.line.set({
//         dirty: true,
//         objectCaching: true
//       });
//       inst.canvas.renderAll();
//       inst.disable();
//     };
  
//     Arrow.prototype.onMouseMove = function(o) {
//       var inst = this;
//       if (!inst.isEnable()) {
//         return;
//       }
  
//       var pointer = inst.canvas.getPointer(o.e);
//       var activeObj = inst.canvas.getActiveObject();
//       activeObj.set({
//         x2: pointer.x,
//         y2: pointer.y
//       });
//       activeObj.setCoords();
//       inst.canvas.renderAll();
//     };
  
//     Arrow.prototype.onMouseDown = function(o) {
//       var inst = this;
//       inst.enable();
//       var pointer = inst.canvas.getPointer(o.e);
  
//       var points = [pointer.x, pointer.y, pointer.x, pointer.y];
//       this.line = new fabric.LineArrow(points, {
//         strokeWidth: 5,
//         fill: 'red',
//         stroke: 'red',
//         originX: 'center',
//         originY: 'center',
//         hasBorders: false,
//         hasControls: false,
//         objectCaching: false,
//         perPixelTargetFind: true,
//         heads: [1, 0]
//       });
  
//       inst.canvas.add(this.line).setActiveObject(this.line);
//     };
  
//     Arrow.prototype.isEnable = function() {
//       return this.isDrawing;
//     }
  
//     Arrow.prototype.enable = function() {
//       this.isDrawing = true;
//     }
  
//     Arrow.prototype.disable = function() {
//       this.isDrawing = false;
//     }
  
//     return Arrow;
//   }());
  
//   var canvas = new fabric.Canvas('canvas', {
//     selection: false
//   });
//   var arrow = new Arrow(canvas);

  export default LineArrow;
 