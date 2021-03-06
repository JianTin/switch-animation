import {storeNamespace} from './store'

export namespace calculateNamespace {
    export type baseStyleStore = {
        [key in storeNamespace.styleStoreKey]: number
    } & storeNamespace.interfaceUnit
    // color style
    export type colorStore = {
        [key in storeNamespace.styleStoreKey]: storeNamespace.colorValue
    } & storeNamespace.interfaceUnit
    export type shadowStore = {
        [key in storeNamespace.styleStoreKey]: storeNamespace.boxShadowValue
    } & storeNamespace.interfaceUnit & storeNamespace.interfaceInset
}