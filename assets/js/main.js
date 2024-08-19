(function() {
    "use strict";

    var $body = document.querySelector('body');

    if (!("classList" in document.documentElement)) {
        Object.defineProperty(Element.prototype, 'classList', {
            get: function() {
                var self = this;

                function update(fn) {
                    return function(value) {
                        var classes = self.className.split(/\s+/),
                            index = classes.indexOf(value);

                        fn(classes, index, value);
                        self.className = classes.join(" ");
                    };
                }

                return {
                    add: update(function(classes, index, value) {
                        if (!~index) classes.push(value);
                    }),
                    remove: update(function(classes, index) {
                        if (~index) classes.splice(index, 1);
                    }),
                    toggle: update(function(classes, index, value) {
                        if (~index) classes.splice(index, 1);
                        else classes.push(value);
                    }),
                    contains: function(value) {
                        return !!~self.className.split(/\s+/).indexOf(value);
                    }
                };
            }
        });
    }

    window.canUse = function(property) {
        if (!window._canUse) window._canUse = document.createElement("div");
        var style = window._canUse.style,
            up = property.charAt(0).toUpperCase() + property.slice(1);
        return property in style || "Moz" + up in style || "Webkit" + up in style || "O" + up in style || "ms" + up in style;
    };

    (function() {
        if ("addEventListener" in window) return;
        window.addEventListener = function(type, f) {
            window.attachEvent("on" + type, f);
        };
    })();

    window.addEventListener('load', function() {
        window.setTimeout(function() {
            $body.classList.remove('is-preload');
        }, 100);
    });

    (function() {
        var settings = {
            images: {
                'images/background.jpg': 'center',
            },
            delay: 6000
        };

        var pos = 0,
            lastPos = 0,
            $wrapper, $bgs = [],
            $bg,
            k, v;

        $wrapper = document.createElement('div');
        $wrapper.id = 'bg';
        $body.appendChild($wrapper);

        for (k in settings.images) {
            $bg = document.createElement('div');
            $bg.style.backgroundImage = 'url("' + k + '")';
            $bg.style.backgroundPosition = settings.images[k];
            $wrapper.appendChild($bg);
            $bgs.push($bg);
        }

        $bgs[pos].classList.add('visible');
        $bgs[pos].classList.add('top');

        if ($bgs.length == 1 || !canUse('transition')) return;

        window.setInterval(function() {
            lastPos = pos;
            pos++;

            if (pos >= $bgs.length)
                pos = 0;

            $bgs[lastPos].classList.remove('top');
            $bgs[pos].classList.add('visible');
            $bgs[pos].classList.add('top');

            window.setTimeout(function() {
                $bgs[lastPos].classList.remove('visible');
            }, settings.delay / 2);

        }, settings.delay);
    })();
})();
