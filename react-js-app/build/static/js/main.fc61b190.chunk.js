(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{10:function(e,t,a){e.exports=a(17)},16:function(e,t,a){},17:function(e,t,a){"use strict";a.r(t);var i=a(0),n=a.n(i),r=a(2),s=a.n(r),o=a(5),l=a(6),c=a(8),d=a(7),h=a(1),u=a(9);var p=function(e){return n.a.createElement("div",{className:"tab-items-wrapper","data-title":e.title,"data-author":e.author,"data-id":e.id,"data-ref-type":e.ref_type,onClick:function(t){return e.handleReferenceClick(t)}},n.a.createElement("li",{className:"tab-items"},n.a.createElement("span",{className:"props"},"Title: ",n.a.createElement("span",{className:"title"},e.title)),n.a.createElement("span",{className:"props"},"Author: ",n.a.createElement("span",{className:"author"},e.author)),n.a.createElement("span",{className:"props"},"Ref. ID: ",n.a.createElement("span",{className:"id"},e.id)),n.a.createElement("span",{className:"props",style:{display:"block",textAlign:"right",fontSize:"10px"}},e.ref_type)))};function b(e){var t={height:e.attributes.size,width:e.attributes.size,background:e.attributes.color,display:"inline-block",borderRadius:"50%",marginRight:5},a={visibility:e.isLoading?"visible":"hidden",opacity:e.isLoading?1:0,position:"absolute",width:"100%",background:"rgba(50, 50, 50, 0)",display:"flex",justifyContent:"center",alignItems:"center",textAlign:"center",height:e.attributes.wrapperHeight,flexDirection:"column",color:e.attributes.color},i={display:"block",textAlign:"center",position:"minor"===e.attributes.type?"absolute":"",visibility:e.isLoading?"visible":"hidden",opacity:e.isLoading?1:0},r=n.a.createElement("span",{className:"loader",style:i},n.a.createElement("span",{className:"loader-circle",style:t}),n.a.createElement("span",{className:"loader-circle",style:t}),n.a.createElement("span",{className:"loader-circle",style:t})),s=n.a.createElement("div",{className:"loader-wrapper",style:a},r,n.a.createElement("br",null),n.a.createElement("span",{className:"load-name",style:{fontSize:"13px"}},e.attributes.rider));return"minor"===e.attributes.type?r:s}var m,f,g,v,y=function(e){return n.a.createElement("section",{className:"dropdown",style:{height:e.state.dropdownCurHeight}},n.a.createElement("div",{className:"tab-links-wrapper"},n.a.createElement("button",{className:"back-btn",onClick:e.goBackInTime,style:{width:e.state.historyExists?55:0}},"\u276e"),n.a.createElement("button",{className:"required-tab-link tab-link active-tab-link","data-tab-name":"required-tab",onClick:e.handleTabToggle},"Required"),n.a.createElement("button",{className:"recommended-tab-link tab-link","data-tab-name":"recommended-tab",onClick:e.handleTabToggle},"Recommended"),n.a.createElement("button",{className:"graph-tab-link tab-link","data-tab-name":"graph-tab",onClick:e.handleTabToggle},"\u2605")),n.a.createElement("div",{className:"tabs-container",style:{position:"relative"}},n.a.createElement(b,{isLoading:e.state.isLoading,attributes:{size:12,color:"#333",rider:"Loading References...",type:"major",wrapperHeight:e.state.dropdownCurHeight-e.state.widgetHeight}}),n.a.createElement("div",{className:"tabs-wrapper",style:{opacity:e.state.isLoading?0:1}},n.a.createElement("ul",{className:"tab required-tab active-tab"},e.state.payload.map(function(t,a){return"required"===t.ref_type?n.a.createElement(p,{title:t.title,author:t.author,id:t.id,key:a,ref_type:t.ref_type,handleReferenceClick:e.handleReferenceClick}):null})),n.a.createElement("ul",{className:"tab recommended-tab"},e.state.payload.map(function(t,a){return"recommended"===t.ref_type?n.a.createElement(p,{title:t.title,author:t.author,id:t.id,key:a,ref_type:t.ref_type,handleReferenceClick:e.handleReferenceClick}):null})),n.a.createElement("ul",{className:"tab graph-tab"},n.a.createElement("div",{className:"tab-items-wrapper graph-wrapper"},n.a.createElement("h1",{className:"title"},"GRAPH ZONE!"))))))},T=a(3);function k(){var e=Object(T.a)([";"]);return k=function(){return e},e}function w(){var e=Object(T.a)([";"]);return w=function(){return e},e}function N(){var e=Object(T.a)([";"]);return N=function(){return e},e}function E(){var e,t,a=m.split(N()),i=f.split(w()),n=[];return m.split(k()).map(function(r,s){return s>7?null:(t=Math.floor(Math.random()*a.length),e=a[t],n.push(i[t]),a.splice(t,1),i.splice(t,1),e)}).filter(function(e){return null!==e}).map(function(e,t){var i=v.map(function(e,t){return t<11?v[Math.floor(Math.random()*v.length)]:""}).join(""),r=Math.ceil(Math.random()*a.length);return{title:e,author:n[t],id:i,ref_type:r%t===0?g[0]:g[1]}})}m="The Iliad;The Hobbit;1984;Pride and Prejudice;To Kill a Mockingbird;The Da Vinci Code;The Catcher in the Rye;Life of Pi;The Two Towers;Harry Potter and the Goblet of Fire;Outlander;Never Let Me Go;Digital Fortress;A Christmas Carol;Zen and the Art of Motorcycle Maintenance;Tess of the d'Urbervilles;The Divine Comedy;The Thirteenth Tale;To the Lighthouse;The Sea of Monsters",f="Homer;J. R. R. Tolkien;George Orwell;Jane Austen;Harper Lee;Dan Brown;J. D. Salinger;Yann Martel;J. R. R. Tolkien;J. K. Rowling;Diana Gabaldon;Kazuo Ishiguro;Dan Brown;Charles Dickens;Robert M. Pirsig;Thomas Hardy;Dante Alighieri;Diane Setterfield;Virginia Woolf;Rick Riordan",g=["required","recommended"],v="01234abcdefghijklmnopqrstuvwxyz56789".split("");var L=function(e){function t(){var e;return Object(o.a)(this,t),(e=Object(c.a)(this,Object(d.a)(t).call(this))).state={dropdownIsCollapsed:!0,dropdownCurHeight:0,refID:"9v7s4gtgt9",isLoading:!1,payload:E(),activeTab:"required-tab",activeTabLink:"required-tab-link",historyExists:!1,widgetHeight:0},e.height=0,e.dropdown=void 0,e.activeTabLink=void 0,e.activeTab=void 0,e.history=[{}],e.resizeDropdownHeightTo=e.resizeDropdownHeightTo.bind(Object(h.a)(e)),e.findNode=e.findNode.bind(Object(h.a)(e)),e}return Object(u.a)(t,e),Object(l.a)(t,[{key:"handleDropdownToggle",value:function(){var e=this;this.setState(function(t){var a=t.dropdownIsCollapsed;return{dropdownIsCollapsed:!a,dropdownCurHeight:e.resizeDropdownHeightTo(a?e.activeTab:0),widgetHeight:e.height}})}},{key:"handleTabToggle",value:function(e){var t,a,i;this.activeTabLink=e.currentTarget,t=this.activeTabLink.getAttribute("data-tab-name"),this.activeTab=this.findNode(this,".".concat(t)),a=this.findNode(this,".tab-link"),i=this.findNode(this,".tab"),a.forEach(function(e,t){e.classList.remove("active-tab-link"),i[t].classList.remove("active-tab")}),this.activeTabLink.classList.add("active-tab-link"),this.activeTab.classList.add("active-tab"),this.setState({dropdownCurHeight:this.resizeDropdownHeightTo(this.activeTab),activeTab:t,activeTabLink:"".concat(t,"-link")})}},{key:"handleReferenceClick",value:function(e){var t=this,a=e.currentTarget.dataset.id;this.setState({isLoading:!0}),this.setState({payload:[]}),setTimeout(function(){t.setState({refID:a,payload:E()}),t.setState({dropdownCurHeight:t.resizeDropdownHeightTo(t.activeTab),historyExists:!0,isLoading:!1}),t.history.push(t.state)},1e3)}},{key:"goBackInTime",value:function(){var e,t=this,a=this.history.length-2,i={},n=this.findNode(this,".tab-link"),r=this.findNode(this,".tab");a>=0&&this.history[a]?this.setState(function(n){for(var r in e=t.history[a])i[r]=e[r];return i}):this.setState({historyExists:!1}),n.forEach(function(e,t){e.classList.remove("active-tab-link"),r[t].classList.remove("active-tab")}),this.activeTab=this.findNode(this,".".concat(this.history[a].activeTab)),this.activeTab.classList.add("active-tab"),this.activeTabLink=this.findNode(this,".".concat(this.history[a].activeTabLink)),this.activeTabLink.classList.add("active-tab-link"),this.history.pop()}},{key:"resizeDropdownHeightTo",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.height;return 0!==e?e.offsetHeight+t:0}},{key:"findNode",value:function(e,t){var a=s.a.findDOMNode(e),i=a.querySelectorAll(t);return t?i[1]?i:a.querySelector(t):a}},{key:"componentDidMount",value:function(){for(var e in this.height=this.findNode(this).offsetHeight,this.dropdown=this.findNode(this,".dropdown"),this.activeTabLink=this.findNode(this,".active-tab-link"),this.activeTab=this.findNode(this,".required-tab"),this.state)this.history[0][e]=this.state[e];this.history[0].dropdownCurHeight=this.resizeDropdownHeightTo(this.activeTab),this.history[0].dropdownIsCollapsed=!1}},{key:"render",value:function(){return n.a.createElement("div",{className:"widget"},n.a.createElement("section",{className:"ref-tab-wrapper",onClick:this.handleDropdownToggle.bind(this)},n.a.createElement("span",null,"LC"),n.a.createElement("span",{style:{position:"relative",display:"flex",justifyContent:"center"}},n.a.createElement("span",{className:"ref-identifier",style:{opacity:this.state.isLoading?0:1}},this.state.refID),n.a.createElement(b,{isLoading:this.state.isLoading,attributes:{size:8,color:"white",type:"minor"}})),n.a.createElement("span",{className:"caret-icon ".concat(this.state.dropdownIsCollapsed?"flip-caret-icon":"")},"\u276e")),n.a.createElement(y,{state:this.state,handleTabToggle:this.handleTabToggle.bind(this),handleReferenceClick:this.handleReferenceClick.bind(this),goBackInTime:this.goBackInTime.bind(this)}))}}]),t}(n.a.Component);a(16);s.a.render(n.a.createElement(L,null),document.querySelector("#root"))}},[[10,1,2]]]);
//# sourceMappingURL=main.fc61b190.chunk.js.map