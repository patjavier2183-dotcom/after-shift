/* AFTER SHIFT V0: pricing drafts only, no real payments or subscriptions. */
(function(){
"use strict";
const MIN_COMMERCIAL_PRICE=4.99;
const terms=[{m:1,label:"Mensual",discount:0},{m:3,label:"3 meses",discount:5},{m:6,label:"6 meses",discount:10},{m:12,label:"Anual",discount:20}];
const defaults=()=>({price:9.99,offer:true,offerDiscount:10,terms:terms.map(t=>({m:t.m,enabled:true,discount:t.discount}))});
const key=id=>"aftershift-v0-pricing-"+id;
function normalize(data){
 const d=defaults();if(!data||typeof data!=="object")return d;
 const p=Number(data.price),o=Number(data.offerDiscount);
 if(Number.isFinite(p)&&p>=0&&p<=10000)d.price=Math.max(MIN_COMMERCIAL_PRICE,Math.round(p*100)/100);
 if(Number.isInteger(o)&&o>=0&&o<=50)d.offerDiscount=o;
 d.offer=data.offer!==false;
 d.terms=d.terms.map(t=>{const v=Array.isArray(data.terms)?data.terms.find(x=>x&&x.m===t.m):null;
  const n=Number(v?.discount);return {m:t.m,enabled:v?v.enabled!==false:true,
   discount:Number.isInteger(n)&&n>=0&&n<=50?n:t.discount};});
 return d;
}
function get(id){try{return normalize(JSON.parse(localStorage.getItem(key(id))))}catch{return defaults()}}
function hasSaved(id){try{return localStorage.getItem(key(id))!==null}catch{return false}}
function save(id,d){try{localStorage.setItem(key(id),JSON.stringify(d));return true}catch{return false}}
function money(amount){return "US$"+Number(amount).toFixed(2).replace(".",",")}
function totals(d){const cents=Math.round(d.price*100);
 return d.terms.filter(t=>t.enabled).map(t=>({m:t.m,discount:t.discount,total:Math.round(cents*t.m*(100-t.discount)/100)/100}));
}
function open(parent,creatorId){
 const old=get(creatorId),overlay=document.createElement("div");
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
  '<div class="as-plan-row as-intro"><label><input id="asIntroOn" type="checkbox" '+(old.offer?'checked':'')+'> Oferta de bienvenida (primer mes)</label>'+
  '<label>Descuento <input id="asIntroPct" type="number" inputmode="numeric" min="0" max="50" step="1" required value="'+old.offerDiscount+'"> %</label></div>'+
  '<h3>Vista previa</h3><div id="asPreview" class="as-preview" aria-live="polite"></div>'+
  '<p class="as-help">Los descuentos de 3, 6 y 12 meses se aplican al total anticipado del periodo. La promoción del primer mes es solo para nuevos suscriptores y no se acumula con otros descuentos.</p>'+
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
  return {price:Math.round(price*100)/100,offer:overlay.querySelector("#asIntroOn").checked,offerDiscount:pct,terms:parsed};
 }
 function refresh(){
  const d=read(),target=overlay.querySelector("#asPreview");
  if(!d){target.textContent="Revisa el precio mínimo de US$4,99, los descuentos de 0 a 50% y los plazos activos.";return;}
  const cards=totals(d).map(t=>'<div class="as-price-card"><strong>'+terms.find(o=>o.m===t.m).label+
   '</strong><span>'+t.discount+'% descuento</span><b>'+money(t.total)+'</b><small>'+(t.m===1?'Por mes':'Total por '+t.m+' meses')+'</small></div>');
  if(d.offer&&d.terms.find(t=>t.m===1)?.enabled){
    const sum=Math.round(Math.round(d.price*100)*(100-d.offerDiscount)/100)/100;
    cards.push('<div class="as-price-card as-welcome"><strong>Primer mes</strong><span>'+d.offerDiscount+'% bienvenida</span><b>'+money(sum)+'</b><small>Solo nuevos suscriptores</small></div>');
  }
  target.innerHTML=cards.join("");
 }
 const percentInputs=overlay.querySelectorAll("input[data-off], #asIntroPct");
 percentInputs.forEach(input=>{
  input.addEventListener("focus",()=>{try{input.select()}catch{}});
  input.addEventListener("input",()=>{if(input.value==="")input.value="0"});
  input.addEventListener("blur",()=>{if(input.value==="")input.value="0";if(Number.isFinite(Number(input.value))&&Number(input.value)>=0&&Number(input.value)<=50)input.value=String(Number(input.value));refresh()});
 });
 form.addEventListener("input",refresh);form.addEventListener("change",refresh);
 form.onsubmit=e=>{e.preventDefault();const d=read(),msg=overlay.querySelector("#asPricingMsg");
  if(!d){msg.textContent="Revisa los valores antes de guardar.";return;}
  const ok=save(creatorId,d);
  msg.textContent=ok?"Borrador guardado. El precio propuesto ya aparece en Creator Studio. No se realizó ningún cobro.":"No se pudo guardar en este navegador.";
  if(ok){const label=parent.querySelector("#studioDraftPrice");if(label)label.textContent=money(d.price);}
 };
 refresh();
}
window.AfterShiftPricing={open:open,defaults:defaults,normalize:normalize,totals:totals,get:get,hasSaved:hasSaved,MIN_COMMERCIAL_PRICE:MIN_COMMERCIAL_PRICE};
})();