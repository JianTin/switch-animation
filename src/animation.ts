import setStyleInstance from "./publicClass/setStyle"
import isRunMiddleInstance from './isRunMiddleAnimation'
import {configNamespace, styleNamespace} from '../@types/animation'
import {storeInstance} from '../@types/store'

class Public <T extends configNamespace.elementKey>{
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
    // globalStore
    storeInstance: storeInstance
    constructor(elementConfig: configNamespace.animationConfig<T>, storeInstance: storeInstance){
        const {
            element,
            targetStyle,
            onStart,
            onAnimation,
            onEnd,
            duration,
            durationType,
            easing = 'linear'
        } = elementConfig
        // 保存动画 运行中的时间
        this.currentDate = 0
        // 动画开始时间
        this.startDate = 0
        // 动画结束的时间
        this.endDate = 0
        // 绘制的元素
        this.element = element
        // 动画绘制的时间长，单位毫秒
        this.duration = duration
        // 元素绘制目标的style, 复杂动画 不会出现。除非是新类 调用
        this.targetStyle = targetStyle ? targetStyle : null
        // 触发事件
        this.AnimationCallback = {onStart, onAnimation, onEnd}
        this.durationType = durationType
        this.isInit = true
        this.isPositive = true
        this.animationShow = false
        this.easing = easing
        this.storeInstance = storeInstance
        this.initEvent(elementConfig)
    }
    // 初始化，保存当前 type实例，每个styleName 每毫秒计算值
    initEvent = (elementConfig: configNamespace.animationConfig<T>) => {
        const {durationType, easing, storeInstance} = this
        const {targetStyle, middleStyle, duration} = elementConfig
        // 初始化保存 globalInstance
        if(durationType === 'all'){
            storeInstance.initGlobalStore(this as any)
        }
        if(!targetStyle) {
            // 如果没有 targetStyle 代表使用 middle模式
            return isRunMiddleInstance.middleAnimationInit(middleStyle as configNamespace.middleStyle, storeInstance)
        }
        // 往storeStyle存储
        Object.keys(targetStyle).forEach(styleName=>{
            const paramsStyle = targetStyle[styleName as styleNamespace.styleName]
            if(!paramsStyle)return;
            // 兼容上方 ts
            const {endValue, startValue, unit} = paramsStyle
            storeInstance.addStoreStyle(durationType, styleName as styleNamespace.styleName, {startValue, endValue}, unit, duration)
        })
        // 存储 instance，继承实例 具有全部方法
        storeInstance.addStoreInstance(durationType, this as any)
        // 添加贝塞尔曲线
        storeInstance.addStoreEasing(durationType, easing)
    }
    // 动画结束 触发
    endInit = () => {
        const {onEnd} = this.AnimationCallback
        if(onEnd) onEnd(this.element);
    }
    // 重置元素style -> 开始 / 结束
    reset = (direction: boolean)=> {
        const {targetStyle, durationType, duration, element, storeInstance} = this
        const {onAnimation} = this.AnimationCallback
        if(!targetStyle) return;
        const typeStore = storeInstance.store[durationType]
        const {easingFn, styleList} = typeStore
        if(!easingFn)return;
        Object.keys(styleList).forEach(styleName=>{
            const styleStore = styleList[styleName as styleNamespace.styleName]
            if(!styleStore) return;
            // 上面是防护
            setStyleInstance.set(element, styleStore, styleName as styleNamespace.styleName, duration, direction, easingFn)
            if(onAnimation)onAnimation(element);
        })
    }
}

// 整体时间计算，调用执行动画
export default class Animation<T extends configNamespace.elementKey> extends Public<T> {
    constructor(elementConfig: configNamespace.animationConfig<T>, storeInstance: storeInstance){
        super(elementConfig, storeInstance)
    }
    // start
    startAnimation = ()=> {
        const {storeInstance} = this
        this.isInit = false
        this.isPositive = true
        // 计算时间
        const currentDate = new Date().valueOf()
        this.endDate = currentDate + this.duration
        this.startDate = currentDate
        this.animationShow = true
        // targetStyle 没有。代表是 middleAnimation设置isStart(保证middle 能运行重置动画)
        if(!this.targetStyle){
            Object.values(storeInstance.store).forEach(({durationObj})=>durationObj!.isStart = true)
        }
        // 动画
        this.runSwitchAnimation(true)
    }
    // switch
    switchAnimation = ()=> {
        const onStart = this.AnimationCallback.onStart
        // 初始化
        if(this.isInit) {
            this.startAnimation()
        } else {
            // 开始切换
            this.animationShow = this.isPositive = !this.isPositive
            // 开始进行切换
            // 计算出，结束时间 = 当前时间 + 已运行时间
            this.endDate = new Date().valueOf() + (this.currentDate - this.startDate)
            // 计算出开始位置
            this.startDate = this.endDate - this.duration
        }
        this.runSwitchAnimation(this.isPositive)
        if(onStart) onStart(this.element);
    }
    runSwitchAnimation = (direction: boolean)=> {
        requestAnimationFrame(()=>{
            const {startDate, endDate, element, targetStyle, isPositive, durationType, storeInstance} = this
            const {onAnimation} = this.AnimationCallback
            const currentDate = new Date().valueOf()
            this.currentDate = currentDate
            // 方向不相等 不递归
            if(direction !== isPositive) return;
            if(currentDate >= endDate) {
                this.reset( direction ? true : false)
                // 结束，下次回撤会使用到 currentDate。防止出现时间误差
                // 进行准确结束赋值
                this.currentDate = endDate
                this.endInit()
                return;
            }
            // 当前时间 距离 开始时间，间隔时间
            let runDate = currentDate - startDate
            // 判断 整体动画 还是 间断动画
            if(targetStyle){
                const {styleList: typeStore, easingFn} = storeInstance.store[durationType]
                Object.keys(typeStore).forEach(styleName=>{
                    const styleStore = typeStore[styleName as styleNamespace.styleName]
                    if(!styleStore || !easingFn )return;
                    setStyleInstance.set(element, styleStore, styleName as styleNamespace.styleName, runDate, isPositive, easingFn)
                })
                if(onAnimation)onAnimation(element)
            } else {
                // 运行间断动画
                Object.keys(storeInstance.store).forEach(middleDuration=>isRunMiddleInstance.runMiddleAnimation(runDate, middleDuration, direction, storeInstance))
            }
            this.runSwitchAnimation(direction);
        })
    }
}