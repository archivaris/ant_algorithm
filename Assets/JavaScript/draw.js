var ACArtist = (function () {
    function ACArtist(ac, canvas) {
        this._ac = ac;
        this._canvas = canvas;
        this._canvas.click(this._click.bind(this));
        this._draw();
        this._animationIterator = null;
        this._animationSteps = 10;
        this._iterationHook = null;
        // Keep scope
        for (var i in this) {
            if (typeof this[i] === 'function') {
                this[i] = this[i].bind(this);
            }
        }
    }

    ACArtist.prototype._click = function () {
        var cities = this._ac.getGraph().getCities();
        for (var cityIndex in cities) {
            var difference = 0;
            difference += Math.abs(cities[cityIndex].getX() - this._canvas.getMouseX());
            difference += Math.abs(cities[cityIndex].getY() - this._canvas.getMouseY());
            if (difference < 30) {
                return;
            }
        }
        this._ac.getGraph().addCity(this._canvas.getMouseX(), this._canvas.getMouseY());
        this._ac.getGraph().createEdges();
        clearInterval(this._animationIterator);
        this._ac.reset();
        this._draw();
    };
    ACArtist.prototype._draw = function () {
        this._canvas.clear();
        this._drawBg();
        this._drawEdges();
        this._drawNodes();
        this._drawCurrentBest();
    };
    ACArtist.prototype._drawCurrentBest = function () {
        var ant = this._ac.getGlobalBest();
        if (ant == null || ant.getTour() == null) {
            return;
        }
        var tour = ant.getTour();
        for (var tourIndex = 0; tourIndex < tour.size(); tourIndex++) {
            if (tourIndex < tour.size() - 1) {
                this._canvas.drawLine(tour.get(tourIndex).getX(), tour.get(tourIndex).getY(),
                    tour.get(tourIndex + 1).getX(), tour.get(tourIndex + 1).getY(),
                    {'alpha': 0.9, 'color': '#0c6', 'width': 3});
            } else {
                this._canvas.drawLine(tour.get(tourIndex).getX(), tour.get(tourIndex).getY(),
                    tour.get(0).getX(), tour.get(0).getY(),
                    {'alpha': 0.9, 'color': '#0c6', 'width': 3});
            }
        }
    };
    ACArtist.prototype._drawNodes = function () {
        var nodes = this._ac.getGraph().getCities();
        for (var nodeIndex in nodes) {
            this._canvas.drawCircle(nodes[nodeIndex].getX(), nodes[nodeIndex].getY(), {'alpha': 0.8});
        }
    };
    ACArtist.prototype._drawEdges = function () {
        var edges = this._ac.getGraph().getEdges();
        var totalPheromone = 0;
        for (var edgeIndex in edges) {
            totalPheromone += edges[edgeIndex].getPheromone();
        }
        for (var edgeIndex in edges) {
            var alpha = 0.2;
            if (this._ac.currentIteration() > 0) {
                var width = Math.ceil((edges[edgeIndex].getPheromone() / totalPheromone) * (this._ac.getGraph().size()) * 6);
                alpha = (edges[edgeIndex].getPheromone() / totalPheromone) * (this._ac.getGraph().size()) + 0.03;
                if (alpha > 1) {
                    alpha = 1;
                }
            }
            this._canvas.drawLine(edges[edgeIndex].pointA().x, edges[edgeIndex].pointA().y,
                edges[edgeIndex].pointB().x, edges[edgeIndex].pointB().y,
                {'alpha': alpha, 'color': '#06f', 'width': width});
        }
    };
    ACArtist.prototype._drawBg = function () {
        var grd = this._canvas.getContext().createLinearGradient(0, 0, 0, this._canvas.getHeight());
        grd.addColorStop(0, "#eee");
        grd.addColorStop(0.4, "#fcfcfc");
        grd.addColorStop(1, "#eee");
        this._canvas.drawRectangle(0, 0, this._canvas.getWidth(), this._canvas.getHeight(), {'fill': grd});
    };
    ACArtist.prototype.stop = function () {
        clearInterval(this._animationIterator);
        this._ac.reset();
        this._draw();
    };
    ACArtist.prototype.clearGraph = function () {
        this.stop();
        this._ac.getGraph().clear();
        this._draw();
    };
    ACArtist.prototype.runAC = function (iterationHook) {
        if (!this._ac.ready()) {
            return;
        }
        if (typeof (iterationHook) == 'function') {
            this._iterationHook = iterationHook;
        }
        clearInterval(this._animationIterator);
        this._ac.reset();
        this._step();
    };
    ACArtist.prototype._step = function (iterationHook) {
        if (this._ac.currentIteration() >= this._ac.maxIterations()) {
            this._draw();
            this._ac.resetAnts();
            return;
        }
        // Run a few steps at a time so it doesn't take too long
        for (var i = 0; i < 3; i++) {
            this._ac.step();
        }
        this._animateAnts();
        if (typeof (this._iterationHook) == 'function') {
            this._iterationHook();
        }
    };
    ACArtist.prototype._moveAnt = function (ant, tourIndex, animationStep) {
        // Get last move
        var tourSize = ant.getTour().size();
        var fromCity = ant.getTour().get(tourIndex - 1);
        var toCity = ant.getTour().get(tourIndex);
        var xOffset = (toCity.getX() - fromCity.getX()) * ((1 / this._animationSteps) * animationStep);
        var yOffset = (toCity.getY() - fromCity.getY()) * ((1 / this._animationSteps) * animationStep);
        var antXPos = fromCity.getX() + xOffset;
        var antYPos = fromCity.getY() + yOffset;
        this._drawAnt(antXPos, antYPos);
    };
    ACArtist.prototype._drawAnt = function (x, y) {
        this._canvas.drawRectangle(x - 2, y - 2, 4, 4, {'alpha': 0.5});
    };
    ACArtist.prototype._animateAnts = function () {
        var animationIndex = 2;
        this._animationIterator = setInterval(function () {
            this._draw();
            var ants = this._ac.getAnts();
            for (var antIndex in ants) {
                this._moveAnt(ants[antIndex], 1, animationIndex);
            }
            animationIndex++;
            if (animationIndex >= this._animationSteps) {
                clearInterval(this._animationIterator);
                this._step();
            }
        }.bind(this), 20);
    };
    return ACArtist;
})();
