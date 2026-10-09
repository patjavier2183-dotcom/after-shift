/* AFTER SHIFT V0: pricing drafts only, no real payments or subscriptions. */
(function(){
"use strict";
const MIN_COMMERCIAL_PRICE=4.99;
const terms=[{m:1,label:"Mensual",discount:0},{m:3,label:"3 meses",discount:5},{m:6,label:"6 meses",discount:10},{m:12,label:"Anual",discount:20}];
const offerDurations={h24:24*60*60*1000,d3:3*24*60*60*1000,d7:7*24*60*60*1000,always:null};
const defaults=()=>({price:9.99,offer:true,offerDiscount:10,offerDuration:"h24",offerStartedAt:null,offerEndsAt:null,terms:terms.map(t=>({m:t.m,enabled:true,discount:t.discount}))});
const key=id=>"aftershift-v0-pricing-"+id;
function normalize(data){
 const d=defaults();if(!data||typeof data!=="object")return d;
 const p=Number(data.price),o=Number(data.offerDiscount);
 if(Number.isFinite(p)&&p>=0&&p<=10000)d.price=Math.max(MIN_COMMERCIAL_PRICE,Math.round(p*100)/100);
 if(Number.isInteger(o)&&o>=0&&o<=50)d.offerDiscount=o;
 d.offer=data.offer!==false;
 d.offerDuration=Object.hasOwn(offerDurations,data.offerDuration)?data.offerDuration:"h24";
 // Legacy drafts have no start date: never invent past campaign activation.
 const start=Number(data.offerStartedAt),end=Number(data.offerEndsAt);
 if(d.offer&&Number.isSafeInteger(start)&&start>0){
   if(d.offerDuration==="always"){
     d.offerStartedAt=start;
     d.offerEndsAt=null;
   }else if(Number.isSafeInteger(end)&&end===start+offerDurations[d.offerDuration]){
     d.offerStartedAt=start;
     d.offerEndsAt=end;
   }
 }
 d.terms=d.terms.map(t=>{const v=Array.isArray(data.terms)?data.terms.find(x=>x&&x.m===t.m):null;
  const n=Number(v?.discount);return {m:t.m,enabled:v?v.enabled!==false:true,
   discount:Number.isInteger(n)&&n>=0&&n<=50?n:t.discount};});
 return d;
}
function get(id){try{return normalize(JSON.parse(localStorage.getItem(key(id))))}catch{return defaults()}}
function hasSaved(id){try{return localStorage.getItem(key(id))!==null}catch{return false}}
function save(id,d){try{localStorage.setItem(key(id),JSON.stringify(d));return true}catch{return false}}
function money(amount){return "US$"+Number(amount).toFixed(2).replace(".",",")}
function campaignStatus(d,at=Date.now()){
 if(!d.offer)return "off";
 if(!d.offerStartedAt)return "pending";
 if(d.offerDuration!=="always"&&Number.isFinite(d.offerEndsAt)&&at>=d.offerEndsAt)return "expired";
 return "active";
}
function buildCampaign(previous,next,at=Date.now(),forceRestart=false){
 const draft={...next};
 if(!draft.offer){draft.offerStartedAt=null;draft.offerEndsAt=null;return draft;}
 const same=previous&&previous.offer&&previous.offerDuration===draft.offerDuration;
 // Ordinary saves never extend the countdown. An expired campaign requires explicit reactivation.
 if(same&&previous.offerStartedAt&&!forceRestart){
   draft.offerStartedAt=previous.offerStartedAt;
   draft.offerEndsAt=previous.offerEndsAt;
   return draft;
 }
 draft.offerStartedAt=at;
 draft.offerEndsAt=offerDurations[draft.offerDuration]===null?null:at+offerDurations[draft.offerDuration];
 return draft;
}
function offerDate(ts){return new Date(ts).toLocaleString("es-CL",{dateStyle:"medium",timeStyle:"short"});}
function totals(d){const cents=Math.round(d.price*100);
 return d.terms.filter(t=>t.enabled).map(t=>({m:t.m,discount:t.discount,total:Math.round(cents*t.m*(100-t.discount)/100)/100}));
}
function open(parent,creatorId){
 let committed=get(creatorId);
 const old=committed,overlay=document.createElement("div");
 let restartCampaign=false;
 overlay.className="form-overlay";
 const options=terms.map(t=>{const p=old.terms.find(x=>x.m===t.m);
  return '<div class="as-plan-row"><label><input type="checkbox" data-months="'+t.m+'" '+(p.enabled?'checked':'')+'> '+t.label+'</label>'+
    '<label>Descuento <input type="number" inputmode="numeric" min="0" max="50" step="1" data-off="'+t.m+'" value="'+p.discount+'" required> %</label></div>';
 }).join("");
 overlay.innerHTML='<section class="post-form as-pricing" role="dialog" aria-modal="true" aria-labelledby="asPriceTitle">'+
  '<button class="profile-close" id="closePricing" type="button" aria-label="Cerrar">×</button>'+
  '<div class="eyebrow">CREATOR STUDIO · V0</div><h2 id="asPriceTitle">Planes y promociones</h2>'+
  '<p class="as-help">Simulación para preparar ofertas. No genera pagos ni suscripciones. Precio comercial mínimo: US$4,99 al mes.</p>'+ 
  '<form id="asPricingForm"><label>Precio mensual de referencia (US$)<input id="asBasePrice" type="number" inputmode="decimal" min="4.99" max="10000" step="0.01" required value="'+old.price.toFixed(2)+'"></label>'+
  '<h3>Plazos y descuentos</h3>'+options+
  '<h3>Oferta de bienvenida</h3>'+
  '<div class="as-plan-row as-intro"><label><input id="asIntroOn" type="checkbox" '+(old.offer?'checked':'')+'> Descuento para nuevos suscriptores</label>'+
  '<label>Descuento <input id="asIntroPct" type="number" inputmode="numeric" min="0" max="50" step="1" required value="'+old.offerDiscount+'"> %</label></div>'+
  '<label class="as-offer-duration">¿Cuánto tiempo estará disponible la oferta?'+
  '<select id="asOfferDuration" aria-label="Duración de la oferta">'+
  '<option value="h24" '+(old.offerDuration==="h24"?"selected":"")+'>24 horas</option>'+
  '<option value="d3" '+(old.offerDuration==="d3"?"selected":"")+'>3 días</option>'+
  '<option value="d7" '+(old.offerDuration==="d7"?"selected":"")+'>7 días</option>'+
  '<option value="always" '+(old.offerDuration==="always"?"selected":"")+'>Bienvenida permanente</option>'+
  '</select></label>'+
  '<div class="as-offer-status" id="asOfferStatus" role="status" aria-live="polite"></div>'+
  '<button class="action-btn as-restart-offer" id="asRestartOffer" type="button" hidden>Reactivar oferta vencida</button>'+
  '<h3>Vista previa</h3><div id="asPreview" class="as-preview" aria-live="polite"></div>'+
  '<p class="as-help">La oferta se puede contratar durante el plazo elegido, pero el descuento se aplica solo al primer mes de una suscripción mensual. Los planes de 3, 6 y 12 meses mantienen sus descuentos propios, sin acumulación. El vencimiento se calcula al guardar y no se extiende automáticamente.</p>'+
  '<div id="asPricingMsg" class="form-msg" role="status" aria-live="polite"></div>'+
  '<div class="form-actions"><button type="button" class="action-btn" id="asCancelPricing">Cancelar</button><button type="submit" class="action-btn action-primary">GUARDAR BORRADOR</button></div>'+
  '<p class="as-help">El precio propuesto aparece en Creator Studio al guardar. Solo se guarda en este navegador; tu suscripción activa de prueba sigue siendo gratuita.</p></form></section>';
 parent.appendChild(overlay);
 const close=()=>overlay.remove();
 overlay.querySelector("#closePricing").onclick=close;
 overlay.querySelector("#asCancelPricing").onclick=close;
 overlay.addEventListener("click",e=>{if(e.target===overlay)close()});
 const form=overlay.querySelector("#asPricingForm");
 function read(){
  const b=overlay.querySelector("#asBasePrice"),p=overlay.querySelector("#asIntroPct");
  const price=Number(b.value),pct=Number(p.value);
  if(!b.value||!Number.isFinite(price)||price<MIN_COMMERCIAL_PRICE||price>10000||Math.abs(price*100-Math.round(price*100))>.0001)return null;
  if(!Number.isInteger(pct)||pct<0||pct>50)return null;
  const parsed=terms.map(t=>{const n=overlay.querySelector('[data-off="'+t.m+'"]'),on=overlay.querySelector('[data-months="'+t.m+'"]');
    return {m:t.m,enabled:on.checked,discount:n.value===""?0:Number(n.value)};});
  if(!parsed.some(t=>t.enabled)||parsed.some(t=>!Number.isInteger(t.discount)||t.discount<0||t.discount>50))return null;
  return {price:Math.round(price*100)/100,offer:overlay.querySelector("#asIntroOn").checked,offerDiscount:pct,
    offerDuration:overlay.querySelector("#asOfferDuration").value,terms:parsed};
 }
 function previewCampaign(d){
   if(!d||!d.offer)return {phase:"off",draft:d};
   const same=committed.offer&&committed.offerDuration===d.offerDuration&&!restartCampaign;
   if(same&&committed.offerStartedAt){
     const draft={...d,offerStartedAt:committed.offerStartedAt,offerEndsAt:committed.offerEndsAt};
     return {phase:campaignStatus(draft),draft};
   }
   return {phase:"pending",draft:d};
 }
 function refresh(){
  const d=read(),target=overlay.querySelector("#asPreview");
  const status=overlay.querySelector("#asOfferStatus"),restart=overlay.querySelector("#asRestartOffer");
  if(!d){
   target.textContent="Revisa el precio mínimo de US$4,99, los descuentos de 0 a 50% y los plazos activos.";
   status.textContent="";
   restart.hidden=true;
   return;
  }
  const campaign=previewCampaign(d);
  const cards=totals(d).map(t=>'<div class="as-price-card"><strong>'+terms.find(o=>o.m===t.m).label+
   '</strong><span>'+t.discount+'% descuento</span><b>'+money(t.total)+'</b><small>'+(t.m===1?'Por mes':'Total por '+t.m+' meses')+'</small></div>');
  if(d.offer&&d.terms.find(t=>t.m===1)?.enabled&&campaign.phase!=="expired"){
    const sum=Math.round(Math.round(d.price*100)*(100-d.offerDiscount)/100)/100;
    cards.push('<div class="as-price-card as-welcome"><strong>Primer mes</strong><span>'+d.offerDiscount+'% bienvenida</span><b>'+money(sum)+'</b><small>'+(campaign.phase==="pending"?"Pendiente de guardar":"Oferta en borrador · nuevos suscriptores")+'</small></div>');
  }
  target.innerHTML=cards.join("");
  if(campaign.phase==="off")status.textContent="Oferta desactivada. Los planes siguen disponibles.";
  if(campaign.phase==="pending")status.textContent="Oferta pendiente de guardar. Su plazo comenzará al guardar este borrador.";
  if(campaign.phase==="active"&&d.offerDuration==="always")status.textContent="Oferta de bienvenida permanente (borrador local).";
  if(campaign.phase==="active"&&d.offerDuration!=="always")status.textContent="Vence el "+offerDate(campaign.draft.offerEndsAt)+" (hora de tu dispositivo). No está publicada.";
  if(campaign.phase==="expired")status.textContent="Oferta vencida el "+offerDate(campaign.draft.offerEndsAt)+". No se muestra el precio promocional.";
  restart.hidden=campaign.phase!=="expired";
 }
 const percentInputs=overlay.querySelectorAll("input[data-off], #asIntroPct");
 percentInputs.forEach(input=>{
  input.addEventListener("focus",()=>{try{input.select()}catch{}});
  input.addEventListener("input",()=>{if(input.value==="")input.value="0"});
  input.addEventListener("blur",()=>{if(input.value==="")input.value="0";if(Number.isFinite(Number(input.value))&&Number(input.value)>=0&&Number(input.value)<=50)input.value=String(Number(input.value));refresh()});
 });
 form.addEventListener("input",refresh);form.addEventListener("change",refresh);
 overlay.querySelector("#asRestartOffer").onclick=()=>{
   restartCampaign=true;
   overlay.querySelector("#asPricingMsg").textContent="La oferta se reactivará al guardar. Se calculará un nuevo vencimiento.";
   refresh();
 };
 const durationInput=overlay.querySelector("#asOfferDuration");
 durationInput.addEventListener("change",()=>{restartCampaign=false;refresh()});
 // Keep the displayed expiry correct while the dialog remains open.
 const ticker=setInterval(()=>{if(!overlay.isConnected){clearInterval(ticker);return;}refresh();},30000);
 const beforeClose=close;
 overlay.querySelector("#closePricing").onclick=()=>{clearInterval(ticker);beforeClose()};
 overlay.querySelector("#asCancelPricing").onclick=()=>{clearInterval(ticker);beforeClose()};
 form.onsubmit=e=>{e.preventDefault();const d=read(),msg=overlay.querySelector("#asPricingMsg");
  if(!d){msg.textContent="Revisa los valores antes de guardar.";return;}
  const saved=buildCampaign(committed,d,Date.now(),restartCampaign);
  const ok=save(creatorId,saved);
  msg.textContent=ok?"Borrador guardado. Se actualizó el precio propuesto y la vigencia de la oferta. No se realizó ningún cobro.":"No se pudo guardar en este navegador.";
  if(ok){
    committed=saved;restartCampaign=false;
    const label=parent.querySelector("#studioDraftPrice");if(label)label.textContent=money(d.price);
    refresh();
  }
 };
 refresh();
}
window.AfterShiftPricing={open:open,defaults:defaults,normalize:normalize,totals:totals,get:get,hasSaved:hasSaved,MIN_COMMERCIAL_PRICE:MIN_COMMERCIAL_PRICE,offerDurations:offerDurations,campaignStatus:campaignStatus,buildCampaign:buildCampaign};
})();