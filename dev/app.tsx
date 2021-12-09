import React, { useEffect, useRef } from "react";
import SwitchAnimation from  '../src/index'
import {getInstanceEventValue} from '../@types'

export default function(){
    const elementRef = useRef<HTMLDivElement | null>(null)
    const event = useRef<getInstanceEventValue| null>(null)
    useEffect(()=>{
        event.current = new SwitchAnimation({
            element: elementRef.current as HTMLDivElement,
            duration: 1000,
            // easing: "easeInOutBack",
            middleStyle: {
                // '0-500': {
                //     'background-color': {
                //         startValue: 'red',
                //         endValue: 'rgba(35, 81, 91, 0.8)',
                //         unit: ''
                //     }
                // },
                '0-1000': {
                    "box-shadow": {
                        startValue: "0px 0px 0px 0px #dbdbdb",
                        endValue: "0px 0px 12px 10px red",
                        unit: 'px'
                    }
                },
                // translateX: {
                //     startValue: '0',
                //     endValue: '50',
                //     unit: 'px'
                // }
                // '0-1000': {
                //     translateX: {
                //         startValue: '0',
                //         endValue: '500',
                //         unit: 'px'
                //     }
                // }
            }
            // targetStyle: {
            //     translateX: {
            //         startValue: '0',
            //         endValue: '100',
            //         unit: 'px'
            //     }
            // }
        }).getInstanceEvent()
    }, [])
    return <>
        <button onClick={()=> event.current?.switchAnimation()}>switch</button>
        <div ref={elementRef} style={{
            width:'100px',
            height:'100px',
            background:'red',
            border: 'solid 1px green'
        }}>1231232</div>
    </> 
}