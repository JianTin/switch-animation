import Store from "./store"
import Animation from './animation'
import {configNamespace, animationInstance} from '../@types/animation'
import {wholeConfig, segmentedConfig} from '../@types/index'
import {storeInstance} from '../@types/store'

class SwitchAnimation<T extends configNamespace.elementKey>{
    // 每次唯一的 storeInstance
    storeInstance: storeInstance
    animationInstance: animationInstance
    constructor(elementConfig: configNamespace.animationConfig<T>){
        this.storeInstance = new Store()
        this.animationInstance = new Animation(elementConfig, this.storeInstance)
    }
    getInstanceEvent = ()=>{
        const {animationShow, startAnimation, switchAnimation} = this.animationInstance
        return {
            isAnimationShow: ()=> animationShow,
            startAnimation,
            switchAnimation
        }
    }
}

export function wholeAnimation(config: wholeConfig){
    const switchAnimationConfig = Object.assign(config, {
        durationType: 'all',
        targetStyle: config['animation']
    })
    // ts - any 原因
    // delete 不需要的属性
    delete (switchAnimationConfig as any)['animation']
    return new SwitchAnimation(switchAnimationConfig).getInstanceEvent()
}
export function segmentedAnimation(config: segmentedConfig){
    const switchAnimationConfig = Object.assign(config, {
        durationType: 'all',
        middleStyle: config.animation
    })
    // ts - any 原因
    // delete 不需要的属性
    delete (switchAnimationConfig as any)['animation']
    return new SwitchAnimation(switchAnimationConfig).getInstanceEvent()
}
