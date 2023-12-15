const is = require('is-type-of');

const __internalPropsStatic = ['length', 'name', 'prototype'];
const __internalPropsPrototype = ['constructor'];

module.exports = function mixinClasses(classMain, classesMore, ...args) {
  // classesMore
  if (!Array.isArray(classesMore)) {
    classesMore = [classesMore];
  }
  // classMain
  let isFunction;
  if (is.function(classMain) && !is.class(classMain)) {
    classMain = classMain(...args);
    isFunction = true;
  } else {
    isFunction = false;
  }
  if (classMain.__eb_mixined) return classMain;
  // classesMore
  const mixins = [];
  for (const _class of classesMore) {
    if (is.function(_class) && !is.class(_class)) {
      if (!isFunction) throw new Error('should use the same mixin mode as the main class');
      mixins.push(_class(...args));
    } else {
      if (isFunction) throw new Error('should use the same mixin mode as the main class');
      mixins.push(_class);
    }
  }
  // mixin
  for (const mixin of mixins) {
    copyProperties(classMain, mixin, __internalPropsStatic); // copy static
    copyProperties(classMain.prototype, mixin.prototype, __internalPropsPrototype); // copy prototype
  }
  // record
  classMain.__eb_mixined = true;
  // ok
  return classMain;
};

function copyProperties(target, source, __internalProps) {
  for (const key of Reflect.ownKeys(source)) {
    if (!__internalProps.includes(key)) {
      const desc = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, desc);
    }
  }
}
