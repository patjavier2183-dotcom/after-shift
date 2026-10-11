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

/* Self-service help entry point: requests originate with the account owner. */
document.addEventListener("DOMContentLoaded",async()=>{
 const section=document.getElementById("accountSection");
 if(!section||typeof currentUser!=="function")return;
 const user=await currentUser();if(!user)return;
 const {data:staff}=await supabaseClient.from("five30_staff").select("staff_role").eq("user_id",user.id).maybeSingle();
 if(staff)return;
 const panel=document.createElement("section");panel.className="five30-professional five30-self-help";
 const title=document.createElement("h3");title.textContent="Centro de ayuda";
 const info=document.createElement("p");info.textContent="¿Necesitas ayuda con tu cuenta, acceso, publicaciones o suscripciones? Puedes contactar al equipo de soporte.";
 const select=document.createElement("select");select.setAttribute("aria-label","Motivo de ayuda");
 for(const name of ["No puedo iniciar sesión","Recuperación de contraseña","Cuenta de creador o agencia","Suscripciones y pagos","Reportar un problema","Otra consulta"]){const o=document.createElement("option");o.textContent=name;select.append(o);}
 const details=document.createElement("textarea");details.rows=3;details.placeholder="Describe tu problema. Nunca compartas contraseñas ni códigos de verificación.";
 const send=document.createElement("button");send.type="button";send.textContent="Enviar consulta";
 const notice=document.createElement("p");notice.setAttribute("role","status");notice.textContent="Tus mensajes quedan dentro de 5:30. Nunca compartas contraseñas ni códigos.";
 const history=document.createElement("div");history.className="five30-support-history";
 const categories={"No puedo iniciar sesión":"Acceso","Recuperación de contraseña":"Contraseña","Cuenta de creador o agencia":"Creadores y agencias","Suscripciones y pagos":"Suscripciones y pagos","Reportar un problema":"Reportar problema","Otra consulta":"Otro"};
 async function openConversation(ticket){
  history.replaceChildren();
  const back=document.createElement("button");back.type="button";back.textContent="← Volver a mis consultas";back.onclick=loadHistory;history.append(back);
  const heading=document.createElement("h4");heading.textContent=ticket.subject+" · "+ticket.status;history.append(heading);
  const messages=document.createElement("div");history.append(messages);
  const reply=document.createElement("textarea");reply.rows=2;reply.placeholder="Escribe tu mensaje";reply.maxLength=4000;
  const submit=document.createElement("button");submit.type="button";submit.textContent="Enviar mensaje";
  async function refresh(){
   const {data,error}=await supabaseClient.from("five30_support_messages").select("sender_id,body,created_at").eq("ticket_id",ticket.id).order("created_at",{ascending:true}).limit(150);
   messages.replaceChildren();
   if(error){messages.textContent="No se pudieron cargar los mensajes.";return;}
   for(const m of data||[]){const p=document.createElement("p");p.textContent=(m.sender_id===user.id?"Tú":"Soporte 5:30")+": "+m.body;messages.append(p);}
  }
  submit.onclick=async()=>{const body=reply.value.trim();if(!body)return;submit.disabled=true;const {error}=await supabaseClient.from("five30_support_messages").insert({ticket_id:ticket.id,sender_id:user.id,body});submit.disabled=false;if(error){notice.textContent="No se pudo enviar el mensaje.";return;}reply.value="";await refresh();};
  history.append(reply,submit);await refresh();
 }
 async function loadHistory(){
  history.textContent="Cargando consultas…";
  const {data,error}=await supabaseClient.from("five30_support_tickets").select("id,subject,status,created_at").eq("user_id",user.id).order("created_at",{ascending:false}).limit(30);
  history.replaceChildren();
  const heading=document.createElement("h4");heading.textContent="Mis consultas";history.append(heading);
  if(error){history.append("No se pudieron cargar las consultas.");return;}
  if(!data?.length){history.append("Todavía no tienes consultas.");return;}
  for(const t of data){const btn=document.createElement("button");btn.type="button";btn.className="five30-user-open";btn.textContent=t.subject+" · "+t.status;btn.onclick=()=>openConversation(t);history.append(btn);}
 }
 send.onclick=async()=>{
  const body=details.value.trim();if(body.length<5){notice.textContent="Describe el problema con al menos 5 caracteres.";return;}
  send.disabled=true;notice.textContent="Enviando consulta…";
  const {data:t,error:e}=await supabaseClient.from("five30_support_tickets").insert({user_id:user.id,category:categories[select.value],subject:select.value}).select("id").single();
  if(e){send.disabled=false;notice.textContent="No se pudo registrar la consulta. Intenta nuevamente.";return;}
  const {error:me}=await supabaseClient.from("five30_support_messages").insert({ticket_id:t.id,sender_id:user.id,body});
  send.disabled=false;
  if(me){notice.textContent="La consulta se creó, pero el mensaje no se envió. Abre Mis consultas para completarla.";await loadHistory();return;}
  details.value="";notice.textContent="Consulta recibida. Podrás revisar aquí la respuesta.";await loadHistory();
 };

 const launcher=document.createElement("button");launcher.type="button";launcher.className="five30-help-launcher";launcher.textContent="✦ Ayuda";launcher.setAttribute("aria-label","Abrir chat de ayuda 5:30");launcher.setAttribute("aria-expanded","false");
 const header=document.createElement("div");header.className="five30-help-header";
 const heading=document.createElement("strong");heading.textContent="Soporte 5:30";
 const close=document.createElement("button");close.type="button";close.className="five30-help-close";close.textContent="×";close.setAttribute("aria-label","Cerrar chat");
 header.append(heading,close);
 const body=document.createElement("div");body.className="five30-help-body";
 panel.append(header,body);body.append(info,select,details,send,notice,history);
 panel.setAttribute("role","dialog");panel.setAttribute("aria-label","Chat de ayuda 5:30");panel.hidden=true;
 function toggle(open){panel.hidden=!open;launcher.setAttribute("aria-expanded",String(open));if(open){loadHistory();}else{launcher.focus();}}
 launcher.onclick=()=>toggle(panel.hidden);close.onclick=()=>toggle(false);
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!panel.hidden)toggle(false);});
 document.body.append(launcher,panel);
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
  back.hidden=true;detailHeader.hidden=true;
  usersArea.hidden=true;requestsArea.hidden=true;moduleArea.hidden=true;
  for(const button of moduleButtons.values())button.setAttribute("aria-expanded","false");
  window.scrollTo({top:0,behavior:"instant"});
 }
 back.onclick=goHome;
 function showModule(key){
  navigation.hidden=true;title.hidden=true;access.hidden=true;
  back.hidden=false;detailHeader.hidden=false;detailView.hidden=false;
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
  const heading=document.createElement("h3");heading.textContent=userFilter?"Consultas de esta cuenta":"Bandeja de atención al cliente";
  const refresh=document.createElement("button");refresh.type="button";refresh.textContent="Actualizar consultas";
  const results=document.createElement("div");results.setAttribute("aria-live","polite");
  const summary=document.createElement("div");summary.className="five30-admin-stats";
  const filters=document.createElement("div");filters.className="five30-support-filters";
  let activeFilter="all",tickets=[];
  const names={open:"Pendientes",in_progress:"En atención",resolved:"Resueltos"};
  for(const [value,label] of [["all","Todos"],["open","Pendientes"],["in_progress","En atención"],["resolved","Resueltos"]]){
   const button=document.createElement("button");button.type="button";button.textContent=label;button.dataset.filter=value;
   button.onclick=()=>{activeFilter=value;drawTickets();};filters.append(button);
  }
  target.append(heading,summary,filters,refresh,results);
  function drawTickets(){
   results.replaceChildren();summary.replaceChildren();
   for(const [label,count] of [["Total",tickets.length],["Pendientes",tickets.filter(t=>t.status==="open").length],["En atención",tickets.filter(t=>t.status==="in_progress").length],["Resueltos",tickets.filter(t=>t.status==="resolved").length]]){
    const card=document.createElement("div");card.className="five30-admin-stat";
    const number=document.createElement("strong");number.textContent=String(count);
    const name=document.createElement("span");name.textContent=label;card.append(number,name);summary.append(card);
   }
   for(const b of filters.children)b.setAttribute("aria-pressed",String(b.dataset.filter===activeFilter));
   const visible=activeFilter==="all"?tickets:tickets.filter(t=>t.status===activeFilter);
   if(!visible.length){results.textContent=tickets.length?"No hay casos con este filtro.":"Todavía no hay consultas.";return;}
   for(const t of visible){
    const card=document.createElement("article");card.className="five30-review-item";
    const title=document.createElement("strong");title.textContent=t.subject;
    const meta=document.createElement("p");meta.textContent=(names[t.status]||t.status)+" · "+new Date(t.created_at).toLocaleString("es-CL");
    const button=document.createElement("button");button.type="button";button.textContent="Abrir conversación →";button.onclick=()=>showTicket(t);
    card.append(title,meta,button);results.append(card);
   }
  }
  async function showTicket(t){
   results.replaceChildren();
   const back=document.createElement("button");back.type="button";back.textContent="← Volver a consultas";back.onclick=loadTickets;
   const h=document.createElement("h4");h.textContent=t.subject+" · "+t.status;
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
   update.onclick=async()=>{update.disabled=true;const {error}=await supabaseClient.rpc("five30_support_set_status",{p_ticket_id:t.id,p_status:status.value});update.disabled=false;feedback.textContent=error?"No se pudo actualizar.":"Estado actualizado.";};
   results.append(back,h,reload,messages,reply,send,status,update,feedback);await loadMessages();
  }
  async function loadTickets(){
   results.textContent="Cargando consultas…";
   let query=supabaseClient.from("five30_support_tickets").select("id,user_id,category,subject,status,created_at").order("created_at",{ascending:false}).limit(100);if(userFilter)query=query.eq("user_id",userFilter);
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
 panel.append(toolbar,back,title,access,navigation,detailHeader,detailView);
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
