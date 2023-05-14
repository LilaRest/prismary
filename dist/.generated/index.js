"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
_export_star(require("./models-specs"), exports);
_export_star(require("./UserSchema"), exports);
_export_star(require("./UserCreateSchema"), exports);
_export_star(require("./UserUpdateSchema"), exports);
_export_star(require("./ProfileSchema"), exports);
_export_star(require("./ProfileCreateSchema"), exports);
_export_star(require("./ProfileUpdateSchema"), exports);
_export_star(require("./PostSchema"), exports);
_export_star(require("./PostCreateSchema"), exports);
_export_star(require("./PostUpdateSchema"), exports);
_export_star(require("./CommentSchema"), exports);
_export_star(require("./CommentCreateSchema"), exports);
_export_star(require("./CommentUpdateSchema"), exports);
function _export_star(from, to) {
    Object.keys(from).forEach(function(k) {
        if (k !== "default" && !Object.prototype.hasOwnProperty.call(to, k)) {
            Object.defineProperty(to, k, {
                enumerable: true,
                get: function() {
                    return from[k];
                }
            });
        }
    });
    return from;
}
