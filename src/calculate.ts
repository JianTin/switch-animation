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
        if(storeInstance.colorNameArray.includes(name as styleNamespace.color)) {
            // 颜色
            return this.colorCalculate(styleStore as calculateNamespace.colorStore, runDate, direction, easingFn)
        } else {
            // 基础
            return this.baseStyleCalulate(styleStore as calculateNamespace.baseStyleStore, runDate, direction, easingFn)
        }
    }
    // 计算base style值
    baseStyleCalulate(store: calculateNamespace.baseStyleStore, runDate:number, direction: boolean, easingFn: EasingFunction){
        const {startValue, endValue, millisecond} = store
        // 获取 每毫秒移动距离
        const calculate = millisecond * runDate
        let styleVal = 0
        if(direction) {// 正向 原始值 + 计算值
            styleVal = startValue + calculate
        // 反向 最终值 - 计算值 
        } else {
            styleVal = endValue - calculate
        }
        // 解释
        // 计算出 当前动画值 在 最终值中占多少比率 = 当前动画比率
        // 当前动画比率 传入 曲线函数 = 曲线中的占比
        // 最终值 * 曲线中占比 = 当前应该曲线动画值
        const easingRatio = easingFn(styleVal / endValue)
        return easingRatio * endValue
    }
    // 计算color值
    colorCalculate(store: calculateNamespace.colorStore, runDate:number, direction: boolean, easingFn: EasingFunction){
        const {startValue, endValue, millisecond} = store
        // 得出当前毫秒运算的rgb值
        const calculateMillisecond = millisecond.map(v=>v*runDate)
        if(direction){
            return startValue.reduce<string>((prev, colorMode, index)=>{
                const calulateColorMode = calculateMillisecond[index]
                const endColorMode = endValue[index]
                const runColorVal = colorMode + calulateColorMode
                // 计算曲线值
                const easignRatio = easingFn(runColorVal / endColorMode)
                prev += endColorMode * easignRatio
                if(index !== 3) prev+=',';
                if(index === 3) prev+=')';
                return prev
            }, 'rgba(')
        } else {
            return endValue.reduce<string>((prev, colorMode, index)=>{
                const calulateColorMode = calculateMillisecond[index]
                const runColorVal = colorMode - calulateColorMode
                // 计算曲线值
                const easignRatio = easingFn(runColorVal / colorMode)
                prev += colorMode * easignRatio
                if(index !== 3) prev+=',';
                if(index === 3) prev+=')';
                return prev
            }, 'rgba(')
        }
    }
}

export default new Calculate()