# voice-form

voice-form is a Adapter for your react form where allows you to enable Voice based form filling

To install the package `npm i voice-form --save`

`<VoiceForm/>`

# API Reference
## props
`buttonStyles` - Object indicating styles of the enable button
`autoSubmit` - Boolean representing to submit the form on Filling every columns

Example code
```import { useState } from "react";
import VoiceForm from "voice-form";

export default function App(){
    const [name,setName] = useState("")
    const [country,setCountry] = useState("") 

    const handleSubmit = (e)=>{
        e?.preventDefault()
        console.log(name,",",country)
    }

    return(
        <VoiceForm buttonStyles={{margin:"3px",padding:"3px",backgroundColor:"white"}} autoSubmit>
            <form onSubmit={handleSubmit}>
                <input speak={"Please tell your name"} value={name} onChange={setName}/>
                <input speak={"Please tell your Country"} value={country} onChange={setCountry}/>
            </form>
        </VoiceForm>
    )
}```
