const vec = {};


vec.distance = function (v1, v2) {
    let dx = v1.x - v2.x;
    let dy = v1.y - v2.y;
    let dz = v1.z - v2.z;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

module.exports = vec;