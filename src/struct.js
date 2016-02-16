import panic from './panic';

import {check_type} from './util';

let factory=function(def){
	let prop_info=Object.keys(def).map((key)=>{
		return {
			name:key,
			type:def[key],
			mutable:false
		};
	});

	let struct=function(props){
		prop_info.forEach(({name,type,mutable})=>{
			name in props
				|| panic(`Property ${name} does not found`);

			let {match,expected,actual}=check_type(type,props[name]);

			match
				? Object.defineProperty(this,name,{
					value:props[name],
					writable:mutable,
					enumerable:true,
					configurable:false
				})
				: panic(`Type mismatched for ${name} ! expected: ${expected}, actual: ${actual}`);
		});
	};

	let creator=(props)=>{
		return new struct(props);
	};

	creator.toString=()=>{
		let props=prop_info.map((prop)=>`${prop.name}: ${prop.type}`).join(',');
		return `rusted struct type: {${props} }`;
	};

	struct.prototype=creator.prototype;

	return creator;
};

export default factory;
