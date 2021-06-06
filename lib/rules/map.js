/**
 * @fileoverview map
 * @author Tatiana Pyatykhina
 */
 "use strict";

 //------------------------------------------------------------------------------
 // Rule Definition
 //------------------------------------------------------------------------------
 
module.exports = {
    meta: {
         docs: {
             description: "map",
             category: "Fill me in",
             recommended: false
         },
         fixable: "code",  // or "code" or "whitespace"
         schema: [
             // fill in your schema
         ]
    },
 
    create: function(context) {

        return {
            CallExpression(node) {
                if (node.callee?.object.name !== "_" || node.callee?.property.name !== "map") return; // not lodash map
                if (node.arguments.length < 2) return; // not arguments

                const firstArg = node.arguments[0];
                const secondArg = node.arguments[1];

                if (firstArg.type === "ObjectExpression") return; // not array

                const firstArgInner = context.getSourceCode().getText(firstArg);
                const secondArgInner = context.getSourceCode().getText(secondArg);
                let replaceStr;

                if (context.getSourceCode().getText(firstArg)[0] === "[") { // explicit array literal
                    replaceStr = `${firstArgInner}.map(${secondArgInner})`;
                } else { // implicit array literal
                    replaceStr = `(Array.isArray(${firstArgInner})) ? ${firstArgInner}.map(${secondArgInner}) : _.map(${firstArgInner}, ${secondArgInner})`;
                };

                context.report({
                    node: node,
                    message: "Use Array#map instead of _.map",
                    fix: function(fixer) {
                        return fixer.replaceText(node, replaceStr);
                    }
                });

            }
        };

    }
};
 