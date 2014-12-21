(function (DPI) {
    'use strict';

    var dpi = new DPI();

    dpi.module('documentReady', function () {
        var that = this,
            docReadyId = setInterval(function () {
            if ((document.readyState === "interactive" || document.readyState === "complete")) {
                clearInterval(docReadyId);
                that.emit('document ready');
            }
        }, 50);
    });
    dpi.module('fontsReady', function () {
        var that = this;

        window.WebFontConfig = {
            custom: {
                families: ['block_regular', 'informa_regular', 'informa_medium', 'informa_bold'],
                urls: ['css/bf_fonts.css']
            },
            active: function () {
                that.emit('fonts loaded');
            }
        };

        dpi.loadScript('//ajax.googleapis.com/ajax/libs/webfont/1.5.6/webfont.js');
    });

    dpi.module('moduleA', function () {
        this.emit('a');
    });
    dpi.module('moduleB', ['moduleA', function () {
        this.emit('b');
    }]);
    dpi.module('main', ['moduleB', 'documentReady', 'fontsReady', function (moduleB) {
        console.log(moduleB);
    }]);
    dpi.apply();
}(DPI));
