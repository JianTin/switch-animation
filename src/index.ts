import {wholeConfig, segmentedConfig} from '../@types/index'
import SwitchAnimation from './switchAnimation'
import MappingStyle,{mappingStyleConfig} from './valueMappingStyleList'

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

export function valueMappingAnimation(config: mappingStyleConfig){
    return new MappingStyle(config).valueAnimation
}