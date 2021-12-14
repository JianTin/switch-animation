import {bulitInEasing} from './easing'

// 支持得css参数
export namespace styleNamespace {
    type margin = 'margin' | 'margin-top' | 'margin-bottom' | 'margin-left' | 'margin-right'
    type border = 'border-width'
    type borderRadius =  'border-radius' | 'border-top-left-radius' | 'border-top-right-radius' | 'border-bottom-right-radius' | 'border-bottom-left-radius'
    type padding = 'padding' | 'padding-top' | 'padding-bottom' | 'padding-left' | 'padding-right'
    type size = 'width' | 'height'
    type inset = 'left' | 'right' | 'top' | 'bottom'
    type color = 'color' | 'background-color' | 'border-color'
    type rotate = 'rotate' | 'rotateX' | 'rotateY' | 'rotateZ' 
    type translate = 'translateX' | 'translateY' | 'translateZ'
    type scale = 'scaleX' | 'scaleY' | 'scaleZ'
    type skew = 'skewX' | 'skewY'
    export type shadow = 'box-shadow'
    export type transform = rotate | translate | scale | skew | 'perspective'
    export type styleName = margin | padding | size | inset | color | transform  | border |'font-size' | 'opacity' | shadow | borderRadius
}

// config配置
export namespace configNamespace {
    // html typescript
    type elementKey = keyof HTMLElementTagNameMap
    // style配置value
    type targetStyleVal = {
        unit: string,
        startValue: string,
        endValue: string
    }
    //贝塞尔曲线 value
    type easingVal = [number, number, number, number] | bulitInEasing
    // 目标style
    type targetStyle = {
        [key1 in styleNamespace.styleName]?: targetStyleVal
    }
    // 间断style
    type middleStyle = {
        [key: string]: {
            [key1 in styleNamespace.styleName]?: targetStyleVal
        } & AnimationCallback & {
            easing?: easingVal
        }
    }
    // 事件 参数
    type AnimationCallback = {
        onStart?: (element?: HTMLElement)=>void,
        onAnimation?: (element?: HTMLElement)=>void,
        onEnd?: (element?: HTMLElement)=>void
    }
    // 基础配置，供暴露方法使用
    type baseConfig = {
        element: HTMLElementTagNameMap[T]
        duration: number
        easing?: easingVal
    } & AnimationCallback
    // 配置项
    type animationConfig<T extends elementKey> = {
        targetStyle?: targetStyle
        middleStyle?: middleStyle
        durationType: string // 内部使用
    } & baseConfig
}

// animation实例
export interface animationInstance {
    duration: number
    currentDate: number
    startDate: number
    endDate: number
    element: HTMLElementTagNameMap[T]
    targetStyle: configNamespace.targetStyle | null
    AnimationCallback: configNamespace.AnimationCallback
    // 正向 还是 反向
    isPositive: boolean
    // 是否第一次
    isInit: boolean
    // true 显示/显示中，false 隐藏和隐藏中
    animationShow: boolean
    // 实例分级
    durationType: string
    // 曲线
    easing: configNamespace.easingVal
    startAnimation: ()=>void
    switchAnimation: ()=>void
}