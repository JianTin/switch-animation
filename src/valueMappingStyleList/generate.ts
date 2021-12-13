// 生成 startStyleVal 到 endStyleVal
// currentValue 对应的 styleVal
import {styleNamespace} from '../../@types/animation'
import {initStyleRangeObj} from './index'
import {shadow, colorArry} from '../constant'
import colorString from 'color-string'

type JudgmentHandelStyle = (styleName: styleNamespace.styleName, initRangeStyle:initStyleRangeObj, rangeValue: number, increasingValue: number)=> string
type handelStyle = (initRangeStyle:initStyleRangeObj, rangeValue: number, increasingValue: number)=> string
class generateStyleValue {
    constructor(){}
    generateStyle:JudgmentHandelStyle = (styleName, initRangeStyle, rangeValue, increasingValue)=>{
        const {baseStyle, colorStyle, shadowStyle} = this
        if(colorArry.includes(styleName)){
            return colorStyle(initRangeStyle, rangeValue, increasingValue)
        } else if(styleName === shadow){
            return shadowStyle(initRangeStyle, rangeValue, increasingValue)
        } else {
            return baseStyle(initRangeStyle, rangeValue, increasingValue)
        }
    }
    // 处理基础 style
    // 处理的rangeStyle、rangeValue、currentValue
    baseStyle:handelStyle = (initRangeStyle, rangeValue, increasingValue)=>{
        const {startValue, endValue, unit} = initRangeStyle
        const styleRange = Number(endValue) - Number(startValue)
        // styleRange 在范围值内，每个占的值 * 当前值
        const percentage = styleRange / rangeValue * increasingValue
        // 小于0，代表 startValue > endValue
        // startValue 递减
        return (Number(startValue) + percentage).toFixed(2) + unit
    }
    // 处理 颜色
    colorStyle:handelStyle = (initRangeStyle, rangeValue, increasingValue)=>{
        const {baseStyle} = this
        const {startValue, endValue} = initRangeStyle
        const startRgba = colorString.get(startValue)!.value
        const endRgba = colorString.get(endValue)!.value
        return startRgba.reduce<string>((prev, item, index)=>{
            // ts 限制 以及 复用原因
            const current = baseStyle({
                startValue: item as any,
                endValue: endRgba[index] as any,
                unit: ''
            }, rangeValue, increasingValue)
            prev+=current
            if(index !== 3) prev+=',';
            if(index === 3) prev+=')';
            return prev
        }, 'rgba(')
    }
    shadowStyle:handelStyle = (initRangeStyle, rangeValue, increasingValue)=>{
        return ''
    }
}

export default (new generateStyleValue()).generateStyle