'use strict';var lang_1 = require('angular2/src/facade/lang');
function extractAnnotation(annotation) {
    if (lang_1.isFunction(annotation) && annotation.hasOwnProperty('annotation')) {
        // it is a decorator, extract annotation
        annotation = annotation.annotation;
    }
    return annotation;
}
function applyParams(fnOrArray, key) {
    if (fnOrArray === Object || fnOrArray === String || fnOrArray === Function ||
        fnOrArray === Number || fnOrArray === Array) {
        throw new Error("Can not use native " + lang_1.stringify(fnOrArray) + " as constructor");
    }
    if (lang_1.isFunction(fnOrArray)) {
        return fnOrArray;
    }
    else if (fnOrArray instanceof Array) {
        var annotations = fnOrArray;
        var fn = fnOrArray[fnOrArray.length - 1];
        if (!lang_1.isFunction(fn)) {
            throw new Error("Last position of Class method array must be Function in key " + key + " was '" + lang_1.stringify(fn) + "'");
        }
        var annoLength = annotations.length - 1;
        if (annoLength != fn.length) {
            throw new Error("Number of annotations (" + annoLength + ") does not match number of arguments (" + fn.length + ") in the function: " + lang_1.stringify(fn));
        }
        var paramsAnnotations = [];
        for (var i = 0, ii = annotations.length - 1; i < ii; i++) {
            var paramAnnotations = [];
            paramsAnnotations.push(paramAnnotations);
            var annotation = annotations[i];
            if (annotation instanceof Array) {
                for (var j = 0; j < annotation.length; j++) {
                    paramAnnotations.push(extractAnnotation(annotation[j]));
                }
            }
            else if (lang_1.isFunction(annotation)) {
                paramAnnotations.push(extractAnnotation(annotation));
            }
            else {
                paramAnnotations.push(annotation);
            }
        }
        Reflect.defineMetadata('parameters', paramsAnnotations, fn);
        return fn;
    }
    else {
        throw new Error("Only Function or Array is supported in Class definition for key '" + key + "' is '" + lang_1.stringify(fnOrArray) + "'");
    }
}
/**
 * Provides a way for expressing ES6 classes with parameter annotations in ES5.
 *
 * ## Basic Example
 *
 * ```
 * var Greeter = ng.Class({
 *   constructor: function(name) {
 *     this.name = name;
 *   },
 *
 *   greet: function() {
 *     alert('Hello ' + this.name + '!');
 *   }
 * });
 * ```
 *
 * is equivalent to ES6:
 *
 * ```
 * class Greeter {
 *   constructor(name) {
 *     this.name = name;
 *   }
 *
 *   greet() {
 *     alert('Hello ' + this.name + '!');
 *   }
 * }
 * ```
 *
 * or equivalent to ES5:
 *
 * ```
 * var Greeter = function (name) {
 *   this.name = name;
 * }
 *
 * Greeter.prototype.greet = function () {
 *   alert('Hello ' + this.name + '!');
 * }
 * ```
 *
 * ### Example with parameter annotations
 *
 * ```
 * var MyService = ng.Class({
 *   constructor: [String, [new Query(), QueryList], function(name, queryList) {
 *     ...
 *   }]
 * });
 * ```
 *
 * is equivalent to ES6:
 *
 * ```
 * class MyService {
 *   constructor(name: string, @Query() queryList: QueryList) {
 *     ...
 *   }
 * }
 * ```
 *
 * ### Example with inheritance
 *
 * ```
 * var Shape = ng.Class({
 *   constructor: (color) {
 *     this.color = color;
 *   }
 * });
 *
 * var Square = ng.Class({
 *   extends: Shape,
 *   constructor: function(color, size) {
 *     Shape.call(this, color);
 *     this.size = size;
 *   }
 * });
 * ```
 */
