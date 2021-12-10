import { storeInstance } from './../@types/store.d';
import {Animation} from './index'
import {configNamespace} from '../@types/index'

// 用于做 运行的中间 动画，处理
class IsRunMiddleAnimation {
    constructor(){}
    // 获取 '开始-结束' -> [开始，结束]
    getDurationType(durationType: string){
        return durationType.split('-').map(n=>Number(n))
    }
    // 用于生成，具有中间动画的 实例 和 运行时间对象
    middleAnimationInit<T  extends configNamespace.elementKey>(middleStyle: configNamespace.middleStyle, storeInstance: storeInstance){
        Object.keys(middleStyle).forEach(durationType=>{
            const [startDuration, endDuration] = this.getDurationType(durationType)
            const styleObj = middleStyle[durationType]
            const {onStart, onEnd, onAnimation, easing} = styleObj
            delete styleObj['onStart']
            delete styleObj['onEnd']
            delete styleObj['onAnimation']
            delete styleObj['easing']
            // // 获取运行多长时间
            let continuedDuration = endDuration -  startDuration
            new Animation<T>({
                duration: continuedDuration,
                element: storeInstance.globalStore?.element,
                targetStyle: styleObj,
                durationType,
                easing: easing ? easing : storeInstance.globalStore?.easing,
                onStart, onEnd, onAnimation
            }, storeInstance)
            // 存储该type级别，正方向应该 运行的时间
            storeInstance.addStoreDirection(durationType, startDuration, endDuration)
        })
    }
    // 时间判断运行
    runMiddleAnimation = (currentDate: number, durationType: string, currentDirection: boolean, storeInstance: storeInstance)=> {
        const  {instance, durationObj} = storeInstance.store[durationType]
        if(!instance || !durationObj) return;
        const {positive, negative, direction, isStart} = durationObj
        if(currentDirection !== direction || isStart) {
            // 判断符合运行时间
            const {startDuration, endDuration} = currentDirection ? positive : negative
            // switch 调用的时间段，只需要调用一次。配合 方向解决
            if(currentDate > startDuration && currentDate < endDuration) {
                // 更新方向
                durationObj.direction = currentDirection
                // 判断是 重新start么，如果是的话运行
                if(isStart) {
                    durationObj.isStart = false
                    // 调用
                    instance.startAnimation()
                } else {
                    // 调用
                    instance.switchAnimation()
                }
            }
        }
    }
}

export default new IsRunMiddleAnimation()