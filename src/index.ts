import { global } from "./global.js";
import { is } from "./is.js";
import { launch, ready } from "./launch.js";
import { start, pause } from "./renderLoop.js";
import { importScene, downloadScene } from "./import.js";
import { createLibrary, library, libraries } from "./library.js";
import { select } from "./select.js";
import { data } from "./data.js";
import { on, off, one, trigger } from "./events.js";
import { patch } from "./patch.js";
import { match } from "./Elements.js";
import { Selector } from "./Selector.js";
import { color } from './color.js';
import { animate } from "./animate.js";
import { extend } from "./extend.js";
import "./patch.plugins/index.js";

export default {
    get canvas() {
        return global.canvas;
    },
    set canvas(value) {
        global.canvas = value;
    },
    get scene() {
        return global.scene;
    },
    set scene(value) {
        global.scene = value;
    },
    get engine() {
        return global.engine;
    },
    set engine(value) {
        global.engine = value;
    },
    get TRACE() {
        return global.TRACE;
    },
    set TRACE(value) {
        global.TRACE = value;
    },
    launch : launch,
    ready : ready,
    start : start,
    pause : pause,
    import : importScene,
    download : downloadScene,
    createLibrary : createLibrary,
    library : library,
    data : data,
    on : function(event: string, handler: (...args: any[]) => void, repeat = true) {
        on(this, event, handler, repeat);
    },
    off : function(event: string, handler?: (...args: any[]) => void) {
        off(this, event, handler);
    },
    one : function(event: string, handler: (...args: any[]) => void) {
        one(this, event, handler);
    },
    trigger : function(event: string, extraParameters?: any) {
        trigger(this, event, extraParameters);
    },
    select : select,
    patch : patch,
    match : match,
    Selector : Selector,
    is : is,
    color : color,
    animate : animate,
    extend : extend
};
