import { BABYLON } from './BABYLON.js';
import { is } from "./is.js";
import { select } from "./select.js";
import { extend } from "./extend.js";
import { color } from "./color.js";
import { patch } from "./patch.js";

function getEasingFunction(easing: string): BABYLON.EasingFunction {
  let mode;
  let func;
  if (easing.indexOf("easeInOut") != -1) {
    mode = BABYLON.EasingFunction.EASINGMODE_EASEINOUT;
    func = easing.replace("easeInOut", "");
  } else {
    if (easing.indexOf("easeIn") != -1) {
      mode = BABYLON.EasingFunction.EASINGMODE_EASEIN;
      func = easing.replace("easeIn", "");
    } else {
      if (easing.indexOf("easeOut") != -1) {
        mode = BABYLON.EasingFunction.EASINGMODE_EASEOUT;
        func = easing.replace("easeOut", "");
      } else {
        console.info("_r::unrecognized easing function " + easing);
        return null;
      }
    }
  }
  let easingFunction;
  switch (func) {
    case "Sine":
      easingFunction = new BABYLON.SineEase();
      easingFunction.setEasingMode(mode);
      return easingFunction;
    case "Quad":
      easingFunction = new BABYLON.QuadraticEase();
      easingFunction.setEasingMode(mode);
      return easingFunction;
    case "Cubic":
      easingFunction = new BABYLON.CubicEase();
      easingFunction.setEasingMode(mode);
      return easingFunction;
    case "Quart":
      easingFunction = new BABYLON.QuarticEase();
      easingFunction.setEasingMode(mode);
      return easingFunction;
    case "Quint":
      easingFunction = new BABYLON.QuinticEase();
      easingFunction.setEasingMode(mode);
      return easingFunction;
    case "Expo" :
      easingFunction = new BABYLON.ExponentialEase();
      easingFunction.setEasingMode(mode);
      return easingFunction;
    case "Circ":
      easingFunction = new BABYLON.CircleEase();
      easingFunction.setEasingMode(mode);
      return easingFunction;
    case "Back":
      easingFunction = new BABYLON.BackEase();
      easingFunction.setEasingMode(mode);
      return easingFunction;
    case "Elastic":
      easingFunction = new BABYLON.ElasticEase();
      easingFunction.setEasingMode(mode);
      return easingFunction;
    case "Bounce":
      easingFunction = new BABYLON.BounceEase();
      easingFunction.setEasingMode(mode);
      return easingFunction;
    default:
      console.warn("_r::unrecognized easing function " + easing);
      return null;
  }
}

function getLoopMode(options : IAnimationOptions): number {
  if (is.Boolean(options.loopMode)) {
    if (options.loopMode) {
      return BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT;
    }
  }
  if (is.String(options.loopMode)) {
    if ((<string> options.loopMode).toLowerCase() == "cycle") {
      return BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE;
    }
    if ((<string>options.loopMode).toLocaleLowerCase() == "relative" || (<string>this.loop).toLocaleLowerCase() == "pingpong") {
      return BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE;
    }
  } else {
    if (is.Number(options.loopMode)) {
      return <number>options.loopMode;
    }
  }
  return BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT;
}

function getAnimationType(element, property) : number {
  if (is.Vector2(element[property])) {
    return BABYLON.Animation.ANIMATIONTYPE_VECTOR2;
  }
  if (is.Vector3(element[property])) {
    return BABYLON.Animation.ANIMATIONTYPE_VECTOR3;
  }
  if (is.Number(element[property])) {
    return BABYLON.Animation.ANIMATIONTYPE_FLOAT;
  }
  if (is.Color(element[property])) {
    return BABYLON.Animation.ANIMATIONTYPE_COLOR3;
  }
  if (is.Quaternion(element[property])) {
    return BABYLON.Animation.ANIMATIONTYPE_QUATERNION;
  }
  if (is.Matrix(element[property])) {
    return BABYLON.Animation.ANIMATIONTYPE_MATRIX;
  }
  if (is.Size(element[property])) {
    return BABYLON.Animation.ANIMATIONTYPE_SIZE;
  }
  return null;
}

