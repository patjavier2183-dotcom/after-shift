/* 5:30: secure intake. No role changes are performed here. */
document.addEventListener("DOMContentLoaded",()=>{
 const notice=document.getElementById("professionalNotice");
 const show=t=>{notice.hidden=false;notice.textContent=t;};
 async function apply(type){
  const user=await currentUser();
  if(!user){show("Inicia sesión antes de enviar una solicitud.");return;}
  const name=prompt(type==="agency"?"Nombre público de la agencia o estudio:":"Nombre público que deseas utilizar:");
  if(name===null)return;
  const clean=name.trim();
  if(clean.length<2||clean.length>100){show("El nombre debe tener entre 2 y 100 caracteres.");return;}
  const email=(user.email||"").trim();
  if(!email){show("Tu cuenta debe tener un correo válido.");return;}
  show("Enviando solicitud...");
  const {error}=await supabaseClient.from("five30_professional_requests").insert({user_id:user.id,request_type:type,public_name:clean,contact_email:email});
  if(error){show(error.code==="23505"?"Ya tienes una solicitud de este tipo. La revisaremos antes de habilitar funciones.":"No se pudo enviar la solicitud. Comprueba la conexión y vuelve a intentar.");return;}
  show("Solicitud recibida. Pendiente de revisión y verificación de identidad. Tu cuenta y permisos no han cambiado.");
 }
 document.getElementById("professionalCreator")?.addEventListener("click",()=>apply("creator"));
 document.getElementById("professionalAgency")?.addEventListener("click",()=>apply("agency"));
 // Private demo for applicants; does not grant creator role or write content.
 async function creatorPreview(){
  const user=await currentUser();if(!user)return;
  const {data,error}=await supabaseClient.from("five30_professional_requests").select("status").eq("user_id",user.id).eq("request_type","creator").maybeSingle();
  if(error||!data||!["pending","under_review"].includes(data.status))return;
  const host=document.getElementById("professionalNotice")?.parentElement;
  if(!host||document.getElementById("five30Preview"))return;
  const btn=document.createElement("button");btn.id="five30Preview";btn.type="button";btn.className="action-btn";btn.textContent="Probar Creator Studio (demo)";host.append(btn);
  btn.onclick=()=>{
   const overlay=document.createElement("div");overlay.className="profile-overlay";
   const panel=document.createElement("section");panel.className="creator-studio";
   const close=document.createElement("button");close.type="button";close.className="profile-close";close.textContent="×";close.setAttribute("aria-label","Cerrar");close.onclick=()=>overlay.remove();
   const heading=document.createElement("h2");heading.textContent="Creator Studio · DEMO";
   const info=document.createElement("p");info.textContent="Tu solicitud sigue en revisión. Esta demostración no publica, no guarda archivos ni habilita cobros.";
   const actions=document.createElement("div");actions.className="studio-actions";
   const result=document.createElement("p");result.setAttribute("role","status");result.textContent="Selecciona una función.";
   for(const [label,detail] of [["Nueva publicación","Aquí podrás crear publicaciones con imágenes y videos cuando tu cuenta esté aprobada."],["Planes y promociones","Aquí configurarás tus planes cuando los pagos estén habilitados."],["Mis publicaciones","Aquí podrás administrar tus publicaciones."],["En vivo","Aquí estarán las transmisiones en vivo cuando estén habilitadas."]]){
    const b=document.createElement("button");b.type="button";b.className="action-btn";b.textContent=label;b.onclick=()=>{result.textContent=detail;};actions.append(b);
   }
   panel.append(close,heading,info,actions,result);overlay.append(panel);document.body.append(overlay);
   overlay.onclick=e=>{if(e.target===overlay)overlay.remove();};
  };
 }
 creatorPreview();
});

