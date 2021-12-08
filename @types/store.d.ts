import {styleNamespace, switchAnimationInstance} from './index'
import {EasingFunction} from 'bezier-easing'

export namespace storeNamespace {
    // style级别的 key
    // 开始、结束、每秒运行、距离、最小值到 0的值（减去他代表 在动画中真正进行 计算的距离，可以和 distance 一起使用 计算在动画曲线中的位置）
    export type styleStoreKey = 'startValue' | 'endValue' | 'millisecond' | 'distance' | 'minValDistanceZero'
    // 颜色存储value
    export type colorValue = [number, number, number, number]
    // boxShadow储存的value
    type shadowNumber = [number, number, number, number]
    export type boxShadowValue = {
        inset: number[],// 哪部分具有inset
        // color: colorValue[],
        shadowArray: Array<{
            color: colorValue,
            shadowNumber: shadowNumber
        }>
    }
    // styleValue
    // 分几种情况：基础style、color、box-shadow
    type storeStyleValue = number | colorValue | boxShadowValue
    // 存储单位
    export type interfaceUnit = {
        unit: string
    }
    // style级别
    export type styleStore =  {
        [key in styleStoreKey]: storeStyleValue
    } & interfaceUnit
    // 不同方向存储的value值
    type durationDirectionValue = {
        startDuration: number
        endDuration: number
    }

    // type级别
    export type typeStore = {
        styleList: {
            [name in styleNamespace.styleName]?: styleStore
        }
        instance: switchAnimationInstance | null,
        durationObj: {
            positive: durationDirectionValue,
            negative: durationDirectionValue,
            direction: boolean | null,
            isStart: boolean
        } | null,
        easingFn: EasingFunction | null
    }
}