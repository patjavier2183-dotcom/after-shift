/* AFTER SHIFT V26: Premium LIVE DEMO only.
   No live video, no payment requests, no subscription writes, no real content unlocks.
   Any subscriber simulation is isolated to this modal and disappears on close. */
(function(){
"use strict";
const TICKET_CENTS=500,CREATOR_PERCENT=80;
const langs={
 es:{
  teaserTitle:"LIVE PREMIUM",tag:"PRUEBA · SOLO SUSCRIPTORES",
  teaserDesc:"Cada LIVE requiere entrada adicional a la suscripción. Los regalos son voluntarios.",
  teaserBtn:"PROBAR LIVE PREMIUM",
  eyebrow:"AFTER SHIFT · DEMOSTRACIÓN",title:"LIVE PREMIUM · Entrada y regalos",
  disclaimer:"PRUEBA SIN COBROS. No hay transmisión real. La entrada, la suscripción simulada y los regalos NO activan permisos, no cobran dinero ni abren contenido privado.",
  creator:"Creador",status:"Estado de la suscripción",
  active:"Suscripción activa verificada en el perfil",owner:"Vista de prueba del propio creador",
  simulated:"Suscripción simulada SOLO en esta ventana",inactive:"No tienes una suscripción activa a este creador",
  why:"Solo los suscriptores del creador pueden comprar la entrada de un LIVE PREMIUM. La mensualidad no incluye los LIVE.",
  mock:"Simular suscripción (sin crearla)",mocked:"✓ Suscripción ficticia activada solo para esta prueba. Tu cuenta real no ha cambiado.",
  ticket:"Entrada de este LIVE",ticketBtn:"Simular compra de entrada por US$5",
  ticketLocked:"Primero necesitas una suscripción activa o simularla en este laboratorio.",
  ticketDone:"✓ Entrada ficticia comprada. Acceso solo a la escena DEMO.",
  ticketNote:"Cada LIVE exige su propia entrada. El precio US$5 es ilustrativo; todavía no hay pagos reales.",
  liveTag:"ESCENA DEMO · NO ES UN LIVE REAL",stage:"Aquí se vería una transmisión privada en directo.",
  stageDetail:"Sin cámara, espectadores ni video real. No se transmite ni se graba nada.",
  topups:"Monedas de prueba para regalos",pack:(n,p)=>n+" monedas · "+p,
  topupInfo:"Recarga simulada: 1 moneda = US$0,10 + tarifa de servicio ilustrativa del 5%. No existe saldo real ni compartido con otras pantallas.",
  gifts:"Enviar regalos durante el LIVE",heart:"❤️ Corazón",star:"⭐ Estrella",diamond:"💎 Diamante",crown:"👑 Corona",
  giftLabel:(label,n)=>label+" · "+n+" 🪙",
  wallet:"Monedas disponibles",sent:"Regalos enviados",paid:"Entradas simuladas",
  rechargeFees:"Tarifas de recarga simuladas",creatorCut:"Para el creador (80%)",
  platformCut:"AFTER SHIFT (20% + tarifa)",pending:"Valor de monedas sin gastar",
  history:"Actividad simulada",empty:"Sin movimientos todavía.",
  ticketMsg:"✓ Entrada de US$5 simulada. No se cobró dinero.",
  rechargeMsg:(n,total)=>"✓ Recarga ficticia de "+n+" monedas. Cargo simulado: "+total+".",
  giftMsg:(label,n)=>"✓ Regalo ficticio: "+label+" ("+n+" monedas).",
  noBalance:"Te faltan monedas de prueba. Recarga un paquete ficticio.",
  noTicket:"Primero simula la compra de tu entrada al LIVE.",
  reset:"Reiniciar prueba",close:"Cerrar",note:"Las entradas y los regalos son operaciones distintas. Las propinas son voluntarias. Los montos son BRUTOS, antes de pasarela, streaming, impuestos, contracargos y saldos sin gastar. Todo se reinicia al cerrar.",
 },
 en:{
  teaserTitle:"PREMIUM LIVE",tag:"DEMO · SUBSCRIBERS ONLY",
  teaserDesc:"Each LIVE requires a separate ticket beyond the subscription. Gifts are optional.",
  teaserBtn:"TRY PREMIUM LIVE",
  eyebrow:"AFTER SHIFT · DEMO",title:"PREMIUM LIVE · Tickets & gifts",
  disclaimer:"NO-CHARGE DEMO. There is no real stream. Test tickets, simulated subscription and gifts do NOT grant permissions, charge money or unlock private content.",
  creator:"Creator",status:"Subscription status",active:"Active subscription verified on this profile",
  owner:"Creator's own test view",simulated:"SIMULATED subscription in this window only",
  inactive:"You have no active subscription to this creator",
  why:"Only active subscribers may buy a PREMIUM LIVE ticket. LIVE events are not included in the monthly subscription.",
  mock:"Simulate subscription (no real change)",mocked:"✓ Fictional subscription enabled for this demo only. Your real account was not changed.",
  ticket:"Ticket for this LIVE",ticketBtn:"Simulate US$5 ticket purchase",
  ticketLocked:"You need an active subscription or a demo-only simulation first.",
  ticketDone:"✓ Fictional ticket purchased. Access is limited to this DEMO scene.",
  ticketNote:"Each LIVE requires its own ticket. US$5 is an illustrative price; there are no real payments yet.",
  liveTag:"DEMO SCENE · NOT A REAL LIVE",stage:"A private live stream would appear here.",
  stageDetail:"No camera, audience or real video. Nothing is recorded or streamed.",
  topups:"Demo coins for gifts",pack:(n,p)=>n+" coins · "+p,
  topupInfo:"Simulated top-up: 1 coin = US$0.10 + an illustrative 5% service fee. No real or shared balance.",
  gifts:"Send gifts during the LIVE",heart:"❤️ Heart",star:"⭐ Star",diamond:"💎 Diamond",crown:"👑 Crown",
  giftLabel:(label,n)=>label+" · "+n+" 🪙",
  wallet:"Available demo coins",sent:"Gifts sent",paid:"Simulated tickets",
  rechargeFees:"Simulated top-up fees",creatorCut:"Creator share (80%)",
  platformCut:"AFTER SHIFT (20% + fee)",pending:"Unspent coin value",
  history:"Demo activity",empty:"No activity yet.",
  ticketMsg:"✓ US$5 ticket simulated. No money was charged.",
  rechargeMsg:(n,total)=>"✓ Fictional top-up of "+n+" coins. Simulated charge: "+total+".",
  giftMsg:(label,n)=>"✓ Fictional gift: "+label+" ("+n+" coins).",
  noBalance:"Not enough demo coins. Add a fictional top-up.",
  noTicket:"Simulate buying a LIVE ticket first.",
  reset:"Reset demo",close:"Close",note:"Tickets and gifts are separate transactions. Gifts are voluntary. All values are GROSS, before payment processing, streaming costs, taxes, chargebacks and unspent balances. The demo resets when closed.",
 },
 pt:{
  teaserTitle:"LIVE PREMIUM",tag:"TESTE · APENAS ASSINANTES",
  teaserDesc:"Cada LIVE exige ingresso adicional à assinatura. Os presentes são opcionais.",
  teaserBtn:"TESTAR LIVE PREMIUM",
  eyebrow:"AFTER SHIFT · DEMONSTRAÇÃO",title:"LIVE PREMIUM · Ingressos e presentes",
  disclaimer:"TESTE SEM COBRANÇAS. Não há transmissão real. Ingressos, assinatura simulada e presentes NÃO liberam conteúdo privado, não cobram nem criam permissões.",
  creator:"Criador",status:"Status da assinatura",active:"Assinatura ativa verificada neste perfil",
  owner:"Vista de teste do próprio criador",simulated:"Assinatura simulada SOMENTE nesta janela",
  inactive:"Você não tem assinatura ativa deste criador",
  why:"Somente assinantes ativos podem comprar ingresso para LIVE PREMIUM. As transmissões não estão incluídas na mensalidade.",
  mock:"Simular assinatura (sem criá-la)",mocked:"✓ Assinatura fictícia ativada apenas neste teste. Sua conta real não foi alterada.",
  ticket:"Ingresso deste LIVE",ticketBtn:"Simular compra do ingresso por US$ 5",
  ticketLocked:"Primeiro você precisa de uma assinatura ativa ou simulá-la apenas neste teste.",
  ticketDone:"✓ Ingresso fictício comprado. Acesso somente à cena DEMO.",
  ticketNote:"Cada LIVE exige seu próprio ingresso. O preço US$ 5 é ilustrativo; ainda não há pagamentos reais.",
  liveTag:"CENA DEMO · NÃO É UMA LIVE REAL",stage:"Uma transmissão privada ao vivo apareceria aqui.",
  stageDetail:"Sem câmera, espectadores ou vídeo real. Nada é transmitido ou gravado.",
  topups:"Moedas de teste para presentes",pack:(n,p)=>n+" moedas · "+p,
  topupInfo:"Recarga simulada: 1 moeda = US$ 0,10 + taxa de serviço ilustrativa de 5%. Não existe saldo real ou compartilhado.",
  gifts:"Enviar presentes durante a LIVE",heart:"❤️ Coração",star:"⭐ Estrela",diamond:"💎 Diamante",crown:"👑 Coroa",
  giftLabel:(label,n)=>label+" · "+n+" 🪙",
  wallet:"Moedas disponíveis",sent:"Presentes enviados",paid:"Ingressos simulados",
  rechargeFees:"Taxas de recarga simuladas",creatorCut:"Para o criador (80%)",
  platformCut:"AFTER SHIFT (20% + taxa)",pending:"Valor das moedas não usadas",
  history:"Atividades simuladas",empty:"Ainda sem movimentos.",
  ticketMsg:"✓ Ingresso de US$ 5 simulado. Nenhuma cobrança foi feita.",
  rechargeMsg:(n,total)=>"✓ Recarga fictícia de "+n+" moedas. Cobrança simulada: "+total+".",
  giftMsg:(label,n)=>"✓ Presente fictício: "+label+" ("+n+" moedas).",
  noBalance:"Moedas de teste insuficientes. Simule uma recarga.",
  noTicket:"Primeiro simule a compra de um ingresso para a LIVE.",
  reset:"Reiniciar teste",close:"Fechar",note:"Ingressos e presentes são transações diferentes. Presentes são voluntários. Valores BRUTOS, antes de processamento, transmissão, impostos, estornos e moedas não usadas. O teste reinicia ao fechar.",
 }
};
const TICKET_PERCENT=20;
function language(){const key=document.getElementById("uiLanguage")?.value;return langs[key]?key:"es";}
function d(){return langs[language()];}
function currency(cents){return "US$"+(cents/100).toFixed(2).replace(".",language()==="en"?".":",");}
function summary(ticketPaid,wallet){
 const ticket=ticketPaid?TICKET_CENTS:0;
 const creatorTicket=Math.round(ticket*CREATOR_PERCENT/100);
 return {ticket,giftSpend:wallet.spent,coins:wallet.balance,
 creator:creatorTicket+wallet.creator,
 platform:ticket-creatorTicket+wallet.commission+wallet.fees,
 fee:wallet.fees,unspent:wallet.balance*10};
}
function element(tag,className,value){
 const e=document.createElement(tag);if(className)e.className=className;
 if(value!==undefined)e.textContent=value;return e;
}
function makeButton(className){const el=element("button",className);el.type="button";return el;}
function mount(overlay,{creatorName,subscribed,owner=false}={}){
 const panel=overlay.querySelector('.profile-panel[data-panel="content"]');
 if(!panel||panel.querySelector(".premium-live-teaser"))return;
 const promo=element("section","premium-live-teaser");
 const inner=element("div","premium-live-teaser-text");
 inner.append(element("span","premium-live-teaser-label","LIVE PREMIUM"),element("strong","", "PRUEBA · SOLO SUSCRIPTORES"),element("p","","Cada LIVE requiere entrada adicional a la suscripción. Los regalos son voluntarios."));
 const button=makeButton("premium-live-teaser-btn");button.textContent="PROBAR LIVE PREMIUM";
 button.onclick=()=>open({creatorName,subscribed:subscribed===true,owner});
 promo.append(inner,button);
 panel.prepend(promo);
}
function open({creatorName="Creador",subscribed=false,owner=false}={}){
 if(document.getElementById("premiumLiveLab"))return;
 const coinAPI=window.AfterShiftCoinDemo;
 if(!coinAPI)return;
 let fakeSub=false,ticketPaid=false,wallet=coinAPI.blank(),events=[],notice="";
 const previousFocus=document.activeElement;
 const overlay=element("div","premium-live-overlay");overlay.id="premiumLiveLab";
 const card=element("section","premium-live-dialog");
 card.setAttribute("role","dialog");card.setAttribute("aria-modal","true");card.setAttribute("aria-labelledby","premiumLiveTitle");
 const close=makeButton("premium-live-close");close.textContent="×";
 const eyebrow=element("div","premium-live-eyebrow");
 const heading=element("h2","premium-live-title");heading.id="premiumLiveTitle";
 const disclaimer=element("p","premium-live-disclaimer");
 const creator=element("p","premium-live-creator");
 const state=element("div","premium-live-sub-status");
 const why=element("p","premium-live-note");
 const fakeBtn=makeButton("premium-live-muted");
 const price=element("div","premium-live-ticket");
 const ticketTitle=element("strong"),amount=element("b","",currency(TICKET_CENTS));
 price.append(ticketTitle,amount);
 const ticketBtn=makeButton("premium-live-ticket-btn");
 const ticketNote=element("p","premium-live-note");
 const demoStage=element("section","premium-live-stage");
 const demoEyebrow=element("strong","premium-live-stage-tag"),video=element("div","premium-live-placeholder");
 const camera=element("div","premium-live-camera","▶");
 const stageText=element("p"),stageNote=element("small");
 video.append(camera,stageText,stageNote);
 demoStage.append(demoEyebrow,video);
 const packsTitle=element("h3"),packNote=element("p","premium-live-note"),packs=element("div","premium-live-packs");
 const packControls=[];
 [50,100,200].forEach(coins=>{
   const button=makeButton("premium-live-pack");
   button.onclick=()=>{if(!ticketPaid)return;
     const quote=coinAPI.price(coins);
     wallet=coinAPI.topup(wallet,coins);
     notice=d().rechargeMsg(coins,currency(quote.charged));events.unshift(notice);render();
   };
   packs.appendChild(button);packControls.push({coins,button});
 });
 const giftsTitle=element("h3"),gifts=element("div","premium-live-gifts"),giftControls=[];
 [{kind:"heart",coins:5},{kind:"star",coins:10},{kind:"diamond",coins:50},{kind:"crown",coins:100}].forEach(({kind,coins})=>{
   const button=makeButton("premium-live-gift");
   button.onclick=()=>{
     if(!ticketPaid){notice=d().noTicket;render();return;}
     const result=coinAPI.redeem(wallet,coins,kind);
     if(result.error){notice=d().noBalance;render();return;}
     wallet=result;notice=d().giftMsg(d()[kind],coins);events.unshift(notice);render();
   };
   gifts.appendChild(button);giftControls.push({kind,coins,button});
 });
 const metrics=element("div","premium-live-metrics");
 const metricNames=["wallet","paid","sent","rechargeFees","creatorCut","platformCut","pending"];
 const metricCells={};
 metricNames.forEach(key=>{
   const cell=element("div","premium-live-metric");
   const label=element("span"),value=element("strong");
   cell.append(label,value);metrics.appendChild(cell);metricCells[key]={label,value};
 });
 const feedback=element("div","premium-live-feedback");
 feedback.setAttribute("role","status");feedback.setAttribute("aria-live","polite");
 const histTitle=element("h3"),history=element("ul","premium-live-history");
 const foot=element("p","premium-live-note premium-live-foot");
 const reset=makeButton("premium-live-reset");
 const eligible=()=>subscribed||owner||fakeSub;
 fakeBtn.onclick=()=>{
   fakeSub=true;notice=d().mocked;events.unshift(notice);render();
 };
 ticketBtn.onclick=()=>{
   if(!eligible()){notice=d().ticketLocked;render();return;}
   if(ticketPaid)return;
   ticketPaid=true;notice=d().ticketMsg;events.unshift(notice);render();
 };
 reset.onclick=()=>{
   fakeSub=false;ticketPaid=false;wallet=coinAPI.blank();events=[];notice="";render();
 };
 function render(){
   const x=d(),total=summary(ticketPaid,wallet);
   close.setAttribute("aria-label",x.close);
   eyebrow.textContent=x.eyebrow;heading.textContent=x.title;disclaimer.textContent=x.disclaimer;
   creator.textContent=x.creator+": "+creatorName;
   state.textContent=x.status+": "+(owner?x.owner:subscribed?x.active:fakeSub?x.simulated:x.inactive);
   state.classList.toggle("is-eligible",eligible());
   why.textContent=x.why;fakeBtn.textContent=x.mock;
   fakeBtn.hidden=eligible();
   ticketTitle.textContent=x.ticket;amount.textContent=currency(TICKET_CENTS);
   ticketBtn.textContent=ticketPaid?x.ticketDone:x.ticketBtn;
   ticketBtn.disabled=ticketPaid||!eligible();
   ticketNote.textContent=eligible()?x.ticketNote:x.ticketLocked;
   demoStage.hidden=!ticketPaid;demoEyebrow.textContent=x.liveTag;
   stageText.textContent=x.stage;stageNote.textContent=x.stageDetail;
   packsTitle.textContent=x.topups;packNote.textContent=x.topupInfo;
   packControls.forEach(({coins,button})=>{
     button.textContent=x.pack(coins,currency(coinAPI.price(coins).charged));button.disabled=!ticketPaid;
   });
   giftsTitle.textContent=x.gifts;
   giftControls.forEach(({kind,coins,button})=>{
     button.textContent=x.giftLabel(x[kind],coins);button.disabled=!ticketPaid;
   });
   const values={wallet:total.coins+" 🪙",paid:currency(total.ticket),sent:currency(total.giftSpend),
    rechargeFees:currency(total.fee),creatorCut:currency(total.creator),
    platformCut:currency(total.platform),pending:currency(total.unspent)};
   metricNames.forEach(key=>{metricCells[key].label.textContent=x[key];metricCells[key].value.textContent=values[key];});
   feedback.textContent=notice||x.ticketNote;
   histTitle.textContent=x.history;
   history.replaceChildren();
   if(!events.length)history.append(element("li","",x.empty));
   else events.slice(0,7).forEach(ev=>history.append(element("li","",ev)));
   foot.textContent=x.note;reset.textContent=x.reset;
 }
 function stop(){
   if(!overlay.isConnected)return;
   document.removeEventListener("keydown",onKey);
   document.getElementById("uiLanguage")?.removeEventListener("change",onLang);
   overlay.remove();if(previousFocus?.isConnected)previousFocus.focus();
 }
 function onKey(ev){if(ev.key==="Escape"){ev.preventDefault();stop();}}
 function onLang(){notice="";render();}
 close.onclick=stop;overlay.onclick=ev=>{if(ev.target===overlay)stop();};
 card.append(close,eyebrow,heading,disclaimer,creator,state,why,fakeBtn,price,ticketBtn,ticketNote,
             demoStage,packsTitle,packNote,packs,giftsTitle,gifts,metrics,feedback,histTitle,history,foot,reset);
 overlay.appendChild(card);document.body.appendChild(overlay);
 document.addEventListener("keydown",onKey);
 document.getElementById("uiLanguage")?.addEventListener("change",onLang);
 render();close.focus();
}
window.AfterShiftLiveLab={mount,open,summary};
})();
