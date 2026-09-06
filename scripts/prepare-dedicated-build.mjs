import {readFileSync,writeFileSync} from 'node:fs';

const path='scripts/generate-dedicated-screens.mjs';
const source=readFileSync(path,'utf8');
const bad="const fn=(r,s)=>(r+'_'+s).replace(/[^a-zA-Z0-9]+(.)?/g,(_,__,c)=>c?c.toUpperCase():'').replace(/^./,x=>x.toUpperCase())+'Screen';";
const good="const fn=(r,s)=>(r+'_'+s).replace(/[^a-zA-Z0-9]+(.)?/g,(_,__,c)=>typeof c==='string'?c.toUpperCase():'').replace(/^./,x=>x.toUpperCase())+'Screen';";
if(source.includes(bad)) writeFileSync(path,source.replace(bad,good));
await import('./generate-dedicated-screens.mjs');
