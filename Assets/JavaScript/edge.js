var Edge = (function () {
    function Edge(cityA, cityB) {
        this._cityA = cityA;
        this._cityB = cityB;
        this._initPheromone = 1;
        this._pheromone = this._initPheromone;
        // Calculate edge distance
        var deltaXSq = Math.pow((cityA.getX() - cityB.getX()), 2);
        var deltaYSq = Math.pow((cityA.getY() - cityB.getY()), 2);
        this._distance = Math.sqrt(deltaXSq + deltaYSq);
    }

    Edge.prototype.pointA = function () {
        return {'x': this._cityA.getX(), 'y': this._cityA.getY()};
    }
    Edge.prototype.pointB = function () {
        return {'x': this._cityB.getX(), 'y': this._cityB.getY()};
    }
    Edge.prototype.getPheromone = function () {
        return this._pheromone;
    };
    Edge.prototype.getDistance = function () {
        return this._distance;
    };
    Edge.prototype.contains = function (city) {
        if (this._cityA.getX() == city.getX()) {
            return true;
        }
        if (this._cityB.getX() == city.getX()) {
            return true;
        }
        return false;
    };
    Edge.prototype.setInitialPheromone = function (pheromone) {
        this._initPheromone = pheromone;
    };
    Edge.prototype.setPheromone = function (pheromone) {
        this._pheromone = pheromone;
    };
    Edge.prototype.resetPheromone = function () {
        this._pheromone = this._initPheromone;
    };
    return Edge;
})();
