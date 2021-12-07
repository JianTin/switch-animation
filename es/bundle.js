import _assertThisInitialized from '@babel/runtime/helpers/assertThisInitialized';
import _inheritsLoose from '@babel/runtime/helpers/inheritsLoose';
import _newArrowCheck from '@babel/runtime/helpers/newArrowCheck';
import BezierEasing from 'bezier-easing';
import colorString from 'color-string';

var Easing = function Easing() {
  var _this = this;

  // 创建贝塞尔曲线函数
  this.createEasing = function (easing) {
    _newArrowCheck(this, _this);

    // ts 无法运行
    // return BezierEasing( !Array.isArray(easing) ? ...this.bulitInEasing[easing] : easing )
    if (Array.isArray(easing)) {
      return BezierEasing.apply(void 0, easing);
    } else {
      // 防止传入无效 stringKey
      var easingVal = this.bulitInEasing[easing];
      easingVal = easingVal ? easingVal : this.bulitInEasing['linear'];
      return BezierEasing.apply(void 0, easingVal);
    }
  }.bind(this);

  this.bulitInEasing = {
    linear: [1, 1, 0, 0],
    easeInSine: [0.12, 0, 0.39, 0],
    easeOutSine: [0.61, 1, 0.88, 1],
    easeInOutSine: [0.37, 0, 0.63, 1],
    easeInQuad: [0.11, 0, 0.5, 0],
    easeOutQuad: [0.5, 1, 0.89, 1],
    easeInOutQuad: [0.45, 0, 0.55, 1],
    easeInCubic: [0.32, 0, 0.67, 0],
    easeOutCubic: [0.33, 1, 0.68, 1],
    easeInOutCubic: [0.65, 0, 0.35, 1],
    easeInQuart: [0.5, 0, 0.75, 0],
    easeOutQuart: [0.25, 1, 0.5, 1],
    easeInOutQuart: [0.76, 0, 0.24, 1],
    easeInQuint: [0.64, 0, 0.78, 0],
    easeOutQuint: [0.22, 1, 0.36, 1],
    easeInOutQuint: [0.83, 0, 0.17, 1],
    easeInExpo: [0.7, 0, 0.84, 0],
    easeOutExpo: [0.16, 1, 0.3, 1],
    easeInOutExpo: [0.87, 0, 0.13, 1],
    easeInCirc: [0.55, 0, 1, 0.45],
    easeOutCirc: [0, 0.55, 0.45, 1],
    easeInOutCirc: [0.85, 0, 0.15, 1],
    easeInBack: [0.36, 0, 0.66, -0.56],
    easeOutBack: [0.34, 1.56, 0.64, 1],
    easeInOutBack: [0.68, -0.6, 0.32, 1.6]
  };
};

var easing = new Easing();

