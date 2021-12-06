import { React } from 'react';
import {EasingFunction} from 'bezier-easing'
import {bulitInEasing} from './easing'

// 支持得css参数
export namespace styleNamespace {
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
}

// config配置
export namespace configNamespace {
    // html typescript
    export type elementKey = keyof HTMLElementTagNameMap
    // style配置value
    type targetStyleVal = {
        unit: string,
        startValue: string,
        endValue: string
    }
    //贝塞尔曲线 value
    export type easingVal = [number, number, number, number] | bulitInEasing
    // 目标style
    type targetStyle = {
        [key1 in styleNamespace.styleName]?: targetStyleVal
    }
    // 间断style
    type middleStyle = {
        [key: string]: {
            [key1 in styleNamespace.styleName]?: targetStyleVal
        } & AnimationCallback &　{
            easing?: easingVal
        }
    }
    // 事件 参数
    type AnimationCallback = {
        onStart?: ()=>void,
        onAnimation?: ()=>void,
        onEnd?: ()=>void
    }
    // 配置项
    type animationConfig<T extends elementKey> = {
        element: HTMLElementTagNameMap[T]
        duration: number
        targetStyle?: targetStyle
        middleStyle?: middleStyle
        durationType?: string
        easing?: easingVal
    } & AnimationCallback
}

export type getInstanceEventValue = {
    isAnimationShow:()=>boolean
    startAnimation: ()=>void
    switchAnimation:()=>void
}
// switchAnimation实例
export interface switchAnimationInstance {
    getInstanceEvent:()=>(getInstanceEventValue)
}

declare module "swtich-animation" {
    export default class <T extends configNamespace.elementKey>{
        constructor(animationConfig: configNamespace.animationConfig<T>): switchAnimationInstance
    }
}