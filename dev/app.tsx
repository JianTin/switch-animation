import React, { useEffect, useRef, useState } from "react";
import {wholeAnimation, segmentedAnimation} from  '../src/index'
import {getInstanceEventValue} from '../@types'

export default function(){
    const elementRef = useRef<HTMLDivElement | null>(null)
    const [inpVal, setInpVal] = useState<string>('')
    const event = useRef<Function>()
    const selectRef = useRef<string>()
    // duration
    const startDuration = useRef<number>(0)
    const endDuration = useRef<number>(0)
    // 动画占比
    function runAnimation(rangeCss: any, valueArray: any,animationDuration: number, element: any){
        requestAnimationFrame(()=>{
            const runDate = new Date().valueOf() - startDuration.current
            if(runDate >= animationDuration) return;
            // 当前运行值 在 全部时间的占比 * 长度 = 选择的index 
            const selectIndex = (runDate / animationDuration) *  Number(valueArray.length)
            const styleList = rangeCss[valueArray[Math.round(selectIndex)]]
            Object.keys(styleList).forEach((styleName)=>{
                element.style[styleName] = styleList[styleName]
            })
            runAnimation(rangeCss, valueArray, animationDuration, element)
        })
    }
    // animation 运行的选择层
    function getAnimationRangeCss(valueMappingObj: any, oldSelect: string, newSelect: string, direaction: boolean){
        const newObj = Object.assign({}, valueMappingObj)
        const builtValueArray = Object.keys(newObj)
        builtValueArray.forEach(builtValue=>{
            const numBuiltValue = Number(builtValue)
            const numOldSelect = Number(oldSelect)
            const numNewSelect = Number(newSelect)
            if(direaction){
                // 正向 内部value > oldSelect && 内部value < newSelect
                if(numBuiltValue > numOldSelect && numBuiltValue < numNewSelect){} else {
                    delete newObj[builtValue]
                }
            } else {
                // 反向 内部value > newSelect && 内部value < oldSelect
                if(numBuiltValue > numNewSelect && numBuiltValue < numOldSelect){} else {
                    delete newObj[builtValue]
                }
            }
        })
        return newObj
    }
    function goValue(element: any, valueMappingObj: any){
        return(value: string, animationDuration: number)=>{
            let selectVal = ''
            Object.keys(valueMappingObj).forEach(builtValue=>{
                if(Number(value) >= Number(builtValue))selectVal = builtValue ;
            })
            const styleList = valueMappingObj[selectVal]
            if(!styleList) return;
            // 之前选择过了, 执行动画
            if(selectRef.current && animationDuration){
                const direaction = selectRef.current < value ? true : false
                const rangeCss = getAnimationRangeCss(valueMappingObj, selectRef.current, value, direaction)
                // 对象 -> 数组，key是无序 先排序
                const valueArray = Object.keys(rangeCss).sort((a, b)=>(a as unknown as number)-(b as unknown as number))
                startDuration.current = new Date().valueOf()
                endDuration.current = startDuration.current + animationDuration
                runAnimation(rangeCss, direaction ? valueArray : valueArray.reverse(), animationDuration, element)
            } else {
                Object.keys(styleList).forEach((styleName)=>{
                    element.style[styleName] = styleList[styleName]
                })
            }
            selectRef.current = value
        }
    }
    function rangeMappingCss(element: any, config: {
        [range: string]: {
            [styleName: string]: {
                startValue: string,
                endValue: string,
                unit: string
            }
        }
    }){
        const valueMappingObj: {
            [value:string]: {
                [styleName: string]: string
            }
        } = {}
        Object.keys(config).forEach((range, index)=>{
            const [start, end] = range.split('-').map(Number)
            const valueRange = end - start
            const styleList = config[range]
            // 每次范围 +0.1
            for(let v=start; v<=end; v+=0.1){
                const currentValueMappingCss = Object.keys(styleList).reduce<{[styleName: string]: string}>((prev, styleName)=>{
                    const {startValue, endValue, unit} = styleList[styleName]
                    const styleRange = Number(endValue) - Number(startValue)
                    // cssValue 在当前范围值内 占的值
                    const current = (styleRange / valueRange * v) + Number(startValue) + unit
                    prev[styleName] = current
                    return prev
                }, {})
                const currentValue = String(v)
                // 没有添加新对象
                if(!valueMappingObj.hasOwnProperty(currentValue)){
                    valueMappingObj[currentValue] = currentValueMappingCss
                } else { // 有的话进行合并
                    valueMappingObj[currentValue] = Object.assign(valueMappingObj[currentValue], currentValueMappingCss)
                }
            }
        })
        const animation = goValue(element, valueMappingObj)
        animation(Object.keys(valueMappingObj)[0], 100)
        return animation
    }
    useEffect(()=>{
        event.current = rangeMappingCss(elementRef.current, {
            '0-100':{
                'left': {
                    startValue: '0',
                    endValue: '200',
                    unit: 'px'
                }
            }
        })
    }, [])
    function onClick(){
        (event.current as Function)(inpVal, 200)
    }
    return <>
        <input onChange={(event)=>{
            setInpVal(event.target.value)
        }} />
        <button onClick={onClick}>click</button>
        <div ref={elementRef} style={{
            width:'100px',
            height:'100px',
            background:'red',
            border: 'solid 1px green',
            position: 'relative'
        }}>1231232</div>
    </> 
}