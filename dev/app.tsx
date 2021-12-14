import React, { useEffect, useRef } from "react";
import {wholeAnimation, segmentedAnimation} from  '../src/index'
import {getInstanceEventValue} from '../@types'

export default function(){
    const elementRef = useRef<HTMLDivElement | null>(null)
    useEffect(()=>{
        wholeAnimation({
            element: elementRef.current as HTMLDivElement,
            duration: 200,
            animation: {
                "border-radius": {
                    startValue: '0',
                    endValue: '10',
                    unit: 'px'
                }
            }
        }).switchAnimation()
    }, [])
    return <>
    <div ref={elementRef} style={{
        width: '100px',
        height: '100px',
        border: '1px solid red'
    }}></div>
    </> 
}