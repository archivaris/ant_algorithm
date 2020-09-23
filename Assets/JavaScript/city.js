var City = (function () {
    function City(x, y) {
        this._x = x;
        this._y = y;
    }

    City.prototype.getX = function () {
        return this._x;
    };
    City.prototype.getY = function () {
        return this._y;
    };
    City.prototype.toString = function () {
        return this._x + ',' + this._y;
    };
    City.prototype.isEqual = function (city) {
        if (this._x == city._x && this._y == city._y) {
            return true;
        }
        return false;
    };
    return City;
})();