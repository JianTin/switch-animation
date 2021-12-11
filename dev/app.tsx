import React, { useEffect, useRef } from "react";
import {wholeAnimation, segmentedAnimation} from  '../src/index'
import {getInstanceEventValue} from '../@types'

export default function(){
    const elementRef = useRef<HTMLDivElement | null>(null)
    const event = useRef<getInstanceEventValue| null>(null)
    const event2 = useRef<getInstanceEventValue | null>(null)
    useEffect(()=>{
        event.current = wholeAnimation({
            element: elementRef.current as HTMLDivElement,
            duration: 800,
            animation: {
                "translateX": {
                    startValue: "0",
                    endValue: "300",
                    unit: 'px'
                }
            }
        })
        event2.current = segmentedAnimation({
            element: elementRef.current as HTMLDivElement,
            duration: 800,
            animation: {
                "0-800": {
                    "translateX": {
                        startValue: "300",
                        endValue: "600",
                        unit: 'px'
                    }
                }
            }
        })
    }, [])
    return <>
        <button onClick={()=> event.current?.switchAnimation()}>switch</button>
        <button onClick={()=> event2.current?.switchAnimation()}>switch</button>
        <button onClick={()=>console.log( event.current?.isAnimationShow())}></button>
        <div ref={elementRef} style={{
            width:'100px',
            height:'100px',
            background:'red',
            border: 'solid 1px green'
        }}>1231232</div>
    </> 
}