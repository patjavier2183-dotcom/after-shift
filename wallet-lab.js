/* AFTER SHIFT V25 · Isolated UI-only coin simulation.
   NO REAL MONEY, NO FINANCIAL ACCOUNT, NO SERVER OR SUBSCRIPTION WRITES.
   Numbers are examples until a payment processor, terms and compliance are approved. */
(function(){
"use strict";
const PACKS=[50,100,200],CENT_PER_COIN=10,FEE_BPS=500,CREATOR_PERCENT=80;
const messages={
 es:{
  trigger:"🪙 Comprar monedas",eyebrow:"AFTER SHIFT · COMPRA DE PRUEBA",title:"Comprar paquetes de monedas",
  warning:"MODO PRUEBA · Aquí no se cobra dinero real. Elegir un paquete simula una compra: no crea monedas reales, transferencias ni acceso a videos. El saldo se elimina al cerrar.",
  how:"Después de simular una compra, prueba los regalos para LIVE, propinas o una publicación DEMO.",
  packs:"Elige tu paquete",pack:(coins,charge)=>coins+" monedas · "+charge,packQty:n=>n+" monedas",packCTA:"SIMULAR COMPRA",packNominal:"Valor de monedas",
  packInfo:"Precios de ejemplo en USD (no definitivos). 1 moneda = US$0,10; el total ilustrativo incluye una tarifa de recarga del 5%. No se realiza ningún pago.",
  live:"Regalos para LIVE (prueba)",notLive:"Esta es una simulación de regalos; todavía no hay transmisiones reales.",
  heart:"❤️ Corazón",star:"⭐ Estrella",diamond:"💎 Diamante",crown:"👑 Corona",
  more:"También puedes probar",tip:"💛 Propina de 20 monedas",post:"🎬 Publicación DEMO · 30 monedas",bought:"✓ Comprada en la prueba",
  noUnlock:"Esta compra solo cambia el indicador DEMO; no permite abrir videos ni contenido privado.",
  balance:"Saldo de prueba",charged:"Pago simulado al recargar",fee:"Tarifas de servicio simuladas",
  redeemed:"Valor gastado",creator:"A favor del creador (80% del gasto)",commission:"Comisión AFTER SHIFT (20% del gasto)",
  platform:"AFTER SHIFT total simulado",pending:"Monedas sin gastar",history:"Movimientos de esta prueba",
  ready:"Selecciona un paquete de monedas para empezar.",chargeOk:(n,p)=>"✓ Recarga ficticia: "+n+" monedas. Total simulado "+p+".",
  actionOk:(what,n)=>"✓ "+what+": "+n+" monedas usadas.",
  insufficient:"No tienes suficientes monedas de prueba. Simula una recarga antes de continuar.",
  duplicate:"Esta publicación DEMO ya fue comprada en esta prueba.",empty:"Sin movimientos todavía.",
  fine:"Ejemplo: al recargar 100 monedas, el usuario pagaría US$10,50: US$10 de valor y US$0,50 de tarifa. Si gasta las 100, corresponderían US$8 al creador y US$2 de comisión a AFTER SHIFT. Los montos de la plataforma son brutos, antes de costos, impuestos, devoluciones y posibles obligaciones sobre saldo no utilizado.",
  reset:"Reiniciar prueba",close:"Cerrar prueba",unspentNote:"El saldo restante no es utilidad realizada. Tampoco permite retirar efectivo.",
 },
 en:{
  trigger:"🪙 Buy coins",eyebrow:"AFTER SHIFT · PURCHASE DEMO",title:"Buy coin packages",
  warning:"DEMO MODE · No real money is charged. Selecting a package simulates a purchase: no real coins, transfers or private video access. Balance resets on close.",
  how:"After simulating a purchase, try LIVE gifts, tips or an individual DEMO post.",
  packs:"Choose your package",pack:(coins,charge)=>coins+" coins · "+charge,packQty:n=>n+" coins",packCTA:"SIMULATE PURCHASE",packNominal:"Coin value",
  packInfo:"Illustrative USD prices (not final). 1 coin = US$0.10; the example total includes a 5% top-up fee. No payment occurs.",
  live:"LIVE gifts (demo)",notLive:"This is a gift simulation; real live streams are not available yet.",
  heart:"❤️ Heart",star:"⭐ Star",diamond:"💎 Diamond",crown:"👑 Crown",
  more:"Other demo uses",tip:"💛 Tip 20 coins",post:"🎬 DEMO post · 30 coins",bought:"✓ Bought in demo",
  noUnlock:"This DEMO purchase changes only the test indicator; it does not unlock videos or private posts.",
  balance:"Demo balance",charged:"Simulated top-up charges",fee:"Simulated service fees",
  redeemed:"Value spent",creator:"Creator allocation (80% of spending)",commission:"AFTER SHIFT commission (20% of spending)",
  platform:"AFTER SHIFT simulated total",pending:"Unspent coins",history:"Demo activity",
  ready:"Choose a coin pack to start.",chargeOk:(n,p)=>"✓ Fictional top-up: "+n+" coins. Simulated charge "+p+".",
  actionOk:(what,n)=>"✓ "+what+": "+n+" coins spent.",
  insufficient:"Not enough demo coins. Simulate a top-up before continuing.",
  duplicate:"You've already bought this DEMO post.",empty:"No activity yet.",
  fine:"Example: adding 100 coins would cost US$10.50: US$10 in coin value plus a US$0.50 fee. If all 100 coins are spent, US$8 would be allocated to the creator and US$2 to AFTER SHIFT. Platform figures are gross, before processing costs, taxes, refunds and possible liabilities for unused balances.",
  reset:"Reset demo",close:"Close demo",unspentNote:"Unspent coin value is not realized profit. Coins cannot be cashed out.",
 },
 pt:{
  trigger:"🪙 Comprar moedas",eyebrow:"AFTER SHIFT · COMPRA DE TESTE",title:"Comprar pacotes de moedas",
  warning:"MODO TESTE · Nenhum dinheiro real é cobrado. A escolha do pacote simula uma compra: não cria moedas reais, transferências nem acesso a vídeos. Saldo zerado ao fechar.",
  how:"Depois de simular uma compra, teste presentes em LIVE, gorjetas ou uma publicação DEMO.",
  packs:"Escolha seu pacote",pack:(coins,charge)=>coins+" moedas · "+charge,packQty:n=>n+" moedas",packCTA:"SIMULAR COMPRA",packNominal:"Valor das moedas",
  packInfo:"Valores ilustrativos em USD (não definitivos). 1 moeda = US$ 0,10; o total de exemplo inclui taxa de recarga de 5%. Nenhum pagamento ocorre.",
  live:"Presentes para LIVE (teste)",notLive:"Esta é uma simulação de presentes; ainda não há transmissões reais.",
  heart:"❤️ Coração",star:"⭐ Estrela",diamond:"💎 Diamante",crown:"👑 Coroa",
  more:"Outros usos de teste",tip:"💛 Gorjeta de 20 moedas",post:"🎬 Publicação DEMO · 30 moedas",bought:"✓ Comprada no teste",
  noUnlock:"Esta compra DEMO muda apenas o indicador de teste; não libera vídeos nem conteúdo privado.",
  balance:"Saldo de teste",charged:"Recargas simuladas",fee:"Taxas de serviço simuladas",
  redeemed:"Valor gasto",creator:"Valor do criador (80% do gasto)",commission:"Comissão AFTER SHIFT (20% do gasto)",
  platform:"Total simulado AFTER SHIFT",pending:"Moedas não utilizadas",history:"Movimentos de teste",
  ready:"Escolha um pacote de moedas para começar.",chargeOk:(n,p)=>"✓ Recarga fictícia: "+n+" moedas. Total simulado "+p+".",
  actionOk:(what,n)=>"✓ "+what+": "+n+" moedas usadas.",
  insufficient:"Moedas de teste insuficientes. Simule uma recarga antes de continuar.",
  duplicate:"Esta publicação DEMO já foi comprada neste teste.",empty:"Nenhum movimento ainda.",
  fine:"Exemplo: uma recarga de 100 moedas custaria US$ 10,50: US$ 10 de valor e US$ 0,50 de taxa. Se as 100 moedas forem usadas, US$ 8 seriam destinados ao criador e US$ 2 seriam comissão do AFTER SHIFT. Os valores da plataforma são brutos, antes de custos, impostos, estornos e possíveis obrigações sobre saldos não utilizados.",
  reset:"Reiniciar teste",close:"Fechar teste",unspentNote:"Saldo não utilizado não é lucro realizado. Moedas não podem ser sacadas.",
 }
};
function lang(){const selected=document.getElementById("uiLanguage")?.value;return messages[selected]?selected:"es";}
function t(key){return messages[lang()][key];}
function money(cents){return "US$"+(cents/100).toFixed(2).replace(".",lang()==="en"?".":",");}
function blank(){return {balance:0,charged:0,fees:0,spent:0,creator:0,commission:0,postBought:false,events:[]};}
function price(coins){
 if(!PACKS.includes(coins))throw new Error("Invalid demo pack");
 const face=coins*CENT_PER_COIN;
 const fee=Math.round(face*FEE_BPS/10000);
 return {coins,face,fee,charged:face+fee};
}
function topup(s,coins){
 const q=price(coins);
 return {...s,balance:s.balance+coins,charged:s.charged+q.charged,fees:s.fees+q.fee};
}
function redeem(s,coins,kind){
 if(!Number.isInteger(coins)||coins<=0||!["heart","star","diamond","crown","tip","post"].includes(kind))throw new Error("Invalid demo redemption");
 if(kind==="post"&&s.postBought)return {error:"duplicate"};
 if(s.balance<coins)return {error:"insufficient"};
 const face=coins*CENT_PER_COIN,creator=Math.round(face*CREATOR_PERCENT/100);
 return {...s,balance:s.balance-coins,spent:s.spent+face,creator:s.creator+creator,commission:s.commission+face-creator,postBought:s.postBought||kind==="post"};
}
function elem(tag,className,value){
 const node=document.createElement(tag);
 if(className)node.className=className;
 if(value!==undefined)node.textContent=value;
 return node;
}
function open(){
 if(document.getElementById("coinLabOverlay"))return;
 let state=blank(),notice="",focusFrom=document.activeElement;
 const overlay=elem("div","coin-lab-overlay");
 overlay.id="coinLabOverlay";
 const card=elem("section","coin-lab-card");
 card.setAttribute("role","dialog");
 card.setAttribute("aria-modal","true");
 card.setAttribute("aria-labelledby","coinLabTitle");
 const close=elem("button","coin-lab-close","×");
 close.type="button";
 const eyebrow=elem("div","coin-lab-eyebrow");
 const title=elem("h2","coin-lab-title");title.id="coinLabTitle";
 const warning=elem("p","coin-lab-warning");
 const intro=elem("p","coin-lab-intro");
 const balance=elem("div","coin-lab-balance");
 const packH=elem("h3"),packInfo=elem("p","coin-lab-small"),packs=elem("div","coin-lab-packs");
 const liveH=elem("h3"),liveInfo=elem("p","coin-lab-small"),gifts=elem("div","coin-lab-gifts");
 const otherH=elem("h3"),other=elem("div","coin-lab-other"),otherInfo=elem("p","coin-lab-small");
 const stats=elem("dl","coin-lab-stats");
 const metricKeys=["charged","fee","redeemed","creator","commission","platform","pending"];
 const metrics={};
 for(const key of metricKeys){
   const item=elem("div","coin-lab-metric"),label=elem("dt"),value=elem("dd");
   item.append(label,value);stats.appendChild(item);metrics[key]={label,value};
 }
 const message=elem("div","coin-lab-feedback");
 message.setAttribute("role","status");message.setAttribute("aria-live","polite");
 const histH=elem("h3"),history=elem("ol","coin-lab-history");
 const fine=elem("p","coin-lab-small coin-lab-fine");
 const note=elem("p","coin-lab-small");
 const reset=elem("button","coin-lab-reset");reset.type="button";
 const packButtons=[],actionButtons=[];
 PACKS.forEach(coins=>{
   const button=elem("button","coin-lab-pack");
   button.type="button";
   button.onclick=()=>{
     const q=price(coins);
     state=topup(state,coins);
     notice=t("chargeOk")(coins,money(q.charged));
     state.events.unshift(notice);
     render();
   };
   const quantity=elem("strong","coin-lab-pack-qty");
   const total=elem("span","coin-lab-pack-total");
   const nominal=elem("small","coin-lab-pack-nominal");
   const action=elem("span","coin-lab-pack-action");
   button.append(quantity,total,nominal,action);
   packButtons.push({coins,button,quantity,total,nominal,action});packs.appendChild(button);
 });
 [{kind:"heart",coins:5},{kind:"star",coins:10},{kind:"diamond",coins:50},{kind:"crown",coins:100}]
 .forEach(({kind,coins})=>{
   const button=elem("button","coin-lab-gift");button.type="button";
   button.onclick=()=>spend(kind,coins);
   actionButtons.push({kind,coins,button});gifts.appendChild(button);
 });
 [{kind:"tip",coins:20},{kind:"post",coins:30}].forEach(({kind,coins})=>{
   const button=elem("button","coin-lab-use");button.type="button";
   button.onclick=()=>spend(kind,coins);
   actionButtons.push({kind,coins,button});other.appendChild(button);
 });
 function spend(kind,coins){
   const result=redeem(state,coins,kind);
   if(result.error){notice=t(result.error);render();return;}
   state=result;
   notice=t("actionOk")(t(kind),coins);
   state.events.unshift(notice);
   render();
 }
 function render(){
   close.setAttribute("aria-label",t("close"));
   eyebrow.textContent=t("eyebrow");title.textContent=t("title");
   warning.textContent=t("warning");intro.textContent=t("how");
   balance.textContent=t("balance")+": "+state.balance+" 🪙";
   packH.textContent=t("packs");packInfo.textContent=t("packInfo");
   liveH.textContent=t("live");liveInfo.textContent=t("notLive");
   otherH.textContent=t("more");otherInfo.textContent=t("noUnlock");
   packButtons.forEach(({coins,button,quantity,total,nominal,action})=>{
     const q=price(coins);
     quantity.textContent=t("packQty")(coins);
     total.textContent=money(q.charged);
     nominal.textContent=t("packNominal")+": "+money(q.face);
     action.textContent=t("packCTA");
     button.setAttribute("aria-label",t("packQty")(coins)+" · "+money(q.charged)+" · "+t("packCTA"));
   });
   actionButtons.forEach(({kind,coins,button})=>{
     button.textContent=kind==="post"&&state.postBought?t("bought"):t(kind)+(kind==="tip"||kind==="post"?"":" · "+coins+" 🪙");
     button.disabled=(kind==="post"&&state.postBought);
   });
   const amounts={charged:state.charged,fee:state.fees,redeemed:state.spent,creator:state.creator,
     commission:state.commission,platform:state.fees+state.commission,pending:state.balance*CENT_PER_COIN};
   metricKeys.forEach(key=>{
     metrics[key].label.textContent=t(key);
     metrics[key].value.textContent=money(amounts[key]);
   });
   histH.textContent=t("history");reset.textContent=t("reset");
   note.textContent=t("unspentNote");fine.textContent=t("fine");
   message.textContent=notice||t("ready");
   history.replaceChildren();
   if(!state.events.length)history.appendChild(elem("li","",t("empty")));
   else state.events.slice(0,7).forEach(line=>history.appendChild(elem("li","",line)));
 }
 function finish(){
   overlay.remove();
   document.removeEventListener("keydown",onKey);
   document.getElementById("uiLanguage")?.removeEventListener("change",onLanguage);
   if(focusFrom?.isConnected)focusFrom.focus();
 }
 function onKey(ev){if(ev.key==="Escape"){ev.preventDefault();finish();}}
 function onLanguage(){notice="";render();}
 close.onclick=finish;
 overlay.onclick=ev=>{if(ev.target===overlay)finish();};
 reset.onclick=()=>{state=blank();notice="";render();};
 document.addEventListener("keydown",onKey);
 document.getElementById("uiLanguage")?.addEventListener("change",onLanguage);
 card.append(close,eyebrow,title,warning,packH,packInfo,packs,balance,intro,liveH,liveInfo,gifts,otherH,other,otherInfo,stats,message,histH,history,fine,note,reset);
 overlay.appendChild(card);
 document.body.appendChild(overlay);
 render();
 close.focus();
}
const trigger=document.getElementById("coinLabTrigger");
function updateTrigger(){if(trigger)trigger.textContent=t("trigger");}
if(trigger){
 trigger.addEventListener("click",open);
 document.getElementById("uiLanguage")?.addEventListener("change",updateTrigger);
 updateTrigger();
}
window.AfterShiftCoinDemo={price,topup,redeem,blank};
})();
