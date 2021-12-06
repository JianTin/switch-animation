import { React } from 'react';
import {EasingFunction} from 'bezier-easing'
// 支持得css参数
type margin = 'margin' | 'margin-top' | 'margin-bottom' | 'margin-left' | 'margin-right'
type padding = 'padding' | 'padding-top' | 'padding-bottom' | 'padding-left' | 'padding-right'
type size = 'width' | 'height'
type inset = 'left' | 'right' | 'top' | 'bottom'
type color = 'color' | 'background-color'
type rotate = 'rotate' | 'rotateX' | 'rotateY' | 'rotateZ' 
type translate = 'translateX' | 'translateY' | 'translateZ'
type scale = 'scaleX' | 'scaleY' | 'scaleZ'
type skew = 'skewX' | 'skewY'
export type transform = rotate | translate | scale | skew | 'perspective'
export type styleName = margin | padding | size | inset | color | transform  | 'font-size' | 'opacity'

// config
// 配置项
type animationConfig<T extends elementKey> = {
    element: HTMLElementTagNameMap[T]
    duration: number
    targetStyle?: targetStyle
    middleStyle?: middleStyle
    durationType?: string
    easing?: easingVal
} & AnimationCallback
// 事件 参数
type AnimationCallback = {
    onStart?: ()=>void,
    onAnimation?: ()=>void,
    onEnd?: ()=>void
}
// html typescript
export type elementKey = keyof HTMLElementTagNameMap
// 目标style
type targetStyle = {
    [key1 in styleName]?: targetStyleVal
}
// 间断style
type middleStyle = {
    [key: string]: {
        [key1 in styleName]?: targetStyleVal
    } & AnimationCallback &　{
        easing?: easingVal
    }
}
// style配置value
type targetStyleVal = {
    unit: string,
    startValue: string,
    endValue: string
}
//贝塞尔曲线 value
export type easingVal = [number, number, number, number] | string

// SwitchAnimation 类
interface SwitchAnimation {
    // new(config: animationConfig<T>):SwitchAnimation
    getInstanceEvent:()=>(getInstanceEventValue)
}
export type getInstanceEventValue = {
    isAnimationShow:()=>boolean
    startAnimation: ()=>void
    switchAnimation:()=>void
}

// store type
// type级别
export type typeStore = {
    styleList: {
        [name in styleName]?: styleStore
    }
    instance: SwitchAnimation | null,
    durationObj: {
        positive: durationDirectionValue,
        negative: durationDirectionValue,
        direction: boolean | null,
        isStart: boolean
    } | null,
    easingFn: EasingFunction | null
}
// style级别的 key
type styleStoreKey = 'startValue' | 'endValue' | 'millisecond'
// style级别
export type styleStore =  {
    [key in styleStoreKey]: storeStyleValue
} & styleUnit
// 存储单位
type styleUnit = {
    unit: string
}
// styleValue
type storeStyleValue = number | colorValue
// 颜色存储value
type colorValue = [number, number, number, number]
// 不同方向存储的value值
type durationDirectionValue = {
    startDuration: number
    endDuration: number
}


// 运算需要的格式
// base style
export type baseStore = {
    [key in styleStoreKey]: number
} & styleUnit
// color style
export type colorStore = {
    [key in styleStoreKey]: colorValue
} & styleUnit