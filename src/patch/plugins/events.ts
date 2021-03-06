import { registerPlugin } from "../patchPlugin.js";
import { is } from "../../is.js";
import { global } from "../../global.js";
import { globalPatch } from "../patchElement.js";
import { select } from "../../select.js";

registerPlugin({
  test(element, source, property) : boolean {
    return ["on", "off", "trigger", "one"].indexOf(property) != -1;
  },
  resolve(element, source, property, context) {
    switch (property) {
      case "on" :
        Object.getOwnPropertyNames(source[property]).forEach(function(event) {
          let handler = source[property][event];
          if (is.Function(handler)) {
            return select(element).on(event, handler);
          }
          else {
            select(element).on(event, function() {
              return select(element).patch(source[property][event]);
            });
          }
        });
        break;
      case "off" :
        if (is.String(source[property])) {
          return select(element).off(source[property]);
        }
        else {
          Object.getOwnPropertyNames(source[property]).forEach(function(event) {
            select(element).off(event, source[property][event]);
          });
        }
        break;
      case "trigger" :
        if (is.String(source[property])) {
            return select(element).trigger(source[property]);
        }
        else {
          Object.getOwnPropertyNames(source[property]).forEach(function(event) {
            return select(element).trigger(event, source[property][event]);
          });
        }
        break;
      case "one":
        Object.getOwnPropertyNames(source[property]).forEach(function(event) {
          let handler = source[property][event];
          if (is.Function(handler)) {
            return select(element).one(event, handler);
          }
          else {
            select(element).one(event, function() {
              return select(element).patch(source[property][event]);
            });
          }
        });
        break;
    }
  }
});