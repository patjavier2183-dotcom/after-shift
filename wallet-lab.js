/* AFTER SHIFT V25 · Isolated UI-only coin simulation.
   NO REAL MONEY, NO FINANCIAL ACCOUNT, NO SERVER OR SUBSCRIPTION WRITES.
   Numbers are examples until a payment processor, terms and compliance are approved. */
(function(){
"use strict";
const PACKS=[50,100,200],CENT_PER_COIN=10,FEE_BPS=500,CREATOR_PERCENT=80;
const messages={
 es:{
  trigger:"🪙 Monedas · prueba",eyebrow:"AFTER SHIFT · LABORATORIO",title:"Monedas y regalos virtuales",
  warning:"SIMULADOR: no compra monedas reales, no cobra dinero, no hace transferencias ni desbloquea publicaciones. El saldo desaparece al cerrar.",
  how:"Prueba una recarga y luego úsala en regalos de un LIVE ficticio, propinas o una compra individual DEMO.",
  packs:"1. Recargar monedas (simulación)",pack:(coins,charge)=>coins+" monedas · "+charge,
  packInfo:"1 moneda = US$0,10. El precio de ejemplo incluye una tarifa visible de servicio del 5%.",
  live:"2. Regalos durante un LIVE de ejemplo",notLive:"Esta es una simulación de regalos; todavía no hay transmisiones reales.",
  heart:"❤️ Corazón",star:"⭐ Estrella",diamond:"💎 Diamante",crown:"👑 Corona",
  more:"3. Otros usos de las monedas",tip:"💛 Propina de 20 monedas",post:"🎬 Publicación DEMO · 30 monedas",bought:"✓ Comprada en la prueba",
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
  trigger:"🪙 Coins · demo",eyebrow:"AFTER SHIFT · TEST LAB",title:"Coins and virtual gifts",
  warning:"DEMO ONLY: no real coin purchases, charges, transfers or private content unlocks. Balance resets on close.",
  how:"Try a top-up, then use the demo coins for LIVE gifts, tips or an individual DEMO purchase.",
  packs:"1. Add demo coins",pack:(coins,charge)=>coins+" coins · "+charge,
  packInfo:"1 coin = US$0.10. Example price includes a clearly disclosed 5% service fee.",
  live:"2. Gifts in a simulated LIVE",notLive:"This is a gift simulation; real live streams are not available yet.",
  heart:"❤️ Heart",star:"⭐ Star",diamond:"💎 Diamond",crown:"👑 Crown",
  more:"3. Other ways to use coins",tip:"💛 Tip 20 coins",post:"🎬 DEMO post · 30 coins",bought:"✓ Bought in demo",
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
  trigger:"🪙 Moedas · teste",eyebrow:"AFTER SHIFT · LABORATÓRIO",title:"Moedas e presentes virtuais",
  warning:"SIMULAÇÃO: não compra moedas reais, não cobra, não transfere dinheiro nem libera conteúdo privado. O saldo zera ao fechar.",
  how:"Simule uma recarga e use as moedas em presentes de LIVE, gorjetas ou uma compra individual DEMO.",
  packs:"1. Recarregar moedas (simulação)",pack:(coins,charge)=>coins+" moedas · "+charge,
  packInfo:"1 moeda = US$ 0,10. O valor de exemplo inclui uma taxa de serviço visível de 5%.",
  live:"2. Presentes em um LIVE de exemplo",notLive:"Esta é uma simulação de presentes; ainda não há transmissões reais.",
  heart:"❤️ Coração",star:"⭐ Estrela",diamond:"💎 Diamante",crown:"👑 Coroa",
  more:"3. Outros usos das moedas",tip:"💛 Gorjeta de 20 moedas",post:"🎬 Publicação DEMO · 30 moedas",bought:"✓ Comprada no teste",
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
   packButtons.push({coins,button});packs.appendChild(button);
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
   packButtons.forEach(({coins,button})=>{button.textContent=t("pack")(coins,money(price(coins).charged));});
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
 card.append(close,eyebrow,title,warning,intro,balance,packH,packInfo,packs,liveH,liveInfo,gifts,otherH,other,otherInfo,stats,message,histH,history,fine,note,reset);
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
