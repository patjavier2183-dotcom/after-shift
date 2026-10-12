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
document.addEventListener("DOMContentLoaded",async()=>{
 const section=document.getElementById("accountSection");
 if(!section||typeof currentUser!=="function")return;
 const user=await currentUser();
 if(!user)return;
 const {data:staff,error:staffError}=await supabaseClient.from("five30_staff").select("staff_role").eq("user_id",user.id).maybeSingle();
 if(staffError||!staff)return;
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
  }
 }
 async function renderSupportInbox(target,userFilter=null){
  target.replaceChildren();
  const heading=document.createElement("h3");heading.textContent=userFilter?"Consultas de esta cuenta":"Centro de atención";
  if(!userFilter){const intro=document.createElement("p");intro.className="five30-support-intro";intro.textContent="Superadministrador 5:30 · Supervisión de casos y equipo";const roles=document.createElement("div");roles.className="five30-support-roles";const detail=document.createElement("div");detail.className="five30-support-team-detail";detail.hidden=true;for(const [symbol,label] of [["♙","Supervisores"],["♧","Operadores"],["▤","Casos"]]){const cell=document.createElement("button");cell.type="button";cell.className="five30-support-role-button";const ico=document.createElement("span");ico.textContent=symbol;const name=document.createElement("strong");name.textContent=label;cell.append(ico,name);cell.onclick=()=>{for(const other of roles.children)other.setAttribute("aria-pressed",String(other===cell));if(label==="Casos"){detail.hidden=true;heading.hidden=false;summary.hidden=false;refresh.hidden=false;results.hidden=false;activeFilter="all";drawTickets();return;}heading.hidden=true;summary.hidden=true;refresh.hidden=true;results.hidden=true;detail.hidden=false;detail.replaceChildren();const h=document.createElement("h4");h.textContent=label;const p=document.createElement("p");p.textContent=label==="Supervisores"?"La lista de supervisores estará disponible cuando se habilite la gestión de personal y sus permisos seguros.":"La lista de operadores, sus casos y actividad estará disponible cuando se habilite la gestión de personal y sus permisos seguros.";const back=document.createElement("button");back.type="button";back.textContent="← Volver a casos";back.onclick=()=>roles.lastElementChild.click();detail.append(h,p,back);};roles.append(cell);}target.append(intro,roles,detail);}
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
   const reload=document.createElement("button");reload.type="button";reload.textContent="Actualizar conversación";reload.onclick=loadMessages;
   async function loadMessages(){
    const {data,error}=await supabaseClient.from("five30_support_messages").select("sender_id,body,created_at").eq("ticket_id",t.id).order("created_at",{ascending:true}).limit(150);
    messages.replaceChildren();
    if(error){messages.textContent="Error al cargar conversación.";return;}
    for(const m of data||[]){const p=document.createElement("p");p.textContent=(m.sender_id===t.user_id?"Usuario":"Soporte 5:30")+": "+m.body;messages.append(p);}
   }
   send.onclick=async()=>{if(!reply.value.trim())return;send.disabled=true;const {error}=await supabaseClient.from("five30_support_messages").insert({ticket_id:t.id,sender_id:user.id,body:reply.value.trim()});send.disabled=false;if(error){feedback.textContent="No se pudo enviar.";return;}reply.value="";feedback.textContent="Respuesta registrada.";await loadMessages();};
   update.onclick=async()=>{update.disabled=true;const requested=status.value;feedback.textContent="Guardando estado…";const {error}=await supabaseClient.rpc("five30_support_set_status",{p_ticket_id:t.id,p_status:requested});if(error){update.disabled=false;feedback.textContent="No se pudo guardar el estado. Inténtalo nuevamente.";status.value=t.status;return;}const {data:confirmed,error:readError}=await supabaseClient.from("five30_support_tickets").select("status").eq("id",t.id).single();update.disabled=false;if(readError||!confirmed){feedback.textContent="Cambio enviado, pero no se pudo verificar. Actualiza las consultas.";return;}t.status=confirmed.status;const cached=tickets.find(item=>item.id===t.id);if(cached)cached.status=confirmed.status;h.textContent=t.subject+" · "+(names[t.status]||t.status);status.value=t.status;for(const button of summary.querySelectorAll(".five30-support-stat-button")){const label=button.querySelector("span")?.textContent;const count=label==="Total"?tickets.length:label==="Pendientes"?tickets.filter(x=>x.status==="open").length:label==="En atención"?tickets.filter(x=>x.status==="in_progress").length:tickets.filter(x=>x.status==="resolved").length;button.querySelector("strong").textContent=String(count);button.setAttribute("aria-label",label+": "+count+" casos");}feedback.textContent=t.status===requested?"Estado guardado y contadores actualizados.":"El servidor devolvió un estado diferente. Consulta el estado mostrado.";};
   results.append(back,h,reload,messages,reply,send,status,update,feedback);await loadMessages();
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

});
