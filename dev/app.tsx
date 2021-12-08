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
                '200-800': {
                    // "background-color": {
                    //     startValue: "red",
                    //     endValue: "rgba(255,191,111,1)",
                    //     unit: ""
                    // },
                    "box-shadow": {
                        startValue: "inset 2px 2px 2px 1px rgba(0,0,0,0.2)",
                        endValue: "inset 2px 2px 2px 1px red",
                        unit: 'px'
                    }
                },
                '0-1000': {
                    translateX: {
                        startValue: '0',
                        endValue: '50',
                        unit: 'px'
                    }
                }
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