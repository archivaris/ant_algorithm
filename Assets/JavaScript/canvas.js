var Canvas = (function () {
    function Canvas(canvasHolder, width, height) {
        var canvasId = 'aoc-graph';
        this._canvasSize = {
            'width': width,
            'height': height,
        };
        $(canvasHolder).css('maxWidth', this._canvasSize.width);
        $(canvasHolder).append('<canvas id="' + canvasId + '" width="' + this._canvasSize.width + '" height="' + this._canvasSize.height + '" style="width:100%;"></canvas>');
        this._canvasEle = $('#' + canvasId)[0];
        this._canvas = this._canvasEle.getContext('2d');
        this._canvasPos = this._canvasEle.getBoundingClientRect();
        this._mousePos = {
            'x': 0,
            'y': 0,
        };
        $(this._canvasEle).click(this._click.bind(this));
        $(this._canvasEle).mousemove(this._move.bind(this));
        this._clickHook = null;
        this._mouseMoveHook = null;
    }

    Canvas.prototype.getMouseX = function () {
        return this._mousePos.x
    };
    Canvas.prototype.getMouseY = function () {
        return this._mousePos.y
    };
    Canvas.prototype.getWidth = function () {
        return this._canvasSize.width
    };
    Canvas.prototype.getHeight = function () {
        return this._canvasSize.height
    };
    Canvas.prototype.getContext = function () {
        return this._canvas;
    };
    Canvas.prototype._click = function (mouseEvt) {
        this._updateMouseXY(mouseEvt);
        if (typeof (this._clickHook) === 'function') {
            this._clickHook();
        }
    };
    Canvas.prototype._move = function (mouseEvt) {
        this._updateMouseXY(mouseEvt);
        if (typeof (this._mouseMoveHook) === 'function') {
            this._mouseMoveHook();
        }
    };
    Canvas.prototype.click = function (clickHook) {
        this._clickHook = clickHook;
    };
    Canvas.prototype.mousemove = function (mouseMoveHook) {
        this._mouseMoveHook = mouseMoveHook;
    };
    Canvas.prototype.clear = function () {
        this._canvas.clearRect(0, 0, this._canvasSize.width, this._canvasSize.height);
    };
    Canvas.prototype.drawLine = function (fromX, fromY, toX, toY, params) {
        var color = '#000';
        var alpha = 1;
        var lineWidth = 1;
        if (params != undefined) {
            if (params.color != undefined) {
                color = params.color;
            }
            if (params.alpha != undefined) {
                alpha = params.alpha;
            }
            if (params.width != undefined) {
                lineWidth = params.width;
            }
        }
        this._canvas.shadowBlur = 0;
        this._canvas.globalAlpha = alpha;
        this._canvas.strokeStyle = color;
        this._canvas.lineWidth = lineWidth;
        this._canvas.beginPath();
        this._canvas.moveTo(fromX, fromY);
        this._canvas.lineTo(toX, toY);
        this._canvas.stroke();
    }
    Canvas.prototype.drawCircle = function (x, y, params) {
        var size = 6;
        var color = '#000';
        var alpha = 1;
        if (params != undefined) {
            if (params.size != undefined) {
                size = params.size;
            }
            if (params.color != undefined) {
                color = params.color;
            }
            if (params.alpha != undefined) {
                alpha = params.alpha;
            }
        }
        this._canvas.shadowColor = '#666';
        this._canvas.shadowBlur = 15;
        this._canvas.shadowOffsetX = 0;
        this._canvas.shadowOffsetY = 0;
        this._canvas.globalAlpha = alpha;
        this._canvas.fillStyle = color;
        this._canvas.beginPath();
        this._canvas.arc(x, y, size, 0, 2 * Math.PI);
        this._canvas.fill();
    };
    Canvas.prototype.drawRectangle = function (pointA, pointB, pointC, pointD, params) {
        var fill = '#000';
        var alpha = 1;
        if (params != undefined) {
            if (params.fill != undefined) {
                fill = params.fill;
            }
            if (params.alpha != undefined) {
                alpha = params.alpha;
            }
        }
        this._canvas.shadowBlur = 0;
        this._canvas.globalAlpha = alpha;
        this._canvas.fillStyle = fill;
        this._canvas.fillRect(pointA, pointB, pointC, pointD);
    }
    Canvas.prototype._updateMouseXY = function (mouseEvt) {
        this._canvasPos = this._canvasEle.getBoundingClientRect();
        var mouseX = mouseEvt.clientX - this._canvasPos.left;
        var mouseY = mouseEvt.clientY - this._canvasPos.top;
        var widthScaled = $(this._canvasEle).width() / this._canvasSize.width;
        var heightScaled = $(this._canvasEle).height() / this._canvasSize.height;
        var x = Math.floor(mouseX / widthScaled);
        var y = Math.floor(mouseY / heightScaled);
        this._mousePos.x = x;
        this._mousePos.y = y;
    };
    return Canvas;
})();
