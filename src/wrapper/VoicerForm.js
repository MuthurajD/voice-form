import React, { useEffect, useState } from 'react';

const formObject = React.createElement('form');
const inputObject = React.createElement('input');

export default function VoiceForm(props) {
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

	const [currentNodesResolvedCount,setNodesResolvedCount] = useState(0)
	const [voice,setVoice] = useState(false)
	const [enabled,setEnabled] = useState(false)
	const [error,setError] = useState(false)

	if(!voice){
		speechSynthesis.onvoiceschanged = e=>{
			setVoice(speechSynthesis.getVoices()[0])
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
		if(error || !enabled || voice===null || voice===undefined) return

		let node = getNthFormElement(props.children,currentNodesResolvedCount)

		if (node!=null && node!=undefined){
			let utterence = new SpeechSynthesisUtterance()

			utterence.text = node.props.speak
			utterence.volume = 0.5
			utterence.pitch = 1
			utterence.rate = 1
			utterence.voice = voice
			utterence.lang = voice.lang
			utterence.voiceURI = voice.voiceURI
			utterence.onend = ()=>{handleSpeechRecognition(node.props.onChange)}

			speechSynthesis.speak(utterence);
		}
	},[currentNodesResolvedCount,enabled]);

	return (
	<div>
		<button onClick={()=>{setEnabled(true)}}>Enable Voice Filling</button>
		{props.children}
	</div>
	)
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