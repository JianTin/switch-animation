import React, { useEffect, useRef, useState } from "react";
import {wholeAnimation, segmentedAnimation, valueMappingAnimation} from  '../src/index'
import {getInstanceEventValue} from '../@types'

export default function(){
    const elementRef = useRef<HTMLDivElement | null>(null)
    const [inpVal, setInpVal] = useState<string>('')
    const event = useRef<Function>()
    useEffect(()=>{
        event.current = valueMappingAnimation({
            element: elementRef.current as HTMLElement,
            initValue: '0',
            rangeConfig: {
                '0-20': {
                    "background-color": {
                        startValue: 'red',
                        endValue: 'green',
                        unit: ''
                    }
                }
            }
        })
    }, [])
    function onClick(){
        (event.current as Function)(inpVal, 5000)
    }
    return <>
        <input onChange={(event)=>{
            setInpVal(event.target.value)
        }} />
        <button onClick={onClick}>click</button>
        <button onClick={()=> (event.current as Function)(100, 1000)}>click2</button>
        <div ref={elementRef} style={{
            width:'100px',
            height:'100px',
            background:'red',
            border: 'solid 1px green',
            position: 'relative'
        }}>1231232</div>
    </> 
}