var Store = /*#__PURE__*/function () {
  function Store() {
    var _this = this;

    this.createType = function (type) {
      _newArrowCheck(this, _this);

      if (!this.store[type]) {
        this.store[type] = {
          styleList: {},
          instance: null,
          durationObj: null,
          easingFn: null
        };
      }
    }.bind(this); // 全局的store，第一次初始化调用


    this.initGlobalStore = function (instance) {
      _newArrowCheck(this, _this);

      this.globalStore = instance;
    }.bind(this); // 添加storeStyle


    this.addStoreStyle = function (type, name, valueObj, unit, duration) {
      _newArrowCheck(this, _this);

      this.createType(type);

      if (this.colorNameArray.includes(name)) {
        // 判断是color么，是的话处理为需要的格式
        this.generateColorStyle(type, name, valueObj, unit, duration);
      } else {
        this.generateBaseStyle(type, name, valueObj, unit, duration);
      }
    }.bind(this); // 添加当前实例


    this.addStoreInstance = function (type, instance) {
      _newArrowCheck(this, _this);

      this.createType(type);
      this.store[type]['instance'] = instance;
    }.bind(this); // 添加实例对应的 正反方向 --- 开始、结束值 用于做是否 运行动画判断


    this.addStoreDirection = function (type, startDuration, endDuration) {
      _newArrowCheck(this, _this);

      this.createType(type);
      var allInstance = this.globalStore;
      if (!allInstance) return;
      var allDuration = allInstance.duration; // 正向 800 - 1000
      // 反向，设置和之前相同的动画逻辑时间。0-200

      this.store[type]['durationObj'] = {
        positive: {
          startDuration: startDuration,
          endDuration: endDuration
        },
        negative: {
          startDuration: allDuration - endDuration,
          endDuration: allDuration - startDuration
        },
        direction: null,
        isStart: false
      };
    }.bind(this); // 添加贝塞尔函数


    this.addStoreEasing = function (type, easingVal) {
      _newArrowCheck(this, _this);

      this.store[type]['easingFn'] = easing.createEasing(easingVal);
    }.bind(this); // 全局的


    this.globalStore = null;
    this.store = {};
    this.colorNameArray = ['color', 'background-color', 'border-color'];
  } // 生成基础style每毫秒值


  var _proto = Store.prototype;

  _proto.generateBaseStyle = function generateBaseStyle(type, name, valueObj, unit, duration) {
    var _this2 = this;

    var _Object$values$map = Object.values(valueObj).map(function (v) {
      _newArrowCheck(this, _this2);

      return Number(v);
    }.bind(this)),
        startValue = _Object$values$map[0],
        endValue = _Object$values$map[1];

    var millisecond = (endValue - startValue) / duration;
    var distance = endValue > startValue ? endValue - startValue : startValue - endValue;
    var minValDistanceZero = endValue > startValue ? startValue : endValue;
    this.store[type]['styleList'][name] = {
      startValue: startValue,
      endValue: endValue,
      millisecond: millisecond,
      unit: unit,
      distance: distance,
      minValDistanceZero: minValDistanceZero
    };
  } // 处理颜色 -> rgba()
  ;

  _proto.handelColorParams = function handelColorParams(valueObj) {
    var _this3 = this;

    return Object.keys(valueObj).reduce(function (prev, key) {
      _newArrowCheck(this, _this3);

      prev[key] = colorString.get(valueObj[key]).value;
      return prev;
    }.bind(this), {
      startValue: [],
      endValue: []
    });
  } // 生成color每毫秒值
  ;

  _proto.generateColorStyle = function generateColorStyle(type, name, valueObj, unit, duration) {
    var _this4 = this;

    var _this$handelColorPara = this.handelColorParams(valueObj),
        startValue = _this$handelColorPara.startValue,
        endValue = _this$handelColorPara.endValue; // sta: [0,0,0,0] end: [255,255,255,255]


    var r1 = startValue[0],
        g1 = startValue[1],
        b1 = startValue[2],
        a1 = startValue[3];
    var r2 = endValue[0],
        g2 = endValue[1],
        b2 = endValue[2],
        a2 = endValue[3]; // 进行计算 每毫秒移动的值

    var millisecond = [r2 - r1, g2 - g1, b2 - b1, a2 - a1].map(function (val) {
      _newArrowCheck(this, _this4);

      return val / duration;
    }.bind(this)); // const distance = startValue.map((startColor, index)=>{
    //     const endColor = endValue[index]
    //     return endColor > startColor ? endColor - startColor : startColor - endColor
    // })

    var _startValue$reduce = startValue.reduce(function (prev, startColor, index) {
      _newArrowCheck(this, _this4);

      var endColor = endValue[index];
      prev['distance'].push(endColor > startColor ? endColor - startColor : startColor - endColor);
      prev['minValDistanceZero'].push(endColor > startColor ? startColor : endColor);
      return prev;
    }.bind(this), {
      distance: [],
      minValDistanceZero: []
    }),
        distance = _startValue$reduce.distance,
        minValDistanceZero = _startValue$reduce.minValDistanceZero;

    if (startValue.length === 4 && endValue.length === 4 && millisecond.length === 4) {
      if (!this.store[type]) return;
      this.store[type]['styleList'][name] = {
        startValue: startValue,
        endValue: endValue,
        millisecond: millisecond,
        distance: distance,
        minValDistanceZero: minValDistanceZero,
        unit: unit
      };
    }
  };

  return Store;
}();

var storeInstance = new Store();

