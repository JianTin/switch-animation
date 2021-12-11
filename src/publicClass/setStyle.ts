// 设置 value值
import calculateInstance from './calculate'
import {EasingFunction} from 'bezier-easing'
import {configNamespace, styleNamespace} from '../../@types/animation'
import {storeNamespace} from '../../@types/store'
import {transformArray} from '../constant'

class SetStyleValue {
    transformKey: Array<string>
    constructor(){
        this.transformKey = transformArray
    }
    set<T extends configNamespace.elementKey>(
        element: HTMLElementTagNameMap[T], styleStore: storeNamespace.styleStore, styleName: styleNamespace.styleName, runDate: number, direction:boolean, easingFn: EasingFunction
    ){
        const {unit} = styleStore
        const val = calculateInstance.calculateVal(styleStore, styleName, runDate, direction, easingFn)
        // 处理transform
        if(this.transformKey.includes(styleName)){
            this.setTransform(element, styleName, val as string, unit)
        } else { // 处理正常
            this.setBaseStyle(element, styleName, val as string, unit)
        }
    }
    setTransform = (element: HTMLElement, styleName: string, styleVal: string, unit: string)=> {
        let transformVal = element.style['transform']
        const bool = transformVal.includes(styleName)
        // transform 内部存在该值，删除重新处理
        if(bool) {
            // /translateX\([0-9]+%{0,}[p|x]{0,}\)/
            transformVal = transformVal.replace(new RegExp(`${styleName}\\(-*[0-9]*\\.*[0-9]*${unit}\\)`, 'g'), '')
        }
        transformVal += ` ${styleName}(${styleVal})`
        element.style['transform'] = transformVal
    }
    setBaseStyle = (element: HTMLElement, styleName: string, styleVal: string, unit: string)=> {
        element.style[styleName as any] = styleVal
    }
}

export default new SetStyleValue()