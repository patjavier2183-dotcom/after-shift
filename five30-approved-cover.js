/* 5:30: controles REALES sobre la imagen aprobada, responsive y con idiomas. */
(function(){
"use strict";
const panel=document.getElementById("approvedSearchPanel");
const input=document.getElementById("approvedSearchInput");
const oldSearch=document.getElementById("creatorSearch");
const oldLang=document.getElementById("uiLanguage");
const loginOriginal=document.getElementById("loginBtn");
const joinOriginal=document.getElementById("signupBtn");
const selectors=[document.getElementById("approvedDesktopLanguage"),document.getElementById("approvedMobileLanguage")].filter(Boolean);
const labels={
 es:{about:"ACERCA DE",cta:"EXPLORAR CREADORES",howAction:"CÓMO FUNCIONA",login:"INGRESAR",account:"MI CUENTA",join:"CREAR CUENTA",creators:"CREADORES",explore:"EXPLORAR",subscriptions:"SUSCRIPCIONES",search:"BUSCAR",searchLabel:"Buscar creadores",exclusive:"CONTENIDO EXCLUSIVO",topCreators:"CREADORES DESTACADOS",flexible:"SUSCRIPCIONES FLEXIBLES",discover:"DESCUBRIR",howTitle:"Cómo funciona",howStep1:"Crea tu cuenta",howText1:"Regístrate gratis y descubre creadores.",howStep2:"Explora perfiles",howText2:"Conoce sus publicaciones y elige a quién seguir.",howStep3:"Suscríbete cuando esté disponible",howText3:"Los pagos reales aún no están activos. Las pruebas no cobran dinero.",placeholder:"Nombre del creador…"},
 en:{about:"ABOUT",cta:"EXPLORE CREATORS",howAction:"SEE HOW IT WORKS",login:"LOG IN",account:"MY ACCOUNT",join:"JOIN",creators:"CREATORS",explore:"EXPLORE",subscriptions:"SUBSCRIPTIONS",search:"SEARCH",searchLabel:"Search creators",exclusive:"EXCLUSIVE CONTENT",topCreators:"TOP CREATORS",flexible:"FLEXIBLE SUBSCRIPTIONS",discover:"DISCOVER",howTitle:"How it works",howStep1:"Create your account",howText1:"Sign up for free and discover creators.",howStep2:"Explore profiles",howText2:"See posts and choose who to follow.",howStep3:"Subscribe when available",howText3:"Real payments are not enabled yet. Demos do not charge money.",placeholder:"Creator name…"},
 pt:{about:"SOBRE",cta:"EXPLORAR CRIADORES",howAction:"COMO FUNCIONA",login:"ENTRAR",account:"MINHA CONTA",join:"CRIAR CONTA",creators:"CRIADORES",explore:"EXPLORAR",subscriptions:"ASSINATURAS",search:"BUSCAR",searchLabel:"Buscar criadores",exclusive:"CONTEÚDO EXCLUSIVO",topCreators:"CRIADORES EM DESTAQUE",flexible:"ASSINATURAS FLEXÍVEIS",discover:"DESCUBRA",howTitle:"Como funciona",howStep1:"Crie sua conta",howText1:"Cadastre-se gratuitamente e descubra criadores.",howStep2:"Explore perfis",howText2:"Veja publicações e escolha quem seguir.",howStep3:"Assine quando disponível",howText3:"Pagamentos reais ainda não estão ativos. Testes não cobram dinheiro.",placeholder:"Nome do criador…"}
};
let lang=window.AfterShiftI18n?.getLanguage?.()||oldLang?.value||"es";
function isLoggedIn(){return joinOriginal?.style.display==="none" || Boolean(window.Five30Auth?.signedIn?.());}
function updateLabels(){
 const word=labels[lang]||labels.es;
 document.querySelector(".approved-cover")?.setAttribute("data-cover-lang",lang);
 document.querySelector(".approved-cover")?.setAttribute("data-cover-logged-in",String(isLoggedIn()));
 document.querySelectorAll("[data-cover-label]").forEach(el=>{
   const key=el.getAttribute("data-cover-label");
   const value=key==="login"&&isLoggedIn()?word.account:word[key];
   if(value&&el.textContent!==value)el.textContent=value;
 });
 input.placeholder=word.placeholder;
 selectors.forEach(sel=>{if(sel.value!==lang)sel.value=lang;});
 document.querySelectorAll(".approved-desktop-lang-label,.approved-mobile-lang-label").forEach(el=>el.title=lang==="es"?"Cambiar idioma":lang==="en"?"Change language":"Mudar idioma");
 document.querySelectorAll('[data-cover-action="join"]').forEach(el=>{el.hidden=isLoggedIn();});
}
function changeLanguage(value){
 if(!labels[value])return;
 lang=value;
 if(window.AfterShiftI18n?.setLanguage)window.AfterShiftI18n.setLanguage(value);
 else if(oldLang){oldLang.value=value;oldLang.dispatchEvent(new Event("change",{bubbles:true}));}
 updateLabels();
}
function scrollToId(id){
 const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:"smooth",block:"start"});
}
function showAuth(mode){
 if(isLoggedIn()){window.Five30Auth?.openAccount?.()||loginOriginal?.click();return;}
 const api=window.Five30Auth;
 if(mode==="signup"&&api?.openSignup){api.openSignup();return;}
 if(mode==="login"&&api?.openLogin){api.openLogin();return;}
 (mode==="signup"?joinOriginal:loginOriginal)?.click();
}
function syncSearch(){
 if(!oldSearch)return;
 oldSearch.value=input.value;
 oldSearch.dispatchEvent(new Event("input",{bubbles:true}));
}
function route(action){
 switch(action){
 case "home":scrollToId("portada");break;
 case "creators":case "explore":scrollToId("creators");break;
 case "about":scrollToId("about");break;
 case "how":scrollToId("howItWorks");break;
 case "subscriptions":document.getElementById("navSubscriptions")?.click();break;
 case "login":showAuth("login");break;
 case "join":showAuth("signup");break;
 case "search":
   panel.hidden=!panel.hidden;
   if(!panel.hidden)input.focus();
   break;
 case "search-close":panel.hidden=true;break;
 case "search-go":syncSearch();scrollToId("creators");break;
 }
}
document.addEventListener("click",event=>{
 const target=event.target.closest?.("[data-cover-action]");
 if(!target)return;
 event.preventDefault();
 route(target.getAttribute("data-cover-action"));
});
selectors.forEach(select=>select.addEventListener("change",()=>changeLanguage(select.value)));
if(oldLang)oldLang.addEventListener("change",()=>{lang=oldLang.value;updateLabels();});
input.addEventListener("input",syncSearch);
input.addEventListener("keydown",event=>{if(event.key==="Enter"){event.preventDefault();route("search-go");}if(event.key==="Escape"){panel.hidden=true;}});
if(loginOriginal) new MutationObserver(updateLabels).observe(loginOriginal,{childList:true,subtree:true,characterData:true});
if(joinOriginal) new MutationObserver(updateLabels).observe(joinOriginal,{attributes:true,attributeFilter:["style"]});
updateLabels();
window.Five30Cover={route,changeLanguage};
})();