var Calculate = /*#__PURE__*/function () {
  function Calculate() {}

  var _proto = Calculate.prototype;

  _proto.calculateVal = function calculateVal(styleStore, name, runDate, direction, easingFn) {
    // 选择不同
    // as color 是因为ts原因
    if (storeInstance.colorNameArray.includes(name)) {
      // 颜色
      return this.colorCalculate(styleStore, runDate, direction, easingFn);
    } else {
      // 基础
      return this.baseStyleCalulate(styleStore, runDate, direction, easingFn);
    }
  } // 计算base style值
  ;

  _proto.baseStyleCalulate = function baseStyleCalulate(store, runDate, direction, easingFn) {
    var startValue = store.startValue,
        endValue = store.endValue,
        millisecond = store.millisecond,
        distance = store.distance,
        minValDistanceZero = store.minValDistanceZero; // 获取 每毫秒移动距离

    var calculate = millisecond * runDate;
    var styleVal = 0;

    if (direction) {
      // 正向 原始值 + 计算值
      styleVal = startValue + calculate; // 反向 最终值 - 计算值 
    } else {
      styleVal = endValue - calculate;
    } // distance 为0 代表设置值一模一样，直接返回 不需要做曲线处理


    if (distance === 0) return styleVal; // 解释
    // 计算出 当前动画值(不能 大于 距离值，所以需要减少到距离值内) 在 距离值中占多少比率 = 当前动画比率
    // 当前动画比率 传入 曲线函数 = 曲线中的占比
    // 距离值 * 曲线中占比 = 当前应该曲线动画值

    var easingRatio = easingFn((styleVal - minValDistanceZero) / distance);
    return easingRatio * distance + minValDistanceZero;
  } // 计算color值
  ;

  _proto.colorCalculate = function colorCalculate(store, runDate, direction, easingFn) {
    var _this = this;

    var startValue = store.startValue,
        endValue = store.endValue,
        millisecond = store.millisecond,
        distance = store.distance,
        minValDistanceZero = store.minValDistanceZero; // 得出当前毫秒运算的rgb值

    var calculateMillisecond = millisecond.map(function (v) {
      _newArrowCheck(this, _this);

      return v * runDate;
    }.bind(this));

    if (direction) {
      return startValue.reduce(function (prev, colorMode, index) {
        _newArrowCheck(this, _this);

        var calulateColorMode = calculateMillisecond[index];
        var distanceValue = distance[index];
        var minVal = minValDistanceZero[index];
        var runColorVal = colorMode + calulateColorMode;
        console.log(runColorVal, colorMode, calulateColorMode);

        if (distanceValue === 0) {
          prev += runColorVal;
        } else {
          // 计算曲线值
          var easignRatio = easingFn((runColorVal - minVal) / distanceValue);
          prev += distanceValue * easignRatio + minVal;
        }

        if (index !== 3) prev += ',';
        if (index === 3) prev += ')';
        console.log(prev);
        return prev;
      }.bind(this), 'rgba(');
    } else {
      return endValue.reduce(function (prev, colorMode, index) {
        _newArrowCheck(this, _this);

        var calulateColorMode = calculateMillisecond[index];
        var distanceValue = distance[index];
        var minVal = minValDistanceZero[index];
        var runColorVal = colorMode - calulateColorMode;

        if (distanceValue === 0) {
          prev += runColorVal;
        } else {
          // 计算曲线值
          var easignRatio = easingFn((runColorVal - minVal) / distanceValue);
          prev += distanceValue * easignRatio + minVal;
        }

        if (index !== 3) prev += ',';
        if (index === 3) prev += ')';
        return prev;
      }.bind(this), 'rgba(');
    }
  };

  return Calculate;
}();

var calculateInstance = new Calculate();

