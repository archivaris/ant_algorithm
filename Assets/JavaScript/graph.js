var Graph = (function () {
    function Graph() {
        this._cities = [];
        this._edges = {};
    }

    Graph.prototype.getEdges = function () {
        return this._edges;
    };
    Graph.prototype.getEdgeCount = function () {
        return Object.keys(this._edges).length
    };
    Graph.prototype.getCity = function (cityIndex) {
        return this._cities[cityIndex];
    };
    Graph.prototype.getCities = function () {
        return this._cities;
    };
    Graph.prototype.size = function () {
        return this._cities.length;
    };
    Graph.prototype.addCity = function (x, y) {
        this._cities.push(new City(x, y));
    };
    Graph.prototype._addEdge = function (cityA, cityB) {
        this._edges[cityA.toString() + '-' + cityB.toString()] = new Edge(cityA, cityB);
    };
    Graph.prototype.getEdge = function (cityA, cityB) {
        if (this._edges[cityA.toString() + '-' + cityB.toString()] != undefined) {
            return this._edges[cityA.toString() + '-' + cityB.toString()];
        }
        if (this._edges[cityB.toString() + '-' + cityA.toString()] != undefined) {
            return this._edges[cityB.toString() + '-' + cityA.toString()];
        }
    };
    Graph.prototype.createEdges = function () {
        this._edges = {};
        for (var cityIndex = 0; cityIndex < this._cities.length; cityIndex++) {
            for (var connectionIndex = cityIndex; connectionIndex < this._cities.length; connectionIndex++) {
                this._addEdge(this._cities[cityIndex], this._cities[connectionIndex]);
            }
        }
    };
    Graph.prototype.resetPheromone = function () {
        for (var edgeIndex in this._edges) {
            this._edges[edgeIndex].resetPheromone();
        }
    }
    Graph.prototype.clear = function () {
        this._cities = [];
        this._edges = {};
    }
    return Graph;
})();
