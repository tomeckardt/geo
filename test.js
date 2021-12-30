   import LatLon from 'https://cdn.jsdelivr.net/npm/geodesy@2/latlon-spherical.min.js';
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelector('#calc-angles').onclick = function () {
                calculateSphericalAngles();
            };
            document.querySelector('#clear').onclick = function () {
                clear();
            };
        });
        function angleDiff(angle1, angle2) {
            let angle3 = Math.abs(angle1 - angle2);
            if (angle3 > 180) angle3 = 360 - angle3;
            return angle3.toFixed(3);
        }
        function calculateSphericalAngles() {
            const lineString = document.querySelector('#textarea1').value;
            const angles = lineString.match(/[^\r\n]+/g).filter((line) => { return line.trim().length; }).map((line) => {
                line = line.trim().split(/[\s,]+/);
                const p1 = LatLon.parse(line[0] + ',' + line[1]);
                const p2 = LatLon.parse(line[2] + ',' + line[3]);
                const p3 = LatLon.parse(line[4] + ',' + line[5]);
                const angle1 = angleDiff(p1.initialBearingTo(p2), p1.initialBearingTo(p3));
                const angle2 = angleDiff(p2.initialBearingTo(p1), p2.initialBearingTo(p3));
                const angle3 = angleDiff(p3.initialBearingTo(p1), p3.initialBearingTo(p2));
                return [angle1, angle2, angle3].join('\t');
            });
            document.querySelector('#result-angles').textContent = angles.join('\n');
        }
        function clear() {
            document.querySelector('#textarea1').value = '';
        }