var SetStyleValue = /*#__PURE__*/function () {
  function SetStyleValue() {
    var _this = this;

    this.setTransform = function (element, styleName, styleVal, unit) {
      _newArrowCheck(this, _this);

      var transformVal = element.style['transform'];
      var bool = transformVal.includes(styleName); // transform 内部存在该值，删除重新处理

      if (bool) {
        // /translateX\([0-9]+%{0,}[p|x]{0,}\)/
        transformVal = transformVal.replace(new RegExp(styleName + "\\(-*[0-9]*\\.*[0-9]*" + unit + "\\)", 'g'), '');
      }

      transformVal += " " + styleName + "(" + styleVal + unit + ")";
      element.style['transform'] = transformVal;
    }.bind(this);

    this.setBaseStyle = function (element, styleName, styleVal, unit) {
      _newArrowCheck(this, _this);

      element.style[styleName] = styleVal + unit;
    }.bind(this);

    this.transformKey = ['rotate', 'rotateX', 'rotateY', 'rotateZ', 'translateX', 'translateY', 'translateZ', 'scaleX', 'scaleY', 'scaleZ', 'skewX', 'skewY'];
  }

  var _proto = SetStyleValue.prototype;

  _proto.set = function set(element, styleStore, styleName, runDate, direction, easingFn) {
    var unit = styleStore.unit;
    var val = calculateInstance.calculateVal(styleStore, styleName, runDate, direction, easingFn); // 处理transform

    if (this.transformKey.includes(styleName)) {
      this.setTransform(element, styleName, val, unit);
    } else {
      // 处理正常
      this.setBaseStyle(element, styleName, val, unit);
    }
  };

  return SetStyleValue;
}();

var setStyleInstance = new SetStyleValue();

var IsRunMiddleAnimation = /*#__PURE__*/function () {
  function IsRunMiddleAnimation() {
    var _this = this;

    // 时间判断运行
    this.runMiddleAnimation = function (currentDate, middleDuration, currentDirection) {
      _newArrowCheck(this, _this);

      var _storeInstance$store$ = storeInstance.store[middleDuration],
          instance = _storeInstance$store$.instance,
          durationObj = _storeInstance$store$.durationObj;
      if (!instance || !durationObj) return;
      var positive = durationObj.positive,
          negative = durationObj.negative,
          direction = durationObj.direction,
          isStart = durationObj.isStart;

      if (currentDirection !== direction || isStart) {
        // 判断符合运行时间
        var _ref = currentDirection ? positive : negative,
            startDuration = _ref.startDuration,
            endDuration = _ref.endDuration; // switch 调用的时间段，只需要调用一次。配合 方向解决


        if (currentDate > startDuration && currentDate < endDuration) {
          // 更新方向
          durationObj.direction = currentDirection; // 判断是 重新start么，如果是的话运行

          if (isStart) {
            durationObj.isStart = false; // 调用

            instance.getInstanceEvent().startAnimation();
          } else {
            // 调用
            instance.getInstanceEvent().switchAnimation();
          }
        }
      }
    }.bind(this);
  } // 用于生成，具有中间动画的 实例 和 运行时间对象


  var _proto = IsRunMiddleAnimation.prototype;

  _proto.middleAnimationInit = function middleAnimationInit(elementConfig) {
    var _this2 = this;

    var element = elementConfig.element,
        middleStyle = elementConfig.middleStyle;
    if (!middleStyle) return;
    Object.keys(middleStyle).forEach(function (durationType) {
      var _this3 = this;

      _newArrowCheck(this, _this2);

      var _durationType$split$m = durationType.split('-').map(function (n) {
        _newArrowCheck(this, _this3);

        return Number(n);
      }.bind(this)),
          startDuration = _durationType$split$m[0],
          endDuration = _durationType$split$m[1];

      var styleObj = middleStyle[durationType];
      var onStart = styleObj.onStart,
          onEnd = styleObj.onEnd,
          onAnimation = styleObj.onAnimation,
          easing = styleObj.easing;
      delete styleObj['onStart'];
      delete styleObj['onEnd'];
      delete styleObj['onAnimation']; // // 获取运行多长时间

      var continuedDuration = endDuration - startDuration;
      new SwitchAnimation({
        duration: continuedDuration,
        element: element,
        targetStyle: styleObj,
        durationType: durationType,
        easing: easing ? easing : 'linear',
        onStart: onStart,
        onEnd: onEnd,
        onAnimation: onAnimation
      }); // 存储该type级别，正方向应该 运行的时间

      storeInstance.addStoreDirection(durationType, startDuration, endDuration);
    }.bind(this));
  };

  return IsRunMiddleAnimation;
}();

var isRunMiddleInstance = new IsRunMiddleAnimation();

