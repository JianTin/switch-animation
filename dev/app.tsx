import React, { useEffect, useRef } from "react";
import SwitchAnimation from  '../src/index'
import colorString from 'color-string'
import {getInstanceEventValue} from '../@types'

export default function(){
    const elementRef = useRef<HTMLDivElement | null>(null)
    const event = useRef<getInstanceEventValue| null>(null)
    // useEffect(()=>{
    //     console.log(colorString.get('rgba(1,2,3,0)'))
    //     console.log(colorString.get('red'))
    //     console.log(colorString.get('#ff0000'))
    // }, [])
    useEffect(()=>{
        event.current = new SwitchAnimation({
            element: elementRef.current as HTMLDivElement,
            duration: 1000,
            middleStyle: {
                '0-500': {
                    'background-color': {
                        startValue: 'red',
                        endValue: 'rgba(35, 81, 91, 0.8)',
                        unit: ''
                    }
                },
                '500-1000': {
                    'background-color': {
                      startValue: "rgba(35, 81, 91, 0.8)",
                      endValue: "blue",
                      unit: ""
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
            background:'red'
        }}>1231232</div>
    </> 
}