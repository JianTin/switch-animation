import Store from "./store"
import Animation from './animation'
import {configNamespace, animationInstance} from '../../@types/animation'
import {storeInstance} from '../../@types/store'

export default class SwitchAnimation<T extends configNamespace.elementKey>{
    // 每次唯一的 storeInstance
    storeInstance: storeInstance
    animationInstance: animationInstance
    constructor(elementConfig: configNamespace.animationConfig<T>){
        this.storeInstance = new Store()
        this.animationInstance = new Animation(elementConfig, this.storeInstance)
    }
    getInstanceEvent = ()=>{
        const {startAnimation, switchAnimation} = this.animationInstance
        const that = this
        return {
            // 保证更新 和 this指向
            isAnimationShow: ()=> that.animationInstance.animationShow,
            startAnimation,
            switchAnimation
        }
    }
}