function Class(clsDef) {
    var constructor = applyParams(clsDef.hasOwnProperty('constructor') ? clsDef.constructor : undefined, 'constructor');
    var proto = constructor.prototype;
    if (clsDef.hasOwnProperty('extends')) {
        if (lang_1.isFunction(clsDef.extends)) {
            constructor.prototype = proto =
                Object.create(clsDef.extends.prototype);
        }
        else {
            throw new Error("Class definition 'extends' property must be a constructor function was: " + lang_1.stringify(clsDef.extends));
        }
    }
    for (var key in clsDef) {
        if (key != 'extends' && key != 'prototype' && clsDef.hasOwnProperty(key)) {
            proto[key] = applyParams(clsDef[key], key);
        }
    }
    if (this && this.annotations instanceof Array) {
        Reflect.defineMetadata('annotations', this.annotations, constructor);
    }
    return constructor;
}
exports.Class = Class;
var Reflect = lang_1.global.Reflect;
if (!(Reflect && Reflect.getMetadata)) {
    throw 'reflect-metadata shim is required when using class decorators';
}
function makeDecorator(annotationCls, chainFn) {
    if (chainFn === void 0) { chainFn = null; }
    function DecoratorFactory(objOrType) {
        var annotationInstance = new annotationCls(objOrType);
        if (this instanceof annotationCls) {
            return annotationInstance;
        }
        else {
            var chainAnnotation = lang_1.isFunction(this) && this.annotations instanceof Array ? this.annotations : [];
            chainAnnotation.push(annotationInstance);
            var TypeDecorator = function TypeDecorator(cls) {
                var annotations = Reflect.getOwnMetadata('annotations', cls);
                annotations = annotations || [];
                annotations.push(annotationInstance);
                Reflect.defineMetadata('annotations', annotations, cls);
                return cls;
            };
            TypeDecorator.annotations = chainAnnotation;
            TypeDecorator.Class = Class;
            if (chainFn)
                chainFn(TypeDecorator);
            return TypeDecorator;
        }
    }
    DecoratorFactory.prototype = Object.create(annotationCls.prototype);
    return DecoratorFactory;
}
exports.makeDecorator = makeDecorator;
function makeParamDecorator(annotationCls) {
    function ParamDecoratorFactory() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var annotationInstance = Object.create(annotationCls.prototype);
        annotationCls.apply(annotationInstance, args);
        if (this instanceof annotationCls) {
            return annotationInstance;
        }
        else {
            ParamDecorator.annotation = annotationInstance;
            return ParamDecorator;
        }
        function ParamDecorator(cls, unusedKey, index) {
            var parameters = Reflect.getMetadata('parameters', cls);
            parameters = parameters || [];
            // there might be gaps if some in between parameters do not have annotations.
            // we pad with nulls.
            while (parameters.length <= index) {
                parameters.push(null);
            }
            parameters[index] = parameters[index] || [];
            var annotationsForParam = parameters[index];
            annotationsForParam.push(annotationInstance);
            Reflect.defineMetadata('parameters', parameters, cls);
            return cls;
        }
    }
    ParamDecoratorFactory.prototype = Object.create(annotationCls.prototype);
    return ParamDecoratorFactory;
}
exports.makeParamDecorator = makeParamDecorator;
function makePropDecorator(decoratorCls) {
    function PropDecoratorFactory() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var decoratorInstance = Object.create(decoratorCls.prototype);
        decoratorCls.apply(decoratorInstance, args);
        if (this instanceof decoratorCls) {
            return decoratorInstance;
        }
        else {
            return function PropDecorator(target, name) {
                var meta = Reflect.getOwnMetadata('propMetadata', target.constructor);
                meta = meta || {};
                meta[name] = meta[name] || [];
                meta[name].unshift(decoratorInstance);
                Reflect.defineMetadata('propMetadata', meta, target.constructor);
            };
        }
    }
    PropDecoratorFactory.prototype = Object.create(decoratorCls.prototype);
    return PropDecoratorFactory;
}
exports.makePropDecorator = makePropDecorator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjb3JhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFuZ3VsYXIyL3NyYy9jb3JlL3V0aWwvZGVjb3JhdG9ycy50cyJdLCJuYW1lcyI6WyJleHRyYWN0QW5ub3RhdGlvbiIsImFwcGx5UGFyYW1zIiwiQ2xhc3MiLCJtYWtlRGVjb3JhdG9yIiwibWFrZURlY29yYXRvci5EZWNvcmF0b3JGYWN0b3J5IiwibWFrZURlY29yYXRvci5EZWNvcmF0b3JGYWN0b3J5LlR5cGVEZWNvcmF0b3IiLCJtYWtlUGFyYW1EZWNvcmF0b3IiLCJtYWtlUGFyYW1EZWNvcmF0b3IuUGFyYW1EZWNvcmF0b3JGYWN0b3J5IiwibWFrZVBhcmFtRGVjb3JhdG9yLlBhcmFtRGVjb3JhdG9yRmFjdG9yeS5QYXJhbURlY29yYXRvciIsIm1ha2VQcm9wRGVjb3JhdG9yIiwibWFrZVByb3BEZWNvcmF0b3IuUHJvcERlY29yYXRvckZhY3RvcnkiLCJtYWtlUHJvcERlY29yYXRvci5Qcm9wRGVjb3JhdG9yRmFjdG9yeS5Qcm9wRGVjb3JhdG9yIl0sIm1hcHBpbmdzIjoiQUFBQSxxQkFBZ0UsMEJBQTBCLENBQUMsQ0FBQTtBQTRFM0YsMkJBQTJCLFVBQWU7SUFDeENBLEVBQUVBLENBQUNBLENBQUNBLGlCQUFVQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxVQUFVQSxDQUFDQSxjQUFjQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUN0RUEsd0NBQXdDQTtRQUN4Q0EsVUFBVUEsR0FBR0EsVUFBVUEsQ0FBQ0EsVUFBVUEsQ0FBQ0E7SUFDckNBLENBQUNBO0lBQ0RBLE1BQU1BLENBQUNBLFVBQVVBLENBQUNBO0FBQ3BCQSxDQUFDQTtBQUVELHFCQUFxQixTQUE2QixFQUFFLEdBQVc7SUFDN0RDLEVBQUVBLENBQUNBLENBQUNBLFNBQVNBLEtBQUtBLE1BQU1BLElBQUlBLFNBQVNBLEtBQUtBLE1BQU1BLElBQUlBLFNBQVNBLEtBQUtBLFFBQVFBO1FBQ3RFQSxTQUFTQSxLQUFLQSxNQUFNQSxJQUFJQSxTQUFTQSxLQUFLQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNoREEsTUFBTUEsSUFBSUEsS0FBS0EsQ0FBQ0Esd0JBQXNCQSxnQkFBU0EsQ0FBQ0EsU0FBU0EsQ0FBQ0Esb0JBQWlCQSxDQUFDQSxDQUFDQTtJQUMvRUEsQ0FBQ0E7SUFDREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsaUJBQVVBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBQzFCQSxNQUFNQSxDQUFXQSxTQUFTQSxDQUFDQTtJQUM3QkEsQ0FBQ0E7SUFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsU0FBU0EsWUFBWUEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDdENBLElBQUlBLFdBQVdBLEdBQVVBLFNBQVNBLENBQUNBO1FBQ25DQSxJQUFJQSxFQUFFQSxHQUFhQSxTQUFTQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNuREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsaUJBQVVBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3BCQSxNQUFNQSxJQUFJQSxLQUFLQSxDQUNYQSxpRUFBK0RBLEdBQUdBLGNBQVNBLGdCQUFTQSxDQUFDQSxFQUFFQSxDQUFDQSxNQUFHQSxDQUFDQSxDQUFDQTtRQUNuR0EsQ0FBQ0E7UUFDREEsSUFBSUEsVUFBVUEsR0FBR0EsV0FBV0EsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDeENBLEVBQUVBLENBQUNBLENBQUNBLFVBQVVBLElBQUlBLEVBQUVBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1lBQzVCQSxNQUFNQSxJQUFJQSxLQUFLQSxDQUNYQSw0QkFBMEJBLFVBQVVBLDhDQUF5Q0EsRUFBRUEsQ0FBQ0EsTUFBTUEsMkJBQXNCQSxnQkFBU0EsQ0FBQ0EsRUFBRUEsQ0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDbklBLENBQUNBO1FBQ0RBLElBQUlBLGlCQUFpQkEsR0FBWUEsRUFBRUEsQ0FBQ0E7UUFDcENBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLEVBQUVBLEdBQUdBLFdBQVdBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLEVBQUVBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO1lBQ3pEQSxJQUFJQSxnQkFBZ0JBLEdBQVVBLEVBQUVBLENBQUNBO1lBQ2pDQSxpQkFBaUJBLENBQUNBLElBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsQ0FBQ0E7WUFDekNBLElBQUlBLFVBQVVBLEdBQUdBLFdBQVdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2hDQSxFQUFFQSxDQUFDQSxDQUFDQSxVQUFVQSxZQUFZQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDaENBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLFVBQVVBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO29CQUMzQ0EsZ0JBQWdCQSxDQUFDQSxJQUFJQSxDQUFDQSxpQkFBaUJBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUMxREEsQ0FBQ0E7WUFDSEEsQ0FBQ0E7WUFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsaUJBQVVBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNsQ0EsZ0JBQWdCQSxDQUFDQSxJQUFJQSxDQUFDQSxpQkFBaUJBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBO1lBQ3ZEQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDTkEsZ0JBQWdCQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtZQUNwQ0EsQ0FBQ0E7UUFDSEEsQ0FB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Q3JEQyxJQUFJQSxJQUFJQSxHQUFHQSxPQUFPQSxDQUFDQSxjQUFjQSxDQUFDQSxjQUFjQSxFQUFFQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQTtnQkFDdEVBLElBQUlBLEdBQUdBLElBQUlBLElBQUlBLEVBQUVBLENBQUNBO2dCQUNsQkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0E7Z0JBQzlCQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxPQUFPQSxDQUFDQSxpQkFBaUJBLENBQUNBLENBQUNBO2dCQUN0Q0EsT0FBT0EsQ0FBQ0EsY0FBY0EsQ0FBQ0EsY0FBY0EsRUFBRUEsSUFBSUEsRUFBRUEsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0E7WUFDbkVBLENBQUNBLENBQUNEO1FBQ0pBLENBQUNBO0lBQ0hBLENBQUNBO0lBQ0RELG9CQUFvQkEsQ0FBQ0EsU0FBU0EsR0FBR0EsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7SUFDdkVBLE1BQU1BLENBQUNBLG9CQUFvQkEsQ0FBQ0E7QUFDOUJBLENBQUNBO0FBbkJlLHlCQUFpQixvQkFtQmhDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbmNyZXRlVHlwZSwgZ2xvYmFsLCBUeXBlLCBpc0Z1bmN0aW9uLCBzdHJpbmdpZnl9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5cbi8qKlxuICogRGVjbGFyZXMgdGhlIGludGVyZmFjZSB0byBiZSB1c2VkIHdpdGgge0BsaW5rIENsYXNzfS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDbGFzc0RlZmluaXRpb24ge1xuICAvKipcbiAgICogT3B0aW9uYWwgYXJndW1lbnQgZm9yIHNwZWNpZnlpbmcgdGhlIHN1cGVyY2xhc3MuXG4gICAqL1xuICBleHRlbmRzPzogVHlwZTtcblxuICAvKipcbiAgICogUmVxdWlyZWQgY29uc3RydWN0b3IgZnVuY3Rpb24gZm9yIGEgY2xhc3MuXG4gICAqXG4gICAqIFRoZSBmdW5jdGlvbiBtYXkgYmUgb3B0aW9uYWxseSB3cmFwcGVkIGluIGFuIGBBcnJheWAsIGluIHdoaWNoIGNhc2UgYWRkaXRpb25hbCBwYXJhbWV0ZXJcbiAgICogYW5ub3RhdGlvbnMgbWF5IGJlIHNwZWNpZmllZC5cbiAgICogVGhlIG51bWJlciBvZiBhcmd1bWVudHMgYW5kIHRoZSBudW1iZXIgb2YgcGFyYW1ldGVyIGFubm90YXRpb25zIG11c3QgbWF0Y2guXG4gICAqXG4gICAqIFNlZSB7QGxpbmsgQ2xhc3N9IGZvciBleGFtcGxlIG9mIHVzYWdlLlxuICAgKi9cbiAgY29uc3RydWN0b3I6IEZ1bmN0aW9uIHwgYW55W107XG5cbiAgLyoqXG4gICAqIE90aGVyIG1ldGhvZHMgb24gdGhlIGNsYXNzLiBOb3RlIHRoYXQgdmFsdWVzIHNob3VsZCBoYXZlIHR5cGUgJ0Z1bmN0aW9uJyBidXQgVFMgcmVxdWlyZXNcbiAgICogYWxsIHByb3BlcnRpZXMgdG8gaGF2ZSBhIG5hcnJvd2VyIHR5cGUgdGhhbiB0aGUgaW5kZXggc2lnbmF0dXJlLlxuICAgKi9cbiAgW3g6IHN0cmluZ106IFR5cGUgfCBGdW5jdGlvbiB8IGFueVtdO1xufVxuXG4vKipcbiAqIEFuIGludGVyZmFjZSBpbXBsZW1lbnRlZCBieSBhbGwgQW5ndWxhciB0eXBlIGRlY29yYXRvcnMsIHdoaWNoIGFsbG93cyB0aGVtIHRvIGJlIHVzZWQgYXMgRVM3XG4gKiBkZWNvcmF0b3JzIGFzIHdlbGwgYXNcbiAqIEFuZ3VsYXIgRFNMIHN5bnRheC5cbiAqXG4gKiBEU0wgc3ludGF4OlxuICpcbiAqIGBgYFxuICogdmFyIE15Q2xhc3MgPSBuZ1xuICogICAuQ29tcG9uZW50KHsuLi59KVxuICogICAuVmlldyh7Li4ufSlcbiAqICAgLkNsYXNzKHsuLi59KTtcbiAqIGBgYFxuICpcbiAqIEVTNyBzeW50YXg6XG4gKlxuICogYGBgXG4gKiBAbmcuQ29tcG9uZW50KHsuLi59KVxuICogQG5nLlZpZXcoey4uLn0pXG4gKiBjbGFzcyBNeUNsYXNzIHsuLi59XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUeXBlRGVjb3JhdG9yIHtcbiAgLyoqXG4gICAqIEludm9rZSBhcyBFUzcgZGVjb3JhdG9yLlxuICAgKi9cbiAgPFQgZXh0ZW5kcyBUeXBlPih0eXBlOiBUKTogVDtcblxuICAvLyBNYWtlIFR5cGVEZWNvcmF0b3IgYXNzaWduYWJsZSB0byBidWlsdC1pbiBQYXJhbWV0ZXJEZWNvcmF0b3IgdHlwZS5cbiAgLy8gUGFyYW1ldGVyRGVjb3JhdG9yIGlzIGRlY2xhcmVkIGluIGxpYi5kLnRzIGFzIGEgYGRlY2xhcmUgdHlwZWBcbiAgLy8gc28gd2UgY2Fubm90IGRlY2xhcmUgdGhpcyBpbnRlcmZhY2UgYXMgYSBzdWJ0eXBlLlxuICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMzM3OSNpc3N1ZWNvbW1lbnQtMTI2MTY5NDE3XG4gICh0YXJnZXQ6IE9iamVjdCwgcHJvcGVydHlLZXk/OiBzdHJpbmcgfCBzeW1ib2wsIHBhcmFtZXRlckluZGV4PzogbnVtYmVyKTogdm9pZDtcblxuICAvKipcbiAgICogU3RvcmFnZSBmb3IgdGhlIGFjY3VtdWxhdGVkIGFubm90YXRpb25zIHNvIGZhciB1c2VkIGJ5IHRoZSBEU0wgc3ludGF4LlxuICAgKlxuICAgKiBVc2VkIGJ5IHtAbGluayBDbGFzc30gdG8gYW5ub3RhdGUgdGhlIGdlbmVyYXRlZCBjbGFzcy5cbiAgICovXG4gIGFubm90YXRpb25zOiBhbnlbXTtcblxuICAvKipcbiAgICogR2VuZXJhdGUgYSBjbGFzcyBmcm9tIHRoZSBkZWZpbml0aW9uIGFuZCBhbm5vdGF0ZSBpdCB3aXRoIHtAbGluayBUeXBlRGVjb3JhdG9yI2Fubm90YXRpb25zfS5cbiAgICovXG4gIENsYXNzKG9iajogQ2xhc3NEZWZpbml0aW9uKTogQ29uY3JldGVUeXBlO1xufVxuXG5mdW5jdGlvbiBleHRyYWN0QW5ub3RhdGlvbihhbm5vdGF0aW9uOiBhbnkpOiBhbnkge1xuICBpZiAoaXNGdW5jdGlvbihhbm5vdGF0aW9uKSAmJiBhbm5vdGF0aW9uLmhhc093blByb3BlcnR5KCdhbm5vdGF0aW9uJykpIHtcbiAgICAvLyBpdCBpcyBhIGRlY29yYXRvciwgZXh0cmFjdCBhbm5vdGF0aW9uXG4gICAgYW5ub3RhdGlvbiA9IGFubm90YXRpb24uYW5ub3RhdGlvbjtcbiAgfVxuICByZXR1cm4gYW5ub3RhdGlvbjtcbn1cblxuZnVuY3Rpb24gYXBwbHlQYXJhbXMoZm5PckFycmF5OiAoRnVuY3Rpb24gfCBhbnlbXSksIGtleTogc3RyaW5nKTogRnVuY3Rpb24ge1xuICBpZiAoZm5PckFycmF5ID09PSBPYmplY3QgfHwgZm5PckFycmF5ID09PSBTdHJpbmcgfHwgZm5PckFycmF5ID09PSBGdW5jdGlvbiB8fFxuICAgICAgZm5PckFycmF5ID09PSBOdW1iZXIgfHwgZm5PckFycmF5ID09PSBBcnJheSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgQ2FuIG5vdCB1c2UgbmF0aXZlICR7c3RyaW5naWZ5KGZuT3JBcnJheSl9IGFzIGNvbnN0cnVjdG9yYCk7XG4gIH1cbiAgaWYgKGlzRnVuY3Rpb24oZm5PckFycmF5KSkge1xuICAgIHJldHVybiA8RnVuY3Rpb24+Zm5PckFycmF5O1xuICB9IGVsc2UgaWYgKGZuT3JBcnJheSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgdmFyIGFubm90YXRpb25zOiBhbnlbXSA9IGZuT3JBcnJheTtcbiAgICB2YXIgZm46IEZ1bmN0aW9uID0gZm5PckFycmF5W2ZuT3JBcnJheS5sZW5ndGggLSAxXTtcbiAgICBpZiAoIWlzRnVuY3Rpb24oZm4pKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYExhc3QgcG9zaXRpb24gb2YgQ2xhc3MgbWV0aG9kIGFycmF5IG11c3QgYmUgRnVuY3Rpb24gaW4ga2V5ICR7a2V5fSB3YXMgJyR7c3RyaW5naWZ5KGZuKX0nYCk7XG4gICAgfVxuICAgIHZhciBhbm5vTGVuZ3RoID0gYW5ub3RhdGlvbnMubGVuZ3RoIC0gMTtcbiAgICBpZiAoYW5ub0xlbmd0aCAhPSBmbi5sZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgTnVtYmVyIG9mIGFubm90YXRpb25zICgke2Fubm9MZW5ndGh9KSBkb2VzIG5vdCBtYXRjaCBudW1iZXIgb2YgYXJndW1lbnRzICgke2ZuLmxlbmd0aH0pIGluIHRoZSBmdW5jdGlvbjogJHtzdHJpbmdpZnkoZm4pfWApO1xuICAgIH1cbiAgICB2YXIgcGFyYW1zQW5ub3RhdGlvbnM6IGFueVtdW10gPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMCwgaWkgPSBhbm5vdGF0aW9ucy5sZW5ndGggLSAxOyBpIDwgaWk7IGkrKykge1xuICAgICAgdmFyIHBhcmFtQW5ub3RhdGlvbnM6IGFueVtdID0gW107XG4gICAgICBwYXJhbXNBbm5vdGF0aW9ucy5wdXNoKHBhcmFtQW5ub3RhdGlvbnMpO1xuICAgICAgdmFyIGFubm90YXRpb24gPSBhbm5vdGF0aW9uc1tpXTtcbiAgICAgIGlmIChhbm5vdGF0aW9uIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBhbm5vdGF0aW9uLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgcGFyYW1Bbm5vdGF0aW9ucy5wdXNoKGV4dHJhY3RBbm5vdGF0aW9uKGFubm90YXRpb25bal0pKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChpc0Z1bmN0aW9uKGFubm90YXRpb24pKSB7XG4gICAgICAgIHBhcmFtQW5ub3RhdGlvbnMucHVzaChleHRyYWN0QW5ub3RhdGlvbihhbm5vdGF0aW9uKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJhbUFubm90YXRpb25zLnB1c2goYW5ub3RhdGlvbik7XG4gICAgICB9XG4gICAgfVxuICAgIFJlZmxlY3QuZGVmaW5lTWV0YWRhdGEoJ3BhcmFtZXRlcnMnLCBwYXJhbXNBbm5vdGF0aW9ucywgZm4pO1xuICAgIHJldHVybiBmbjtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBPbmx5IEZ1bmN0aW9uIG9yIEFycmF5IGlzIHN1cHBvcnRlZCBpbiBDbGFzcyBkZWZpbml0aW9uIGZvciBrZXkgJyR7a2V5fScgaXMgJyR7c3RyaW5naWZ5KGZuT3JBcnJheSl9J2ApO1xuICB9XG59XG5cbi8qKlxuICogUHJvdmlkZXMgYSB3YXkgZm9yIGV4cHJlc3NpbmcgRVM2IGNsYXNzZXMgd2l0aCBwYXJhbWV0ZXIgYW5ub3RhdGlvbnMgaW4gRVM1LlxuICpcbiAqICMjIEJhc2ljIEV4YW1wbGVcbiAqXG4gKiBgYGBcbiAqIHZhciBHcmVldGVyID0gbmcuQ2xhc3Moe1xuICogICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24obmFtZSkge1xuICogICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gKiAgIH0sXG4gKlxuICogICBncmVldDogZnVuY3Rpb24oKSB7XG4gKiAgICAgYWxlcnQoJ0hlbGxvICcgKyB0aGlzLm5hbWUgKyAnIScpO1xuICogICB9XG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqIGlzIGVxdWl2YWxlbnQgdG8gRVM2OlxuICpcbiAqIGBgYFxuICogY2xhc3MgR3JlZXRlciB7XG4gKiAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAqICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICogICB9XG4gKlxuICogICBncmVldCgpIHtcbiAqICAgICBhbGVydCgnSGVsbG8gJyArIHRoaXMubmFtZSArICchJyk7XG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICpcbiAqIG9yIGVxdWl2YWxlbnQgdG8gRVM1OlxuICpcbiAqIGBgYFxuICogdmFyIEdyZWV0ZXIgPSBmdW5jdGlvbiAobmFtZSkge1xuICogICB0aGlzLm5hbWUgPSBuYW1lO1xuICogfVxuICpcbiAqIEdyZWV0ZXIucHJvdG90eXBlLmdyZWV0ID0gZnVuY3Rpb24gKCkge1xuICogICBhbGVydCgnSGVsbG8gJyArIHRoaXMubmFtZSArICchJyk7XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiAjIyMgRXhhbXBsZSB3aXRoIHBhcmFtZXRlciBhbm5vdGF0aW9uc1xuICpcbiAqIGBgYFxuICogdmFyIE15U2VydmljZSA9IG5nLkNsYXNzKHtcbiAqICAgY29uc3RydWN0b3I6IFtTdHJpbmcsIFtuZXcgUXVlcnkoKSwgUXVlcnlMaXN0XSwgZnVuY3Rpb24obmFtZSwgcXVlcnlMaXN0KSB7XG4gKiAgICAgLi4uXG4gKiAgIH1dXG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqIGlzIGVxdWl2YWxlbnQgdG8gRVM2OlxuICpcbiAqIGBgYFxuICogY2xhc3MgTXlTZXJ2aWNlIHtcbiAqICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBAUXVlcnkoKSBxdWVyeUxpc3Q6IFF1ZXJ5TGlzdCkge1xuICogICAgIC4uLlxuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiAjIyMgRXhhbXBsZSB3aXRoIGluaGVyaXRhbmNlXG4gKlxuICogYGBgXG4gKiB2YXIgU2hhcGUgPSBuZy5DbGFzcyh7XG4gKiAgIGNvbnN0cnVjdG9yOiAoY29sb3IpIHtcbiAqICAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gKiAgIH1cbiAqIH0pO1xuICpcbiAqIHZhciBTcXVhcmUgPSBuZy5DbGFzcyh7XG4gKiAgIGV4dGVuZHM6IFNoYXBlLFxuICogICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24oY29sb3IsIHNpemUpIHtcbiAqICAgICBTaGFwZS5jYWxsKHRoaXMsIGNvbG9yKTtcbiAqICAgICB0aGlzLnNpemUgPSBzaXplO1xuICogICB9XG4gKiB9KTtcbiAqIGBgYFxuICovXG5leHBvcnQgZnVuY3Rpb24gQ2xhc3MoY2xzRGVmOiBDbGFzc0RlZmluaXRpb24pOiBDb25jcmV0ZVR5cGUge1xuICB2YXIgY29uc3RydWN0b3IgPSBhcHBseVBhcmFtcyhcbiAgICAgIGNsc0RlZi5oYXNPd25Qcm9wZXJ0eSgnY29uc3RydWN0b3InKSA/IGNsc0RlZi5jb25zdHJ1Y3RvciA6IHVuZGVmaW5lZCwgJ2NvbnN0cnVjdG9yJyk7XG4gIHZhciBwcm90byA9IGNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgaWYgKGNsc0RlZi5oYXNPd25Qcm9wZXJ0eSgnZXh0ZW5kcycpKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24oY2xzRGVmLmV4dGVuZHMpKSB7XG4gICAgICAoPEZ1bmN0aW9uPmNvbnN0cnVjdG9yKS5wcm90b3R5cGUgPSBwcm90byA9XG4gICAgICAgICAgT2JqZWN0LmNyZWF0ZSgoPEZ1bmN0aW9uPmNsc0RlZi5leHRlbmRzKS5wcm90b3R5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYENsYXNzIGRlZmluaXRpb24gJ2V4dGVuZHMnIHByb3BlcnR5IG11c3QgYmUgYSBjb25zdHJ1Y3RvciBmdW5jdGlvbiB3YXM6ICR7c3RyaW5naWZ5KGNsc0RlZi5leHRlbmRzKX1gKTtcbiAgICB9XG4gIH1cbiAgZm9yICh2YXIga2V5IGluIGNsc0RlZikge1xuICAgIGlmIChrZXkgIT0gJ2V4dGVuZHMnICYmIGtleSAhPSAncHJvdG90eXBlJyAmJiBjbHNEZWYuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgcHJvdG9ba2V5XSA9IGFwcGx5UGFyYW1zKGNsc0RlZltrZXldLCBrZXkpO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0aGlzICYmIHRoaXMuYW5ub3RhdGlvbnMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIFJlZmxlY3QuZGVmaW5lTWV0YWRhdGEoJ2Fubm90YXRpb25zJywgdGhpcy5hbm5vdGF0aW9ucywgY29uc3RydWN0b3IpO1xuICB9XG5cbiAgcmV0dXJuIDxDb25jcmV0ZVR5cGU+Y29uc3RydWN0b3I7XG59XG5cbnZhciBSZWZsZWN0ID0gZ2xvYmFsLlJlZmxlY3Q7XG5pZiAoIShSZWZsZWN0ICYmIFJlZmxlY3QuZ2V0TWV0YWRhdGEpKSB7XG4gIHRocm93ICdyZWZsZWN0LW1ldGFkYXRhIHNoaW0gaXMgcmVxdWlyZWQgd2hlbiB1c2luZyBjbGFzcyBkZWNvcmF0b3JzJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VEZWNvcmF0b3IoXG4gICAgYW5ub3RhdGlvbkNscywgY2hhaW5GbjogKGZuOiBGdW5jdGlvbikgPT4gdm9pZCA9IG51bGwpOiAoLi4uYXJnczogYW55W10pID0+IChjbHM6IGFueSkgPT4gYW55IHtcbiAgZnVuY3Rpb24gRGVjb3JhdG9yRmFjdG9yeShvYmpPclR5cGUpOiAoY2xzOiBhbnkpID0+IGFueSB7XG4gICAgdmFyIGFubm90YXRpb25JbnN0YW5jZSA9IG5ldyAoPGFueT5hbm5vdGF0aW9uQ2xzKShvYmpPclR5cGUpO1xuICAgIGlmICh0aGlzIGluc3RhbmNlb2YgYW5ub3RhdGlvbkNscykge1xuICAgICAgcmV0dXJuIGFubm90YXRpb25JbnN0YW5jZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGNoYWluQW5ub3RhdGlvbiA9XG4gICAgICAgICAgaXNGdW5jdGlvbih0aGlzKSAmJiB0aGlzLmFubm90YXRpb25zIGluc3RhbmNlb2YgQXJyYXkgPyB0aGlzLmFubm90YXRpb25zIDogW107XG4gICAgICBjaGFpbkFubm90YXRpb24ucHVzaChhbm5vdGF0aW9uSW5zdGFuY2UpO1xuICAgICAgdmFyIFR5cGVEZWNvcmF0b3I6IFR5cGVEZWNvcmF0b3IgPSA8VHlwZURlY29yYXRvcj5mdW5jdGlvbiBUeXBlRGVjb3JhdG9yKGNscykge1xuICAgICAgICB2YXIgYW5ub3RhdGlvbnMgPSBSZWZsZWN0LmdldE93bk1ldGFkYXRhKCdhbm5vdGF0aW9ucycsIGNscyk7XG4gICAgICAgIGFubm90YXRpb25zID0gYW5ub3RhdGlvbnMgfHwgW107XG4gICAgICAgIGFubm90YXRpb25zLnB1c2goYW5ub3RhdGlvbkluc3RhbmNlKTtcbiAgICAgICAgUmVmbGVjdC5kZWZpbmVNZXRhZGF0YSgnYW5ub3RhdGlvbnMnLCBhbm5vdGF0aW9ucywgY2xzKTtcbiAgICAgICAgcmV0dXJuIGNscztcbiAgICAgIH07XG4gICAgICBUeXBlRGVjb3JhdG9yLmFubm90YXRpb25zID0gY2hhaW5Bbm5vdGF0aW9uO1xuICAgICAgVHlwZURlY29yYXRvci5DbGFzcyA9IENsYXNzO1xuICAgICAgaWYgKGNoYWluRm4pIGNoYWluRm4oVHlwZURlY29yYXRvcik7XG4gICAgICByZXR1cm4gVHlwZURlY29yYXRvcjtcbiAgICB9XG4gIH1cbiAgRGVjb3JhdG9yRmFjdG9yeS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKGFubm90YXRpb25DbHMucHJvdG90eXBlKTtcbiAgcmV0dXJuIERlY29yYXRvckZhY3Rvcnk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlUGFyYW1EZWNvcmF0b3IoYW5ub3RhdGlvbkNscyk6IGFueSB7XG4gIGZ1bmN0aW9uIFBhcmFtRGVjb3JhdG9yRmFjdG9yeSguLi5hcmdzKTogYW55IHtcbiAgICB2YXIgYW5ub3RhdGlvbkluc3RhbmNlID0gT2JqZWN0LmNyZWF0ZShhbm5vdGF0aW9uQ2xzLnByb3RvdHlwZSk7XG4gICAgYW5ub3RhdGlvbkNscy5hcHBseShhbm5vdGF0aW9uSW5zdGFuY2UsIGFyZ3MpO1xuICAgIGlmICh0aGlzIGluc3RhbmNlb2YgYW5ub3RhdGlvbkNscykge1xuICAgICAgcmV0dXJuIGFubm90YXRpb25JbnN0YW5jZTtcbiAgICB9IGVsc2Uge1xuICAgICAgKDxhbnk+UGFyYW1EZWNvcmF0b3IpLmFubm90YXRpb24gPSBhbm5vdGF0aW9uSW5zdGFuY2U7XG4gICAgICByZXR1cm4gUGFyYW1EZWNvcmF0b3I7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBQYXJhbURlY29yYXRvcihjbHMsIHVudXNlZEtleSwgaW5kZXgpOiBhbnkge1xuICAgICAgdmFyIHBhcmFtZXRlcnM6IGFueVtdW10gPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdwYXJhbWV0ZXJzJywgY2xzKTtcbiAgICAgIHBhcmFtZXRlcnMgPSBwYXJhbWV0ZXJzIHx8IFtdO1xuXG4gICAgICAvLyB0aGVyZSBtaWdodCBiZSBnYXBzIGlmIHNvbWUgaW4gYmV0d2VlbiBwYXJhbWV0ZXJzIGRvIG5vdCBoYXZlIGFubm90YXRpb25zLlxuICAgICAgLy8gd2UgcGFkIHdpdGggbnVsbHMuXG4gICAgICB3aGlsZSAocGFyYW1ldGVycy5sZW5ndGggPD0gaW5kZXgpIHtcbiAgICAgICAgcGFyYW1ldGVycy5wdXNoKG51bGwpO1xuICAgICAgfVxuXG4gICAgICBwYXJhbWV0ZXJzW2luZGV4XSA9IHBhcmFtZXRlcnNbaW5kZXhdIHx8IFtdO1xuICAgICAgdmFyIGFubm90YXRpb25zRm9yUGFyYW06IGFueVtdID0gcGFyYW1ldGVyc1tpbmRleF07XG4gICAgICBhbm5vdGF0aW9uc0ZvclBhcmFtLnB1c2goYW5ub3RhdGlvbkluc3RhbmNlKTtcblxuICAgICAgUmVmbGVjdC5kZWZpbmVNZXRhZGF0YSgncGFyYW1ldGVycycsIHBhcmFtZXRlcnMsIGNscyk7XG4gICAgICByZXR1cm4gY2xzO1xuICAgIH1cbiAgfVxuICBQYXJhbURlY29yYXRvckZhY3RvcnkucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShhbm5vdGF0aW9uQ2xzLnByb3RvdHlwZSk7XG4gIHJldHVybiBQYXJhbURlY29yYXRvckZhY3Rvcnk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlUHJvcERlY29yYXRvcihkZWNvcmF0b3JDbHMpOiBhbnkge1xuICBmdW5jdGlvbiBQcm9wRGVjb3JhdG9yRmFjdG9yeSguLi5hcmdzKTogYW55IHtcbiAgICB2YXIgZGVjb3JhdG9ySW5zdGFuY2UgPSBPYmplY3QuY3JlYXRlKGRlY29yYXRvckNscy5wcm90b3R5cGUpO1xuICAgIGRlY29yYXRvckNscy5hcHBseShkZWNvcmF0b3JJbnN0YW5jZSwgYXJncyk7XG5cbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mIGRlY29yYXRvckNscykge1xuICAgICAgcmV0dXJuIGRlY29yYXRvckluc3RhbmNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gUHJvcERlY29yYXRvcih0YXJnZXQ6IGFueSwgbmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHZhciBtZXRhID0gUmVmbGVjdC5nZXRPd25NZXRhZGF0YSgncHJvcE1ldGFkYXRhJywgdGFyZ2V0LmNvbnN0cnVjdG9yKTtcbiAgICAgICAgbWV0YSA9IG1ldGEgfHwge307XG4gICAgICAgIG1ldGFbbmFtZV0gPSBtZXRhW25hbWVdIHx8IFtdO1xuICAgICAgICBtZXRhW25hbWVdLnVuc2hpZnQoZGVjb3JhdG9ySW5zdGFuY2UpO1xuICAgICAgICBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKCdwcm9wTWV0YWRhdGEnLCBtZXRhLCB0YXJnZXQuY29uc3RydWN0b3IpO1xuICAgICAgfTtcbiAgICB9XG4gIH1cbiAgUHJvcERlY29yYXRvckZhY3RvcnkucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShkZWNvcmF0b3JDbHMucHJvdG90eXBlKTtcbiAgcmV0dXJuIFByb3BEZWNvcmF0b3JGYWN0b3J5O1xufVxuIl19