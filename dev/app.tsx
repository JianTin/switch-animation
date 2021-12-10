import React, { useEffect, useRef } from "react";
import SwitchAnimation from  '../src/index'
import {getInstanceEventValue} from '../@types'

export default function(){
    const elementRef = useRef<HTMLDivElement | null>(null)
    const event = useRef<getInstanceEventValue| null>(null)
    useEffect(()=>{
        event.current = new SwitchAnimation({
            element: elementRef.current as HTMLDivElement,
            duration: 800,
            // easing: "easeInOutBack",
            targetStyle: {
                "translateX": {
                    startValue: "0",
                    endValue: "300",
                    unit: 'px'
                }
            }
        }).getInstanceEvent()
        // update({
        //     type: 'all',
        // })
        // read({
        //     type: ''
        // })
    }, [])
    function update(){
        // event.current!.updateTarget({
        //     translateX: {
        //         startValue: '-100',
        //         endValue: "300",
        //         unit: 'px'
        //     }
        // })
    }
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