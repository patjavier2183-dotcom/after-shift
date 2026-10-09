/* AFTER SHIFT V27 · Creator LIVE management DEMO. Only local drafts, no streaming, no payments, no Supabase writes. */
(function(){
"use strict";
const prefix="aftershift-v27-live-draft-";
const copy={
 es:{label:"LIVE PREMIUM · creador",empty:"Prepara tu primer LIVE (borrador local)",draft:"Borrador guardado aquí",config:"CONFIGURAR LIVE",eyebrow:"CREATOR STUDIO · PRUEBA",title:"Organiza tu LIVE PREMIUM",warning:"PRUEBA LOCAL SIN COBROS: al iniciar te pedirá permiso para encender la cámara. Solo tú verás la imagen. No transmite a suscriptores ni vende entradas.",name:"Nombre del LIVE",nameExample:"Ej. Encuentro exclusivo",desc:"Descripción",descExample:"¿Qué ocurrirá durante este evento?",date:"Fecha y hora del evento",price:"Precio de entrada (US$)",save:"GUARDAR BORRADOR",saved:"✓ Borrador guardado en este dispositivo. No se publicó.",invalid:"Revisa el nombre, fecha y precio entre US$1 y US$500 (máximo dos decimales).",storage:"No se pudo guardar en este navegador.",preview:"Resumen del LIVE",noDraft:"Todavía no hay ningún evento guardado.",scheduled:"PROGRAMADO · SOLO BORRADOR",running:"CÁMARA ENCENDIDA · NO TRANSMITE",ended:"PRUEBA FINALIZADA",controls:"Controles de prueba",start:"Iniciar prueba con cámara",stop:"Finalizar prueba",sale:"+ 1 entrada ficticia",gift:"+ Regalo ficticio US$1",results:"Estadísticas ficticias",tickets:"Entradas DEMO",gifts:"Regalos DEMO",gross:"Total simulado",creator:"Creador · 80%",platform:"AFTER SHIFT · 20%",note:"Estas cifras no son ventas ni ganancias reales. Se reinician al cerrar esta ventana. El precio solo se refleja en el simulador del mismo navegador.",help:"Guarda un evento para comenzar.",started:"✓ Cámara encendida. Solo puedes verla tú. No se transmite ni se graba.",stopped:"✓ Cámara apagada. No se realizó ninguna transmisión.",saleAdded:"✓ Entrada ficticia añadida. Nadie pagó.",giftAdded:"✓ Regalo ficticio añadido. No se recaudó dinero.",camHeading:"Tu cámara en directo (solo para ti)",camCaption:"Solo vista local · Nadie más puede verte · No se graba",camWaiting:"Solicitando permiso para acceder a la cámara...",camUnsupported:"Este navegador no admite acceso a la cámara. Abre AFTER SHIFT en Chrome con HTTPS.",camDenied:"No se pudo encender la cámara. Revisa los permisos de cámara en el navegador.",camEnded:"La cámara se desconectó y se apagó.",close:"Cerrar"},
 en:{label:"PREMIUM LIVE · creator",empty:"Plan your first LIVE (local draft)",draft:"Draft saved here",config:"SET UP LIVE",eyebrow:"CREATOR STUDIO · DEMO",title:"Plan your PREMIUM LIVE",warning:"LOCAL NO-CHARGE DEMO: starting requests camera permission. Only you will see the video; no subscribers, broadcasts or ticket sales.",name:"LIVE title",nameExample:"e.g. Exclusive meetup",desc:"Description",descExample:"What will happen during the event?",date:"Event date and time",price:"Ticket price (US$)",save:"SAVE DRAFT",saved:"✓ Draft saved on this device. It was not published.",invalid:"Check title, date and price between US$1 and US$500 (up to two decimals).",storage:"Could not save in this browser.",preview:"LIVE summary",noDraft:"No event has been saved yet.",scheduled:"SCHEDULED · LOCAL DRAFT ONLY",running:"CAMERA ON · NOT BROADCASTING",ended:"DEMO FINISHED",controls:"Demo controls",start:"Start camera test",stop:"End demo",sale:"+ 1 fictional ticket",gift:"+ US$1 fictional gift",results:"Fictional statistics",tickets:"DEMO tickets",gifts:"DEMO gifts",gross:"Simulated gross",creator:"Creator · 80%",platform:"AFTER SHIFT · 20%",note:"These are not real sales or earnings. They reset when you close this window. The price is available only to the demo in this browser.",help:"Save an event to start.",started:"✓ Camera on. Visible to you only; no streaming or recording.",stopped:"✓ Camera off. No broadcast took place.",saleAdded:"✓ Fictional ticket added. Nobody paid.",giftAdded:"✓ Fictional gift added. No money collected.",camHeading:"Your live camera (local preview)",camCaption:"Local preview only · Nobody else can watch · Not recorded",camWaiting:"Requesting camera permission...",camUnsupported:"This browser does not support camera access. Open AFTER SHIFT over HTTPS in Chrome.",camDenied:"Could not start camera. Check your browser camera permissions.",camEnded:"Camera disconnected and was turned off.",close:"Close"},
 pt:{label:"LIVE PREMIUM · criador",empty:"Prepare sua primeira LIVE (rascunho local)",draft:"Rascunho salvo aqui",config:"CONFIGURAR LIVE",eyebrow:"CREATOR STUDIO · TESTE",title:"Organize sua LIVE PREMIUM",warning:"TESTE LOCAL SEM COBRANÇAS: ao iniciar será solicitada permissão para a câmera. Só você verá a imagem. Não há transmissão nem vendas.",name:"Nome da LIVE",nameExample:"Ex.: Encontro exclusivo",desc:"Descrição",descExample:"O que vai acontecer durante o evento?",date:"Data e horário do evento",price:"Preço do ingresso (US$)",save:"SALVAR RASCUNHO",saved:"✓ Rascunho salvo neste dispositivo. Não foi publicado.",invalid:"Revise o nome, data e preço entre US$1 e US$500 (até duas casas decimais).",storage:"Não foi possível salvar neste navegador.",preview:"Resumo da LIVE",noDraft:"Nenhum evento foi salvo.",scheduled:"PROGRAMADA · APENAS RASCUNHO",running:"CÂMERA LIGADA · SEM TRANSMISSÃO",ended:"TESTE FINALIZADO",controls:"Controles de teste",start:"Iniciar teste da câmera",stop:"Finalizar teste",sale:"+ 1 ingresso fictício",gift:"+ Presente fictício US$1",results:"Estatísticas fictícias",tickets:"Ingressos DEMO",gifts:"Presentes DEMO",gross:"Total simulado",creator:"Criador · 80%",platform:"AFTER SHIFT · 20%",note:"Estes números não são vendas nem ganhos reais. São reiniciados ao fechar. O preço só aparece no simulador deste navegador.",help:"Salve um evento para começar.",started:"✓ Câmera ligada. Só você pode ver. Não transmite nem grava.",stopped:"✓ Câmera desligada. Não houve transmissão.",saleAdded:"✓ Ingresso fictício adicionado. Ninguém pagou.",giftAdded:"✓ Presente fictício adicionado. Nenhum dinheiro recebido.",camHeading:"Sua câmera ao vivo (prévia local)",camCaption:"Somente prévia local · Ninguém mais vê · Não é gravado",camWaiting:"Solicitando permissão para usar a câmera...",camUnsupported:"Este navegador não oferece acesso à câmera. Abra AFTER SHIFT no Chrome com HTTPS.",camDenied:"Não foi possível iniciar a câmera. Verifique as permissões.",camEnded:"A câmera foi desconectada e desligada.",close:"Fechar"}
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
 const prev=document.activeElement;let draft=getDraft(creatorId),mode="draft",sales=0,gifts=0,feedbackText="",cameraStream=null,cameraPending=false,closed=false,requestId=0;
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
 const camWrap=el("section","live-manager-camera");camWrap.hidden=true;
 const camHeading=el("h3","live-manager-camera-heading"),camVideo=el("video","live-manager-camera-video"),camCaption=el("p","live-manager-camera-caption");
 camVideo.autoplay=true;camVideo.playsInline=true;camVideo.muted=true;camVideo.disablePictureInPicture=true;
 camVideo.setAttribute("playsinline","");camVideo.setAttribute("aria-label","Solo vista previa de tu cámara");
 camWrap.append(camHeading,camVideo,camCaption);
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
 card.append(close,eyebrow,heading,warning,form,previewTitle,preview,camWrap,controlTitle,controls,metricsTitle,metrics,status,note);
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
  camWrap.hidden=mode!=="started";camHeading.textContent=t.camHeading;camCaption.textContent=t.camCaption;
  controlTitle.textContent=t.controls;
  start.textContent=t.start;stop.textContent=t.stop;addSale.textContent=t.sale;addGift.textContent=t.gift;
  start.disabled=!draft||mode==="started"||cameraPending;stop.disabled=mode!=="started";addSale.disabled=mode!=="started";addGift.disabled=mode!=="started";
  metricsTitle.textContent=t.results;const values={tickets:String(sales),gifts:money(gifts*100),gross:money(sum.gross),creator:money(sum.creator),platform:money(sum.platform)};
  Object.keys(cells).forEach(key=>{cells[key].label.textContent=t[key];cells[key].number.textContent=values[key];});
  status.textContent=feedbackText||t.help;note.textContent=t.note;
 }
 function stopCamera(){
  if(cameraStream){cameraStream.getTracks().forEach(track=>track.stop());cameraStream=null;}
  camVideo.pause();camVideo.srcObject=null;camWrap.hidden=true;
 }
 async function startCamera(){
  if(!draft||closed||cameraPending||mode==="started")return;
  if(!navigator.mediaDevices?.getUserMedia){feedbackText=tr().camUnsupported;render();return;}
  const myRequest=++requestId;cameraPending=true;feedbackText=tr().camWaiting;render();
  try{
   const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user"},audio:false});
   if(closed||myRequest!==requestId){stream.getTracks().forEach(track=>track.stop());return;}
   cameraStream=stream;
   stream.getVideoTracks()[0]?.addEventListener("ended",()=>{
     if(!closed&&cameraStream===stream){stopCamera();mode="ended";feedbackText=tr().camEnded;render();}
   },{once:true});
   camVideo.srcObject=stream;mode="started";sales=0;gifts=0;feedbackText=tr().started;
   render();
   await camVideo.play().catch(()=>{});
  }catch(error){
   if(!closed&&myRequest===requestId){stopCamera();mode="draft";feedbackText=tr().camDenied;render();}
  }finally{if(myRequest===requestId){cameraPending=false;if(!closed)render();}}
 }
 form.onsubmit=e=>{
  e.preventDefault();
  const v=parse(title.field.value,desc.field.value,date.field.value,cost.field.value);
  if(!v){feedbackText=tr().invalid;render();return;}
  try{localStorage.setItem(prefix+creatorId,JSON.stringify(v));}
  catch{feedbackText=tr().storage;render();return;}
  requestId++;cameraPending=false;stopCamera();draft=v;mode="draft";sales=0;gifts=0;feedbackText=tr().saved;updateBanner();render();
 };
 start.onclick=()=>{void startCamera();};
 stop.onclick=()=>{if(mode!=="started")return;requestId++;cameraPending=false;stopCamera();mode="ended";feedbackText=tr().stopped;render();};
 addSale.onclick=()=>{if(mode!=="started"||sales>=1000)return;sales++;feedbackText=tr().saleAdded;render();};
 addGift.onclick=()=>{if(mode!=="started"||gifts>=1000)return;gifts++;feedbackText=tr().giftAdded;render();};
 function finish(){
  if(closed)return;closed=true;requestId++;stopCamera();
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
