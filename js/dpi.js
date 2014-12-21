(function () {
    'use strict';

    function isNotString(obj) {
        return typeof obj !== 'string';
    }

    function DPI() {
        this.modules = [];
    }

    DPI.prototype.getModuleIndex = function (moduleName) {
        var index = -1;
        this.modules.some(function (m, i) {
            if (m.name === moduleName) {
                index = i;
                return true;
            }
            return false;
        });
        return index;
    };
    DPI.prototype.module = function (moduleName, arr) {
        if (isNotString(moduleName)) {
            throw 'The first argument: "moduleName" must be a [String]!';
        } else {
            moduleName = moduleName.trim();
        }

        if (typeof arr === 'function') {
            this.modules.push(new Module(moduleName, [], arr, this));
        } else if (Array.isArray(arr)) {
            this.modules.push(new Module(moduleName, arr, arr.pop(), this));
        } else {
            throw('The second argument of DPI.module must be an [Array] or a [Function]!');
        }
    };
    DPI.prototype.getModuleArgs = function (module) {
        var that = this,
            result = false,
            args = [];

        module.deps.forEach(function (moduleName) {
            var moduleIndex = that.getModuleIndex(moduleName);
            if (moduleIndex >= 0) {
                if (that.modules[moduleIndex].hasOwnProperty('val')) {
                    args.push(that.modules[moduleIndex].val);
                }
            } else {
                throw 'No such module ' + moduleName + '!';
            }
        });

        if (args.length === module.deps.length) {
            result = args;
        }

        return result;
    };
    DPI.prototype.apply = function () {
        var that = this;
        this.modules.forEach(function (module) {
            if (!module.runned) {
                var args = that.getModuleArgs(module);
                if (args) {
                    module.runned = true;
                    module.run.apply(module, args);
                }
            }
        });
    };
    DPI.prototype.loadScript = function (src, async, callback) {
        var script = document.createElement('script');
        script.src = ('https:' == document.location.protocol ? 'https' : 'http') + ':' + src;
        script.type = 'text/javascript';
        script.async = async || true;
        script.onload = callback;

        var head = document.getElementsByTagName('head')[0];
        head.appendChild(script);
    };

    function Module(name, deps, run, dpi) {
        if (deps.some(isNotString)) {
            throw ('The dependencies of module ' + name + ' must be a [String]!');
        }
        this.name = name;
        this.run = run;
        this.deps = deps;
        this.runned = false;
        this.dpi = dpi;
    }

    Module.prototype.emit = function (obj) {
        this.val = obj;
        this.dpi.apply();
    };

    window.DPI = DPI;
}());
