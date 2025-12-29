(function(){
"use strict";
var SLUG="slider";
var SCHEMA=[{"id":"6951b1c4d456d4aac927652e","key":"test","label":"Test Label","description":null,"type":"string","defaultValue":"test","min":null,"max":null,"step":null,"alpha":null,"invertY":null,"groupName":null,"monitorView":null,"interval":null,"bufferSize":null,"bladeValue":null,"rows":3,"placeholder":null,"wide":null,"lineCount":2,"options":[],"buttons":[]}];

// Code is object contents without outer braces, we wrap it here
var scriptDef={};
var currentConfig={};
function run(config){
currentConfig=Object.assign({},config);
if(scriptDef.run)scriptDef.run(config);
}

window.flowing=window.flowing||{};
window.flowing[SLUG]={
run:run,
schema:SCHEMA,
getConfig:function(){return Object.assign({},currentConfig);}
};

if(new URLSearchParams(location.search).get("flowing-dev-mode")==="true"){
(async function(){
try{
var c="https://esm.sh";
var[T,E,C,X]=await Promise.all([
import(c+"/tweakpane@4"),
import(c+"/@tweakpane/plugin-essentials@0.2"),
import(c+"/@tweakpane/plugin-camerakit@0.3"),
import(c+"/@pangenerator/tweakpane-textarea-plugin@2")
]);
initDevtools(T.Pane,E.default,C.default,X.default);
}catch(e){console.error("[flowing] Failed to load devtools:",e);}
})();
function initDevtools(Pane,Essentials,Camerakit,Textarea){
var s=window.flowing["slider"];
if(!s)return;
var ctr=document.createElement("div");
ctr.id="flowing-devtools-slider";
ctr.style.cssText="position:fixed;top:10px;right:10px;z-index:99999;max-height:90vh;overflow-y:auto;";
document.body.appendChild(ctr);
var pane=new Pane({container:ctr,title:"slider"});
pane.registerPlugin(Essentials);
pane.registerPlugin(Camerakit);
pane.registerPlugin(Textarea);
var urlCfg=getUrlConfig("slider");
var cfg=urlCfg||s.getConfig()||buildDefaults(s.schema);
for(var p of s.schema)addControl(pane,cfg,p);
var copyBtn=pane.addButton({title:"📋 Copy Config"});
copyBtn.on("click",function(){
var code='window.flowing["slider"].run('+JSON.stringify(cfg,null,2)+");";
navigator.clipboard.writeText(code);
copyBtn.title="✓ Copied!";
setTimeout(function(){copyBtn.title="📋 Copy Config";},2000);
});
pane.on("change",function(){
s.run(Object.assign({},cfg));
setUrlConfig("slider",cfg);
});
s.run(Object.assign({},cfg));
}
function getUrlConfig(slug){
try{var v=new URLSearchParams(location.search).get("fc-"+slug);return v?JSON.parse(decodeURIComponent(v)):null;}catch{return null;}
}
function setUrlConfig(slug,cfg){
try{
var u=new URL(location.href);
u.searchParams.set("fc-"+slug,encodeURIComponent(JSON.stringify(cfg)));
history.replaceState(null,"",u);
}catch{}
}
function buildDefaults(schema){
var cfg={};
for(var p of schema){
if(!p.key||!p.type)continue;
var d=p.defaultValue;
if(d===undefined||d===""){
switch(p.type){
case"number":case"ring":case"wheel":cfg[p.key]=p.min||0;break;
case"boolean":cfg[p.key]=false;break;
case"string":case"textarea":cfg[p.key]="";break;
case"color":cfg[p.key]="#ffffff";break;
case"point2d":cfg[p.key]={x:0,y:0};break;
case"point3d":cfg[p.key]={x:0,y:0,z:0};break;
case"interval":cfg[p.key]={min:p.min||0,max:p.max||100};break;
case"select":case"radio-grid":cfg[p.key]=p.options&&p.options[0]?p.options[0].value:"";break;
case"cubic-bezier":cfg[p.key]=[0.5,0,0.5,1];break;
default:cfg[p.key]=null;
}
}else{try{cfg[p.key]=JSON.parse(d);}catch{cfg[p.key]=d;}}
}
return cfg;
}
function addControl(pane,cfg,p){
if(!p.key||!p.type)return;
var k=p.key,l=p.label;
switch(p.type){
case"number":pane.addBinding(cfg,k,{label:l,min:p.min,max:p.max,step:p.step});break;
case"string":case"boolean":pane.addBinding(cfg,k,{label:l});break;
case"color":pane.addBinding(cfg,k,{label:l,color:{alpha:p.alpha}});break;
case"point2d":pane.addBinding(cfg,k,{label:l,x:{min:p.min,max:p.max},y:{min:p.min,max:p.max,inverted:p.invertY}});break;
case"point3d":pane.addBinding(cfg,k,{label:l,x:{min:p.min,max:p.max},y:{min:p.min,max:p.max},z:{min:p.min,max:p.max}});break;
case"interval":pane.addBinding(cfg,k,{label:l,min:p.min||0,max:p.max||100,step:p.step});break;
case"select":
if(p.options&&p.options.length){
var opts={};for(var o of p.options)opts[o.label]=o.value;
pane.addBinding(cfg,k,{label:l,options:opts});
}break;
case"separator":pane.addBlade({view:"separator"});break;
case"fps-graph":pane.addBlade({view:"fpsgraph",label:l,min:p.min||0,max:p.max||90,lineCount:p.lineCount||2});break;
case"button-grid":
if(p.buttons&&p.buttons.length){
var cells=p.buttons.map(function(b){return{title:b.title};});
pane.addBlade({view:"buttongrid",label:l,size:[2,Math.ceil(p.buttons.length/2)],cells:function(x,y){return cells[y*2+x]||{title:""};}});
}break;
case"cubic-bezier":cfg[k]=cfg[k]||[0.5,0,0.5,1];pane.addBinding(cfg,k,{label:l,view:"cubicbezier"});break;
case"radio-grid":
if(p.options&&p.options.length){
var rcells=p.options.map(function(o){return{title:o.label,value:o.value};});
cfg[k]=cfg[k]||p.options[0].value;
pane.addBinding(cfg,k,{label:l,view:"radiogrid",groupName:p.groupName||k,size:[2,Math.ceil(p.options.length/2)],cells:function(x,y){return rcells[y*2+x]||{title:"",value:""};}});
}break;
case"ring":cfg[k]=cfg[k]||0;pane.addBinding(cfg,k,{label:l,view:"cameraring",min:p.min||0,max:p.max||360,wide:p.wide});break;
case"wheel":cfg[k]=cfg[k]||0;pane.addBinding(cfg,k,{label:l,view:"camerawheel",wide:p.wide});break;
case"textarea":cfg[k]=cfg[k]||"";pane.addBinding(cfg,k,{label:l,view:"textarea",rows:p.rows||3,placeholder:p.placeholder});break;
}
}
}
})();