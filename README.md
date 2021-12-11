# switch-animation
___
封装的一个动画类。用于做动画 切换，保证中间切换 按照原动画逻辑进行过度。  
支持typescript。  
支持动画曲线（贝塞尔曲线）目前已内置了部分。  
分为两种模式：整段动画、阶段动画  
插件例子：[menu动画](https://codesandbox.io/s/menudong-hua-li-zi-9p1ww?file=/src/components/menuItem.tsx)    [input提示动画](https://codesandbox.io/s/jian-dan-li-zi---zu-jian-cdykh)      [整段动画](https://codesandbox.io/s/jian-dan-dong-hua-bdusy?file=/src/App.tsx)     [分段动画](https://codesandbox.io/s/fu-za-dong-hua-li-zi-3cuzm?file=/src/App.tsx)   

> css问题：  
> 0-1000ms（left: 0-1000px ) 100-200ms (background-color: red->green )  
> 当你走到 200ms，需要让他恢复到初始状态。此时单靠 css 是无法实现的。  
> transtion: 无法保证 100-200ms 做background切换，保持left同步运行。  
> animation：直接增加新animation类，会导致 动画从初始化开始运行。不会出现动画效果。  

#### 安装
```
npm i switch-animation
    /
yarn add switch-animation
```

#### 基本使用
```
（整段动画）
html:
<div style="border: 1px solid red; width: 100px; height: 100px; " ></div>
js:
import {wholeAnimation} from 'switch-animation'
...
const {switchAnimation} = wholeAnimation({
    element: document.querySelector('div'),
    duration: 500,
    easing: 'easeInOutBack', // 可不传，默认 linear 曲线。
    animation: {
        translateX: {
            startValue: '0',
            endValue: '100',
            unit: 'px'
        },
        'border-color': {
            startValue: 'red',
            endValue: '#373D49',
            unit: ''
        }
    }
})
switchAnimation()
...
```

```
(分段动画)
html:
<div style='width:100px; height:100px; background-color:red;'></div>
js:
import {segmentedAnimation} from 'switch-animation'
...
const {switchAnimation} = segmentedAnimation({
    element: document.querySelector('div'),
    duration: 800,
    easing: 'linear', // 默认linear，可不传递。将应用于每个时间段 动画曲线
    animation: {
        '0-800': {
            easing: 'easeOutBack', // 每个时间段可以单独设置，做到覆盖全局 动画曲线
            translateX: {
                startValue: '0',
                endValue: '500',
                unit: 'px'
            },
            width: {
                startValue: '100',
                endValue: '150',
                unit: 'px'
            }
        },
        '0-200': {
            'background-color': {
                startValue: 'red',
                endValue: 'rgba(0,0,0,1)',
                unit: ''
            }
        },
        '200-600': {
            rotate: {
                startValue: '0',
                endValue: '360',
                unit: 'deg'
            } 
        }
    }
})
switchAnimation()
...
```

