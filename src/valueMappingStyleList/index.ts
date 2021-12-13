import {styleNamespace} from '../../@types/animation'
import {transformArray} from '../constant'
import SetStyleValueInstance from '../publicClass/setStyle'
import generateStyle from  './generate'

// 类初始化 config
export type mappingStyleConfig = {
    element: HTMLElement,
    initValue: string,
    rangeConfig: {
        [range: string]: {
            [style in styleNamespace.styleName]?: initStyleRangeObj
        }
    }
}
export type initStyleRangeObj = {
    startValue: string,
    endValue: string,
    unit: string
}

// value -> 样式列表
type mappingStyleList = {
    [value:string]: styleList
}
type styleList = {
    [style in styleNamespace.styleName]?: styleObj
}
type styleObj = {
    value: string,
    unit: string
}

export default class ValueMappingStyle{
    element: HTMLElement
    // value 对应 cssList 列表
    /**
     * {
     *  '0': {
     *      left: {
     *          value: '10px',
     *          unit: 'px
     *      },
     *      scaleX: {
     *          value: '0',
     *          unit: ''
     *      }
     *  }
     *  '1'...
     * }
    */
    mappingStyleList: mappingStyleList
    // 之前的位置。作为下次动画的起点，用于 正向/反向 选择
    oldSelect: number | null
    // 动画 运行时间 和 结束时间，用于配合 rangeStyleList 选择运行的 styleList
    startDuration: number
    endDuration: number
    // 当前动画得 id，防止 两个动画一起运行
    currentAnimationId: number | null
    constructor(config: mappingStyleConfig){
        const {element, initValue, rangeConfig} = config
        this.element = element
        this.mappingStyleList = {}
        this.oldSelect = null
        this.startDuration = 0
        this.endDuration = 0
        this.currentAnimationId  = null
        this.init(rangeConfig, initValue)
    }
    // 初始化，生成 value -> cssList
    init(rangeConfig: mappingStyleConfig['rangeConfig'], initValue: string){
        const {valueAnimation} = this
        Object.keys(rangeConfig).forEach((range)=>{
            const {mappingStyleList} = this
            const [start, end] = range.split('-').map(Number)
            // 获取范围
            const valueRange = end - start
            const multipleStyleList = rangeConfig[range]
            // 每次范围 +0.1
            for(let v=start; v<=end; v+=0.1){
                const currentValueMappingCss = Object.keys(multipleStyleList).reduce<{[styleName in styleNamespace.styleName]?: styleObj}>((prev, styleName)=>{
                    const styleList = multipleStyleList[styleName as styleNamespace.styleName]
                    if(!styleList)return prev;
                    // const {startValue, endValue, unit} = styleList
                    // const styleRange = Number(endValue) - Number(startValue)
                    // // cssValue 在当前范围值内 占的值
                    // const current = (styleRange / valueRange * v) + Number(startValue) + unit
                    const styleValue = generateStyle(styleName as styleNamespace.styleName, styleList, valueRange, v)
                    console.log(styleValue)
                    prev[styleName  as styleNamespace.styleName] = {value: styleValue, unit: styleList.unit}
                    return prev
                }, {})
                const currentValue = String(v)
                // 没有添加新对象
                if(!mappingStyleList.hasOwnProperty(currentValue)){
                    mappingStyleList[currentValue] = currentValueMappingCss
                } else { // 有的话进行合并
                    mappingStyleList[currentValue] = Object.assign(mappingStyleList[currentValue], currentValueMappingCss)
                }
            }
        })
        valueAnimation(Number(initValue))
    }
    // 设置 styleList
    setStyleList = (styleList: styleList) => {
        const {element} = this
        Object.keys(styleList).forEach((styleName)=>{
            const styleObj = styleList[styleName as styleNamespace.styleName]
            if(!styleObj) return;
            const {value, unit} = styleObj
            // transform 设置要自己处理
            if(transformArray.includes(styleName)) {
                SetStyleValueInstance.setTransform(element, styleName, value, unit)
            } else {
                SetStyleValueInstance.setBaseStyle(element, styleName, value, unit)
            }
        })
    }
    // 运行范围值内得 动画
    runAnimation = (rangeStyleList: mappingStyleList, valueArray: Array<number>,animationDuration: number, id: number)=>{
        requestAnimationFrame(()=>{
            // 防止动画 重复
            if(this.currentAnimationId !== id) return;
            const {startDuration, setStyleList, runAnimation} = this
            const runDate =  new Date().valueOf() - startDuration
            // 时间结束，选择最后一个
            if(runDate >= animationDuration) {
                const endKey = valueArray[Number(valueArray.length) - 1]
                this.oldSelect = endKey
                const styleList = rangeStyleList[endKey]
                return setStyleList(styleList)
            }
            // 当前运行值 在 全部时间的占比 * 长度 = 选择的index 
            const selectIndex = (runDate / animationDuration) *  Number(valueArray.length)
            const selectKey = valueArray[Math.round(selectIndex)]
            this.oldSelect = selectKey
            const styleList = rangeStyleList[selectKey]
            setStyleList(styleList)
            runAnimation(rangeStyleList, valueArray, animationDuration, id)
        })
    }
    // 筛选一定范围内的 多个styleList，根据时间 选择一个 接 一个运行
    // 保证动画联动性
    getAnimationRangeStyleList = (valueMappingObj: any, oldSelect: number, newSelect: number, direaction: boolean) => {
        const newObj = Object.assign({}, valueMappingObj)
        const builtValueArray = Object.keys(newObj).map(Number)
        builtValueArray.forEach(builtValue=>{
            if(direaction){
                // 正向 内部value > oldSelect && 内部value < newSelect
                if(builtValue > oldSelect && builtValue < newSelect){} else {
                    delete newObj[String(builtValue)]
                }
            } else {
                // 反向 内部value > newSelect && 内部value < oldSelect
                if(builtValue > newSelect && builtValue < oldSelect){} else {
                    delete newObj[String(builtValue)]
                }
            }
        })
        return newObj
    }
    // 去往value -> cssList
    // 传递 duration 代表需不需要执行动画
    valueAnimation = (value: number, animationDuration?: number)=>{
        const {oldSelect, mappingStyleList, setStyleList, getAnimationRangeStyleList, runAnimation} = this
        this.oldSelect = value
        if(oldSelect !== null && oldSelect !== undefined && animationDuration){
            // 选择动画是 正向 还是 反向
            // 用于 正向运行 或 反向运行
            // 以及 接下来的筛选范围 styleList
            const direcation = oldSelect < value ? true : false
            const rangeStyleList = getAnimationRangeStyleList(mappingStyleList, oldSelect, value, direcation)
            // 获取范围值数组, objectKey是无序 先排序
            // 0、1、2
            const valueArray = Object.keys(rangeStyleList).map(Number).sort((a, b)=>(a as unknown as number)-(b as unknown as number))
            const currentDuration = new Date().valueOf()
            // 作为当前 animation id，不会重复防止动画重复一起运行
            this.currentAnimationId = currentDuration
            this.startDuration = currentDuration
            this.endDuration = currentDuration + animationDuration
            // 反向如果是反得，需要 将范围值数组 倒叙。保证方向
            runAnimation(rangeStyleList, direcation ? valueArray : valueArray.reverse(), animationDuration, currentDuration)
        } else {
            // 选择 合适的 styleList，中间有许多浮点值
            let selectVal = ''
            Object.keys(mappingStyleList).forEach(builtValue=>{
                if(value >= Number(builtValue))selectVal = builtValue ;
            })
            const styleList = mappingStyleList[selectVal]
            setStyleList(styleList)
        }
    }
}