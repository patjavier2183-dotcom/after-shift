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
 function showModule(key){
  usersArea.hidden=key!=="users";
  requestsArea.hidden=key!=="creators";
  moduleArea.hidden=key==="users"||key==="creators";
  for(const [id,button] of moduleButtons)button.setAttribute("aria-expanded",String(id===key));
  if(key==="users"){search.value="";loadUsers();}
  else if(key==="creators")load();
  else{
   moduleArea.replaceChildren();
   const selected=modules.find(m=>m[0]===key);
   const heading=document.createElement("h3");heading.textContent=selected[1];
   const message=document.createElement("p");
   message.textContent=key==="finance"?"Los movimientos reales estarán disponibles cuando integremos el procesador de pagos y su conciliación.":key==="security"?"La verificación en dos pasos está activa. El historial y la gestión de permisos aún están en desarrollo.":"El sistema de consultas y reclamos está en desarrollo. No hay una bandeja de tickets conectada todavía.";
   moduleArea.append(heading,message);
  }
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
 usersArea.append(usersHeading,search,searchButton,usersResults);
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
   card.append(name,details);usersResults.append(card);
  }
 }
 searchButton.onclick=loadUsers;
 search.addEventListener("keydown",e=>{if(e.key==="Enter")loadUsers();});
 requestsArea.append(intro,stats,filter,refresh,list);
 panel.append(toolbar,title,access,navigation,usersArea,moduleArea,requestsArea);
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
