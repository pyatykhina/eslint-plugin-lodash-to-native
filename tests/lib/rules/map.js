/**
 * @fileoverview map
 * @author Tatiana Pyatykhina
 */
 "use strict";

var rule = require("../../../lib/rules/map"),
RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();

ruleTester.run("map", rule, {
    valid: [
        "[1, 2, 3].map(fn)",
        "_.map({a: 1, b: 2}, fn)",
        // `_ = {map: () => []}; 
        // var m2 = _.map([], fn);`
    ],

    invalid: [
        {
            code: `
                var collection = [1, 2, 3];
                _.map(collection, fn);
            `,
            errors: [{ message: "Use Array#map instead of _.map" }],
            output: `
                var collection = [1, 2, 3];
                (Array.isArray(collection)) ? collection.map(fn) : _.map(collection, fn);
            `
        },
        {
            code: "_.map([1, 2, 3], fn)",
            errors: [{ message: "Use Array#map instead of _.map" }],
            output: "[1, 2, 3].map(fn)"
        },
        {
            code: "var m1 = _.map([1, 2, 3], fn);",
            errors: [{ message: "Use Array#map instead of _.map" }],
            output: `var m1 = [1, 2, 3].map(fn);`
        }
    ]
});
