"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_alias_1 = require("module-alias");
const path_1 = require("path");
// For development (when running ts-node)
if (process.env.NODE_ENV !== 'production') {
    (0, module_alias_1.addAlias)('@', (0, path_1.join)(__dirname, '..'));
}
