import React, { useEffect, useState } from 'react';

const formObject = React.createElement('form');
const inputObject = React.createElement('input');

export default function VoiceForm(props) {
	const [inputTags, setInputTags] = useState([]);
	const [isTraced, setIsTraced] = useState(false);

	if (props === null)
		throw new Error('No child nodes detected inside VoiceForm Component');
	if (Array.isArray(props.children))
		throw new Error(
			'VoiceForm Component should contain single node as child'
		);
	if (props.children.type !== formObject.type)
		throw new Error(
			`React form element must be the element that shoud wrapped by VoiceForm Element found ${props.children.type}`
		);

	useEffect(() => {
		if (!isTraced) {
			detectInputElements(props.children, inputTags);
			return setIsTraced(true);
		}
		if (inputTags.length !== 0) {
			fillElement(inputTags[0]);
			setInputTags(inputTags.slice(1));
		}
	}, [isTraced, inputTags]);

	return props.children;
}

function detectInputElements(node, nodeArr) {
	if (node === undefined || Object.keys(node).length === 0) return;

	if (node.type === inputObject.type) {
		const { value, onChange } = node.props;

		if (value === undefined)
			throw new Error(`${node.type} element must contain value prop`);
		if (onChange === undefined)
			throw new Error(`${node.type} element must contain onchange prop`);

		return nodeArr.push(node);
	}

	if (Array.isArray(node.props.children))
		node.props.children.forEach((childNode) =>
			detectInputElements(childNode, nodeArr)
		);
	else detectInputElements(node.props.children, nodeArr);

	return;
}

function fillElement(node) {
	const { onChange } = node.props;
	return onChange(prompt());
}
