import {configNamespace} from './animation'

export type wholeConfig = {
    animation: configNamespace.targetStyle
} & configNamespace.baseConfig
export type segmentedConfig = {
    animation: configNamespace.middleStyle
} & configNamespace.baseConfig

export type getInstanceEventValue = {
    isAnimationShow:()=>boolean
    startAnimation: ()=>void
    switchAnimation:()=>void
}

declare module "switch-animation" {
    export function wholeAnimation(wholeConfig: wholeConfig):getInstanceEventValue
    export function segmentedAnimation(segmentedConfig: segmentedConfig):getInstanceEventValue
}