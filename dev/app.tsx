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
                '0-100': {
                    'translateX': {
                        startValue: '0',
                        endValue: '100',
                        unit: 'px'
                    }
                },
                '0-33': {
                    "background-color": {
                        startValue: 'green',
                        endValue: 'blue',
                        unit: ''
                    }
                },
                '33-66': {
                    "background-color": {
                        startValue: 'blue',
                        endValue: 'yellow',
                        unit: ''
                    }
                },
                '66-99': {
                    "background-color": {
                        startValue: 'yellow',
                        endValue: 'red',
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