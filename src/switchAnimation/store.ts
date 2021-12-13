// 存储基础style、duration 每次new都会调用
/**
 * styleStoreValue: {
 *      key: startValue、endValue、millisecond、distance、minValDistanceZero
 *      // baseStyle | colorStyle | box-shadow
 *      value: number | [number, number, number, number] | Array<{color: [number...], shadowNumber: [number...]}>
 * }
 * {
 *  styleList: {styleName: styleStoreValue },
 *  durationObj:{
 *      positive, negative: {startDuration, endDuration},
 *      direction: bool
 *  },
 *  instance: ...,
 * }
 * all:
 * 0-1000': 
*/
import easing from '../publicClass/easing'
import colorString from 'color-string'
import {animationInstance, styleNamespace, configNamespace} from '../../@types/animation'
import {storeNamespace} from '../../@types/store'
import {colorArry} from '../constant'

type colorNameArray = Array<styleNamespace.color>
// 传递得value对象
type paramsValueObj = {
    startValue: string, endValue: string
}
type colorValueObj = {
    startValue: number[],
    endValue: number[]
}
// 处理的数组
type handelArrayParamsObj = {
    startValue: number[],
    endValue: number[]
}

class Store {
    globalStore: animationInstance | null
    store: {
        [type: string]: storeNamespace.typeStore
    }
    colorNameArray: colorNameArray
    constructor(){
        // 全局的
        this.globalStore = null
        this.store = {}
        this.colorNameArray = colorArry as colorNameArray
    }
    createType = (type: string)=>{
        if(!this.store[type]) {
            this.store[type] = {
                styleList: {},
                instance: null,
                durationObj: null,
                easingFn: null,
            }
       }
    }
    // 全局的store，第一次初始化调用
    initGlobalStore = (instance: animationInstance)=>{
        this.globalStore = instance
    }
    // 添加storeStyle
    addStoreStyle = (type: string, name: styleNamespace.styleName, valueObj: paramsValueObj, unit: string, duration: number) => {
       this.createType(type)
       if(name === 'box-shadow'){
        this.generateBoxShadow(type, name, valueObj, unit, duration)
       } else if(this.colorNameArray.includes(name as styleNamespace.color)) {// 判断是color么，是的话处理为需要的格式
           this.generateColorStyle(type, name as styleNamespace.color, valueObj, unit, duration)
       } else {
           this.generateBaseStyle(type, name, valueObj, unit, duration)
       }
    }
    // 添加当前实例
    addStoreInstance = (type: string, instance: animationInstance)=> {
       this.createType(type)
       this.store[type]['instance'] = instance
    }
    // 添加实例对应的 正反方向 --- 开始、结束值 用于做是否 运行动画判断
    addStoreDirection = (type: string, startDuration: number, endDuration: number)=>{
        this.createType(type)
        const allInstance = this.globalStore
        if(!allInstance) return;
        const allDuration = (allInstance as any).duration
        // 正向 800 - 1000
        // 反向，设置和之前相同的动画逻辑时间。0-200
        this.store[type]['durationObj'] = {
            positive: {startDuration, endDuration},
            negative: {
                startDuration: allDuration - endDuration,
                endDuration: allDuration - startDuration
            },
            direction: null,
            isStart: false
        }
    }
    // 添加贝塞尔函数
    addStoreEasing = (type: string, easingVal: configNamespace.easingVal) => {
        this.store[type]['easingFn'] = easing.createEasing(easingVal)
    }
    // 生成基础style结构
    generateBaseStyle(type: string, name: styleNamespace.styleName, valueObj: paramsValueObj, unit:string, duration: number){
        const [startValue, endValue] = Object.values(valueObj).map(v=>Number(v))
        const millisecond = (endValue - startValue) / duration
        const distance = endValue > startValue ? endValue - startValue : startValue - endValue
        const minValDistanceZero = endValue > startValue ? startValue : endValue
        this.store[type]['styleList'][name] = {
            startValue, endValue, millisecond, unit, distance, minValDistanceZero
        }
    }
    // 处理数组 -> styleStore,复用
    handelArrayToStyleStore(valueObj: handelArrayParamsObj, duration: number){
        const {startValue, endValue} = valueObj
        const {millisecond, distance, minValDistanceZero} = startValue.reduce<{distance: number[],minValDistanceZero: number[],millisecond: number[]}>((prev, startColor, index)=>{
            const endColor = endValue[index]
            prev['distance'].push(
                endColor > startColor ? endColor - startColor : startColor - endColor
            )
            prev['minValDistanceZero'].push(
                endColor > startColor ? startColor : endColor
            )
            prev['millisecond'].push(
                (endColor - startColor)/duration
            )
            return prev
        }, {
            millisecond: [],
            distance: [],
            minValDistanceZero: []
        })
        return {startValue, endValue, distance, millisecond, minValDistanceZero}
    }
    // 处理颜色 -> rgba()
    handelColorParams(valueObj: paramsValueObj){
        return Object.keys(valueObj).reduce<colorValueObj>((prev, key)=>{
            prev[key as keyof colorValueObj] = colorString.get(valueObj[key as keyof typeof valueObj])!.value
            return prev
        }, {startValue: [], endValue: []})
    }
    // 生成color每毫秒值
    generateColorStyle(type: string, name: styleNamespace.color, valueObj: paramsValueObj, unit: string, duration: number){
        const {startValue, endValue, millisecond, distance, minValDistanceZero} = this.handelArrayToStyleStore(this.handelColorParams(valueObj), duration)
        if(startValue.length === 4 && endValue.length === 4 && millisecond.length === 4) {
            if(!this.store[type]) return;
            this.store[type]['styleList'][name] = {
                startValue: startValue as storeNamespace.colorValue,
                endValue: endValue as storeNamespace.colorValue,
                millisecond: millisecond as storeNamespace.colorValue,
                distance: distance as storeNamespace.colorValue,
                minValDistanceZero: minValDistanceZero as storeNamespace.colorValue,
                unit
            }
        }
    }
    // 生成 box-shadow store
    generateBoxShadow(type: string, name: styleNamespace.shadow, valueObj: paramsValueObj, unit: string, duration: number){
        const {startValue, endValue} = valueObj
        const cleanUnitRegExp = new RegExp(unit, 'g')
        //inset 2px 2px 2px 1px red, inset 2px 2px 2px 1px red
        const multipleStartShadow = startValue.replace(cleanUnitRegExp, '').split((/,(?![^\(]*\))/))
        const multipleEndShadow = endValue.replace(cleanUnitRegExp, '').split((/,(?![^\(]*\))/))
        // ['inset 2px 2px 2px 1px red', 'inset 2px 2px 2px 1px red'] -> 
        const {color, inset, shadowNumber} = multipleStartShadow.reduce<{
            color: Array<handelArrayParamsObj>,
            inset: number[],
            shadowNumber: Array<handelArrayParamsObj>
        }>((prev, startShadow, index)=>{
            /**
             * startValue: 'inset 2px 2px 2px 1px red' -> 
             * color: {startValue: red->[r,g,b,a], endVlaue:...}
             * inset: [0],
             * shadowNumber: {startValue: [2,2,2,1]}
            */
            const startShadowArray = startShadow.split(/ (?![^\(]*\))/).filter(Boolean)
            const endShadowArray = multipleEndShadow[index].split(/ (?![^\(]*\))/).filter(Boolean)
            if(startShadowArray)
            // 查找是否有 inset，如果有的话 delete掉。并未 inset 添加标识
            if(startShadowArray.length === 6) {
                prev['inset'].push(index)
                startShadowArray.shift()
                endShadowArray.shift()
            }
            const startColor = startShadowArray.pop()
            const endColor = endShadowArray.pop()
            prev['color'].push(this.handelColorParams({startValue: startColor as string, endValue: endColor as string}))
            prev['shadowNumber'].push({
                startValue: startShadowArray.map(Number), endValue: endShadowArray.map(Number)
            })
            return prev
        },{
            color: [],inset: [],shadowNumber: []
        })
        const storeObj = color.reduce<
            {[key in storeNamespace.styleStoreKey]: storeNamespace.boxShadowValue}
        >((prev, colorValueObj, index)=>{
            const shadowValueObj = shadowNumber[index]
            // color
            const {
                startValue: colorStartValue, endValue: colorEndValue, millisecond: colorMillisecond, distance: colorDistance, minValDistanceZero: colorMinValDistanceZero
            } = this.handelArrayToStyleStore(colorValueObj, duration) as {[key in storeNamespace.styleStoreKey]: [number, number, number, number]}
            // shadow
            const {
                startValue: shadowStartValue, endValue: shadowEndValue, millisecond: shadowMillisecond, distance: shadowDistance, minValDistanceZero: shadowMinValDistanceZero
            } = this.handelArrayToStyleStore(shadowValueObj, duration) as {[key in storeNamespace.styleStoreKey]: [number, number, number, number]}
            prev['startValue'].push({color: colorStartValue, shadowNumber: shadowStartValue})
            prev['endValue'].push({color: colorEndValue, shadowNumber: shadowEndValue})
            prev['millisecond'].push({color: colorMillisecond, shadowNumber: shadowMillisecond})
            prev['distance'].push({color: colorDistance, shadowNumber: shadowDistance})
            prev['minValDistanceZero'].push({color: colorMinValDistanceZero, shadowNumber: shadowMinValDistanceZero})
            return prev
        }, {
            startValue: [], endValue: [], millisecond: [], distance: [], minValDistanceZero: []
        })
        this.store[type]['styleList'][name] = Object.assign(storeObj, {unit, inset})
    }
}

export default Store