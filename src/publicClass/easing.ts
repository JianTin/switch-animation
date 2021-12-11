import BezierEasing from 'bezier-easing'
import {bulitInEasing} from '../../@types/easing'
import {constantEasing} from '../constant'

type bulitInEasingTs = {
    [key in bulitInEasing]: [number, number, number, number]
}
class Easing {
    bulitInEasing: bulitInEasingTs
    constructor(){
        this.bulitInEasing = constantEasing as bulitInEasingTs
    }
    // 创建贝塞尔曲线函数
    createEasing = (easing: string | [number, number, number, number])=>{
        // ts 无法运行
        // return BezierEasing( !Array.isArray(easing) ? ...this.bulitInEasing[easing] : easing )
        if(Array.isArray(easing)){
            return BezierEasing(...easing)
        } else {
            // 防止传入无效 stringKey
            let easingVal = this.bulitInEasing[easing as bulitInEasing]
            easingVal = easingVal ? easingVal : this.bulitInEasing['linear']
            return BezierEasing(...easingVal)
        }
    }
}

export default new Easing()