#### cssName支持情况
不支持：  
transform：我这边拆分为 单个变换，如 translateX、translateY、rotate、scaleX...
translate: 可以通过 translateX + translateY 代替  
scale: 可以通过 scaleX + scaleY 代替  
border: 可以通过 border-color + border-width 代替，需要预先设置 element border样式  [border 例子](https://codesandbox.io/s/border-li-zi-jf2tl)  
支持：  
box-shadow: 支持，但有格式限制（详情见下方） [阴影例子](https://codesandbox.io/s/yin-ying-li-zi-99cn7)  
'margin' | 'margin-top' | 'margin-bottom' | 'margin-left' | 'margin-right'  
'border-width' | 'border-color'  
'padding' | 'padding-top' | 'padding-bottom' | 'padding-left' | 'padding-right'  
'width' | 'height'  
'left' | 'right' | 'top' | 'bottom'  
'color' | 'background-color'  
'rotate' | 'rotateX' | 'rotateY' | 'rotateZ'   
'translateX' | 'translateY' | 'translateZ'  
'scaleX' | 'scaleY' | 'scaleZ'  
'skewX' | 'skewY'  
'perspective' | 'font-size' | 'opacity'  

#### 基本参数
wholeAnimation 和 segmentedAnimation 基本参数
```
    {
        element: 必传，dom元素 --- element
        duration：必传，动画时间 --- number
        easing：非必传，默认 linear，作用于全局动画的曲线 --- [number, number, number, number] | string（详情下方 动画曲线）
        onStart: 非必传，默认 null，动画开始运行时 触发 --- (element)=>void
        onAnimation: 非必传, 默认null，动画进行更改element.style时 (不建议使用，会频繁调用) 触发 --- (element)=>void
        onEnd: 非必传，默认null，动画结束时 触发 --- (element)=>void
        animation: ...
    }
```
wholeAnimation: 整段动画
```
import {wholeAnimation} from 'switch-animation'
const animationEvent = wholeAnimation({
    ... (基本参数)
    animation: {
         cssName: { // 必传，设置的cssName （例： left | translateX | 'background-color' ）
            startValue: 必传, 开始cssValue值 --- string
            endValue: 必传，结束cssValue值 --- string
            unit: 必传，单位 --- string （例：'px' | '%' | 'deg' | '' ）
        }
        cssName...
    }
})
```
segmentedAnimation: 分段动画
```
import {segmentedAnimation} from 'switch-animation'
const animationEvemt = segmentedAnimation({
    ...(基本参数)
    animation: {
        // 必传开始运行 和 结束运行的时间。例: ( '0-1000' | '300-700' )
        'startDuration-endDuration': { 
            easing: 非必传，默认以 全局动画曲线为主。可单独设置分段动画曲线
            onStart: 非必传，开始运行分段动画触发。
            onAnimation：...
            onEnd:...
            cssName: {
                startValue: string,
                endValue: string,
                unit: string
            },
            cssName...
        }
        'startDuration-endDuration'...
    }
})
```
返回事件
```
animationEvemt {
    // isAnimationShow方法，调用后返回 boolean。true: 动画在显示中 / 已经显示， false：动画在关闭中 / 已关闭
    isAnimationShow:()=>boolean
    // startAnimation方法，需要动画重新开始使用（大概率少用）
    startAnimation: ()=>void 
    // switchAnimation方法，通过他调用动画 切换（开始 -> 结束、结束 -> 开始、中间切换）
    switchAnimation: ()=>void 
}
```
#### 特殊cssName 设置
颜色 --- color、'background-color'、'border-color'
```
    startValue、endValue: rgb(x,x,x)、rgba(x,x,x,x)、##373D49、hsl(360, 100%, 50%)、hwb(60, 3%, 60%)、red(color-name)...
    例：
        color: {
            startValue: 'green',
            endValue: 'rgba()',
            unit: ''
        }
```
box-shadow
```
    startValue、endValue： "0 0 0 0 black"(x偏移、y偏移、阴影模糊半径、阴影扩散半径、阴影颜色)
                        "inset 0 0 0 0 balck"(阴影在框内)
                        "0 0 5 5 black, 2 2 0 0 red"（多个阴影以 逗号， 进行分割）
    unit: 单位 --- 'px' | 'em' ...
    例:
        'box-shadow': {
            startValue: '0 0 0 0 black',
            endValue: '0 0 30 2 white',
            unit: 'px'
        }
```
#### 动画曲线
easing: [number, number, number, number] | string (代表内置的动画曲线)   
> (内置动画曲线 效果查看  ---  [https://easings.net/cn](https://easings.net/cn) )  
> string 支持参数  
> 'linear' | 'easeInSine' | 'easeOutSine' | 'easeInOutSine' | 'easeInQuad' | 'easeOutQuad' | 'easeInOutQuad' |   
>    'easeInCubic' | 'easeOutCubic'  | 'easeInOutCubic' | 'easeInQuart' | 'easeOutQuart' | 'easeInOutQuart' |   
>    'easeInQuint' | 'easeOutQuint' | 'easeInOutQuint' | 'easeInExpo' | 'easeOutExpo' | 'easeInOutExpo'|   
>    'easeInCirc' | 'easeOutCirc' | 'easeInOutCirc' | 'easeInBack' | 'easeOutBack' | 'easeInOutBack'  

> 自定义动画曲线  
> easing: [.42, -0.54, .42, .99]  
> (可以通过该网站预设效果 --- [https://cubic-bezier.com/](https://cubic-bezier.com/) )   


