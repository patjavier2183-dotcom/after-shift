/* 5:30 — Real button handlers and one consistent ES/EN/PT language state.
   Never overlay translations on transparent buttons: CSS completely covers baked English. */
(function(){
"use strict";
const root=document.getElementById("portada");
const panel=document.getElementById("approvedSearchPanel");
const query=document.getElementById("approvedSearchInput");
const originalSearch=document.getElementById("creatorSearch");
const originalLang=document.getElementById("uiLanguage");
const originalLogin=document.getElementById("loginBtn");
const originalJoin=document.getElementById("signupBtn");
const selects=[document.getElementById("approvedDesktopLanguage"),document.getElementById("approvedMobileLanguage")].filter(Boolean);
if(!root||!panel||!query)return;
const dictionary={
 es:{creators:"CREADORES",explore:"EXPLORAR",subscriptions:"SUSCRIPCIONES",search:"BUSCAR",about:"ACERCA DE",login:"INGRESAR",account:"MI CUENTA",join:"CREAR CUENTA",cta:"EXPLORAR CREADORES",how:"CÓMO FUNCIONA",intro:"Una plataforma premium para conexiones auténticas.",exclusive:"CONTENIDO EXCLUSIVO",exclusiveDesc:"Directamente de tus creadores favoritos",topCreators:"MEJORES CREADORES",topCreatorsDesc:"Personas reales. Historias únicas.",flexible:"SUSCRIPCIONES FLEXIBLES",flexibleDesc:"A tu manera. Sin compromisos.",discover:"DESCUBRE",discoverDesc:"Nuevos creadores, nuevas perspectivas.",searchLabel:"Buscar creadores",placeholder:"Nombre del creador…"},
 en:{creators:"CREATORS",explore:"EXPLORE",subscriptions:"SUBSCRIPTIONS",search:"SEARCH",about:"ABOUT",login:"LOG IN",account:"MY ACCOUNT",join:"JOIN",cta:"EXPLORE CREATORS",how:"SEE HOW IT WORKS",intro:"A premium creator platform for those who value authentic connection.",exclusive:"EXCLUSIVE CONTENT",exclusiveDesc:"Direct from your favorite creators",topCreators:"TOP CREATORS",topCreatorsDesc:"Real people. Unique stories.",flexible:"FLEXIBLE SUBSCRIPTIONS",flexibleDesc:"Your way. No commitments.",discover:"DISCOVER",discoverDesc:"New creators, new perspectives.",searchLabel:"Search creators",placeholder:"Creator name…"},
 pt:{creators:"CRIADORES",explore:"EXPLORAR",subscriptions:"ASSINATURAS",search:"BUSCAR",about:"SOBRE",login:"ENTRAR",account:"MINHA CONTA",join:"CRIAR CONTA",cta:"EXPLORAR CRIADORES",how:"COMO FUNCIONA",intro:"Uma plataforma premium para conexões autênticas.",exclusive:"CONTEÚDO EXCLUSIVO",exclusiveDesc:"Direto dos seus criadores favoritos",topCreators:"MELHORES CRIADORES",topCreatorsDesc:"Pessoas reais. Histórias únicas.",flexible:"ASSINATURAS FLEXÍVEIS",flexibleDesc:"Do seu jeito. Sem compromissos.",discover:"DESCUBRA",discoverDesc:"Novos criadores, novas perspectivas.",searchLabel:"Buscar criadores",placeholder:"Nome do criador…"}
};
let lang=window.AfterShiftI18n?.getLanguage?.()||originalLang?.value||"es";
if(!dictionary[lang])lang="es";
const isSignedIn=()=>originalJoin?.style.display==="none" || Boolean(window.Five30Auth?.signedIn?.());
function render(){
 const text=dictionary[lang];
 root.dataset.coverLang=lang;
 root.dataset.coverLoggedIn=String(isSignedIn());
 root.querySelectorAll("[data-cover-copy]").forEach(el=>{
   const key=el.getAttribute("data-cover-copy");
   const value=key==="login"&&isSignedIn()?text.account:key==="join"&&el.classList.contains("approved-hit")&&isSignedIn()?text.account:text[key];
   if(value&&el.textContent!==value)el.textContent=value;
 });
 query.placeholder=text.placeholder;
 selects.forEach(el=>{if(el.value!==lang)el.value=lang;});
 root.querySelectorAll(".approved-mobile-join").forEach(el=>{el.hidden=isSignedIn();});
 root.querySelectorAll(".approved-hit").forEach(el=>{
  const action=el.getAttribute("data-cover-action");
  const label=action==="login"&&isSignedIn()?text.account:action==="join"&&isSignedIn()?text.account:dictionary[lang][action]||el.getAttribute("aria-label");
  if(label)el.setAttribute("aria-label",label);
 });
}
function changeLanguage(value){
 if(!dictionary[value])return;
 lang=value;
 if(window.AfterShiftI18n?.setLanguage)window.AfterShiftI18n.setLanguage(lang);
 else if(originalLang){originalLang.value=lang;originalLang.dispatchEvent(new Event("change",{bubbles:true}));}
 render();
}
function to(id){document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});}
function showAuth(kind){
 if(isSignedIn()){
  if(window.Five30Auth?.openAccount)window.Five30Auth.openAccount();
  else originalLogin?.click();
  return;
 }
 if(kind==="signup"&&window.Five30Auth?.openSignup){window.Five30Auth.openSignup();return;}
 if(kind==="login"&&window.Five30Auth?.openLogin){window.Five30Auth.openLogin();return;}
 (kind==="signup"?originalJoin:originalLogin)?.click();
}
function filter(){
 if(!originalSearch)return;
 originalSearch.value=query.value;
 originalSearch.dispatchEvent(new Event("input",{bubbles:true}));
}
function route(action){
 switch(action){
 case "home":to("portada");break;
 case "creators":case "explore":to("creators");break;
 case "about":to("about");break;
 case "how":to("howItWorks");break;
 case "subscriptions":if(isSignedIn())document.getElementById("navSubscriptions")?.click();else showAuth("login");break;
 case "login":showAuth("login");break;
 case "join":showAuth("signup");break;
 case "search":panel.hidden=!panel.hidden;if(!panel.hidden)query.focus();break;
 case "search-go":filter();to("creators");break;
 case "search-close":panel.hidden=true;break;
 }
}
document.addEventListener("click",event=>{
 const button=event.target.closest?.("[data-cover-action]");
 if(!button)return;
 event.preventDefault();
 route(button.getAttribute("data-cover-action"));
});
selects.forEach(el=>el.addEventListener("change",()=>changeLanguage(el.value)));
if(originalLang)originalLang.addEventListener("change",()=>{lang=dictionary[originalLang.value]?originalLang.value:"es";render();});
query.addEventListener("input",filter);
query.addEventListener("keydown",event=>{
 if(event.key==="Enter"){event.preventDefault();route("search-go");}
 if(event.key==="Escape"){panel.hidden=true;}
});
if(originalJoin)new MutationObserver(render).observe(originalJoin,{attributes:true,attributeFilter:["style"]});
if(originalLogin)new MutationObserver(render).observe(originalLogin,{childList:true,characterData:true,subtree:true});
render();
window.Five30Cover={route,changeLanguage};
})();