function isAnimatable(element, property) {
  return getAnimationType(element, property) !== null;
}

function getKeys(element, property, newValue, options) {
  if (options.keys) {
    return options.keys;
  }
  let initial = element[property];
  let final;
  switch (getAnimationType(element, property)) {
    case BABYLON.Animation.ANIMATIONTYPE_COLOR3:
      final = initial.clone();
      patch(final, color(newValue));
      break;
    case BABYLON.Animation.ANIMATIONTYPE_FLOAT:
      final = newValue;
      break;
    case BABYLON.Animation.ANIMATIONTYPE_MATRIX:
      final = initial.clone();
      patch(final, newValue);
      break;
    default:
      final = initial.clone();
      let properties = Object.getOwnPropertyNames(newValue);
      properties.forEach((property) => {
        final[property] = newValue[property];
      });
      break;
  }
  return [
    {
      frame: 0,
      value: initial
    },
    {
      frame: options.fps * options.duration,
      value: final
    }
  ];
}

function getAnimationsForElement(element : any, patch : any, options : IAnimationOptions) : Array<BABYLON.Animation> {
  let animations = [];
  let properties = Object.getOwnPropertyNames(patch);
  if (!element.animations) {
    element.animations = [];
  }
  properties.forEach((property) => {
    if (!isAnimatable(element, property)) {
      console.error(property + " is not animatable");
    }
    else {
      let animation = new BABYLON.Animation("_r.animation" + element.animations.length, property, options.fps, getAnimationType(element, property), getLoopMode(options));
      let keys = getKeys(element, property, patch[property], options);
      animation.setKeys(keys);
      if (options.easing) {
        animation.setEasingFunction(getEasingFunction(options.easing));
      }
      element.animations.push(animation);
      animations.push(animation);
    }
  });
  return animations;
}

function findSomethingToAnimate(element : any, patch : any) {
  let properties = Object.getOwnPropertyNames(patch);
  let animatables = [];
  properties.forEach((property) => {
    if (isAnimatable(element, property)) {
      animatables.push({
        element : element,
        property : property,
        patch : patch[property]
      });
    }
    else {
      if (!is.Primitive(patch[property])) {
        let _animatables = findSomethingToAnimate(element[property], patch[property]);
        animatables = animatables.concat(_animatables);
      }
      else {
        return [];
      }
    }
  });
  return animatables;
}

export interface IAnimationOptions {
  fps?: number;
  duration?: number;
  speedRatio?: number;
  from?: number;
  to?: number;
  loopMode?: boolean | string | number;
  easing?: string;
  complete?: () => void;
  keys? : [];
}

const defaultOptions = {
  fps : 30,
  duration : 0.4,
  speedRatio : 1,
  loopMode : false
};

let count = 0;

export function animate(elements : any, patch : any, options? : number | IAnimationOptions) : BABYLON.AnimationGroup {
  let _elements = select(elements);
  let _options : IAnimationOptions = {};
  if (is.Number(options)) {
    _options.duration = <number> options;
  }
  else {
    _options = <IAnimationOptions> options;
  }
  _options = extend({}, defaultOptions, _options);
  let group = new BABYLON.AnimationGroup("_r.animate.AnimationsGroup" + count++);
  _elements.each((item) => {
    let _animatables = findSomethingToAnimate(item, patch);
    _animatables.forEach((animatable) => {
      let _element = animatable.element;
      let _patch = {};
      _patch[animatable.property] = animatable.patch;
      let animations = getAnimationsForElement(_element, _patch, _options);
      animations.forEach((animation) => {
        group.addTargetedAnimation(animation, _element);
      });
    });
    /**
    let animations = getAnimationsForElement(item, patch, _options);
    animations.forEach((animation) => {
      group.addTargetedAnimation(animation, item);
    });**/
  });
  group.speedRatio = _options.speedRatio;
  if (_options.complete) {
    group.onAnimationGroupEndObservable.add(_options.complete);
  }
  group.play();
  return group;
}