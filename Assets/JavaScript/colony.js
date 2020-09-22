    var AntColony = (function () {
        function AntColony(params) {
            this._graph = new Graph();
            this._colony = [];

            // Set default params
            this._colonySize = 20;
            this._alpha = 1;
            this._beta = 3;
            this._rho = 0.1;
            this._q = 1;
            this._initPheromone = this._q;
            this._type = 'acs';
            this._elitistWeight = 0;
            this._maxIterations = 250;
            this._minScalingFactor = 0.001;

            this.setParams(params);

            this._iteration = 0;
            this._minPheromone = null;
            this._maxPheromone = null;

            this._iterationBest = null;
            this._globalBest = null;

            this._createAnts();
        }

        AntColony.prototype.getGraph = function () {
            return this._graph;
        };
        AntColony.prototype.getAnts = function () {
            return this._colony;
        };
        AntColony.prototype.size = function () {
            return this._colony.length;
        };
        AntColony.prototype.currentIteration = function () {
            return this._iteration;
        };
        AntColony.prototype.maxIterations = function () {
            return this._maxIterations;
        };

        AntColony.prototype._createAnts = function () {
            this._colony = [];
            for (var antIndex = 0; antIndex < this._colonySize; antIndex++) {
                this._colony.push(new Ant(this._graph, {
                    'alpha': this._alpha,
                    'beta': this._beta,
                    'q': this._q,
                }));
            }
        };

        AntColony.prototype.setParams = function (params) {
            if (params != undefined) {
                if (params.colonySize != undefined) {
                    this._colonySize = params.colonySize;
                }
                if (params.alpha != undefined) {
                    this._alpha = params.alpha;
                }
                if (params.beta != undefined) {
                    this._beta = params.beta;
                }
                if (params.rho != undefined) {
                    this._rho = params.rho;
                }
                if (params.iterations != undefined) {
                    this._maxIterations = params.iterations;
                }
                if (params.q != undefined) {
                    this._q = params.q;
                }
                if (params.initPheromone != undefined) {
                    this._initPheromone = params.initPheromone;
                }
                if (params.type != undefined) {
                    if (params.type == 'elitist') {
                        if (params.elitistWeight != undefined) {
                            this._elitistWeight = params.elitistWeight;
                            this._type = 'elitist';
                        }
                    } else if (params.type == 'maxmin') {
                        this._type = 'maxmin';
                    } else {
                        this._type = 'acs';
                    }
                }
                if (params.minScalingFactor != undefined) {
                    this._minScalingFactor = params.minScalingFactor;
                }
            }
        };

        AntColony.prototype.reset = function () {
            this._iteration = 0;
            this._globalBest = null;
            this.resetAnts();
            this.setInitialPheromone(this._initPheromone);
            this._graph.resetPheromone();
        };

        AntColony.prototype.setInitialPheromone = function () {
            var edges = this._graph.getEdges();
            for (var edgeIndex in edges) {
                edges[edgeIndex].setInitialPheromone(this._initPheromone);
            }
        };

        AntColony.prototype.resetAnts = function () {
            this._createAnts();
            this._iterationBest = null;
        };

        AntColony.prototype.ready = function () {
            if (this._graph.size() <= 1) {
                return false;
            }
            return true;
        }

        AntColony.prototype.run = function () {
            if (!this.ready()) {
                return;
            }

            this._iteration = 0;
            while (this._iteration < this._maxIterations) {
                this.step();
            }
        };

        AntColony.prototype.step = function () {
            if (!this.ready() || this._iteration >= this._maxIterations) {
                return;
            }

            this.resetAnts();

            for (var antIndex in this._colony) {
                this._colony[antIndex].run();
            }

            this.getGlobalBest();
            this.updatePheromone();

            this._iteration++;
        };

        AntColony.prototype.updatePheromone = function () {
            var edges = this._graph.getEdges();
            for (var edgeIndex in edges) {
                var pheromone = edges[edgeIndex].getPheromone();
                edges[edgeIndex].setPheromone(pheromone * (1 - this._rho));
            }

            if (this._type == 'maxmin') {
                if ((this._iteration / this._maxIterations) > 0.75) {
                    var best = this.getGlobalBest();
                } else {
                    var best = this.getIterationBest();
                }

                // Set maxmin
                this._maxPheromone = this._q / best.getTour().distance();
                this._minPheromone = this._maxPheromone * this._minScalingFactor;

                best.addPheromone();
            } else {
                for (var antIndex in this._colony) {
                    this._colony[antIndex].addPheromone();
                }
            }

            if (this._type == 'elitist') {
                this.getGlobalBest().addPheromone(this._elitistWeight);
            }

            if (this._type == 'maxmin') {
                for (var edgeIndex in edges) {
                    var pheromone = edges[edgeIndex].getPheromone();
                    if (pheromone > this._maxPheromone) {
                        edges[edgeIndex].setPheromone(this._maxPheromone);
                    } else if (pheromone < this._minPheromone) {
                        edges[edgeIndex].setPheromone(this._minPheromone);
                    }
                }
            }
        };

        AntColony.prototype.getIterationBest = function () {
            if (this._colony[0].getTour() == null) {
                return null;
            }

            if (this._iterationBest == null) {
                var best = this._colony[0]

                for (var antIndex in this._colony) {
                    if (best.getTour().distance() >= this._colony[antIndex].getTour().distance()) {
                        this._iterationBest = this._colony[antIndex];
                    }
                }
            }

            return this._iterationBest;
        };

        AntColony.prototype.getGlobalBest = function () {
            var bestAnt = this.getIterationBest();
            if (bestAnt == null && this._globalBest == null) {
                return null;
            }

            if (bestAnt != null) {
                if (this._globalBest == null || this._globalBest.getTour().distance() >= bestAnt.getTour().distance()) {
                    this._globalBest = bestAnt;
                }
            }

            return this._globalBest;
        };

        return AntColony;
    })();
