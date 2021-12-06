import React, { useEffect, useRef } from "react";
import SwitchAnimation from  '../src/index'
import {getInstanceEventValue} from '../src/base'

export default function(){
    const elementRef = useRef<HTMLDivElement | null>(null)
    const event = useRef<getInstanceEventValue| null>(null)
    useEffect(()=>{
        event.current = new SwitchAnimation({
            element: elementRef.current as HTMLDivElement,
            duration: 1000,
            targetStyle: {
                translateX: {
                    startValue: '0',
                    endValue: '100',
                    unit: 'px'
                }
            }
        }).getInstanceEvent()
    }, [])
    return <>
        <button onClick={()=> event.current?.switchAnimation()}>switch</button>
        <div ref={elementRef}>1231232</div>
    </> 
}