var Public = function Public(elementConfig) {
  var _this = this;

  // 初始化，保存当前 type实例，每个styleName 每毫秒计算值
  this.initEvent = function (elementConfig) {
    var _this2 = this;

    _newArrowCheck(this, _this);

    var targetStyle = this.targetStyle,
        duration = this.duration,
        durationType = this.durationType; // 初始化保存 globalInstance

    if (durationType === 'all') {
      storeInstance.initGlobalStore(this);
    }

    if (!targetStyle) {
      // 如果没有 targetStyle 代表使用 middle模式
      return isRunMiddleInstance.middleAnimationInit(elementConfig);
    } // 往storeStyle存储


    Object.keys(targetStyle).forEach(function (styleName) {
      _newArrowCheck(this, _this2);

      var paramsStyle = targetStyle[styleName];
      if (!paramsStyle) return; // 兼容上方 ts

      var endValue = paramsStyle.endValue,
          startValue = paramsStyle.startValue,
          unit = paramsStyle.unit;
      storeInstance.addStoreStyle(durationType, styleName, {
        startValue: startValue,
        endValue: endValue
      }, unit, duration);
    }.bind(this)); // 存储 instance，继承实例 具有全部方法

    storeInstance.addStoreInstance(durationType, this); // 添加贝塞尔曲线

    storeInstance.addStoreEasing(durationType, elementConfig.easing ? elementConfig.easing : 'linear');
  }.bind(this); // 动画结束 触发


  this.endInit = function () {
    _newArrowCheck(this, _this);

    var onEnd = this.AnimationCallback.onEnd;
    if (onEnd) onEnd(this.element);
  }.bind(this); // 重置元素style -> 开始 / 结束


  this.reset = function (direction) {
    var _this3 = this;

    _newArrowCheck(this, _this);

    var targetStyle = this.targetStyle,
        durationType = this.durationType,
        duration = this.duration,
        element = this.element;
    var onAnimation = this.AnimationCallback.onAnimation;
    if (!targetStyle) return;
    var typeStore = storeInstance.store[durationType];
    var easingFn = typeStore.easingFn,
        styleList = typeStore.styleList;
    if (!easingFn) return;
    Object.keys(styleList).forEach(function (styleName) {
      _newArrowCheck(this, _this3);

      var styleStore = styleList[styleName];
      if (!styleStore) return; // 上面是防护

      setStyleInstance.set(element, styleStore, styleName, duration, direction, easingFn);
      if (onAnimation) onAnimation(element);
    }.bind(this));
  }.bind(this);

  var element = elementConfig.element,
      targetStyle = elementConfig.targetStyle,
      onStart = elementConfig.onStart,
      onAnimation = elementConfig.onAnimation,
      onEnd = elementConfig.onEnd,
      duration = elementConfig.duration,
      _elementConfig$durati = elementConfig.durationType,
      durationType = _elementConfig$durati === void 0 ? 'all' : _elementConfig$durati; // 保存动画 运行中的时间

  this.currentDate = 0; // 动画开始时间

  this.startDate = 0; // 动画结束的时间

  this.endDate = 0; // 绘制的元素

  this.element = element; // 动画绘制的时间长，单位毫秒

  this.duration = duration; // 元素绘制目标的style, 复杂动画 不会出现。除非是新类 调用

  this.targetStyle = targetStyle ? targetStyle : null; // 触发事件

  this.AnimationCallback = {
    onStart: onStart,
    onAnimation: onAnimation,
    onEnd: onEnd
  };
  this.durationType = durationType;
  this.isInit = true;
  this.isPositive = true;
  this.animationShow = false;
  this.initEvent(elementConfig);
}; // 整体时间计算，调用执行动画


