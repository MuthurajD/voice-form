import React, { useEffect, useState } from 'react';

const formObject = React.createElement('form');
const inputObject = React.createElement('input');

export default function VoiceForm(props) {
	if(!('speechSynthesis' in window) || !('webkitSpeechRecognition' in window))
	    throw new Error("Sorry there is not Browser support for speechRecognition try upgrading your browser or switch to other.")
	if (props === null)
		throw new Error('No child roots detected inside VoiceForm Component');
	if (Array.isArray(props.children))
		throw new Error(
			'VoiceForm Component should contain single root as child'
		);
	if (props.children.type !== formObject.type)
		throw new Error(
			`React form element must be the element that shoud wrapped by VoiceForm Element found ${props.children.type}`
		);
	if(props.autoSubmit && (typeof(props.children.props.onSubmit)!=="function"))
	    throw new Error(
			`Enabling autoSubmit expects onSubmit prop of type function but Received ${typeof(props.children.onSubmit)}`
		) 

	const [currentNodesResolvedCount,setNodesResolvedCount] = useState(0)
	const [voice,setVoice] = useState(false)
	const [enabled,setEnabled] = useState(false)
	const [isSubmitted,setIsSubmitted] = useState(false)

	if(!voice){
		speechSynthesis.onvoiceschanged = e=>{
			setVoice(speechSynthesis.getVoices()[0] || null)
		}
	}

	const handleSpeechRecognition = (onChange)=>{
		listenToSpeechAndReturnText().then(
			result => {
				onChange(result)
				setNodesResolvedCount(count=>count+1)
			}
		)
	} 

	useEffect(() => {
		if(!enabled || voice===null || voice===undefined) return

		let node = getNthFormElement(props.children,currentNodesResolvedCount)

		if (node!=null && node!=undefined){
			let utterence = new SpeechSynthesisUtterance()

			const {speak,onChange} = node.props
			if (typeof(speak)!=="string") throw new Error(`Expected speak prop to be string received type ${typeof(speak)}`)
			if(typeof(onChange)!=="function") throw new Error(`Expected onChange prop to be string received type ${typeof(onChange)}`)

			utterence.text = speak
			utterence.volume = 0.5
			utterence.pitch = 1
			utterence.rate = 1
			utterence.voice = voice || null
			utterence.lang = voice?.lang
			utterence.voiceURI = voice?.voiceURI
			utterence.onend = ()=>{handleSpeechRecognition(onChange)}

			speechSynthesis.speak(utterence);
		}
		else{
			if (props.autoSubmit && !isSubmitted) props.children.props.onSubmit()
			setIsSubmitted(true)
		}
	},[currentNodesResolvedCount,enabled]);

	return (
		React.createElement("div",{},[
			React.createElement("button",{onClick:()=>{setEnabled(true)},style:{...props?.buttonStyles}},"Enable Voice Filling"),
			props.children
		]))
}

const listenToSpeechAndReturnText = () => new Promise((resolve,reject)=>{
	const speechRecognizer = new window.webkitSpeechRecognition();
	speechRecognizer.onresult = (e)=>resolve(e.results[0][0].transcript)
	speechRecognizer.start()
})


function getNthFormElement(root,n) {
	const stack = [root]

	while (stack.length>0){
		let node = stack.pop()
		if(node === undefined || Object.keys(node).length === 0) continue;
		if(node.type === inputObject.type){
			if(n==0) return node
			n-=1
			continue;
		}
		if (Array.isArray(node.props.children)){
			for(let index=node.props.children.length-1;index>=0;index-=1){
				stack.push(node.props.children[index])
			}
		}
		else stack.push(node.props.children)
	}
}