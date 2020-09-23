var Ant = (function () {
    function Ant(graph, params) {
        this._graph = graph;
        this._alpha = params.alpha;
        this._beta = params.beta;
        this._q = params.q;
        this._tour = null;
    }

    Ant.prototype.reset = function () {
        this._tour = null;
    };
    Ant.prototype.init = function () {
        this._tour = new Tour(this._graph);
        var randCityIndex = Math.floor(Math.random() * this._graph.size());
        this._currentCity = this._graph.getCity(randCityIndex);
        this._tour.addCity(this._currentCity);
    }
    Ant.prototype.getTour = function () {
        return this._tour;
    };
    Ant.prototype.makeNextMove = function () {
        if (this._tour == null) {
            this.init();
        }
        var rouletteWheel = 0.0;
        var cities = this._graph.getCities();
        var cityProbabilities = [];
        for (var cityIndex in cities) {
            if (!this._tour.contains(cities[cityIndex])) {
                var edge = this._graph.getEdge(this._currentCity, cities[cityIndex]);
                if (this._alpha == 1) {
                    var finalPheromoneWeight = edge.getPheromone();
                } else {
                    var finalPheromoneWeight = Math.pow(edge.getPheromone(), this._alpha);
                }
                cityProbabilities[cityIndex] = finalPheromoneWeight * Math.pow(1.0 / edge.getDistance(), this._beta);
                rouletteWheel += cityProbabilities[cityIndex];
            }
        }
        var wheelTarget = rouletteWheel * Math.random();
        var wheelPosition = 0.0;
        for (var cityIndex in cities) {
            if (!this._tour.contains(cities[cityIndex])) {
                wheelPosition += cityProbabilities[cityIndex];
                if (wheelPosition >= wheelTarget) {
                    this._currentCity = cities[cityIndex];
                    this._tour.addCity(cities[cityIndex]);
                    return;
                }
            }
        }
    };
    Ant.prototype.tourFound = function () {
        if (this._tour == null) {
            return false;
        }
        return (this._tour.size() >= this._graph.size());
    };
    Ant.prototype.run = function (callback) {
        this.reset();
        while (!this.tourFound()) {
            this.makeNextMove();
        }
    };
    Ant.prototype.addPheromone = function (weight) {
        if (weight == undefined) {
            weight = 1;
        }
        var extraPheromone = (this._q * weight) / this._tour.distance();
        for (var tourIndex = 0; tourIndex < this._tour.size(); tourIndex++) {
            if (tourIndex >= this._tour.size() - 1) {
                var fromCity = this._tour.get(tourIndex);
                var toCity = this._tour.get(0);
                var edge = this._graph.getEdge(fromCity, toCity);
                var pheromone = edge.getPheromone();
                edge.setPheromone(pheromone + extraPheromone);
            } else {
                var fromCity = this._tour.get(tourIndex);
                var toCity = this._tour.get(tourIndex + 1);
                var edge = this._graph.getEdge(fromCity, toCity);
                var pheromone = edge.getPheromone();
                edge.setPheromone(pheromone + extraPheromone);
            }
        }
    };
    return Ant;
})();
