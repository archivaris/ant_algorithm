    var Tour = (function () {
        function Tour(graph) {
            this._graph = graph;
            this._tour = [];
            this._distance = null;
        }

        Tour.prototype.size = function () {
            return this._tour.length;
        };

        Tour.prototype.contains = function (city) {
            for (var tourIndex in this._tour) {
                if (city.isEqual(this._tour[tourIndex])) {
                    return true;
                }
            }

            return false;
        };

        Tour.prototype.addCity = function (city) {
            this._distance = null;
            this._tour.push(city);
        };

        Tour.prototype.get = function (tourIndex) {
            return this._tour[tourIndex];
        };

        Tour.prototype.distance = function () {
            if (this._distance == null) {
                var distance = 0.0;

                for (var tourIndex = 0; tourIndex < this._tour.length; tourIndex++) {
                    if (tourIndex >= this._tour.length - 1) {
                        var edge = this._graph.getEdge(this._tour[tourIndex], this._tour[0]);
                        distance += edge.getDistance();
                    } else {
                        var edge = this._graph.getEdge(this._tour[tourIndex], this._tour[tourIndex + 1]);
                        distance += edge.getDistance();
                    }
                }

                this._distance = distance;
            }

            return this._distance;
        };

        return Tour;
    })();
