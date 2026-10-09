/* AFTER SHIFT · V23 payment simulator + tightly allowlisted test authorization.
   No real payments. For the preauthorized @aftershift -> @pat pair only, a
   separately validated Supabase RPC grants short-lived test access.
   Every other user and creator remains in the isolated fake simulation.
*/
(function(){
"use strict";
const MS_DAY=86400000;
const TERMS=[1,3,6,12];
function money(value){return "US$"+Number(value).toFixed(2).replace(".",",");}
function defaults(){
  return {price:9.99,offer:true,offerDiscount:10,
    terms:[{m:1,enabled:true,discount:0},{m:3,enabled:true,discount:5},
           {m:6,enabled:true,discount:10},{m:12,enabled:true,discount:20}]};
}
function getSettings(creatorId){
  try{
    const p=window.AfterShiftPricing;
    if(p&&p.hasSaved(creatorId))return {...p.get(creatorId),source:"Borrador de Creator Studio en este dispositivo"};
  }catch{}
  return {...defaults(),source:"Precios de ejemplo (no publicados)"};
}
function quote(plan,months,welcome){
  if(!TERMS.includes(months))throw new Error("Plazo inválido");
  const current=plan.terms.find(t=>t.m===months&&t.enabled!==false);
  if(!current)throw new Error("Este plazo no está habilitado en el borrador");
  const cents=Math.round(Number(plan.price)*100);
  if(!Number.isFinite(cents)||cents<499||cents>1000000)throw new Error("Precio inválido");
  const discount=months===1&&welcome&&plan.offer?Number(plan.offerDiscount):Number(current.discount);
  if(!Number.isInteger(discount)||discount<0||discount>50)throw new Error("Descuento inválido");
  const regular=cents*months;
  const total=Math.round(regular*(100-discount)/100);
  return {months,discount,regularCents:regular,totalCents:total,
    usedWelcome:months===1&&welcome&&plan.offer===true};
}
function addMonths(at,months){
  const date=new Date(at);
  if(!Number.isFinite(date.getTime())||!TERMS.includes(months))throw new Error("Fecha o plazo inválido");
  // Keep calendar month meaning, clamp at last day of the target month.
  const out=new Date(date.getTime());
  const day=out.getUTCDate();
  out.setUTCDate(1);
  out.setUTCMonth(out.getUTCMonth()+months);
  const last=new Date(Date.UTC(out.getUTCFullYear(),out.getUTCMonth()+1,0)).getUTCDate();
  out.setUTCDate(Math.min(day,last));
  return out.getTime();
}
function initial(){return {payment:"none",subscription:"none",paidUntil:null,autoRenew:false};}
function access(state,at=Date.now()){
  return (state.subscription==="active"||state.subscription==="cancelled")
    &&Number.isFinite(state.paidUntil)&&at<state.paidUntil;
}
function step(state,event,at,months){
  if(!TERMS.includes(months)||!Number.isFinite(at))throw new Error("Datos de prueba inválidos");
  if(event==="start")return {payment:"pending",subscription:"none",paidUntil:null,autoRenew:false};
  if(event==="approve"){
    if(state.payment!=="pending")return state;
    return {payment:"approved",subscription:"active",paidUntil:addMonths(at,months),autoRenew:true};
  }
  if(event==="reject"){
    if(state.payment!=="pending")return state;
    return {payment:"rejected",subscription:"none",paidUntil:null,autoRenew:false};
  }
  if(event==="cancel"){
    if(!access(state,at)||!state.autoRenew)return state;
    return {...state,subscription:"cancelled",autoRenew:false};
  }
  if(event==="expire"){
    if(state.subscription!=="active"&&state.subscription!=="cancelled")return state;
    return {...state,subscription:"expired",autoRenew:false,paidUntil:at-1};
  }
  if(event==="reset")return initial();
  throw new Error("Evento desconocido");
}
function dateTime(time){
  const date=new Date(time);
  try{return date.toLocaleString("es-CL",{dateStyle:"medium",timeStyle:"short"});}
  catch{return date.toLocaleString();}
}
function status(state,at){
  if(state.payment==="pending")return "Pago pendiente de confirmar";
  if(state.payment==="rejected")return "Pago rechazado";
  if(state.subscription==="expired"||state.subscription==="cancelled"&&!access(state,at))return "Suscripción vencida";
  if(state.subscription==="cancelled")return "Renovación cancelada · acceso simulado hasta el vencimiento";
  if(state.payment==="approved"&&access(state,at))return "Pago simulado aprobado";
  return "Sin intento de pago";
}
function buildElement(tag,className,textContent){
  const el=document.createElement(tag);
  if(className)el.className=className;
  if(textContent!==undefined)el.textContent=textContent;
  return el;
}
function open({creatorId,creatorName,testAccess=null}={}){
  if(!creatorId||!creatorName)return;
  if(document.getElementById("afterShiftPaymentLab"))return;
  const plan=getSettings(creatorId);
  const activeTerms=plan.terms.filter(t=>t.enabled!==false&&TERMS.includes(t.m));
  if(!activeTerms.length)activeTerms.push({m:1,enabled:true,discount:0});
  let months=activeTerms[0].m,welcome=false,state=initial(),history=[];
  let serverStatus="none",serverBusy=false,changedRealAccess=false;
  const parent=document.createElement("div");
  parent.id="afterShiftPaymentLab";
  parent.className="payment-lab-overlay";
  const dialog=buildElement("section","payment-lab-card");
  dialog.setAttribute("role","dialog");
  dialog.setAttribute("aria-modal","true");
  dialog.setAttribute("aria-labelledby","paymentLabTitle");
  const header=buildElement("div","payment-lab-header");
  const caption=buildElement("div","payment-lab-eyebrow","AFTER SHIFT · LABORATORIO V0");
  const title=buildElement("h2","payment-lab-title","Simulación de pagos");
  title.id="paymentLabTitle";
  const closeButton=buildElement("button","payment-lab-close","×");
  closeButton.type="button";
  closeButton.setAttribute("aria-label","Cerrar simulación");
  header.append(caption,title,closeButton);
  const note=buildElement("p","payment-lab-disclaimer",
    testAccess
      ?"SIN COBROS: solo para @aftershift y @pat, una aprobación de PRUEBA pedirá a Supabase una autorización temporal de 2 horas. No es un pago real."
      :"Esta pantalla simula pagos y acceso sobre datos ficticios. NO cobra, no activa una suscripción real ni desbloquea archivos privados.");
  const creator=buildElement("p","payment-lab-by","Creador: "+creatorName);
  const source=buildElement("p","payment-lab-source",plan.source);
  const sectionTitle=buildElement("h3","","Selecciona el plazo");
  const termsContainer=buildElement("div","payment-lab-terms");
  const promo=buildElement("label","payment-lab-promo");
  const promoInput=buildElement("input");
  promoInput.type="checkbox";
  promoInput.checked=false;
  const promoLabel=buildElement("span","","Aplicar oferta de bienvenida al primer mes");
  promo.append(promoInput,promoLabel);
  const totals=buildElement("div","payment-lab-total");
  const message=buildElement("div","payment-lab-state");
  message.setAttribute("role","status");message.setAttribute("aria-live","polite");
  const accessCard=buildElement("div","payment-lab-content");
  // Isolated demo gallery; never grants a real subscription or access to private posts.
  const buttonRow=buildElement("div","payment-lab-actions");
  const btnStart=buildElement("button","action-btn action-primary","1. Iniciar pago simulado");
  const btnApprove=buildElement("button","action-btn","2. Aprobar");
  const btnReject=buildElement("button","action-btn","2. Rechazar");
  const btnCancel=buildElement("button","action-btn","Cancelar renovación");
  const btnExpire=buildElement("button","action-btn","Simular vencimiento");
  const btnReset=buildElement("button","action-btn","Reiniciar prueba");
  for(const button of [btnStart,btnApprove,btnReject,btnCancel,btnExpire,btnReset])button.type="button";
  buttonRow.append(btnStart,btnApprove,btnReject,btnCancel,btnExpire,btnReset);
  // Immediate, persistent feedback NEXT TO the clicked controls on small screens.
  const actionFeedback=buildElement("div","payment-lab-action-feedback","");
  actionFeedback.setAttribute("role","status");
  actionFeedback.setAttribute("aria-live","assertive");
  actionFeedback.hidden=true;
  const activityTitle=buildElement("h3","","Registro de esta prueba");
  const historyEl=buildElement("ol","payment-lab-history");
  const foot=buildElement("p","payment-lab-foot",
    testAccess
      ?"La aprobación ficticia no verifica dinero. El acceso a @pat es una excepción administrativa de prueba, limitada a esta cuenta y autorizada por Supabase durante 2 horas. Puedes cancelarla en el perfil o con «Simular vencimiento»."
      :"El estado de prueba se borra al cerrar. La seguridad de las publicaciones reales continúa en Supabase. En producción, solo un servidor podrá confirmar el pago.");
  dialog.append(header,note,creator,source,sectionTitle,termsContainer,promo,totals,message,accessCard,buttonRow,actionFeedback,activityTitle,historyEl,foot);
  parent.appendChild(dialog);
  document.body.appendChild(parent);
  let oldFocus=document.activeElement;
  function close(){
    document.removeEventListener("keydown",onKey);
    parent.remove();
    if(changedRealAccess&&testAccess?.onClose){
      Promise.resolve().then(()=>testAccess.onClose()).catch(e=>console.error("No se pudo actualizar el perfil de prueba:",e));
    }
    if(oldFocus&&oldFocus.isConnected)oldFocus.focus();
  }
  function onKey(e){if(e.key==="Escape"){e.preventDefault();close();}}
  closeButton.onclick=close;
  parent.onclick=e=>{if(e.target===parent)close();};
  document.addEventListener("keydown",onKey);
  const now=()=>Date.now();
  function record(text){history.unshift(text);if(history.length>8)history.length=8;}
  function showActionFeedback(text){
    actionFeedback.hidden=false;
    actionFeedback.textContent=text;
  }
  function clearActionFeedback(){
    actionFeedback.hidden=true;
    actionFeedback.textContent="";
  }
  function openDemoPreview(kind){
    if(!access(state,now())){
      showActionFeedback("Primero aprueba el pago ficticio. Los íconos de prueba se habilitan solo durante la simulación activa.");
      return;
    }
    const labels={photo:"Foto de prueba",video:"Video de prueba",post:"Publicación de prueba"};
    if(!Object.prototype.hasOwnProperty.call(labels,kind))return;
    const backdrop=buildElement("div","payment-lab-demo-backdrop");
    const pane=buildElement("section","payment-lab-demo-dialog");
    pane.setAttribute("role","dialog");
    pane.setAttribute("aria-modal","true");
    pane.setAttribute("aria-label",labels[kind]);
    const closeBtn=buildElement("button","payment-lab-demo-close","×");
    closeBtn.type="button";
    closeBtn.setAttribute("aria-label","Cerrar publicación de prueba");
    pane.appendChild(closeBtn);
    pane.appendChild(buildElement("div","payment-lab-demo-eyebrow","AFTER SHIFT · CONTENIDO DEMO"));
    pane.appendChild(buildElement("h2","",labels[kind]));
    if(kind==="photo"){
      const photo=buildElement("div","creator-photo-sprite sprite-0 payment-lab-demo-photo");
      photo.setAttribute("role","img");
      photo.setAttribute("aria-label","Fotografía editorial ilustrativa utilizada en AFTER SHIFT");
      pane.appendChild(photo);
      pane.appendChild(buildElement("p","","Imagen editorial de ejemplo. No es una publicación privada ni corresponde a una compra real."));
    }else if(kind==="video"){
      const player=buildElement("video","payment-lab-demo-video");
      player.controls=true;
      player.playsInline=true;
      player.preload="metadata";
      const source=buildElement("source");
      source.src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
      source.type="video/mp4";
      player.appendChild(source);
      pane.appendChild(player);
      pane.appendChild(buildElement("p","","Video público de muestra para comprobar el reproductor. No pertenece al creador. Si tu conexión bloquea el video externo, la prueba de navegación sigue disponible."));
    }else{
      pane.appendChild(buildElement("p","payment-lab-demo-story","Esta es una publicación ficticia de AFTER SHIFT. Sirve para comprobar que, después de aprobar un pago simulado, el botón permite abrir y cerrar una publicación. Ninguna fotografía, video o archivo privado se desbloquea."));
    }
    const closeAction=buildElement("button","action-btn","Cerrar y volver a la prueba");
    closeAction.type="button";
    pane.appendChild(closeAction);
    backdrop.appendChild(pane);
    parent.appendChild(backdrop);
    const previousFocus=document.activeElement;
    function closePreview(){
      const player=pane.querySelector("video");
      if(player)player.pause();
      backdrop.remove();
      if(previousFocus?.isConnected)previousFocus.focus();
    }
    closeBtn.onclick=closePreview;
    closeAction.onclick=closePreview;
    backdrop.onclick=e=>{if(e.target===backdrop)closePreview();};
    backdrop.onkeydown=e=>{if(e.key==="Escape"){e.preventDefault();e.stopPropagation();closePreview();}};
    closeBtn.focus();
  }
  async function authorizeTrial(action){
    if(!testAccess||serverBusy)return;
    serverBusy=true;
    try{
      showActionFeedback("Consultando autorización de prueba en Supabase...");
      const data=await testAccess[action]();
      if(!data?.ok)throw new Error("Supabase no confirmó la operación.");
      serverStatus=action==="grant"?"active":"revoked";
      changedRealAccess=true;
      const text=action==="grant"
        ?"✓ PRUEBA REAL AUTORIZADA. Los archivos exclusivos de @pat ya tienen permiso por 2 horas. Cierra esta ventana para verlos; no se cobró dinero."
        :"✓ PRUEBA REVOCADA EN SUPABASE. Las publicaciones exclusivas volverán a mostrar candados.";
      record(text);
      showActionFeedback(text);
      if(!parent.isConnected&&testAccess.onClose)await testAccess.onClose();
    }catch(error){
      console.error("AFTER SHIFT · Autorización controlada:",error);
      if(action==="grant")serverStatus="failed";
      showActionFeedback("El simulador funcionó, pero Supabase NO "+(action==="grant"?"habilitó":"revocó")+" el acceso real: "+(error?.message||"Error inesperado"));
    }finally{
      serverBusy=false;
      render();
    }
  }
  function resetForNewPlan(){state=initial();history=[];clearActionFeedback();}
  function render(){
    const date=now(),estimate=quote(plan,months,welcome);
    termsContainer.replaceChildren();
    for(const t of activeTerms){
      const button=buildElement("button",months===t.m?"payment-lab-term is-selected":"payment-lab-term",
        t.m===1?"1 mes":t.m===12?"12 meses":t.m+" meses");
      button.type="button";
      button.setAttribute("aria-pressed",String(months===t.m));
      button.disabled=serverBusy||serverStatus==="active";
      button.onclick=()=>{if(button.disabled)return;months=t.m;welcome=false;promoInput.checked=false;resetForNewPlan();render();};
      termsContainer.appendChild(button);
    }
    promo.hidden=months!==1||plan.offer!==true;
    promoInput.disabled=months!==1||plan.offer!==true||serverBusy||serverStatus==="active";
    const cents=estimate.totalCents;
    totals.replaceChildren();
    totals.appendChild(buildElement("span","","Total del plazo · descuento "+estimate.discount+"%"));
    totals.appendChild(buildElement("strong","",money(cents/100)));
    const compare=buildElement("small","",estimate.discount>0
      ?"Precio normal "+money(estimate.regularCents/100)+" · "+(estimate.usedWelcome?"bienvenida del primer mes":"descuento por plazo")
      :"Sin promoción aplicada");
    totals.appendChild(compare);
    const result=status(state,date),entitled=access(state,date);
    message.replaceChildren();
    message.appendChild(buildElement("strong","",result));
    message.appendChild(buildElement("p","",state.paidUntil
      ?"Acceso DEMO hasta "+dateTime(state.paidUntil)+(state.autoRenew?" · renovación simulada activa":" · no se renovará")
      :"Todavía no hay un período de acceso aprobado."));
    accessCard.replaceChildren();
    accessCard.appendChild(buildElement("span","payment-lab-lock",entitled?"🔓":"🔒"));
    accessCard.appendChild(buildElement("strong","",entitled?"Galería DEMO desbloqueada":"Galería DEMO bloqueada"));
    accessCard.appendChild(buildElement("small","",
      "Estas publicaciones son de PRUEBA. Las fotos y videos privados de "+creatorName+" siguen protegidos."));
    const demoActions=buildElement("div","payment-lab-demo-actions");
    for(const item of [
      {kind:"photo",locked:"🔒 Foto",unlocked:"📷 Abrir foto"},
      {kind:"video",locked:"🔒 Video",unlocked:"▶ Ver video"},
      {kind:"post",locked:"🔒 Publicación",unlocked:"📄 Leer texto"}
    ]){
      const button=buildElement("button","payment-lab-demo-button",entitled?item.unlocked:item.locked);
      button.type="button";
      button.disabled=!entitled;
      button.onclick=()=>openDemoPreview(item.kind);
      demoActions.appendChild(button);
    }
    accessCard.appendChild(demoActions);
    if(testAccess){
      accessCard.appendChild(buildElement("small","",serverStatus==="active"
        ?"✓ PERMISO REAL DE PRUEBA: @aftershift puede abrir las publicaciones de @pat durante 2 horas. Cierra esta ventana para actualizar el perfil."
        :serverStatus==="revoked"
          ?"El permiso real de prueba está revocado."
          :serverStatus==="failed"
            ?"La galería DEMO se abrió, pero el acceso REAL NO fue autorizado."
            :"Los tres íconos son demostraciones. Si apruebas esta prueba, Supabase autorizará temporalmente las publicaciones reales de @pat."));
    }
    btnStart.disabled=serverBusy||state.payment==="pending"||access(state,date);
    btnApprove.disabled=serverBusy||state.payment!=="pending";
    btnApprove.textContent=state.payment==="approved"?"✓ Aprobado":"2. Aprobar";
    btnApprove.classList.toggle("action-primary",state.payment==="pending");
    btnReject.disabled=serverBusy||state.payment!=="pending";
    btnReject.textContent=state.payment==="rejected"?"✕ Rechazado":"2. Rechazar";
    btnCancel.disabled=serverBusy||!entitled||!state.autoRenew;
    btnExpire.disabled=serverBusy||!entitled;
    historyEl.replaceChildren();
    if(!history.length){
      historyEl.appendChild(buildElement("li","","Selecciona un plazo y comienza la simulación."));
    }else for(const line of history)historyEl.appendChild(buildElement("li","",line));
  }
  promoInput.onchange=()=>{if(promoInput.disabled)return;welcome=promoInput.checked;resetForNewPlan();render();};
  function apply(action,text){
    // Never fail silently when Android/WebView errors or a stale tap occurs.
    try{
      const next=step(state,action,now(),months);
      if(next===state){
        showActionFeedback("Esta acción no está disponible en el estado actual. Usa «Reiniciar prueba» si necesitas empezar de nuevo.");
        return;
      }
      state=next;
      record(text);
      render();
      const feedback={
        start:"Solicitud iniciada. Ahora presiona «2. Aprobar» o «2. Rechazar».",
        approve:"✓ PAGO APROBADO (SIMULACIÓN). Se habilitaron tres íconos de prueba: foto, video y publicación. Puedes tocarlos arriba. No se cobró dinero ni se abrió contenido privado.",
        reject:"✕ PAGO RECHAZADO (SIMULACIÓN). La tarjeta ficticia permanece bloqueada.",
        cancel:"Renovación cancelada. El acceso ficticio continúa solo hasta la fecha indicada.",
        expire:"Suscripción vencida. La tarjeta ficticia volvió a bloquearse."
      };
      showActionFeedback(feedback[action]||text);
    }catch(error){
      console.error("AFTER SHIFT · Error en la simulación de pago:",error);
      showActionFeedback("No se pudo actualizar la simulación: "+(error?.message||"error inesperado")+". Prueba «Reiniciar prueba».");
    }
  }
  btnStart.onclick=()=>apply("start","Solicitud iniciada · esperando respuesta del banco ficticio.");
  btnApprove.onclick=async()=>{
    if(state.payment!=="pending"||serverBusy)return;
    apply("approve","Aprobación simulada · galería de pruebas habilitada.");
    if(testAccess)await authorizeTrial("grant");
  };
  btnReject.onclick=()=>apply("reject","Rechazo simulado · no se concedió acceso.");
  btnCancel.onclick=()=>apply("cancel","Renovación cancelada · acceso ficticio hasta el vencimiento.");
  btnExpire.onclick=async()=>{
    if(!access(state,now())||serverBusy)return;
    apply("expire","Vencimiento simulado · tarjeta ficticia bloqueada.");
    if(testAccess&&serverStatus==="active")await authorizeTrial("revoke");
  };
  btnReset.onclick=async()=>{
    if(serverBusy)return;
    if(testAccess&&serverStatus==="active"){
      await authorizeTrial("revoke");
      if(serverStatus==="active")return;
    }
    serverStatus="none";resetForNewPlan();render();
  };
  render();
  closeButton.focus();
}
window.AfterShiftPaymentLab={open,quote,initial,step,access,status,addMonths,getSettings};
})();