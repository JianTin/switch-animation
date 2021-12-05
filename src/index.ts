import storeInstance from "./store"
import setStyleInstance from "./setStyle"
import {elementKey, targetStyle, AnimationCallback, animationConfig, styleName} from './base'
import isRunMiddleInstance from './isRunMiddleAnimation'

class Public <T extends elementKey>{
    duration: number
    currentDate: number
    startDate: number
    endDate: number
    element: HTMLElementTagNameMap[T]
    targetStyle: targetStyle | null
    AnimationCallback: AnimationCallback
    // 正向 还是 反向
    isPositive: boolean
    // 是否第一次
    isInit: boolean
    // true 显示/显示中，false 隐藏和隐藏中
    animationShow: boolean
    // 实例分级
    durationType: string
    constructor(elementConfig: animationConfig<T>){
        const {
            element,
            targetStyle,
            onStart,
            onAnimation,
            onEnd,
            duration,
            durationType = 'all'
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
        this.initEvent(elementConfig)
    }
    // 初始化，保存当前 type实例，每个styleName 每毫秒计算值
    initEvent = (elementConfig: animationConfig<T>) => {
        const {targetStyle, duration, durationType} = this
        // 初始化保存 globalInstance
        if(durationType === 'all'){
            storeInstance.initGlobalStore(this as any)
        }
        if(!targetStyle) {
            // 如果没有 targetStyle 代表使用 middle模式
            return  isRunMiddleInstance.middleAnimationInit(elementConfig)
        }
        // 往storeStyle存储
        Object.keys(targetStyle).forEach(styleName=>{
            const paramsStyle = targetStyle[styleName as styleName]
            if(!paramsStyle)return;
            // 兼容上方 ts
            const {endValue, startValue, unit} = paramsStyle
            storeInstance.addStoreStyle(durationType, styleName as styleName, {startValue, endValue}, unit, duration)
        })
        // 存储 instance，继承实例 具有全部方法
        storeInstance.addStoreInstance(durationType, this as any)
        // 添加贝塞尔曲线
        storeInstance.addStoreEasing(durationType, elementConfig.easing ? elementConfig.easing : 'linear')
    }
    // 动画结束 触发
    endInit = () => {
        const {onEnd} = this.AnimationCallback
        if(onEnd) onEnd();
    }
    // 重置元素style -> 开始 / 结束
    reset = (direction: boolean)=> {
        const {targetStyle, durationType, duration, element} = this
        const {onAnimation} = this.AnimationCallback
        if(!targetStyle) return;
        const typeStore = storeInstance.store[durationType]
        const {easingFn, styleList} = typeStore
        if(!easingFn)return;
        Object.keys(styleList).forEach(styleName=>{
            const styleStore = styleList[styleName as styleName]
            if(!styleStore) return;
            // 上面是防护
            setStyleInstance.set(element, styleStore, styleName as styleName, duration, direction, easingFn)
            if(onAnimation)onAnimation();
        })
    }
}

// 整体时间计算，调用执行动画
class Switch<T extends elementKey> extends Public<T> {
    constructor(elementConfig: animationConfig<T>){
        super(elementConfig)
    }
    // start
    start = ()=> {
        this.isInit = false
        this.isPositive = true
        const onStart = this.AnimationCallback.onStart
        // 计算时间
        const currentDate = new Date().valueOf()
        this.endDate = currentDate + this.duration
        this.startDate = currentDate
        this.animationShow = true
        // targetStyle 没有。代表是 middleAnimation设置isStart
        if(!this.targetStyle){
            Object.values(storeInstance.store).forEach(({durationObj})=>durationObj!.isStart = true)
        }
        // 动画
        this.runSwitchAnimation(true)
        // 触发外部事件
        if(onStart) onStart();
    }
    // switch
    switch = ()=> {
        const onStart = this.AnimationCallback.onStart
        // 初始化
        if(this.isInit) {
            this.start()
        } else {
            // 开始切换
            this.animationShow = this.isPositive = !this.isPositive
            // 开始进行切换
            // 计算出，结束时间 = 当前时间 + （剩余时间 | 0）
            this.endDate = new Date().valueOf() + (this.currentDate - this.startDate)
            // 计算出开始位置
            this.startDate = this.endDate - this.duration
        }
        this.runSwitchAnimation(this.isPositive)
        if(onStart) onStart();
    }
    runSwitchAnimation = (direction: boolean)=> {
        requestAnimationFrame(()=>{
            const {startDate, endDate, element, targetStyle, isPositive, durationType} = this
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
                    const styleStore = typeStore[styleName as styleName]
                    if(!styleStore || !easingFn )return;
                    setStyleInstance.set(element, styleStore, styleName  as styleName, runDate, isPositive, easingFn)
                })
                if(onAnimation)onAnimation()
            } else {
                // 运行间断动画
                Object.keys(storeInstance.store).forEach(middleDuration=>isRunMiddleInstance.runMiddleAnimation(runDate, middleDuration, direction))
            }
            this.runSwitchAnimation(direction);
        })
    }
}

export default class SwitchAnimation<T extends elementKey> extends Switch<T> {
    constructor(elementConfig: animationConfig<T>){
        super(elementConfig)
    }
    getInstanceEvent = ()=>{
        return {
            isAnimationShow: ()=> this.animationShow,
            startAnimation: this.start,
            switchAnimation: this.switch
        }
    }
}