/* Floating conversation: a single continuous thread, no duplicated form. */
document.addEventListener("DOMContentLoaded",async()=>{
 const section=document.getElementById("accountSection");
 if(!section||typeof currentUser!=="function")return;
 const user=await currentUser();if(!user)return;
 const {data:staff}=await supabaseClient.from("five30_staff").select("staff_role").eq("user_id",user.id).maybeSingle();
 if(staff)return;
 const categories={"No puedo iniciar sesión":"Acceso","Recuperación de contraseña":"Contraseña","Cuenta de creador o agencia":"Creadores y agencias","Suscripciones y pagos":"Suscripciones y pagos","Reportar un problema":"Reportar problema","Otra consulta":"Otro"};
 const panel=document.createElement("section");panel.className="five30-professional five30-self-help";panel.hidden=true;
 panel.setAttribute("role","dialog");panel.setAttribute("aria-label","Chat de ayuda 5:30");
 const launcher=document.createElement("button");launcher.type="button";launcher.className="five30-help-launcher";launcher.textContent="";launcher.innerHTML='<svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H6l-3 2v-6.5A7.5 7.5 0 1 1 20 11.5Z"/><path d="M8 11.5h8"/></svg><span>Ayuda</span>';launcher.setAttribute("aria-label","Abrir Soporte 5:30");launcher.title="Ayuda";launcher.setAttribute("aria-expanded","false");
 const header=document.createElement("div");header.className="five30-help-header";
 const title=document.createElement("strong");title.textContent="Soporte 5:30";const subtitle=document.createElement("small");subtitle.className="five30-help-subtitle";subtitle.textContent="Estamos aquí para ayudarte";const heading=document.createElement("div");heading.className="five30-help-heading";heading.append(title,subtitle);
 const tools=document.createElement("div");tools.className="five30-help-actions";
 const historyBtn=document.createElement("button");historyBtn.type="button";historyBtn.textContent="Mis chats";historyBtn.setAttribute("aria-label","Ver mis conversaciones");
 const close=document.createElement("button");close.type="button";close.className="five30-help-close";close.textContent="×";close.setAttribute("aria-label","Cerrar chat");
 tools.append(historyBtn,close);header.append(heading,tools);
 const thread=document.createElement("div");thread.className="five30-help-thread";thread.setAttribute("aria-live","polite");
 const composer=document.createElement("div");composer.className="five30-help-composer";
 const category=document.createElement("div");category.className="five30-help-category";
 const categoryButton=document.createElement("button");categoryButton.type="button";categoryButton.className="five30-help-category-button";categoryButton.textContent="No puedo iniciar sesión ▾";categoryButton.setAttribute("aria-expanded","false");
 const categoryOptions=document.createElement("div");categoryOptions.className="five30-help-category-options";categoryOptions.hidden=true;
 let selectedCategory="No puedo iniciar sesión";
 for(const name of Object.keys(categories)){const b=document.createElement("button");b.type="button";b.textContent=name;b.onclick=()=>{selectedCategory=name;categoryButton.textContent=name+" ▾";categoryOptions.hidden=true;categoryButton.setAttribute("aria-expanded","false");};categoryOptions.append(b);}
 categoryButton.onclick=()=>{categoryOptions.hidden=!categoryOptions.hidden;categoryButton.setAttribute("aria-expanded",String(!categoryOptions.hidden));};
 category.append(categoryButton,categoryOptions);
 const input=document.createElement("textarea");input.rows=1;input.maxLength=4000;input.placeholder="Escribe tu mensaje…";
 const send=document.createElement("button");send.type="button";send.textContent="➤";send.setAttribute("aria-label","Enviar mensaje");
 const feedback=document.createElement("p");feedback.className="five30-help-feedback";feedback.setAttribute("role","status");
 composer.append(category,input,send,feedback);panel.append(header,thread,composer);
 let active=null,view="chat",loadSeq=0;
 const statuses={open:"Pendiente",in_progress:"En atención",resolved:"Resuelto"};
 function bubble(message,mine,createdAt){
  const wrap=document.createElement("div");wrap.className="five30-help-bubble "+(mine?"mine":"agent");
  const label=document.createElement("small");label.textContent=mine?"Tú":"Soporte 5:30";
  const body=document.createElement("p");body.textContent=message;
  wrap.append(label,body);if(createdAt){const time=document.createElement("time");time.textContent=new Date(createdAt).toLocaleTimeString("es-CL",{hour:"2-digit",minute:"2-digit"});wrap.append(time);}thread.append(wrap);
 }
 function setActive(t){categoryOptions.hidden=true;categoryButton.setAttribute("aria-expanded","false");active=t;view="chat";category.hidden=!!t;title.textContent="Soporte 5:30";subtitle.textContent=t?(statuses[t.status]||t.status)+" · Te responderemos por este chat":"Estamos aquí para ayudarte";historyBtn.textContent="Mis chats";feedback.textContent="";renderThread();}
 async function renderThread(){
  const seq=++loadSeq;thread.replaceChildren();
  if(!active){bubble("¡Hola! 👋 Somos Soporte 5:30. Cuéntanos en qué podemos ayudarte.",false);thread.scrollTop=thread.scrollHeight;return;}
  const {data,error}=await supabaseClient.from("five30_support_messages").select("sender_id,body,created_at").eq("ticket_id",active.id).order("created_at",{ascending:true}).limit(150);
  if(seq!==loadSeq||view!=="chat")return;
  thread.replaceChildren();
  if(error){bubble("No pudimos cargar los mensajes. Intenta abrir nuevamente el chat.",false);return;}
  // Show the automatic receipt once, directly after the first user message.
  // It is UI-only: never save it as a staff reply or move it to the end.
  let acknowledged=false;
  for(const m of data||[]){
   const mine=m.sender_id===user.id;
   bubble(m.body,mine,m.created_at);
   if(mine&&!acknowledged){
    acknowledged=true;
    bubble("¡Recibimos tu consulta! ✓\nGracias por escribir a Soporte 5:30. Nuestro equipo revisará tu mensaje y te responderá lo antes posible por este mismo chat. No necesitas mantener esta ventana abierta.",false);
   }
  }
  thread.scrollTop=thread.scrollHeight;
 }
 async function showHistory(){
  view="history";loadSeq++;thread.textContent="Cargando conversaciones…";category.hidden=true;input.hidden=true;send.hidden=true;feedback.textContent="";
  historyBtn.textContent="← Chat";historyBtn.onclick=()=>{historyBtn.onclick=showHistory;input.hidden=false;send.hidden=false;setActive(active);};
  const {data,error}=await supabaseClient.from("five30_support_tickets").select("id,subject,status,created_at").eq("user_id",user.id).order("created_at",{ascending:false}).limit(30);
  if(view!=="history")return;
  thread.replaceChildren();
  const newChat=document.createElement("button");newChat.type="button";newChat.className="five30-help-chat-choice";newChat.textContent="+ Nueva conversación";
  newChat.onclick=()=>{historyBtn.onclick=showHistory;input.hidden=false;send.hidden=false;setActive(null);};thread.append(newChat);
  if(error){const p=document.createElement("p");p.textContent="No se pudieron cargar las conversaciones.";thread.append(p);return;}
  if(!data?.length){const p=document.createElement("p");p.textContent="Todavía no tienes conversaciones.";thread.append(p);}
  for(const t of data||[]){const b=document.createElement("button");b.type="button";b.className="five30-help-chat-choice";b.textContent=t.subject+" · "+(statuses[t.status]||t.status);b.onclick=()=>{historyBtn.onclick=showHistory;input.hidden=false;send.hidden=false;setActive(t);};thread.append(b);}
 }
 historyBtn.onclick=showHistory;
 async function startLatest(){
  const {data}=await supabaseClient.from("five30_support_tickets").select("id,subject,status,created_at").eq("user_id",user.id).order("created_at",{ascending:false}).limit(1);
  if(!panel.hidden&&view==="chat"&&!active)setActive(data?.[0]||null);
 }
 send.onclick=async()=>{
  const typed=input.value.trim();const message=typed||(active?"":selectedCategory);if(!message)return;
  send.disabled=true;feedback.textContent="Enviando…";
  let ticket=active;
  if(!ticket){
   const {data,error}=await supabaseClient.from("five30_support_tickets").insert({user_id:user.id,category:categories[selectedCategory],subject:selectedCategory}).select("id,subject,status").single();
   if(error){feedback.textContent="No se pudo iniciar el chat. Intenta nuevamente.";send.disabled=false;return;}
   ticket=data;
  }
  const {error}=await supabaseClient.from("five30_support_messages").insert({ticket_id:ticket.id,sender_id:user.id,body:message});
  send.disabled=false;
  if(error){feedback.textContent="No se pudo enviar. Intenta nuevamente.";if(!active)setActive(ticket);return;}
  input.value="";setActive(ticket);feedback.textContent="";
 };
 function toggle(open){panel.hidden=!open;backdrop.hidden=!open;launcher.hidden=open;launcher.setAttribute("aria-expanded",String(open));if(open){if(view==="history"){historyBtn.onclick=showHistory;input.hidden=false;send.hidden=false;view="chat";}renderThread();startLatest();}else launcher.focus();}
 launcher.onclick=()=>toggle(panel.hidden);close.onclick=()=>toggle(false);
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!panel.hidden)toggle(false);});
 const backdrop=document.createElement("div");backdrop.className="five30-help-backdrop";backdrop.hidden=true;backdrop.onclick=()=>toggle(false);document.body.append(launcher,backdrop,panel);
});
/* Private review workspace. Supabase RLS and RPC enforce staff rights independently of this UI. */
document.addEventListener("DOMContentLoaded",()=>{
 let initializing=false,initializedFor=null;
 async function initializeStaffWorkspace(){
 if(initializing)return;
 const section=document.getElementById("accountSection");
 if(!section||typeof currentUser!=="function"||typeof supabaseClient==="undefined")return;
 initializing=true;
 try{
 const user=await currentUser();
 if(!user||initializedFor===user.id)return;
 const {data:staff,error:staffError}=await supabaseClient.from("five30_staff").select("staff_role").eq("user_id",user.id).maybeSingle();
 if(staffError||!staff)return;
 initializedFor=user.id;
 // Staff have a dedicated workspace, not the subscriber storefront.
 document.body.classList.add("five30-staff-workspace");
 const panel=document.createElement("section");
 panel.className="five30-professional";
 const title=document.createElement("h3");title.textContent=staff.staff_role==="superadmin"?"Administración privada 5:30":"Revisión privada 5:30";
 const intro=document.createElement("p");intro.className="five30-admin-intro";intro.textContent="Solicitudes profesionales · acceso protegido con verificación en dos pasos";
 const permissions=Object.freeze({
  superadmin:["users","creators","support","finance","security"],
  admin:["users","creators","support"]
 });
 const modules=[
  ["users","Usuarios y cuentas","Búsqueda, recuperación de acceso y gestión de cuentas"],
  ["creators","Creadores y agencias","Revisión de solicitudes y perfiles profesionales"],
  ["support","Atención al cliente","Consultas, reclamos y seguimiento de casos"],
  ["finance","Finanzas","Cobros, comisiones, devoluciones y retiros"],
  ["security","Seguridad y auditoría","Permisos, accesos y registro de operaciones"]
 ];
 const role=staff.staff_role==="superadmin"?"superadmin":"admin";
 const access=document.createElement("p");access.className="five30-admin-intro";
 access.textContent=role==="superadmin"?"Superadministrador · control propietario":"Administración operativa · sin acceso a finanzas ni permisos";
 const navigation=document.createElement("div");navigation.className="five30-admin-modules";
 const usersArea=document.createElement("section");usersArea.className="five30-admin-users";usersArea.hidden=true;
 const moduleArea=document.createElement("section");moduleArea.className="five30-admin-users";moduleArea.hidden=true;
 const requestsArea=document.createElement("section");requestsArea.className="five30-admin-users";requestsArea.hidden=true;
 const moduleButtons=new Map();
 const back=document.createElement("button");back.type="button";back.className="five30-admin-back";back.textContent="← Volver al panel";back.hidden=true;
 const detailHeader=document.createElement("h3");detailHeader.className="five30-admin-detail-title";detailHeader.hidden=true;
 const detailView=document.createElement("div");detailView.className="five30-admin-detail";detailView.hidden=true;
 function goHome(){
  detailView.hidden=true;navigation.hidden=false;title.hidden=false;access.hidden=false;
  back.hidden=true;brand.hidden=false;detailHeader.hidden=true;
  usersArea.hidden=true;requestsArea.hidden=true;moduleArea.hidden=true;
  for(const button of moduleButtons.values())button.setAttribute("aria-expanded","false");
  window.scrollTo({top:0,behavior:"instant"});
 }
 back.onclick=goHome;
 function showModule(key){
  navigation.hidden=true;title.hidden=true;access.hidden=true;
  back.hidden=false;brand.hidden=true;detailHeader.hidden=false;detailView.hidden=false;
  const selected=modules.find(m=>m[0]===key);
  detailHeader.textContent=selected[1];
  window.scrollTo({top:0,behavior:"instant"});
  usersArea.hidden=key!=="users";
  requestsArea.hidden=key!=="creators";
  moduleArea.hidden=key==="users"||key==="creators";
  for(const [id,button] of moduleButtons)button.setAttribute("aria-expanded",String(id===key));
  if(key==="users"){userDetail.hidden=true;usersHeading.hidden=false;search.hidden=false;searchButton.hidden=false;usersResults.hidden=false;search.value="";loadUsers();}
  else if(key==="creators")load();
  else{
   moduleArea.replaceChildren();
   const selected=modules.find(m=>m[0]===key);
   const heading=document.createElement("h3");heading.textContent=selected[1];
   const message=document.createElement("p");
   message.textContent=key==="finance"?"Los movimientos reales estarán disponibles cuando integremos el procesador de pagos y su conciliación.":key==="security"?"La verificación en dos pasos está activa. El historial y la gestión de permisos aún están en desarrollo.":"El sistema de consultas y reclamos está en desarrollo. No hay una bandeja de tickets conectada todavía.";
   moduleArea.append(heading,message);
   if(key==="support")renderSupportInbox(moduleArea);
   if(key==="finance")renderFinanceOverview(moduleArea);
  }
 }
 function renderInternationalPayments(target){
 const section=document.createElement("section");section.className="five30-international-panel";
 const title=document.createElement("h4");title.textContent="Finanzas internacionales · por país";
 const note=document.createElement("p");note.textContent="Seleccione un país para revisar sus operaciones de prueba. Sin cobros ni retiros reales habilitados.";
 const status=document.createElement("p");status.setAttribute("role","status");
 const list=document.createElement("div");list.className="five30-international-markets";
 const detail=document.createElement("div");detail.className="five30-international-detail";
 const detailTitle=document.createElement("h4");const detailNote=document.createElement("p");
 const metrics=document.createElement("div");metrics.className="five30-international-metrics";const emptyNotice=document.createElement("p");emptyNotice.className="five30-international-empty";
 const history=document.createElement("div");history.className="five30-finance-table-scroll";
 const simulator=document.createElement("form");simulator.className="five30-finance-real-form";
 const countryLabel=document.createElement("label");countryLabel.textContent="Mercado de prueba";const country=document.createElement("select");countryLabel.append(country);
 const amountLabel=document.createElement("label");amountLabel.textContent="Monto de prueba";const amount=document.createElement("input");amount.type="number";amount.min="0.01";amount.step="0.01";amount.value="10";amount.required=true;amountLabel.append(amount);
 const run=document.createElement("button");run.type="submit";run.textContent="Simular país seleccionado";const allRun=document.createElement("button");allRun.type="button";allRun.textContent="Simular los 7 países";
 const output=document.createElement("p");output.setAttribute("role","status");
 simulator.append(countryLabel,amountLabel,run,allRun);detail.append(detailTitle,detailNote,metrics,history,emptyNotice);
 section.append(title,note,status,list,detail,simulator,output);target.append(section);
 let markets=[],selected="ALL",simulations=[],realExpenses=[],fxRates=null,fxUpdated=null,fxError="";
 const format=(minor,cur)=>new Intl.NumberFormat("es-CL",{style:"currency",currency:cur,maximumFractionDigits:2}).format(minor/100);
 async function loadReferenceRates(){try{const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),8000);let response;try{response=await fetch("https://open.er-api.com/v6/latest/USD",{signal:controller.signal,cache:"no-store"});}finally{clearTimeout(timeout);}if(!response.ok)throw Error("HTTP");const data=await response.json();if(data.result!=="success"||!Number.isFinite(data.rates?.CLP)||!Number.isFinite(data.rates?.EUR)||data.rates.CLP<=0||data.rates.EUR<=0||!data.time_last_update_utc)throw Error("Datos incompletos");const date=new Date(data.time_last_update_utc);if(!Number.isFinite(date.getTime())||Date.now()-date.getTime()>7*86400000)throw Error("Tasa antigua");fxRates=data.rates;fxUpdated=date;fxError="";}catch(e){fxRates=null;fxUpdated=null;fxError="No se pudieron verificar tasas recientes."; }renderDetail();}

 function choose(code){selected=code;country.value=code==="ALL"?(markets[0]?.country_code||""):code;list.querySelectorAll("button").forEach(btn=>btn.setAttribute("aria-pressed",String(btn.dataset.country===code)));renderDetail();}
 function renderDetail(){
 const market=markets.find(m=>m.country_code===selected),rows=simulations.filter(x=>selected==="ALL"||x.country_code===selected);
 detailTitle.textContent=market?"Finanzas · "+market.country_name:"Finanzas · Todos los países";
 detailNote.textContent=selected==="ALL"?"Operaciones de prueba, separadas por moneda. Sin cobros reales.":"Operaciones de prueba · "+(market?.checkout_currency||"")+" · Sin cobros reales.";
 metrics.replaceChildren();history.replaceChildren();
 const byCurrency=new Map();rows.forEach(x=>{const key=x.currency;const v=byCurrency.get(key)||{gross:0,creator:0,platform:0,fee:0,count:0};v.gross+=Number(x.gross_minor);v.creator+=Number(x.creator_minor);v.platform+=Number(x.platform_minor);v.fee+=Number(x.provider_fee_minor);v.count++;byCurrency.set(key,v);});
 if(selected==="ALL"){
 const summary=document.createElement("div");summary.className="five30-international-summary";
 const headline=document.createElement("strong");headline.textContent="Consolidado general · USD";
 summary.append(headline);
 const currencies=[...byCurrency.keys()];const usdOnly=currencies.every(c=>c==="USD");const usd=byCurrency.get("USD")||{gross:0,creator:0,platform:0,fee:0};
 const usdText=(v)=>format(v,"USD");
 const converted=(field)=>{let total=0;for(const [cur,v] of byCurrency){if(cur==="USD"){total+=v[field];continue;}const rate=fxRates?.[cur];if(!Number.isFinite(rate)||rate<=0)return null;total+=v[field]/rate;}return total;};
 const money=(field)=>{const total=converted(field);return total===null?"Conversión pendiente":usdText(total);};
 const totals=[["Ingresos brutos",money("gross")],["Comisión 5:30",money("platform")],["Saldo de creadores",money("creator")],["Tarifas procesador",money("fee")],["Egresos operacionales","Sin consolidar"],["Resultado operacional","Sin calcular"]];
 totals.forEach(([label,value])=>{const card=document.createElement("button");card.type="button";card.className="five30-international-summary-card";card.setAttribute("aria-expanded","false");card.onclick=()=>{const existing=summary.querySelector(".five30-international-drilldown");const isOpen=card.getAttribute("aria-expanded")==="true";if(existing)existing.remove();summary.querySelectorAll("button").forEach(b=>b.setAttribute("aria-expanded","false"));if(isOpen)return;card.setAttribute("aria-expanded","true");const panel=document.createElement("div");panel.className="five30-international-drilldown";const h=document.createElement("strong");h.textContent="Detalle · "+label;panel.append(h);const index=totals.findIndex(x=>x[0]===label);const field=["gross_minor","platform_minor","creator_minor","provider_fee_minor"][index];if(field){const table=document.createElement("table");table.className="five30-finance-table";const body=document.createElement("tbody");rows.forEach(x=>{const tr=document.createElement("tr");[markets.find(m=>m.country_code===x.country_code)?.country_name||x.country_code,x.currency,format(x[field],x.currency)].forEach(v=>{const td=document.createElement("td");td.textContent=v;tr.append(td);});body.append(tr);});table.append(body);if(rows.length){const scroll=document.createElement("div");scroll.className="five30-finance-table-scroll";scroll.append(table);panel.append(scroll);}else{const p=document.createElement("p");p.textContent="Sin operaciones registradas.";panel.append(p);}}else{const p=document.createElement("p");p.textContent=index===4?"Los gastos reales no tienen país asignado y se muestran aparte.":"No se calcula el resultado hasta contar con gastos y tipos de cambio verificables.";panel.append(p);}summary.append(panel);panel.scrollIntoView({block:"nearest"});};const caption=document.createElement("span");caption.textContent=label;const figure=document.createElement("strong");figure.textContent=value;card.append(caption,figure);summary.append(card);});
 const info=document.createElement("p");info.textContent="Operaciones simuladas: "+rows.length+". "+(fxUpdated?"Conversión de referencia a USD: "+fxUpdated.toLocaleDateString("es-CL")+" · open.er-api.com (tasas informativas, no liquidación bancaria).":fxError||"Consultando tasas de referencia…")+" Los egresos sin país asignado se informan aparte; no se calcula utilidad sin datos completos.";summary.append(info);metrics.append(summary);
 if(realExpenses.length){const totalsByStatus={paid:0,pending:0,projected:0};realExpenses.forEach(x=>{if(Object.hasOwn(totalsByStatus,x.status))totalsByStatus[x.status]+=Number(x.amount_clp)||0;});const expenses=document.createElement("div");expenses.className="five30-international-currency";const head=document.createElement("strong");head.textContent="Egresos reales de 5:30 · sin país asignado";expenses.append(head);[["Pagados",totalsByStatus.paid],["Pendientes",totalsByStatus.pending],["Proyectados",totalsByStatus.projected]].forEach(([label,value])=>{const p=document.createElement("p");p.textContent=label+": "+new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(value);expenses.append(p);});metrics.append(expenses);}
 }
 emptyNotice.textContent=rows.length?"":"Sin ingresos simulados todavía. Los importes aparecerán aquí al registrar pruebas.";emptyNotice.hidden=Boolean(rows.length);
 byCurrency.forEach((v,cur)=>{const block=document.createElement("div");block.className="five30-international-currency";const head=document.createElement("strong");head.textContent=cur+" · "+v.count+" operaciones simuladas";block.append(head);[["Ingresos simulados",v.gross],["Saldo creadores (80%)",v.creator],["Comisión 5:30 (20%)",v.platform],["Tarifas de prueba",v.fee]].forEach(([label,value])=>{const line=document.createElement("p");line.textContent=label+": "+format(value,cur);block.append(line);});metrics.append(block);});
 const table=document.createElement("table");table.className="five30-finance-table";const thead=document.createElement("thead");const headerRow=document.createElement("tr");["Fecha","País","Moneda","Ingreso","Creador 80%","5:30 20%"].forEach(v=>{const th=document.createElement("th");th.textContent=v;headerRow.append(th);});thead.append(headerRow);table.append(thead);const tbody=document.createElement("tbody");rows.forEach(x=>{const tr=document.createElement("tr");[new Date(x.created_at).toLocaleDateString("es-CL"),markets.find(m=>m.country_code===x.country_code)?.country_name||x.country_code,x.currency,format(x.gross_minor,x.currency),format(x.creator_minor,x.currency),format(x.platform_minor,x.currency)].forEach(v=>{const td=document.createElement("td");td.textContent=v;tr.append(td);});tbody.append(tr);});table.append(tbody);if(rows.length)history.append(table);
 }
 async function loadSimulations(){const {data,error}=await supabaseClient.from("five30_payment_simulations").select("country_code,currency,gross_minor,creator_minor,platform_minor,provider_fee_minor,created_at").order("created_at",{ascending:false}).limit(500);if(error){output.textContent="No se pudo consultar el historial de simulaciones.";return;}simulations=data||[];const {data:expenses,error:expenseError}=await supabaseClient.from("five30_operating_expenses").select("amount_clp,status").limit(1000);if(!expenseError)realExpenses=expenses||[];renderDetail();}
 async function loadMarkets(){const {data,error}=await supabaseClient.from("five30_payment_markets").select("country_code,country_name,display_currency,checkout_currency,payment_provider,payout_provider,checkout_enabled,payout_enabled,test_mode").order("country_name");if(error){status.textContent="No se pudo consultar la configuración internacional.";return;}markets=data||[];country.replaceChildren();list.replaceChildren();
 function addButton(code,name,details){const btn=document.createElement("button");btn.type="button";btn.className="five30-international-market";btn.dataset.country=code;const strong=document.createElement("strong");strong.textContent=name;const span=document.createElement("span");span.textContent=details;btn.append(strong,span);btn.onclick=()=>choose(code);list.append(btn);}
 addButton("ALL","🌎 Todos","Consolidado");
 markets.forEach(m=>{const opt=document.createElement("option");opt.value=m.country_code;opt.textContent=m.country_name+" · "+m.checkout_currency;country.append(opt);addButton(m.country_code,({CL:"🇨🇱",MX:"🇲🇽",CO:"🇨🇴",PE:"🇵🇪",AR:"🇦🇷",US:"🇺🇸",ES:"🇪🇸"}[m.country_code]||"🌐")+" "+m.country_name,m.checkout_currency+" · En pruebas");});
 status.textContent=markets.length+" mercados configurados · cobros reales desactivados.";choose("ALL");await loadSimulations();loadReferenceRates();}
 simulator.onsubmit=async event=>{event.preventDefault();const gross=Math.round(Number(amount.value)*100);if(!Number.isSafeInteger(gross)||gross<=0||!country.value){output.textContent="Ingresa un monto y mercado válidos.";return;}const creator=Math.round(gross*.8),platform=gross-creator;const m=markets.find(x=>x.country_code===country.value);run.disabled=true;const {error}=await supabaseClient.from("five30_payment_simulations").insert({country_code:country.value,currency:m.checkout_currency,gross_minor:gross,creator_minor:creator,platform_minor:platform,provider_fee_minor:0});run.disabled=false;if(error){output.textContent="No se pudo registrar la simulación.";return;}output.textContent="Simulación registrada. No se efectuó ningún cobro.";await loadSimulations();};
 allRun.onclick=async()=>{const gross=Math.round(Number(amount.value)*100);if(!Number.isSafeInteger(gross)||gross<=0||!markets.length){output.textContent="Ingresa un monto válido.";return;}const creator=Math.round(gross*.8),platform=gross-creator;const records=markets.map(m=>({country_code:m.country_code,currency:m.checkout_currency,gross_minor:gross,creator_minor:creator,platform_minor:platform,provider_fee_minor:0}));allRun.disabled=true;run.disabled=true;const {error}=await supabaseClient.from("five30_payment_simulations").insert(records);allRun.disabled=false;run.disabled=false;if(error){output.textContent="No se pudieron registrar las simulaciones. No se realizó ningún cobro.";return;}output.textContent="Se registraron "+records.length+" operaciones de prueba, una por país. Sin cobros reales.";choose("ALL");await loadSimulations();};
 loadMarkets();
}
function renderFinanceOverview(target){
 target.replaceChildren();
 const heading=document.createElement("h3");heading.textContent="Centro financiero";
 const intro=document.createElement("p");intro.className="five30-support-intro";intro.textContent="Superadministrador 5:30 · Resumen financiero";
 const notice=document.createElement("p");notice.className="five30-finance-notice";
 const controls=document.createElement("div");controls.className="five30-finance-demo-controls";
 const demoButton=document.createElement("button");demoButton.type="button";demoButton.textContent="Activar simulación con 10 creadores";
 const stats=document.createElement("div");stats.className="five30-admin-stats five30-finance-stats";
 const detail=document.createElement("section");detail.className="five30-finance-detail";detail.hidden=true;const expenseSummary=document.createElement("div");expenseSummary.className="five30-expense-summary";expenseSummary.hidden=true;
 const alert=document.createElement("p");alert.className="five30-finance-alert";alert.hidden=true;alert.setAttribute("role","status");
 const creators=["Paulina","Francisco","Cristian","Valentina","Camila","Martín","Antonia","Daniel","Catalina","Ignacio"];
 const sales=creators.flatMap((creator,i)=>Array.from({length:3},(_,j)=>({date:"2026-10-"+String(1+i+j).padStart(2,"0"),ref:"DEMO-"+String(i*3+j+1).padStart(4,"0"),subscriber:"Suscriptor demo "+String(i*3+j+1).padStart(2,"0"),creator,concept:j===2?"Compra individual":"Suscripción",amount:(i+3)*5000+(j+1)*2500,status:"Simulado"})));
 const payouts=creators.map((creator,i)=>({creator,amount:sales.filter(x=>x.creator===creator).reduce((sum,x)=>sum+x.amount,0),paid:i%3===0?20000:0,withdrawal:i%2===0?15000:0}));
 const withdrawals=payouts.filter(x=>x.withdrawal>0).map((x,i)=>({date:"2026-10-"+String(i+10).padStart(2,"0"),creator:x.creator,amount:x.withdrawal,method:"Transferencia (demo)",status:"Pendiente (demo)",ref:"RETIRO-DEMO-"+String(i+1).padStart(3,"0")}));
 const currency=n=>new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(n);
 const gross=sales.reduce((sum,x)=>sum+x.amount,0);
 const commission=Math.round(gross*.2);
 const balances=payouts.reduce((sum,x)=>sum+x.amount*.8-x.paid,0);
 const withdrawalTotal=withdrawals.reduce((sum,x)=>sum+x.amount,0);
 const expenseItems=[
  ["2026-10-02","Infraestructura","Cloudflare","Hosting y distribución",18000,"Pagado","GASTO-DEMO-001"],
  ["2026-10-03","Infraestructura","Supabase","Base de datos y autenticación",25000,"Pagado","GASTO-DEMO-002"],
  ["2026-10-04","Almacenamiento","Proveedor de almacenamiento","Fotografías y videos",42000,"Pagado","GASTO-DEMO-003"],
  ["2026-10-05","Servicios","Correo corporativo","Correos y notificaciones",12000,"Pagado","GASTO-DEMO-004"],
  ["2026-10-06","Marketing","Campaña digital","Captación de creadores",65000,"Pagado","GASTO-DEMO-005"],
  ["2026-10-07","Operación","Soporte técnico","Mantenimiento y asistencia",85000,"Pendiente","GASTO-DEMO-006"],
  ["2026-10-08","Pagos","Procesador de pagos","Comisiones de procesamiento (estimación ficticia)",32000,"Pendiente","GASTO-DEMO-007"],
  ["2026-10-09","Administración","Servicios contables","Contabilidad y gestión",35000,"Proyectado","GASTO-DEMO-008"]
 ];
 const expenses=expenseItems.reduce((sum,item)=>sum+item[4],0);
 const paidExpenses=expenseItems.filter(x=>x[5]==="Pagado").reduce((sum,x)=>sum+x[4],0);
 const pendingExpenses=expenseItems.filter(x=>x[5]==="Pendiente").reduce((sum,x)=>sum+x[4],0);
 const projectedExpenses=expenseItems.filter(x=>x[5]==="Proyectado").reduce((sum,x)=>sum+x[4],0);
 const committedExpenses=paidExpenses+pendingExpenses;
 const result=commission-committedExpenses;
 const views=[
  {label:"Ingresos verificados",columns:["Fecha","Referencia","Suscriptor","Creador","Concepto","Monto","Estado"],rows:sales.map(x=>[x.date,x.ref,x.subscriber,x.creator,x.concept,currency(x.amount),x.status]),total:gross,description:"Ingresos brutos simulados de 30 movimientos. No representan pagos reales."},
  {label:"Comisión 5:30",columns:["Fecha","Referencia","Creador","Venta bruta","Comisión 5:30 (20%)"],rows:sales.map(x=>[x.date,x.ref,x.creator,currency(x.amount),currency(x.amount*.2)]),total:commission,description:"Una sola comisión del 20% por venta. Es ingreso bruto de la plataforma, no utilidad neta; no se suman comisiones duplicadas."},
  {label:"Saldo de creadores",columns:["Creador","Ventas brutas","Participación 80%","Pagos realizados","Retiros solicitados","Saldo por pagar"],rows:payouts.map(x=>[x.creator,currency(x.amount),currency(x.amount*.8),currency(x.paid),currency(x.withdrawal),currency(x.amount*.8-x.paid)]),total:balances,description:"Saldo total por pagar a creadores. Incluye los retiros solicitados que todavía no se han pagado."},
  {label:"Retiros pendientes",columns:["Fecha","Creador","Monto solicitado","Método","Estado","Referencia"],rows:withdrawals.map(x=>[x.date,x.creator,currency(x.amount),x.method,x.status,x.ref]),total:withdrawalTotal,description:"Retiros solicitados simulados; ya están incluidos en el saldo de creadores."},
  {label:"Egresos operacionales",columns:["Fecha","Categoría","Proveedor","Descripción","Monto","Estado","Referencia"],rows:expenseItems.map(x=>[x[0],x[1],x[2],x[3],currency(x[4]),x[5],x[6]]),total:expenses,description:"Pagados: "+currency(paidExpenses)+" · Pendientes: "+currency(pendingExpenses)+" · Proyectados: "+currency(projectedExpenses)+". El resultado operacional solo descuenta pagados y pendientes."},
  {label:"Resultado operacional",columns:["Concepto","Monto"],rows:[["Comisiones 5:30",currency(commission)],["Gastos pagados",currency(-paidExpenses)],["Gastos pendientes",currency(-pendingExpenses)],["Resultado comprometido",currency(result)],["Gastos proyectados (no descontados)",currency(projectedExpenses)]],total:result,description:"Comisiones menos gastos pagados y pendientes. Los proyectados se muestran aparte; resultado simulado antes de impuestos y otros ajustes."}
 ];
 let demo=false,active=-1,expenseStatus="";
 const labels=views.map(view=>{const card=document.createElement("button");card.type="button";card.className="five30-admin-stat five30-finance-stat";card.setAttribute("aria-pressed","false");const value=document.createElement("strong");value.textContent="—";const name=document.createElement("span");name.textContent=view.label;card.append(value,name);stats.append(card);return {card,value};});
 const close=document.createElement("button");close.type="button";close.textContent="← Volver al resumen";close.onclick=()=>{detail.hidden=true;active=-1;labels.forEach(x=>x.card.setAttribute("aria-pressed","false"));};
 const detailHeading=document.createElement("h4"),detailDescription=document.createElement("p"),totalLine=document.createElement("p");
 const filters=document.createElement("div");filters.className="five30-finance-filters";
 const from=document.createElement("input");from.type="date";from.setAttribute("aria-label","Fecha desde");
 const to=document.createElement("input");to.type="date";to.setAttribute("aria-label","Fecha hasta");
 const search=document.createElement("input");search.type="search";search.placeholder="Buscar en la tabla";search.setAttribute("aria-label","Buscar en la tabla");
 const fromLabel=document.createElement("label");fromLabel.textContent="Fecha desde";fromLabel.append(from);const toLabel=document.createElement("label");toLabel.textContent="Fecha hasta";toLabel.append(to);filters.append(fromLabel,toLabel,search);
 const scroll=document.createElement("div");scroll.className="five30-finance-table-scroll";
 const table=document.createElement("table");table.className="five30-finance-table";scroll.append(table);
 const empty=document.createElement("p");empty.className="five30-finance-empty";
 const exportButton=document.createElement("button");exportButton.type="button";exportButton.textContent="Exportar CSV (simulación)";
 function visibleRows(){if(!demo||active<0)return [];return views[active].rows.filter(row=>{if(active===4&&expenseStatus&&row[5]!==expenseStatus)return false;const d=row[0];const dateMatch=!/^2026-/.test(d)||((!from.value||d>=from.value)&&(!to.value||d<=to.value));return dateMatch&&row.join(" ").toLowerCase().includes(search.value.trim().toLowerCase());});}
 function drawTable(){if(active<0)return;const view=views[active];detailHeading.textContent=view.label+(active===4&&expenseStatus?" · "+expenseStatus:"");detailDescription.textContent=demo?view.description:"No hay movimientos reales verificados. Se requiere integración y conciliación con el procesador de pagos.";table.replaceChildren();const thead=document.createElement("thead"),tr=document.createElement("tr");view.columns.forEach(column=>{const th=document.createElement("th");th.textContent=column;tr.append(th);});thead.append(tr);table.append(thead);const tbody=document.createElement("tbody");const rows=visibleRows();rows.forEach(row=>{const tr=document.createElement("tr");row.forEach(value=>{const td=document.createElement("td");td.textContent=value;tr.append(td);});tbody.append(tr);});table.append(tbody);
 const moneyColumns=active===0?[5]:active===1?[3,4]:active===2?[1,2,3,4,5]:active===3?[2]:active===4?[4]:[1];
 const totals=view.columns.map((_,i)=>i===0?(active===5?"RESULTADO":"TOTAL"):active===5&&i===1?currency(rows.some(row=>row[0]==="Resultado comprometido")?result:0):moneyColumns.includes(i)?currency(rows.reduce((sum,row)=>sum+Number(String(row[i]).replace(/[^0-9-]/g,"")),0)):"");
 if(demo&&rows.length){const foot=document.createElement("tfoot"),tr=document.createElement("tr");if(active===5)foot.className=result<0?"five30-result-negative":result>0?"five30-result-positive":"five30-result-neutral";totals.forEach(value=>{const td=document.createElement("td");td.textContent=value;tr.append(td);});foot.append(tr);table.append(foot);scroll.scrollLeft=0;}
 empty.textContent=rows.length?"":"Sin movimientos para mostrar con los filtros seleccionados.";
 totalLine.textContent=demo?"Total de "+rows.length+" registros filtrados · Total general sin filtros: "+currency(view.total):"Total real: no disponible";
 exportButton.disabled=!demo||!rows.length;}
 from.onchange=drawTable;to.onchange=drawTable;search.oninput=drawTable;
 labels.forEach((item,i)=>{item.card.onclick=()=>{active=i;expenseStatus="";detail.hidden=false;labels.forEach((x,j)=>x.card.setAttribute("aria-pressed",String(i===j)));drawTable();detail.scrollIntoView({behavior:"smooth",block:"start"});};});
 exportButton.onclick=()=>{if(!demo||active<0)return;const current=visibleRows();const cols=views[active].columns;const moneyCols=active===0?[5]:active===1?[3,4]:active===2?[1,2,3,4,5]:active===3?[2]:active===4?[4]:[];const footer=cols.map((_,i)=>i===0?"RESULTADO":active===5&&i===1?currency(current.some(row=>row[0]==="Resultado comprometido")?result:0):moneyCols.includes(i)?currency(current.reduce((sum,row)=>sum+Number(String(row[i]).replace(/[^0-9-]/g,"")),0)):"");const lines=[cols,...current,footer].map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(";"));const blob=new Blob(["\uFEFF"+lines.join("\r\n")],{type:"text/csv;charset=utf-8"});const url=URL.createObjectURL(blob);const link=document.createElement("a");link.href=url;link.download="five30-simulacion-"+(active+1)+".csv";link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 function renderMode(){expenseSummary.replaceChildren();expenseSummary.hidden=!demo;if(demo){[["Pagados",paidExpenses,"paid"],["Pendientes",pendingExpenses,"pending"],["Proyectados",projectedExpenses,"projected"]].forEach(([name,value,status])=>{const item=document.createElement("button");item.type="button";item.className="five30-expense-chip five30-expense-"+status;item.setAttribute("aria-label","Ver gastos "+name.toLowerCase());item.onclick=()=>{active=4;expenseStatus=status==="paid"?"Pagado":status==="pending"?"Pendiente":"Proyectado";from.value="";to.value="";search.value="";detail.hidden=false;labels.forEach((x,j)=>x.card.setAttribute("aria-pressed",String(j===4)));drawTable();detail.scrollIntoView({behavior:"smooth",block:"start"});};const label=document.createElement("span");label.textContent=name;const amount=document.createElement("strong");amount.textContent=currency(value);item.append(label,amount);expenseSummary.append(item);});}notice.textContent=demo?"MODO DEMOSTRACIÓN · 10 creadores ficticios · 30 ingresos simulados. Ninguna cifra corresponde a pagos reales.":"Sin procesador de pagos aprobado ni conciliación conectada. No hay ingresos reales verificados para mostrar.";demoButton.textContent=demo?"Desactivar y borrar simulación":"Activar simulación con 10 creadores";labels.forEach((item,i)=>{item.value.textContent=demo?currency(views[i].total):"—";item.card.dataset.financeStatus=!demo?"neutral":i===5?(result<0?"danger":"success"):i===3?"warning":i===4?"danger":i===2?"warning":"success";});alert.hidden=!demo;alert.className="five30-finance-alert "+(result<0?"five30-finance-alert-danger":"five30-finance-alert-success");alert.textContent=demo?(result<0?"● ALERTA ROJA · Pérdida operacional simulada de "+currency(Math.abs(result))+". Ventas brutas necesarias para cubrir gastos: "+currency(Math.ceil(committedExpenses/.2))+".":"● RESULTADO POSITIVO · Excedente operacional simulado de "+currency(result)+"."):"";if(active>=0)drawTable();}
 demoButton.onclick=()=>{demo=!demo;expenseStatus="";from.value="";to.value="";search.value="";renderMode();};
 controls.append(demoButton);
 detail.append(close,detailHeading,detailDescription,totalLine,filters,scroll,empty,exportButton);
 const realExpenses=document.createElement("section");realExpenses.className="five30-finance-real-expenses";
 const realTitle=document.createElement("h4");realTitle.textContent="Registro de egresos reales";
 const realNote=document.createElement("p");realNote.textContent="Separado de la simulación. Solo gastos registrados por administración.";
 const realForm=document.createElement("form");realForm.className="five30-finance-real-form";
 const fields=[["Fecha","date","expense_date"],["Vencimiento (opcional)","date","due_date"],["Categoría","select","category"],["Proveedor","select","vendor"],["Descripción / nota","text","description"],["Monto CLP","number","amount_clp"],["N.º de documento (opcional)","text","reference"]];
 const inputs={};
 const categories=["Hosting y dominio","Almacenamiento","Publicidad y marketing","Soporte técnico","Contabilidad","Comisiones bancarias","Correos y comunicaciones","Servicios profesionales","Equipamiento","Otros"];
 const knownVendors=["Cloudflare","Supabase","Flow","Google","Meta","Otro proveedor"];
 function appendOption(select,value,label){const option=document.createElement("option");option.value=value;option.textContent=label;select.append(option);}
 fields.forEach(([name,type,key])=>{const label=document.createElement("label");label.textContent=name;const input=document.createElement(type==="select"?"select":"input");if(type!=="select")input.type=type;input.name=key;if(["expense_date","category","vendor","description","amount_clp"].includes(key))input.required=true;if(key==="amount_clp"){input.min="1";input.step="1";input.inputMode="numeric";}if(key==="expense_date")input.value=new Date().toISOString().slice(0,10);
 if(key==="category"){appendOption(input,"","Seleccionar categoría");categories.forEach(v=>appendOption(input,v,v));}
 if(key==="vendor"){appendOption(input,"","Seleccionar proveedor");knownVendors.forEach(v=>appendOption(input,v,v));}
 label.append(input);realForm.append(label);inputs[key]=input;});
 const customVendor=document.createElement("label");customVendor.textContent="Nombre del nuevo proveedor";const customVendorInput=document.createElement("input");customVendorInput.type="text";customVendorInput.placeholder="Escribe el proveedor";customVendor.append(customVendorInput);customVendor.hidden=true;realForm.append(customVendor);
 inputs.vendor.onchange=()=>{customVendor.hidden=inputs.vendor.value!=="Otro proveedor";customVendorInput.required=!customVendor.hidden;};
 const statusLabel=document.createElement("label");statusLabel.textContent="Estado";const statusSelect=document.createElement("select");[["projected","Proyectado"],["pending","Pendiente"],["paid","Pagado"]].forEach(([value,label])=>{const option=document.createElement("option");option.value=value;option.textContent=label;statusSelect.append(option);});statusLabel.append(statusSelect);realForm.append(statusLabel);
 const saveExpense=document.createElement("button");saveExpense.type="submit";saveExpense.textContent="Registrar egreso";realForm.append(saveExpense);
 const realFeedback=document.createElement("p");realFeedback.setAttribute("role","status");
 const realTotals=document.createElement("p");
 const realScroll=document.createElement("div");realScroll.className="five30-finance-table-scroll";
 const realTable=document.createElement("table");realTable.className="five30-finance-table";realScroll.append(realTable);
 async function loadRealExpenses(){const {data,error}=await supabaseClient.from("five30_operating_expenses").select("expense_date,due_date,category,vendor,description,amount_clp,status,reference").order("expense_date",{ascending:false}).limit(250);if(error){realFeedback.textContent="No se pudo consultar el registro de egresos.";return;}const selectedVendor=inputs.vendor.value;const existingOptions=new Set(knownVendors);(data||[]).forEach(item=>{if(item.vendor&& !existingOptions.has(item.vendor)){appendOption(inputs.vendor,item.vendor,item.vendor);existingOptions.add(item.vendor);}});if(selectedVendor)inputs.vendor.value=selectedVendor;realTable.replaceChildren();const head=document.createElement("thead"),tr=document.createElement("tr");["Fecha","Vencimiento","Categoría","Proveedor","Descripción","Monto","Estado","Referencia"].forEach(label=>{const th=document.createElement("th");th.textContent=label;tr.append(th);});head.append(tr);realTable.append(head);const body=document.createElement("tbody");const sums={paid:0,pending:0,projected:0};(data||[]).forEach(item=>{sums[item.status]=(sums[item.status]||0)+Number(item.amount_clp);const row=document.createElement("tr");[item.expense_date,item.due_date||"—",item.category,item.vendor,item.description,currency(item.amount_clp),{paid:"Pagado",pending:"Pendiente",projected:"Proyectado"}[item.status]||item.status,item.reference||"—"].forEach(value=>{const td=document.createElement("td");td.textContent=value;row.append(td);});body.append(row);});realTable.append(body);realTotals.textContent="Pagados: "+currency(sums.paid)+" · Pendientes: "+currency(sums.pending)+" · Proyectados: "+currency(sums.projected);if(!(data||[]).length)realFeedback.textContent="Aún no hay egresos reales registrados.";}
 realForm.onsubmit=async event=>{event.preventDefault();saveExpense.disabled=true;realFeedback.textContent="Guardando egreso…";const payload={expense_date:inputs.expense_date.value,due_date:inputs.due_date.value||null,category:inputs.category.value.trim(),vendor:inputs.vendor.value==="Otro proveedor"?customVendorInput.value.trim():inputs.vendor.value,description:inputs.description.value.trim(),amount_clp:Number(inputs.amount_clp.value),reference:inputs.reference.value.trim()||null,status:statusSelect.value};const {error}=await supabaseClient.from("five30_operating_expenses").insert(payload);saveExpense.disabled=false;if(error){realFeedback.textContent="No se pudo guardar el egreso. Comprueba tus permisos y los datos.";return;}realFeedback.textContent="Egreso registrado correctamente.";realForm.reset();customVendor.hidden=true;customVendorInput.required=false;inputs.expense_date.value=new Date().toISOString().slice(0,10);await loadRealExpenses();};
 realExpenses.append(realTitle,realNote,realForm,realFeedback,realTotals,realScroll);
 // Navegación simplificada: preserva las herramientas anteriores sin mezclar pruebas con operaciones reales.
 const tabs=document.createElement("div");tabs.className="five30-finance-demo-controls";
 const panes={};const buttons={};
 const sections=[["resumen","Resumen general"],["operaciones","Operaciones"],["informes","Informes"]];
 sections.forEach(([key,label])=>{const btn=document.createElement("button");btn.type="button";btn.textContent=label;btn.setAttribute("aria-pressed",String(key==="resumen"));buttons[key]=btn;tabs.append(btn);const pane=document.createElement("section");pane.hidden=key!=="resumen";panes[key]=pane;});
 function selectFinanceTab(key){sections.forEach(([id])=>{panes[id].hidden=id!==key;buttons[id].setAttribute("aria-pressed",String(id===key));});}
 sections.forEach(([key])=>buttons[key].onclick=()=>selectFinanceTab(key));
 const summaryNote=document.createElement("p");summaryNote.textContent="Vista mundial y por país. Los registros disponibles actualmente son pruebas; no representan ingresos reales.";
 panes.resumen.append(summaryNote);
 renderInternationalPayments(panes.resumen);
 const operationsNote=document.createElement("p");operationsNote.textContent="Las operaciones reales aparecerán cuando el procesador de pagos esté integrado y conciliado. Las herramientas de prueba se mantienen aparte.";
 const testing=document.createElement("details");const testingTitle=document.createElement("summary");testingTitle.textContent="Herramientas de prueba y registros anteriores";testing.append(testingTitle,controls,alert,stats,expenseSummary,detail);
 const historical=document.createElement("details");const historicalTitle=document.createElement("summary");historicalTitle.textContent="Registro administrativo de egresos existente (fuera del control comercial)";historical.append(historicalTitle,realExpenses);
 panes.operaciones.append(operationsNote,testing,historical);
 const reportHeading=document.createElement("h4");reportHeading.textContent="Informe semanal de ingresos";
 const reportNote=document.createElement("p");reportNote.textContent="Aquí se preparará el informe de lunes a domingo con operaciones reales confirmadas, desglose por país, monedas originales, participación de creadores, comisión 5:30, tarifas y referencias para contabilidad. No se emitirán informes contables basados en simulaciones.";
 const reportState=document.createElement("p");reportState.textContent="Pendiente: integración y conciliación de cobros reales. Exportación PDF y Excel aún no disponible.";
 panes.informes.append(reportHeading,reportNote,reportState);
 target.append(heading,intro,tabs,panes.resumen,panes.operaciones,panes.informes);
 loadRealExpenses();
 renderMode();
}
async function renderSupportInbox(target,userFilter=null){
  target.replaceChildren();
  const heading=document.createElement("h3");heading.textContent=userFilter?"Consultas de esta cuenta":"Centro de atención";
  if(!userFilter){const intro=document.createElement("p");intro.className="five30-support-intro";intro.textContent="Superadministrador 5:30 · Supervisión de casos y equipo";const roles=document.createElement("div");roles.className="five30-support-roles";const detail=document.createElement("div");detail.className="five30-support-team-detail";detail.hidden=true;for(const [symbol,label] of [["♙","Supervisores"],["♧","Operadores"],["▤","Casos"]]){const cell=document.createElement("button");cell.type="button";cell.className="five30-support-role-button";const ico=document.createElement("span");ico.textContent=symbol;const name=document.createElement("strong");name.textContent=label;cell.append(ico,name);cell.onclick=async()=>{for(const other of roles.children)other.setAttribute("aria-pressed",String(other===cell));if(label==="Casos"){detail.hidden=true;heading.hidden=false;summary.hidden=false;refresh.hidden=false;results.hidden=false;activeFilter="all";drawTickets();return;}heading.hidden=true;summary.hidden=true;refresh.hidden=true;results.hidden=true;detail.hidden=false;detail.replaceChildren();const h=document.createElement("h4");h.textContent=label;const p=document.createElement("p");p.textContent="Consultando personal autorizado…";const back=document.createElement("button");back.type="button";back.textContent="← Volver a casos";back.onclick=()=>roles.lastElementChild.click();detail.append(h,p,back);const {data,error}=await supabaseClient.rpc("five30_support_staff_directory");if(detail.hidden)return;if(error){p.textContent="No se pudo consultar el personal. Comprueba la verificación de seguridad.";return;}const desired=label==="Supervisores"?"supervisor":"operator";const staff=(data||[]).filter(person=>person.staff_role===desired);p.textContent=staff.length?staff.length+" "+(staff.length===1?"persona registrada":"personas registradas"):"No hay "+label.toLowerCase()+" registrados todavía.";for(const person of staff){const item=document.createElement("div");item.className="five30-support-staff-item";const name=document.createElement("strong");name.textContent=person.email||"Cuenta sin correo";const count=document.createElement("span");const assigned=tickets.filter(ticket=>ticket.assigned_to===person.user_id);count.textContent=label==="Operadores"?assigned.length+" casos asignados · "+assigned.filter(ticket=>ticket.status!=="resolved").length+" activos":"Supervisor registrado";item.append(name,count);detail.insertBefore(item,back);}};roles.append(cell);}target.append(intro,roles,detail);}
  const refresh=document.createElement("button");refresh.type="button";refresh.textContent="Actualizar consultas";
  const results=document.createElement("div");results.setAttribute("aria-live","polite");
  const summary=document.createElement("div");summary.className="five30-admin-stats";
  let activeFilter="all",tickets=[];
  const names={open:"Pendientes",in_progress:"En atención",resolved:"Resueltos"};
  target.append(heading,summary,refresh,results);
  function drawTickets(){
   results.replaceChildren();summary.replaceChildren();
   const counts=[["all","Total",tickets.length],["open","Pendientes",tickets.filter(t=>t.status==="open").length],["in_progress","En atención",tickets.filter(t=>t.status==="in_progress").length],["resolved","Resueltos",tickets.filter(t=>t.status==="resolved").length]];
   for(const [value,label,count] of counts){
    const card=document.createElement("button");card.type="button";card.className="five30-admin-stat five30-support-stat-button";card.setAttribute("aria-pressed",String(activeFilter===value));card.setAttribute("aria-label",label+": "+count+" casos");
    const number=document.createElement("strong");number.textContent=String(count);
    const name=document.createElement("span");name.textContent=label;card.append(number,name);
    card.onclick=()=>{activeFilter=value;drawTickets();};summary.append(card);
   }
   const visible=activeFilter==="all"?tickets:tickets.filter(t=>t.status===activeFilter);
   if(!visible.length){results.textContent=tickets.length?"No hay casos con este filtro.":"Todavía no hay consultas.";return;}
   for(const t of visible){
    const card=document.createElement("article");card.className="five30-review-item";
    const title=document.createElement("strong");title.textContent=t.subject;
    const meta=document.createElement("p");meta.textContent=(names[t.status]||t.status)+" · "+(t.assigned_to?"Asignado a operador":"Sin asignar")+" · "+new Date(t.created_at).toLocaleString("es-CL");
    const button=document.createElement("button");button.type="button";button.textContent="Abrir conversación →";button.onclick=()=>showTicket(t);
    card.append(title,meta,button);results.append(card);
   }
  }
  async function showTicket(t){
   results.replaceChildren();
   const back=document.createElement("button");back.type="button";back.textContent="← Volver a consultas";back.onclick=loadTickets;
   const h=document.createElement("h4");h.textContent=t.subject+" · "+(names[t.status]||t.status);
   const messages=document.createElement("div");messages.className="five30-support-thread";
   const reply=document.createElement("textarea");reply.rows=3;reply.maxLength=4000;reply.placeholder="Respuesta de Soporte 5:30";
   const send=document.createElement("button");send.type="button";send.textContent="Responder";
   const status=document.createElement("select");for(const [v,l] of [["open","Abierto"],["in_progress","En atención"],["resolved","Resuelto"]]){const o=document.createElement("option");o.value=v;o.textContent=l;status.append(o);}status.value=t.status;
   const update=document.createElement("button");update.type="button";update.textContent="Guardar estado";
   const feedback=document.createElement("p");feedback.setAttribute("role","status");
   const escalation=document.createElement("div");escalation.className="five30-support-escalation";const escalationReason=document.createElement("textarea");escalationReason.rows=2;escalationReason.maxLength=2000;escalationReason.placeholder="Motivo para solicitar supervisor (mínimo 10 caracteres)";const escalationButton=document.createElement("button");escalationButton.type="button";escalationButton.textContent="Solicitar supervisor";escalationButton.onclick=async()=>{const reason=escalationReason.value.trim();if(reason.length<10){feedback.textContent="Explica el motivo con al menos 10 caracteres.";return;}escalationButton.disabled=true;const {error}=await supabaseClient.rpc("five30_support_request_supervisor",{p_ticket_id:t.id,p_reason:reason});escalationButton.disabled=false;if(error){feedback.textContent="No se pudo derivar el caso. Solo el operador asignado puede solicitar supervisor y no puede haber otra solicitud pendiente.";return;}escalationReason.value="";feedback.textContent="Solicitud enviada al supervisor. La conversación se conserva.";};escalation.append(escalationReason,escalationButton);
   const reload=document.createElement("button");reload.type="button";reload.textContent="Actualizar conversación";reload.onclick=loadMessages;
   async function loadMessages(){
    const {data,error}=await supabaseClient.from("five30_support_messages").select("sender_id,body,created_at").eq("ticket_id",t.id).order("created_at",{ascending:true}).limit(150);
    messages.replaceChildren();
    if(error){messages.textContent="Error al cargar conversación.";return;}
    for(const m of data||[]){const p=document.createElement("p");p.textContent=(m.sender_id===t.user_id?"Usuario":"Soporte 5:30")+": "+m.body;messages.append(p);}
   }
   send.onclick=async()=>{if(!reply.value.trim())return;send.disabled=true;const {error}=await supabaseClient.from("five30_support_messages").insert({ticket_id:t.id,sender_id:user.id,body:reply.value.trim()});send.disabled=false;if(error){feedback.textContent="No se pudo enviar.";return;}reply.value="";feedback.textContent="Respuesta registrada.";await loadMessages();};
   update.onclick=async()=>{update.disabled=true;const requested=status.value;feedback.textContent="Guardando estado…";const {error}=await supabaseClient.rpc("five30_support_set_status",{p_ticket_id:t.id,p_status:requested});if(error){update.disabled=false;feedback.textContent="No se pudo guardar el estado. Inténtalo nuevamente.";status.value=t.status;return;}const {data:confirmed,error:readError}=await supabaseClient.from("five30_support_tickets").select("status").eq("id",t.id).single();update.disabled=false;if(readError||!confirmed){feedback.textContent="Cambio enviado, pero no se pudo verificar. Actualiza las consultas.";return;}t.status=confirmed.status;const cached=tickets.find(item=>item.id===t.id);if(cached)cached.status=confirmed.status;h.textContent=t.subject+" · "+(names[t.status]||t.status);status.value=t.status;for(const button of summary.querySelectorAll(".five30-support-stat-button")){const label=button.querySelector("span")?.textContent;const count=label==="Total"?tickets.length:label==="Pendientes"?tickets.filter(x=>x.status==="open").length:label==="En atención"?tickets.filter(x=>x.status==="in_progress").length:tickets.filter(x=>x.status==="resolved").length;button.querySelector("strong").textContent=String(count);button.setAttribute("aria-label",label+": "+count+" casos");}feedback.textContent=t.status===requested?"Estado guardado y contadores actualizados.":"El servidor devolvió un estado diferente. Consulta el estado mostrado.";};
   results.append(back,h,reload,messages,reply,send,status,update,escalation,feedback);await loadMessages();
  }
  async function loadTickets(){
   results.textContent="Cargando consultas…";
   let query=supabaseClient.from("five30_support_tickets").select("id,user_id,category,subject,status,assigned_to,created_at").order("created_at",{ascending:false}).limit(100);if(userFilter)query=query.eq("user_id",userFilter);
   const {data,error}=await query;
   if(error){results.textContent="No se pudieron consultar los casos. Verifica tu acceso de seguridad.";return;}
   tickets=data||[];drawTickets();
  }
  refresh.onclick=loadTickets;await loadTickets();
 }

 for(const [key,name,description] of modules){
  if(!permissions[role].includes(key))continue;
  const item=document.createElement("button");item.type="button";item.className="five30-admin-module five30-admin-module-button";
  item.setAttribute("aria-expanded","false");
  const heading=document.createElement("strong");heading.textContent=name;
  const detail=document.createElement("small");detail.textContent=description;
  const state=document.createElement("span");
  state.textContent=key==="users"?"Ver usuarios registrados":key==="creators"?"Ver solicitudes": "Abrir sección";
  item.append(heading,detail,state);item.onclick=()=>showModule(key);
  moduleButtons.set(key,item);navigation.append(item);
 }
 const stats=document.createElement("div");stats.className="five30-admin-stats";stats.setAttribute("aria-label","Resumen de solicitudes");
 const filter=document.createElement("select");filter.className="five30-admin-filter";filter.setAttribute("aria-label","Filtrar solicitudes");
 for(const [value,label] of [["all","Todas las solicitudes"],["pending","Pendientes"],["under_review","En revisión"],["rejected","Rechazadas"]]){
  const option=document.createElement("option");option.value=value;option.textContent=label;filter.append(option);
 }
 let requests=[];
 const refresh=document.createElement("button");refresh.type="button";refresh.textContent="Actualizar panel";
 const list=document.createElement("div");list.setAttribute("aria-live","polite");
 const toolbar=document.createElement("div");toolbar.className="five30-admin-toolbar";
 const brand=document.createElement("strong");brand.textContent="5:30 · YOUR WAY.";
 toolbar.append(brand);
 const logout=document.getElementById("logoutBtn");
 if(logout){logout.classList.add("five30-admin-logout");toolbar.append(logout);}
 const usersHeading=document.createElement("h3");usersHeading.textContent="Usuarios registrados";
 const search=document.createElement("input");search.type="search";search.placeholder="Buscar por correo";search.setAttribute("aria-label","Buscar usuario por correo");search.maxLength=100;
 const searchButton=document.createElement("button");searchButton.type="button";searchButton.textContent="Buscar";
 const usersResults=document.createElement("div");usersResults.setAttribute("aria-live","polite");
 const userDetail=document.createElement("section");userDetail.className="five30-user-detail";userDetail.hidden=true;
 const userBack=document.createElement("button");userBack.type="button";userBack.className="five30-admin-back";userBack.textContent="← Volver a usuarios";
 userBack.onclick=()=>{userDetail.hidden=true;usersHeading.hidden=false;search.hidden=false;searchButton.hidden=false;usersResults.hidden=false;window.scrollTo({top:0,behavior:"instant"});};
 usersArea.append(usersHeading,search,searchButton,usersResults,userDetail);
 function openUser(u){
  userDetail.replaceChildren(userBack);
  const fmt=v=>v?new Date(v).toLocaleString("es-CL"):"Sin registro";
  const heading=document.createElement("h3");heading.textContent="Centro de atención · Usuario";
  const email=document.createElement("strong");email.textContent=u.email||"Sin correo";
  const summary=document.createElement("p");summary.textContent="Perfil: "+u.profile_role+(u.is_staff?" · Personal 5:30":"")+" · Último acceso: "+fmt(u.last_sign_in_at);
  const tabs=document.createElement("div");tabs.className="five30-support-tabs";
  const content=document.createElement("div");content.className="five30-support-content";
  const sections=[
   ["Resumen",()=>{const p=document.createElement("p");p.textContent="Registro: "+fmt(u.created_at);const id=document.createElement("p");id.className="five30-user-id";id.textContent="ID de cuenta: "+u.user_id;const status=document.createElement("p");status.textContent="Estado de bloqueo y verificación: pendiente de integración con el servicio de autenticación.";content.append(p,id,status);}],
   ["Acceso y seguridad",()=>{const h=document.createElement("h4");h.textContent="Recuperación de acceso";const p=document.createElement("p");p.textContent="Por seguridad, nunca solicites contraseñas ni códigos del autenticador. El envío de enlaces de recuperación desde el panel todavía no está habilitado.";const note=document.createElement("p");note.textContent="Las funciones de suspender, desbloquear o cambiar permisos requieren un servicio seguro con autorización y auditoría.";content.append(h,p,note);}],
   ["Casos del usuario",()=>{const p=document.createElement("p");p.textContent="Consultas iniciadas por esta cuenta. Puedes abrir cada caso, responder y actualizar su estado sin salir de la ficha.";content.append(p);const area=document.createElement("div");area.className="five30-user-cases";content.append(area);renderSupportInbox(area,u.user_id);}]

  ];
  function activate(index){content.replaceChildren();for(let i=0;i<tabs.children.length;i++)tabs.children[i].setAttribute("aria-pressed",String(i===index));sections[index][1]();}
  for(const [i,section] of sections.entries()){const btn=document.createElement("button");btn.type="button";btn.textContent=section[0];btn.onclick=()=>activate(i);tabs.append(btn);}
  userDetail.append(heading,email,summary,tabs,content);activate(0);
  usersHeading.hidden=true;search.hidden=true;searchButton.hidden=true;usersResults.hidden=true;userDetail.hidden=false;
  window.scrollTo({top:0,behavior:"instant"});
 }

 async function loadUsers(){
  usersResults.textContent="Consultando usuarios…";searchButton.disabled=true;
  const {data,error}=await supabaseClient.rpc("five30_admin_users",{p_search:search.value.trim(),p_limit:30});
  searchButton.disabled=false;usersResults.replaceChildren();
  if(error){usersResults.textContent="No se pudo consultar el directorio. Comprueba tu sesión de seguridad.";return;}
  if(!data?.length){usersResults.textContent="No se encontraron usuarios.";return;}
  const count=document.createElement("p");count.textContent="Mostrando "+data.length+" cuenta(s), máximo 30 por búsqueda.";usersResults.append(count);
  for(const u of data){
   const card=document.createElement("article");card.className="five30-review-item";
   const name=document.createElement("strong");name.textContent=u.email||"Sin correo";
   const details=document.createElement("p");
   const created=u.created_at?new Date(u.created_at).toLocaleDateString("es-CL"):"Sin fecha";
   const last=u.last_sign_in_at?new Date(u.last_sign_in_at).toLocaleDateString("es-CL"):"Sin registro";
   details.textContent="Perfil: "+u.profile_role+" · Registro: "+created+" · Último acceso: "+last+(u.is_staff?" · Personal 5:30":"");
   const select=document.createElement("button");select.type="button";select.className="five30-user-open";select.textContent="Ver ficha y ayuda →";select.onclick=()=>openUser(u);
   card.append(name,details,select);usersResults.append(card);
  }
 }
 searchButton.onclick=loadUsers;
 search.addEventListener("keydown",e=>{if(e.key==="Enter")loadUsers();});
 requestsArea.append(intro,stats,filter,refresh,list);
 detailView.append(usersArea,moduleArea,requestsArea);
 toolbar.insertBefore(back,logout||null);
 panel.append(toolbar,title,access,navigation,detailHeader,detailView);
 section.append(panel);
 supabaseClient.auth.onAuthStateChange((event,session)=>{
  if(event==="SIGNED_OUT"||!session)document.body.classList.remove("five30-staff-workspace");
 });
 function render(){
  stats.replaceChildren();
  const groups=[["Total",requests.length],["Pendientes",requests.filter(x=>x.status==="pending").length],["En revisión",requests.filter(x=>x.status==="under_review").length],["Rechazadas",requests.filter(x=>x.status==="rejected").length]];
  for(const [label,value] of groups){
   const tile=document.createElement("div");tile.className="five30-admin-stat";
   const number=document.createElement("strong");number.textContent=String(value);
   const name=document.createElement("span");name.textContent=label;
   tile.append(number,name);stats.append(tile);
  }
  list.replaceChildren();
  const shown=filter.value==="all"?requests:requests.filter(x=>x.status===filter.value);
  if(!shown.length){list.textContent=requests.length?"No hay solicitudes con este filtro.":"No hay solicitudes todavía.";return;}
  for(const item of shown){
   const card=document.createElement("div");card.className="five30-review-item";
   const heading=document.createElement("strong");heading.textContent=item.public_name+" · "+(item.request_type==="agency"?"Agencia / estudio":"Creador");
   const info=document.createElement("p");info.textContent=item.contact_email+" · "+item.status+" · "+new Date(item.created_at).toLocaleDateString("es-CL");
   card.append(heading,info);
   if(["pending","under_review"].includes(item.status)){
    for(const [label,nextStatus] of [["En revisión","under_review"],["Rechazar","rejected"]]){
     if(item.status===nextStatus)continue;
     const button=document.createElement("button");button.type="button";button.textContent=label;
     button.onclick=async()=>{
      const note=prompt("Motivo de la revisión (mínimo 5 caracteres):");
      if(note===null)return;
      if(note.trim().length<5){alert("El motivo debe tener al menos 5 caracteres.");return;}
      button.disabled=true;
      const {error:reviewError}=await supabaseClient.rpc("five30_review_request",{p_request_id:item.id,p_next_status:nextStatus,p_note:note.trim()});
      if(reviewError){alert("No se pudo registrar la revisión.");button.disabled=false;return;}
      await load();
     };
     card.append(button);
    }
   }
   list.append(card);
  }
 }
 async function load(){
  refresh.disabled=true;list.textContent="Actualizando solicitudes…";
  const {data,error}=await supabaseClient.from("five30_professional_requests").select("id,request_type,public_name,contact_email,status,created_at").order("created_at",{ascending:false}).limit(50);
  refresh.disabled=false;
  if(error){stats.replaceChildren();list.textContent="No se pudieron cargar las solicitudes.";return;}
  requests=data||[];
  render();
 }
 filter.onchange=render;
 refresh.onclick=load;
 // Modules open on demand; no public account list is loaded until requested.
 }finally{initializing=false;}
 }
 initializeStaffWorkspace();
 supabaseClient.auth.onAuthStateChange((event)=>{if(event==="SIGNED_IN"||event==="INITIAL_SESSION")setTimeout(initializeStaffWorkspace,0);if(event==="SIGNED_OUT"){initializedFor=null;document.body.classList.remove("five30-staff-workspace");}});
});
