
    $(document).ready(function () {
        var antCanvas = new Canvas('#aco-canvas', 700, 440);
        var ac = new AntColony();
        var acArtist = new ACArtist(ac, antCanvas);

        $('#aco-params select').change(function () {
            acArtist.stop();
            setParams();
        });

        $('#aco-mode').change(function () {
            $('#elitist-weight-input').hide();
            $('.maxmin-params').hide();
            if ($(this).val() == 'elitist') {
                $('#elitist-weight-input').show();
            } else if ($(this).val() == 'maxmin') {
                $('.maxmin-params').show();
            }
        });

        function setParams() {
            var params = {
                'type': $('#aco-mode').val(),
                'colonySize': $('#colony-size').val(),
                'alpha': $('#alpha').val(),
                'beta': $('#beta').val(),
                'rho': $('#rho').val(),
                'iterations': $('#max-iterations').val(),
                'elitistWeight': $('#elitist-weight').val(),
                'initPheromone': $('#init-pheromone').val(),
                'q': $('#pheromone-deposit-weight').val(),
                'minScalingFactor': $('#min-scalar').val(),
            };

            ac.setParams(params);
        }

        setParams();

        $('#start-search-btn').click(function () {
            if (!ac.ready()) {
                loadPopup({msg: 'Please add at least two destination nodes'});
            }

            $('.aco-info').show();
            $('#iteration-info').html('0/' + ac.maxIterations());
            $('#best-distance').html('-');
            acArtist.runAC(function () {
                $('#iteration-info').html(ac.currentIteration() + '/' + ac.maxIterations());
                $('#best-distance').html((ac.getGlobalBest().getTour().distance()).toFixed(2));
            });
        });
        $('#clear-graph').click(acArtist.clearGraph);
    });
