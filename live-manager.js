/* AFTER SHIFT V27 · Creator LIVE management DEMO. Only local drafts, no streaming, no payments, no Supabase writes. */
(function(){
"use strict";
const prefix="aftershift-v27-live-draft-";
const copy={
 es:{label:"LIVE PREMIUM · creador",empty:"Prepara tu primer LIVE (borrador local)",draft:"Borrador guardado aquí",config:"CONFIGURAR LIVE",eyebrow:"CREATOR STUDIO · PRUEBA",title:"Organiza tu LIVE PREMIUM",warning:"SIMULACIÓN SIN COBROS: este evento se guarda solamente en este navegador. No se publica para suscriptores, no transmite video y no vende entradas.",name:"Nombre del LIVE",nameExample:"Ej. Encuentro exclusivo",desc:"Descripción",descExample:"¿Qué ocurrirá durante este evento?",date:"Fecha y hora del evento",price:"Precio de entrada (US$)",save:"GUARDAR BORRADOR",saved:"✓ Borrador guardado en este dispositivo. No se publicó.",invalid:"Revisa el nombre, fecha y precio entre US$1 y US$500 (máximo dos decimales).",storage:"No se pudo guardar en este navegador.",preview:"Vista previa",noDraft:"Todavía no hay ningún evento guardado.",scheduled:"PROGRAMADO · SOLO BORRADOR",running:"PRUEBA EN CURSO · NO HAY VIDEO",ended:"PRUEBA FINALIZADA",controls:"Controles de prueba",start:"Iniciar prueba",stop:"Finalizar prueba",sale:"+ 1 entrada ficticia",gift:"+ Regalo ficticio US$1",results:"Estadísticas ficticias",tickets:"Entradas DEMO",gifts:"Regalos DEMO",gross:"Total simulado",creator:"Creador · 80%",platform:"AFTER SHIFT · 20%",note:"Estas cifras no son ventas ni ganancias reales. Se reinician al cerrar esta ventana. El precio solo se refleja en el simulador del mismo navegador.",help:"Guarda un evento para comenzar.",started:"✓ Prueba iniciada; no se encendió ninguna cámara.",stopped:"✓ Prueba terminada; no hubo transmisión.",saleAdded:"✓ Entrada ficticia añadida. Nadie pagó.",giftAdded:"✓ Regalo ficticio añadido. No se recaudó dinero.",close:"Cerrar"},
 en:{label:"PREMIUM LIVE · creator",empty:"Plan your first LIVE (local draft)",draft:"Draft saved here",config:"SET UP LIVE",eyebrow:"CREATOR STUDIO · DEMO",title:"Plan your PREMIUM LIVE",warning:"NO-CHARGE DEMO: this event is saved only in this browser. Subscribers cannot see it; there is no streaming, ticket sale or real payment.",name:"LIVE title",nameExample:"e.g. Exclusive meetup",desc:"Description",descExample:"What will happen during the event?",date:"Event date and time",price:"Ticket price (US$)",save:"SAVE DRAFT",saved:"✓ Draft saved on this device. It was not published.",invalid:"Check title, date and price between US$1 and US$500 (up to two decimals).",storage:"Could not save in this browser.",preview:"Preview",noDraft:"No event has been saved yet.",scheduled:"SCHEDULED · LOCAL DRAFT ONLY",running:"DEMO RUNNING · NO VIDEO",ended:"DEMO FINISHED",controls:"Demo controls",start:"Start demo",stop:"End demo",sale:"+ 1 fictional ticket",gift:"+ US$1 fictional gift",results:"Fictional statistics",tickets:"DEMO tickets",gifts:"DEMO gifts",gross:"Simulated gross",creator:"Creator · 80%",platform:"AFTER SHIFT · 20%",note:"These are not real sales or earnings. They reset when you close this window. The price is available only to the demo in this browser.",help:"Save an event to start.",started:"✓ Demo started; no camera was activated.",stopped:"✓ Demo finished; no stream occurred.",saleAdded:"✓ Fictional ticket added. Nobody paid.",giftAdded:"✓ Fictional gift added. No money collected.",close:"Close"},
 pt:{label:"LIVE PREMIUM · criador",empty:"Prepare sua primeira LIVE (rascunho local)",draft:"Rascunho salvo aqui",config:"CONFIGURAR LIVE",eyebrow:"CREATOR STUDIO · TESTE",title:"Organize sua LIVE PREMIUM",warning:"SIMULAÇÃO SEM COBRANÇAS: este evento é salvo apenas neste navegador. Os assinantes não podem vê-lo; não há transmissão, venda de ingressos ou pagamento real.",name:"Nome da LIVE",nameExample:"Ex.: Encontro exclusivo",desc:"Descrição",descExample:"O que vai acontecer durante o evento?",date:"Data e horário do evento",price:"Preço do ingresso (US$)",save:"SALVAR RASCUNHO",saved:"✓ Rascunho salvo neste dispositivo. Não foi publicado.",invalid:"Revise o nome, data e preço entre US$1 e US$500 (até duas casas decimais).",storage:"Não foi possível salvar neste navegador.",preview:"Prévia",noDraft:"Nenhum evento foi salvo.",scheduled:"PROGRAMADA · APENAS RASCUNHO",running:"TESTE INICIADO · SEM VÍDEO",ended:"TESTE FINALIZADO",controls:"Controles de teste",start:"Iniciar teste",stop:"Finalizar teste",sale:"+ 1 ingresso fictício",gift:"+ Presente fictício US$1",results:"Estatísticas fictícias",tickets:"Ingressos DEMO",gifts:"Presentes DEMO",gross:"Total simulado",creator:"Criador · 80%",platform:"AFTER SHIFT · 20%",note:"Estes números não são vendas nem ganhos reais. São reiniciados ao fechar. O preço só aparece no simulador deste navegador.",help:"Salve um evento para começar.",started:"✓ Teste iniciado; nenhuma câmera foi ativada.",stopped:"✓ Teste finalizado; não houve transmissão.",saleAdded:"✓ Ingresso fictício adicionado. Ninguém pagou.",giftAdded:"✓ Presente fictício adicionado. Nenhum dinheiro recebido.",close:"Fechar"}
};
function tr(){return copy[document.getElementById("uiLanguage")?.value]||copy.es;}
function el(tag,cls,txt){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e;}
function btn(cls){const e=el("button",cls);e.type="button";return e;}
function money(n){return "US$"+(n/100).toFixed(2).replace(".",document.getElementById("uiLanguage")?.value==="en"?".":",");}
function validDraft(v){
 return v&&typeof v.title==="string"&&v.title.trim()&&v.title.length<=80&&typeof v.description==="string"&&v.description.length<=280&&
 typeof v.at==="string"&&!Number.isNaN(Date.parse(v.at))&&Number.isInteger(v.priceCents)&&v.priceCents>=100&&v.priceCents<=50000;
}
function getDraft(creatorId){
 if(typeof creatorId!=="string"||!/^[\da-f-]{30,40}$/i.test(creatorId))return null;
 try{const v=JSON.parse(localStorage.getItem(prefix+creatorId));return validDraft(v)?{title:v.title,description:v.description,at:v.at,priceCents:v.priceCents}:null;}catch{return null;}
}
function parse(title,description,at,rawPrice){
 const numeric=Number(rawPrice),cents=Math.round(numeric*100);
 const v={title:title.trim(),description:description.trim(),at,priceCents:cents};
 return rawPrice&&Number.isFinite(numeric)&&Math.abs(numeric*100-cents)<.0001&&validDraft(v)?v:null;
}
function totals(draft,tickets,gifts){
 const gross=(draft?.priceCents||0)*tickets+100*gifts;
 const creator=Math.round(gross*.8);return {gross,creator,platform:gross-creator};
}
function tomorrow(){
 const d=new Date(Date.now()+86400000),p=n=>String(n).padStart(2,"0");
 return d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate())+"T"+p(d.getHours())+":"+p(d.getMinutes());
}
function open(creatorId,creatorName,updateBanner){
 if(document.getElementById("creatorLiveManager"))return;
 const prev=document.activeElement;let draft=getDraft(creatorId),mode="draft",sales=0,gifts=0,feedbackText="";
 const back=el("div","live-manager-overlay");back.id="creatorLiveManager";
 const card=el("section","live-manager-card");card.setAttribute("role","dialog");card.setAttribute("aria-modal","true");card.setAttribute("aria-labelledby","liveManagerHeading");
 const close=btn("live-manager-close");close.textContent="×";
 const eyebrow=el("div","live-manager-eyebrow"),heading=el("h2","live-manager-title");heading.id="liveManagerHeading";
 const warning=el("p","live-manager-warning");
 const form=el("form","live-manager-form");
 function field(tag,type){const label=el("label"),txt=el("span"),field=el(tag);if(type)field.type=type;label.append(txt,field);return {label,txt,field};}
 const title=field("input","text"),desc=field("textarea"),date=field("input","datetime-local"),cost=field("input","number");
 title.field.maxLength=80;title.field.required=true;desc.field.maxLength=280;desc.field.rows=2;
 date.field.required=true;cost.field.min="1";cost.field.max="500";cost.field.step=".01";cost.field.required=true;
 const dateRow=el("div","live-manager-date-row");dateRow.append(date.label,cost.label);
 const save=btn("live-manager-save");save.type="submit";
 form.append(title.label,desc.label,dateRow,save);
 const previewTitle=el("h3"),preview=el("div","live-manager-preview");
 const previewTag=el("span","live-manager-tag"),previewName=el("strong"),previewInfo=el("p");
 preview.append(previewTag,previewName,previewInfo);
 const controlTitle=el("h3"),controls=el("div","live-manager-controls");
 const start=btn("live-manager-control"),stop=btn("live-manager-control"),addSale=btn("live-manager-control"),addGift=btn("live-manager-control");
 controls.append(start,stop,addSale,addGift);
 const metricsTitle=el("h3"),metrics=el("div","live-manager-metrics"),cells={};
 ["tickets","gifts","gross","creator","platform"].forEach(key=>{
  const wrap=el("div","live-manager-metric"),label=el("span"),number=el("strong");
  wrap.append(label,number);metrics.append(wrap);cells[key]={label,number};
 });
 const status=el("p","live-manager-status");status.setAttribute("role","status");status.setAttribute("aria-live","polite");
 const note=el("p","live-manager-note");
 card.append(close,eyebrow,heading,warning,form,previewTitle,preview,controlTitle,controls,metricsTitle,metrics,status,note);
 back.append(card);document.body.append(back);
 title.field.value=draft?.title||"";desc.field.value=draft?.description||"";date.field.value=draft?.at||tomorrow();
 cost.field.value=draft?String(draft.priceCents/100):"5";
 function render(){
  const t=tr(),sum=totals(draft,sales,gifts);
  close.setAttribute("aria-label",t.close);eyebrow.textContent=t.eyebrow;heading.textContent=t.title;warning.textContent=t.warning;
  title.txt.textContent=t.name;title.field.placeholder=t.nameExample;desc.txt.textContent=t.desc;desc.field.placeholder=t.descExample;
  date.txt.textContent=t.date;cost.txt.textContent=t.price;save.textContent=t.save;
  previewTitle.textContent=t.preview;previewTag.textContent=mode==="started"?t.running:mode==="ended"?t.ended:t.scheduled;
  previewName.textContent=draft?.title||t.noDraft;
  previewInfo.textContent=draft?new Date(draft.at).toLocaleString(document.documentElement.lang,{dateStyle:"medium",timeStyle:"short"})+" · "+money(draft.priceCents)+" · "+creatorName:"";
  controlTitle.textContent=t.controls;
  start.textContent=t.start;stop.textContent=t.stop;addSale.textContent=t.sale;addGift.textContent=t.gift;
  start.disabled=!draft||mode==="started";stop.disabled=mode!=="started";addSale.disabled=mode!=="started";addGift.disabled=mode!=="started";
  metricsTitle.textContent=t.results;const values={tickets:String(sales),gifts:money(gifts*100),gross:money(sum.gross),creator:money(sum.creator),platform:money(sum.platform)};
  Object.keys(cells).forEach(key=>{cells[key].label.textContent=t[key];cells[key].number.textContent=values[key];});
  status.textContent=feedbackText||t.help;note.textContent=t.note;
 }
 form.onsubmit=e=>{
  e.preventDefault();
  const v=parse(title.field.value,desc.field.value,date.field.value,cost.field.value);
  if(!v){feedbackText=tr().invalid;render();return;}
  try{localStorage.setItem(prefix+creatorId,JSON.stringify(v));}
  catch{feedbackText=tr().storage;render();return;}
  draft=v;mode="draft";sales=0;gifts=0;feedbackText=tr().saved;updateBanner();render();
 };
 start.onclick=()=>{if(!draft)return;mode="started";sales=0;gifts=0;feedbackText=tr().started;render();};
 stop.onclick=()=>{if(mode!=="started")return;mode="ended";feedbackText=tr().stopped;render();};
 addSale.onclick=()=>{if(mode!=="started"||sales>=1000)return;sales++;feedbackText=tr().saleAdded;render();};
 addGift.onclick=()=>{if(mode!=="started"||gifts>=1000)return;gifts++;feedbackText=tr().giftAdded;render();};
 function finish(){
  document.removeEventListener("keydown",onKey);
  document.getElementById("uiLanguage")?.removeEventListener("change",onLanguage);
  back.remove();if(prev?.isConnected)prev.focus();
 }
 function onKey(e){if(e.key==="Escape"){e.preventDefault();finish();}}
 function onLanguage(){feedbackText="";render();}
 close.onclick=finish;back.onclick=e=>{if(e.target===back)finish();};
 document.addEventListener("keydown",onKey);
 document.getElementById("uiLanguage")?.addEventListener("change",onLanguage);
 render();close.focus();
}
function mount(overlay,{creatorId,creatorName}={}){
 const profile=overlay.querySelector(".creator-studio .studio-profile");
 if(!profile||overlay.querySelector(".creator-live-manager-banner"))return;
 const banner=el("section","creator-live-manager-banner"),info=el("div","creator-live-manager-info");
 const title=el("strong"),subtitle=el("p"),trigger=btn("creator-live-manager-trigger");
 info.append(title,subtitle);banner.append(info,trigger);
 profile.insertAdjacentElement("afterend",banner);
 function update(){
  const t=tr(),draft=getDraft(creatorId);
  title.textContent=t.label;subtitle.textContent=draft?t.draft+": "+draft.title+" · "+money(draft.priceCents):t.empty;
  trigger.textContent=t.config;
 }
 trigger.onclick=()=>open(creatorId,creatorName,update);
 const selector=document.getElementById("uiLanguage");
 selector?.addEventListener("change",update);
 const cleanup=new MutationObserver(()=>{
  if(!overlay.isConnected){selector?.removeEventListener("change",update);cleanup.disconnect();}
 });
 cleanup.observe(document.body,{childList:true});
 update();
}
window.AfterShiftLiveManager={mount,getDraft,parse,totals};
})();