var Switch = /*#__PURE__*/function (_Public) {
  _inheritsLoose(Switch, _Public);

  function Switch(elementConfig) {
    var _this5 = this;

    var _this4;

    _this4 = _Public.call(this, elementConfig) || this; // start

    _this4.start = function () {
      var _this6 = this;

      _newArrowCheck(this, _this5);

      _this4.isInit = false;
      _this4.isPositive = true; // 计算时间

      var currentDate = new Date().valueOf();
      _this4.endDate = currentDate + _this4.duration;
      _this4.startDate = currentDate;
      _this4.animationShow = true; // targetStyle 没有。代表是 middleAnimation设置isStart

      if (!_this4.targetStyle) {
        Object.values(storeInstance.store).forEach(function (_ref) {
          _newArrowCheck(this, _this6);

          var durationObj = _ref.durationObj;
          return durationObj.isStart = true;
        }.bind(this));
      } // 动画


      _this4.runSwitchAnimation(true);
    }.bind(this); // switch


    _this4["switch"] = function () {
      _newArrowCheck(this, _this5);

      var onStart = _this4.AnimationCallback.onStart; // 初始化

      if (_this4.isInit) {
        _this4.start();
      } else {
        // 开始切换
        _this4.animationShow = _this4.isPositive = !_this4.isPositive; // 开始进行切换
        // 计算出，结束时间 = 当前时间 + （剩余时间 | 0）

        _this4.endDate = new Date().valueOf() + (_this4.currentDate - _this4.startDate); // 计算出开始位置

        _this4.startDate = _this4.endDate - _this4.duration;
      }

      _this4.runSwitchAnimation(_this4.isPositive);

      if (onStart) onStart(_this4.element);
    }.bind(this);

    _this4.runSwitchAnimation = function (direction) {
      var _this7 = this;

      _newArrowCheck(this, _this5);

      requestAnimationFrame(function () {
        var _this8 = this;

        _newArrowCheck(this, _this7);

        var _assertThisInitialize = _assertThisInitialized(_this4),
            startDate = _assertThisInitialize.startDate,
            endDate = _assertThisInitialize.endDate,
            element = _assertThisInitialize.element,
            targetStyle = _assertThisInitialize.targetStyle,
            isPositive = _assertThisInitialize.isPositive,
            durationType = _assertThisInitialize.durationType;

        var onAnimation = _this4.AnimationCallback.onAnimation;
        var currentDate = new Date().valueOf();
        _this4.currentDate = currentDate; // 方向不相等 不递归

        if (direction !== isPositive) return;

        if (currentDate >= endDate) {
          _this4.reset(direction ? true : false); // 结束，下次回撤会使用到 currentDate。防止出现时间误差
          // 进行准确结束赋值


          _this4.currentDate = endDate;

          _this4.endInit();

          return;
        } // 当前时间 距离 开始时间，间隔时间


        var runDate = currentDate - startDate; // 判断 整体动画 还是 间断动画

        if (targetStyle) {
          var _storeInstance$store$ = storeInstance.store[durationType],
              typeStore = _storeInstance$store$.styleList,
              easingFn = _storeInstance$store$.easingFn;
          Object.keys(typeStore).forEach(function (styleName) {
            _newArrowCheck(this, _this8);

            var styleStore = typeStore[styleName];
            if (!styleStore || !easingFn) return;
            setStyleInstance.set(element, styleStore, styleName, runDate, isPositive, easingFn);
          }.bind(this));
          if (onAnimation) onAnimation(element);
        } else {
          // 运行间断动画
          Object.keys(storeInstance.store).forEach(function (middleDuration) {
            _newArrowCheck(this, _this8);

            return isRunMiddleInstance.runMiddleAnimation(runDate, middleDuration, direction);
          }.bind(this));
        }

        _this4.runSwitchAnimation(direction);
      }.bind(this));
    }.bind(this);

    return _this4;
  }

  return Switch;
}(Public);

var SwitchAnimation = /*#__PURE__*/function (_Switch) {
  _inheritsLoose(SwitchAnimation, _Switch);

  function SwitchAnimation(elementConfig) {
    var _this10 = this;

    var _this9;

    _this9 = _Switch.call(this, elementConfig) || this;

    _this9.getInstanceEvent = function () {
      var _this11 = this;

      _newArrowCheck(this, _this10);

      return {
        isAnimationShow: function isAnimationShow() {
          _newArrowCheck(this, _this11);

          return _this9.animationShow;
        }.bind(this),
        startAnimation: _this9.start,
        switchAnimation: _this9["switch"]
      };
    }.bind(this);

    return _this9;
  }

  return SwitchAnimation;
}(Switch);

export { SwitchAnimation as default };
