import{S as ie,M as b,I as ce,a as se,v as de,f as le,U as H,V as E,B as W,b as D,C as ue,c as h,d as fe,F as me,P as he,e as ve,W as we,g as ge,h as pe}from"./voronoi_fragment.glsl-d09bf56a.js";var s,r,y,Ce="0B0A0A",O="FBB13C",Q="AA0E47";function ye(e){e="0x"+e;var t=parseInt(e,16),n=t>>16&255,i=t>>8&255,T=t&255;return n+","+i+","+T}function R(e){e="0x"+e;var t=parseInt(e,16),n=(t>>16&255)/255,i=(t>>8&255)/255,T=(t&255)/255;return new h(n,i,T)}function N(e){return new h(Math.round(e.x*255),Math.round(e.y*255),Math.round(e.z*255))}function X(e){return"rgb("+e.x+", "+e.y+", "+e.z+")"}function G(){return new h(Math.random(),Math.random(),Math.random())}function Me(){y=new we({canvas:document.querySelector("#bg"),antialias:!0}),y.setPixelRatio(window.devicePixelRatio),y.setSize(window.innerWidth,window.innerHeight),s=new ge(45,window.innerWidth/window.innerHeight,.1,1e3);const e=-document.body.getBoundingClientRect().top/(Z-U);q=e,I.set(-.4+e*1,-.1+e*.5,1.5)}r=new ie;var c=new b(new ce(1,32),new se({vertexShader:de,fragmentShader:le,wireframe:!0,uniforms:{uTime:{value:0},uScale:{value:1.5},uResolution:new H(new E(10,10)),uChange:{value:0},mainColor:new H(R(O)),shadeColor:new H(R(Q))}})),l=new b(new W(.3,.3,.3),new D({color:16777215,wireframe:!0}));l.position.z=-.5;var u=new b(new W(.2,.2,.2),new D({color:16777215,wireframe:!0}));u.position.z=-.1;var f=new b(new W(.15,.15,.15),new D({color:16777215,wireframe:!0}));f.position.z=-.3;r.background=new ue("rgb("+ye(Ce)+")");var Y=document.body,z=document.documentElement,Z=Math.max(Y.scrollHeight,Y.offsetHeight,z.clientHeight,z.scrollHeight,z.offsetHeight),U=window.innerHeight;window.addEventListener("resize",e=>{U=window.innerHeight,s.aspect=window.innerWidth/window.innerHeight,s.updateProjectionMatrix(),y.setSize(window.innerWidth,window.innerHeight)},!1);window.addEventListener("mousemove",e=>{_.set(e.clientX/window.innerWidth,e.clientY/window.innerHeight)},!1);addEventListener("scroll",e=>{const t=-document.body.getBoundingClientRect().top/(Z-U);q=t,I.set(-.4+t*1,-.1+t*.5,1.5)},!1);function x(e,t,n,i){e.rotation.x+=t*a,e.rotation.y+=n*a,e.rotation.z+=i*a}const xe=1/2;var I=new h(0,0,0),M=new h(0,0,1.5),q=0,A=0;let _=new E;var d=new E;const ke=new pe;var k=0,a=0,v=0,o=0;function Be(){V=G(),B=0}var w=G(),V=R(O),Se=1;function m(e,t,n){return e+n*(t-e)}function be(e,t,n){return m(e,t,a/n)}function J(e,t,n){return new E(m(e.x,t.x,a/n),m(e.y,t.y,a/n))}var Ee=40,B=0;const $=document.getElementById("colorChangeButton");$.addEventListener("click",Be);const P=document.getElementById("frontName");function j(e,t,n){return Math.min(Math.max(e,t),n)}function Ie(e,t,n){const i=j(n*a,0,1);return new h(m(e.x,t.x,i),m(e.y,t.y,i),m(e.z,t.z,i))}Me();function L(e){return(Math.random()-.5)*e}var ee=new Array(0);for(var K=0;K<5e3;K++){let e=L(1e3),t=L(1e3),n=L(1e3);ee.push(e,t,n)}var te=new fe;te.setAttribute("position",new me(ee,3));var Te=new he({color:16777215}),S=new ve(te,Te),ne=document.getElementById("decorationCheck"),He=document.getElementById("mouseCheck"),ze=document.getElementById("scrollCheck");document.getElementById("animationCheck");var re=document.getElementById("starCheck"),oe=document.getElementById("icoCheck"),g=re.checked,p=ne.checked,C=oe.checked;const Ae=document.getElementById("fpsDisplay");g&&r.add(S);p&&(r.add(l),r.add(u),r.add(f));C&&r.add(c);function Pe(){ne.checked?p||(p=!0,r.add(l),r.add(u),r.add(f)):p&&(p=!1,r.remove(l),r.remove(u),r.remove(f)),He.checked?d=J(d,_,3):d.set(.5,.5),ze.checked?M=J(M,I,xe):M.set(-.4,-.1,1.5),re.checked?g||(g=!0,r.add(S)):g&&(g=!1,r.remove(S)),oe.checked?C||(C=!0,r.add(c)):C&&(C=!1,r.remove(c))}const Le=.5;var F=0;function ae(){v=ke.getElapsedTime(),a=j(v-k,0,1),F+=v-k,Pe(),F>=Le&&(Ae.innerHTML="FPS: "+Math.round(1/(v-k)),F=0),o+=a,P.style.background="-webkit-linear-gradient(left top, "+X(N(w))+", #"+Q+")",P.style.webkitBackgroundClip="text",P.style.webkitTextFillColor="transparent",$.style.color=X(N(w)),B>=Ee?(V=G(),B=0):B+=a,w=Ie(w,V,Se),c.material.uniforms.mainColor.value=w,s.position.set(M.x-(d.x*2-1)/4,M.y+(d.y*2-1)/4,I.z),x(S,.004,.005,-.002),c.material.uniforms.uTime.value=.5*o,s.rotation.y=-d.x*Math.PI/64,s.rotation.x=-d.y*Math.PI/64,A=be(A,q,1/2),c.material.uniforms.uChange.value=A*.9,x(l,.05,.05,.05),x(u,-.01,.08,-.05),x(f,.015,.03,-.05),l.position.y=Math.sin(o/8)/30+.5,l.position.x=Math.sin(o/60)/8+1.5,u.position.y=Math.cos(o*.1)/20-.1,u.position.x=Math.sin(o/40)/10+1.2,f.position.y=Math.sin(o*.4+26)/25+.1,f.position.x=Math.sin(o/90)/10+1.8,c.position.y=Math.sin(o*.2)/30,c.position.x=Math.sin(o/20)/80,requestAnimationFrame(ae),y.render(r,s),k=v}ae();