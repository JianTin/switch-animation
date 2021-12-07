import {styleNamespace, switchAnimationInstance} from './index'
import {EasingFunction} from 'bezier-easing'

export namespace storeNamespace {
    // style级别的 key
    // 开始、结束、每秒运行、距离
    export type styleStoreKey = 'startValue' | 'endValue' | 'millisecond' | 'distance'
    // 颜色存储value
    export type colorValue = [number, number, number, number]
    // styleValue
    type storeStyleValue = number | colorValue
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