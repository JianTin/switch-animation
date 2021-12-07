未完成
# switch-animation
___
封装的一个动画类。用于做动画 切换，保证中间切换 按照原动画逻辑进行过度。  
支持typescript。  
支持动画曲线（贝塞尔曲线）目前已内置了部分。  
分为两种模式：整段动画、阶段动画  
> 例子：  
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
import SwitchAnimation from 'switch-animation'
...
const {switchAnimation} = new SwitchAnimation({
    element: document.querySelector('div'),
    duration: 500,
    easing: 'easeInOutBack', // 可不传，默认 linear 曲线。只应用于 整段动画
    targetStyle: {
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
}).getInstanceEvent()
switchAnimation()
...
```

```
(分段动画)
html:
<div style='width:100px; height:100px; background-color:red;'></div>
js:
...
const {switchAnimation} = new SwitchAnimation({
    element: document.querySelector('div'),
    duration: 800,
    middleStyle: {
        '0-800': {
            easing: 'easeOutBack', // 默认 linear，可不传递。每个时间段可以单独设置
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
}).getInstanceEvent()
switchAnimation()
...
```

#### css支持情况
不支持：  
translate: 可以通过 translateX + translateY 代替  
scale: 可以通过 scaleX + scaleY 代替  
border: 可以通过 border-color + border-width 代替，需要预先设置 element border样式  
box-shadow: 目前不支持  
支持：  
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

