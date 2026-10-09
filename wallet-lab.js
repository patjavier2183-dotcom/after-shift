/* AFTER SHIFT V25 · Isolated UI-only coin simulation.
   NO REAL MONEY, NO FINANCIAL ACCOUNT, NO SERVER OR SUBSCRIPTION WRITES.
   Numbers are examples until a payment processor, terms and compliance are approved. */
(function(){
"use strict";
const PACKS=[50,100,200],CENT_PER_COIN=10,FEE_BPS=500,CREATOR_PERCENT=80;
const COST={heart:5,star:10,diamond:50,crown:100};
const KINDS=Object.keys(COST);
const BUNDLES={50:{heart:2,star:1},100:{heart:2,star:2,diamond:1},200:{heart:2,star:2,diamond:1,crown:1}};
function noGifts(){return {heart:0,star:0,diamond:0,crown:0};}
function giftCoins(gifts){return KINDS.reduce((n,k)=>n+(gifts?.[k]||0)*COST[k],0);}
function bundleInfo(n){
 if(!PACKS.includes(n))throw new Error("Invalid package");
 const gifts={...noGifts(),...BUNDLES[n]},reserved=giftCoins(gifts);
 if(reserved>n)throw new Error("Bundle face exceeded");
 return {gifts,reserved,free:n-reserved};
}
function topupBundle(old,n){
 const split=bundleInfo(n),base=topup(old,n),stock=noGifts();
 KINDS.forEach(k=>stock[k]=(base.inventory?.[k]||0)+split.gifts[k]);
 return {...base,balance:base.balance-split.reserved,inventory:stock};
}
function sendIncluded(old,k){
 if(!COST[k]||!old.inventory?.[k])return {error:"insufficient"};
 const face=COST[k]*CENT_PER_COIN,creator=Math.round(face*CREATOR_PERCENT/100);
 return {...old,inventory:{...old.inventory,[k]:old.inventory[k]-1},
  spent:old.spent+face,creator:old.creator+creator,commission:old.commission+face-creator};
}
function pendingValue(st){return (st.balance+giftCoins(st.inventory))*CENT_PER_COIN;}
const messages={
 es:{
  trigger:"🪙 Comprar monedas",eyebrow:"AFTER SHIFT · COMPRA DE PRUEBA",title:"Comprar paquetes de monedas",
  warning:"MODO PRUEBA · Aquí no se cobra dinero real. Elegir un paquete simula una compra: no crea monedas reales, transferencias ni acceso a videos. El saldo se elimina al cerrar.",
  how:"Con cada paquete recibes los regalos indicados y monedas libres. Envíalos cuando quieras: su valor solo llega al creador cuando los usas.",
  packs:"Elige tu paquete",pack:(coins,charge)=>coins+" monedas · "+charge,packQty:n=>n+" monedas",packCTA:"SIMULAR COMPRA",packNominal:"Valor de monedas",giftTitle:"Incluye",flexTitle:"Monedas libres",stockTitle:"Tus regalos disponibles",owned:n=>"Tienes "+n,sentGift:label=>label+" enviado desde los regalos de tu paquete.",sentExtra:label=>label+" enviado con monedas libres.",
  packInfo:"Estos paquetes incluyen regalos valorizados + monedas libres. El valor no se duplica. Precio ficticio en USD con tarifa ilustrativa del 5%.",
  live:"Regalos para LIVE (prueba)",notLive:"Esta es una simulación de regalos; todavía no hay transmisiones reales.",
  heart:"❤️ Corazón",star:"⭐ Estrella",diamond:"💎 Diamante",crown:"👑 Corona",
  more:"También puedes probar",tip:"💛 Propina de 20 monedas",post:"🎬 Publicación DEMO · 30 monedas",bought:"✓ Comprada en la prueba",
  noUnlock:"Esta compra solo cambia el indicador DEMO; no permite abrir videos ni contenido privado.",
  balance:"Monedas libres",charged:"Pago simulado al recargar",fee:"Tarifas de servicio simuladas",
  redeemed:"Valor gastado",creator:"A favor del creador (80% del gasto)",commission:"Comisión AFTER SHIFT (20% del gasto)",
  platform:"AFTER SHIFT total simulado",pending:"Regalos y monedas pendientes",history:"Movimientos de esta prueba",
  ready:"Elige un paquete para recibir tus regalos de prueba.",chargeOk:(n,p)=>"✓ Recarga ficticia: "+n+" monedas. Total simulado "+p+".",
  actionOk:(what,n)=>"✓ "+what+": "+n+" monedas usadas.",
  insufficient:"No tienes ese regalo incluido ni monedas libres suficientes. Simula otro paquete.",
  duplicate:"Esta publicación DEMO ya fue comprada en esta prueba.",empty:"Sin movimientos todavía.",
  fine:"Paquete 100: US$8 de regalos incluidos y US$2 en monedas libres. El creador recibe el 80% solo de regalos ENVIADOS; AFTER SHIFT, 20% más tarifa ilustrativa del 5%. No hay cobros reales.",
  reset:"Reiniciar prueba",close:"Cerrar prueba",unspentNote:"Regalos no enviados y monedas libres todavía son valor pendiente. No son ganancias realizadas.",
 },
 en:{
  trigger:"🪙 Buy coins",eyebrow:"AFTER SHIFT · PURCHASE DEMO",title:"Buy coin packages",
  warning:"DEMO MODE · No real money is charged. Selecting a package simulates a purchase: no real coins, transfers or private video access. Balance resets on close.",
  how:"Packages include the listed gifts plus flexible coins. Send a gift whenever you want; creators are allocated its value only when sent.",
  packs:"Choose your package",pack:(coins,charge)=>coins+" coins · "+charge,packQty:n=>n+" coins",packCTA:"SIMULATE PURCHASE",packNominal:"Coin value",giftTitle:"Includes",flexTitle:"Flexible coins",stockTitle:"Your available gifts",owned:n=>"You have "+n,sentGift:label=>label+" sent from your included gifts.",sentExtra:label=>label+" sent using flexible coins.",
  packInfo:"Packages contain priced gifts + flexible coins. No value is duplicated. Illustrative USD prices with a hypothetical 5% fee.",
  live:"LIVE gifts (demo)",notLive:"This is a gift simulation; real live streams are not available yet.",
  heart:"❤️ Heart",star:"⭐ Star",diamond:"💎 Diamond",crown:"👑 Crown",
  more:"Other demo uses",tip:"💛 Tip 20 coins",post:"🎬 DEMO post · 30 coins",bought:"✓ Bought in demo",
  noUnlock:"This DEMO purchase changes only the test indicator; it does not unlock videos or private posts.",
  balance:"Flexible coins",charged:"Simulated top-up charges",fee:"Simulated service fees",
  redeemed:"Value spent",creator:"Creator allocation (80% of spending)",commission:"AFTER SHIFT commission (20% of spending)",
  platform:"AFTER SHIFT simulated total",pending:"Unsent gifts and unused coins",history:"Demo activity",
  ready:"Choose a package to receive your demo gifts.",chargeOk:(n,p)=>"✓ Fictional top-up: "+n+" coins. Simulated charge "+p+".",
  actionOk:(what,n)=>"✓ "+what+": "+n+" coins spent.",
  insufficient:"No included gift of that type or enough flexible coins. Simulate another package.",
  duplicate:"You've already bought this DEMO post.",empty:"No activity yet.",
  fine:"100-coin package: US$8 in included gifts plus US$2 in flexible coins. Creators receive 80% only when gifts are SENT; AFTER SHIFT gets 20% plus the illustrative 5% fee. No real payments.",
  reset:"Reset demo",close:"Close demo",unspentNote:"Unsent gifts and unused coins remain unspent value, not realized profit.",
 },
 pt:{
  trigger:"🪙 Comprar moedas",eyebrow:"AFTER SHIFT · COMPRA DE TESTE",title:"Comprar pacotes de moedas",
  warning:"MODO TESTE · Nenhum dinheiro real é cobrado. A escolha do pacote simula uma compra: não cria moedas reais, transferências nem acesso a vídeos. Saldo zerado ao fechar.",
  how:"Os pacotes incluem os presentes indicados e moedas livres. Você decide quando enviá-los; o criador recebe o valor somente ao enviar.",
  packs:"Escolha seu pacote",pack:(coins,charge)=>coins+" moedas · "+charge,packQty:n=>n+" moedas",packCTA:"SIMULAR COMPRA",packNominal:"Valor das moedas",giftTitle:"Inclui",flexTitle:"Moedas livres",stockTitle:"Presentes disponíveis",owned:n=>"Você tem "+n,sentGift:label=>label+" enviado do seu pacote.",sentExtra:label=>label+" enviado com moedas livres.",
  packInfo:"Pacotes incluem presentes valorizados + moedas livres. Nenhum valor é duplicado. Valores ilustrativos em USD com taxa hipotética de 5%.",
  live:"Presentes para LIVE (teste)",notLive:"Esta é uma simulação de presentes; ainda não há transmissões reais.",
  heart:"❤️ Coração",star:"⭐ Estrela",diamond:"💎 Diamante",crown:"👑 Coroa",
  more:"Outros usos de teste",tip:"💛 Gorjeta de 20 moedas",post:"🎬 Publicação DEMO · 30 moedas",bought:"✓ Comprada no teste",
  noUnlock:"Esta compra DEMO muda apenas o indicador de teste; não libera vídeos nem conteúdo privado.",
  balance:"Moedas livres",charged:"Recargas simuladas",fee:"Taxas de serviço simuladas",
  redeemed:"Valor gasto",creator:"Valor do criador (80% do gasto)",commission:"Comissão AFTER SHIFT (20% do gasto)",
  platform:"Total simulado AFTER SHIFT",pending:"Presentes e moedas pendentes",history:"Movimentos de teste",
  ready:"Escolha um pacote para receber presentes de teste.",chargeOk:(n,p)=>"✓ Recarga fictícia: "+n+" moedas. Total simulado "+p+".",
  actionOk:(what,n)=>"✓ "+what+": "+n+" moedas usadas.",
  insufficient:"Você não tem esse presente incluído nem moedas livres suficientes. Simule outro pacote.",
  duplicate:"Esta publicação DEMO já foi comprada neste teste.",empty:"Nenhum movimento ainda.",
  fine:"Pacote 100: US$8 em presentes incluídos e US$2 em moedas livres. O criador recebe 80% apenas de presentes ENVIADOS; AFTER SHIFT fica com 20% mais taxa ilustrativa de 5%. Sem pagamentos reais.",
  reset:"Reiniciar teste",close:"Fechar teste",unspentNote:"Presentes não enviados e moedas não usadas são valor pendente, não lucro realizado.",
 }
};
function lang(){const selected=document.getElementById("uiLanguage")?.value;return messages[selected]?selected:"es";}
function t(key){return messages[lang()][key];}
function money(cents){return "US$"+(cents/100).toFixed(2).replace(".",lang()==="en"?".":",");}
function blank(){return {balance:0,inventory:noGifts(),charged:0,fees:0,spent:0,creator:0,commission:0,postBought:false,events:[]};}
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
 const liveH=elem("h3"),liveInfo=elem("p","coin-lab-small"),stock=elem("p","coin-lab-stock"),gifts=elem("div","coin-lab-gifts");
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
     state=topupBundle(state,coins);
     notice=t("chargeOk")(coins,money(q.charged));
     state.events.unshift(notice);
     render();
   };
   const quantity=elem("strong","coin-lab-pack-qty");
   const total=elem("span","coin-lab-pack-total");
   const nominal=elem("small","coin-lab-pack-nominal");
   const detail=elem("div","coin-lab-pack-contents");
   const action=elem("span","coin-lab-pack-action");
   button.append(quantity,total,nominal,detail,action);
   packButtons.push({coins,button,quantity,total,nominal,detail,action});packs.appendChild(button);
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
   const included=!!COST[kind]&&state.inventory[kind]>0;
   const result=included?sendIncluded(state,kind):redeem(state,coins,kind);
   if(result.error){notice=t(result.error);render();return;}
   state=result;
   notice=included?t("sentGift")(t(kind)):COST[kind]?t("sentExtra")(t(kind)):t("actionOk")(t(kind),coins);
   state.events.unshift(notice);render();
 }
 function render(){
   close.setAttribute("aria-label",t("close"));
   eyebrow.textContent=t("eyebrow");title.textContent=t("title");
   warning.textContent=t("warning");intro.textContent=t("how");
   balance.textContent=t("balance")+": "+state.balance+" 🪙 · "+money(state.balance*CENT_PER_COIN);
   packH.textContent=t("packs");packInfo.textContent=t("packInfo");
   liveH.textContent=t("live");liveInfo.textContent=t("notLive");
   const held=KINDS.filter(k=>state.inventory[k]>0);
   stock.hidden=!held.length;
   stock.textContent=t("stockTitle")+": "+held.map(k=>t(k)+" ×"+state.inventory[k]).join(" · ");
   otherH.textContent=t("more");otherInfo.textContent=t("noUnlock");
   packButtons.forEach(({coins,button,quantity,total,nominal,detail,action})=>{
     const q=price(coins),info=bundleInfo(coins);
     quantity.textContent=t("packQty")(coins);
     total.textContent=money(q.charged);
     nominal.textContent=t("packNominal")+": "+money(q.face);
     detail.replaceChildren();
     detail.appendChild(elem("span","coin-lab-contents-heading",t("giftTitle")+":"));
     KINDS.forEach(k=>{
       if(info.gifts[k])detail.appendChild(elem("span","coin-lab-contents-line",
         t(k)+" ×"+info.gifts[k]+" · "+money(info.gifts[k]*COST[k]*CENT_PER_COIN)));
     });
     detail.appendChild(elem("span","coin-lab-contents-flex",t("flexTitle")+": "+info.free+" · "+money(info.free*CENT_PER_COIN)));
     action.textContent=t("packCTA");
     button.setAttribute("aria-label",t("packQty")(coins)+" · "+money(q.charged)+" · "+t("giftTitle"));
   });
   actionButtons.forEach(({kind,coins,button})=>{
     if(COST[kind])button.textContent=t(kind)+"\n"+money(coins*CENT_PER_COIN)+" · "+coins+" 🪙\n"+t("owned")(state.inventory[kind]||0);
     else button.textContent=kind==="post"&&state.postBought?t("bought"):t(kind);
     button.disabled=kind==="post"&&state.postBought;
   });
   const amounts={charged:state.charged,fee:state.fees,redeemed:state.spent,creator:state.creator,
     commission:state.commission,platform:state.fees+state.commission,pending:pendingValue(state)};
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
 card.append(close,eyebrow,title,warning,packH,packInfo,packs,balance,intro,liveH,liveInfo,stock,gifts,otherH,other,otherInfo,stats,message,histH,history,fine,note,reset);
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
window.AfterShiftCoinDemo={price,topup,redeem,blank,bundleInfo,topupBundle,sendIncluded,pendingValue};
})();
