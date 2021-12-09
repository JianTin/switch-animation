// 运算最终 value
import storeInstance from './store'
// import {styleName, styleStore, colorStore, baseStore, color} from './base'
import {styleNamespace} from '../@types/index'
import {storeNamespace} from '../@types/store'
import {calculateNamespace} from '../@types/calculate'
import {EasingFunction} from 'bezier-easing'

class Calculate {
    constructor(){}
    calculateVal(styleStore: storeNamespace.styleStore, name: styleNamespace.styleName,runDate: number, direction: boolean, easingFn: EasingFunction){
        // 选择不同
        // as color 是因为ts原因
        if(name === 'box-shadow'){
            return this.shadowCalulate(styleStore as calculateNamespace.shadowStore, runDate, direction, easingFn)
        } else if(storeInstance.colorNameArray.includes(name as styleNamespace.color)) {
            // 颜色
            return this.colorCalculate(styleStore as calculateNamespace.colorStore, runDate, direction, easingFn)
        } else {
            // 基础
            return this.baseStyleCalulate(styleStore as calculateNamespace.baseStyleStore, runDate, direction, easingFn)
        }
    }
    // 计算base style值
    baseStyleCalulate(store: calculateNamespace.baseStyleStore, runDate:number, direction: boolean, easingFn: EasingFunction){
        const {startValue, endValue, millisecond, distance, minValDistanceZero, unit} = store
        // 获取 每毫秒移动距离
        const calculate = millisecond * runDate
        let styleVal = 0
        if(direction) {// 正向 原始值 + 计算值
            styleVal = startValue + calculate
        // 反向 最终值 - 计算值 
        } else {
            styleVal = endValue - calculate
        }
        // distance 为0 代表设置值一模一样，直接返回 不需要做曲线处理
        if(distance === 0) return styleVal + unit;
        // 解释
        // 计算出 当前动画值(不能 大于 距离值，所以需要减少到距离值内) 在 距离值中占多少比率 = 当前动画比率
        // 当前动画比率 传入 曲线函数 = 曲线中的占比
        // 距离值 * 曲线中占比 = 当前应该曲线动画值
        const easingRatio = easingFn((styleVal - minValDistanceZero) / distance)
        return ((easingRatio * distance) + minValDistanceZero) + unit
    }
    // 计算color值
    colorCalculate(store: calculateNamespace.colorStore, runDate:number, direction: boolean, easingFn: EasingFunction){
        const {startValue, endValue, millisecond, distance, minValDistanceZero} = store
        // 得出当前毫秒运算的rgb值
        const calculateMillisecond = millisecond.map(v=>v*runDate)
        if(direction){
            return startValue.reduce<string>((prev, colorMode, index)=>{
                const calulateColorMode = calculateMillisecond[index]
                const distanceValue = distance[index]
                const minVal = minValDistanceZero[index]
                const runColorVal = colorMode + calulateColorMode
                if(distanceValue === 0){
                    prev += runColorVal
                } else {
                    // 计算曲线值
                    const easignRatio = easingFn((runColorVal - minVal) / distanceValue)
                    prev += (distanceValue * easignRatio) + minVal
                }
                if(index !== 3) prev+=',';
                if(index === 3) prev+=')';
                return prev
            }, 'rgba(')
        } else {
            return endValue.reduce<string>((prev, colorMode, index)=>{
                const calulateColorMode = calculateMillisecond[index]
                const distanceValue = distance[index]
                const minVal = minValDistanceZero[index]
                const runColorVal = colorMode - calulateColorMode
                if(distanceValue === 0){
                    prev += runColorVal
                } else {
                    // 计算曲线值
                    const easignRatio = easingFn((runColorVal - minVal) / distanceValue)
                    prev += (distanceValue * easignRatio ) + minVal
                }
                if(index !== 3) prev+=',';
                if(index === 3) prev+=')';
                return prev
            }, 'rgba(')
        }
    }
    shadowCalulate(store: calculateNamespace.shadowStore, runDate:number, direction: boolean, easingFn: EasingFunction){
        const {startValue, endValue, millisecond, distance, minValDistanceZero, unit, inset} = store
        return startValue.reduce((prev, currentStart, index)=>{
            // 多个shadow设置
            if(index !== 0){
                prev+=','
            }
            if(inset!.includes(index)){
                prev+='inset'
            }
            const {color: startColor, shadowNumber: startShadowNumber} = currentStart
            const {color: endColor, shadowNumber: endShadowNumber} = endValue[index]
            const {color: millisecondColor, shadowNumber: millisecondShadowNumber} = millisecond[index]
            const {color: distanceColor, shadowNumber: distanceShadowNumber} = distance[index]
            const {color: disancenZeroColor, shadowNumber: disancenZeroShadowNumber} = minValDistanceZero[index]
            const caluclateColor = this.colorCalculate({
                startValue: startColor,endValue: endColor, millisecond: millisecondColor, distance: distanceColor, minValDistanceZero: disancenZeroColor, unit: ''
            }, runDate, direction, easingFn)
            const caluclateShadowValue = startShadowNumber.reduce((prev, startNumber, index)=>{
                prev += ' ' + this.baseStyleCalulate({
                    startValue: startNumber, endValue: endShadowNumber[index], millisecond: millisecondShadowNumber[index], distance: distanceShadowNumber[index], minValDistanceZero: disancenZeroShadowNumber[index], unit
                }, runDate, direction, easingFn)
                return prev
            }, '')
            prev += caluclateShadowValue+` ${caluclateColor}`
            return prev
        }, '')
    }
}

export default new Calculate()