const SUPABASE_URL="https://heqjyafaxjzisddmgvob.supabase.co";
const SUPABASE_KEY="sb_publishable_u8E7mHoZgYnUw02fmkAKUQ_8l1vnuJy";
const supabaseClient=supabase.createClient(SUPABASE_URL,SUPABASE_KEY);

const creators=[
{name:"Alex Morgan",handle:"@alexm",sub:"US$9.99",tag:"CREATOR",bio:"Contenido exclusivo y comunidad."},
{name:"Sofia Lane",handle:"@sofialane",sub:"US$12.00",tag:"FEATURED",bio:"Contenido premium para suscriptores."},
{name:"Mia Carter",handle:"@miac",sub:"US$8.99",tag:"CREATOR",bio:"Nuevas publicaciones cada semana."},
{name:"Valentina R.",handle:"@valer",sub:"US$14.99",tag:"FEATURED",bio:"Perfil premium de AFTER SHIFT."}];

const grid=document.getElementById("creatorGrid");
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
async function currentUser(){const {data}=await supabaseClient.auth.getUser();return data.user;}

async function loadAccount(){
 const user=await currentUser(); if(!user)return;
 const {data:p}=await supabaseClient.from("profiles").select("username,display_name,role").eq("id",user.id).maybeSingle();
 const {count:fc}=await supabaseClient.from("follows").select("*",{count:"exact",head:true}).eq("follower_id",user.id);
 const {count:sc}=await supabaseClient.from("subscriptions").select("*",{count:"exact",head:true}).eq("subscriber_id",user.id).eq("status","active");
 document.getElementById("accountSection").style.display="block";
 document.getElementById("accountTitle").textContent="Hola, "+(p?.display_name||user.email);
 document.getElementById("accountEmail").textContent=user.email;
 document.getElementById("accountRole").textContent="Rol: "+(p?.role||"user")+" · @"+(p?.username||"usuario");
 document.getElementById("followCount").textContent=fc||0; document.getElementById("subCount").textContent=sc||0;
 document.getElementById("loginBtn").textContent="Mi cuenta";
 document.getElementById("loginBtn").onclick=()=>document.getElementById("accountSection").scrollIntoView({behavior:"smooth"});
}

async function render(){
 grid.innerHTML=creators.map((c,i)=>`<article class="card" data-index="${i}"><div class="cover"></div><div class="info"><div class="name">${c.name}</div><div class="handle">${c.handle}</div><div class="meta"><span class="badge">${c.tag}</span><span>${c.sub}/mes</span></div></div></article>`).join("");
 document.querySelectorAll(".card").forEach(card=>card.onclick=()=>openProfile(+card.dataset.index));
}

async function getPosts(creatorId){
 const {data,error}=await supabaseClient.from("posts").select("id,title,preview,access,created_at").eq("creator_id",creatorId).order("created_at",{ascending:false});
 return error?[]:(data||[]);
}

async function openProfile(i){
 const c=creators[i],user=await currentUser();
 if(!user){alert("Primero debes ingresar a AFTER SHIFT.");return;}
 const {data:creator}=await supabaseClient.from("profiles").select("id,display_name,username,bio,subscription_price").eq("username",c.handle.replace("@","")).maybeSingle();
 if(!creator){alert("Este creador todavía no está registrado en la base de datos V0.");return;}
 const {data:follow}=await supabaseClient.from("follows").select("creator_id").eq("follower_id",user.id).eq("creator_id",creator.id).maybeSingle();
 const {data:sub}=await supabaseClient.from("subscriptions").select("creator_id,status").eq("subscriber_id",user.id).eq("creator_id",creator.id).maybeSingle();
 const subscribed=sub?.status==="active";
 const posts=await getPosts(creator.id);

 const overlay=document.createElement("div"); overlay.className="profile-overlay";
 overlay.innerHTML=`<section class="creator-profile">
  <button class="profile-close" id="closeProfile" aria-label="Cerrar">×</button>
  <div class="profile-cover"></div>
  <div class="profile-head">
   <div class="avatar">${esc(creator.display_name.charAt(0))}</div>
   <div class="profile-main"><div class="eyebrow">CREATOR</div><h2>${esc(creator.display_name)}</h2><div class="profile-handle">@${esc(creator.username)}</div><p>${esc(creator.bio||c.bio)}</p></div>
  </div>
  <div class="profile-actions">
   <button class="action-btn" id="followAction">${follow?"SIGUIENDO ✓":"SEGUIR"}</button>
   <button class="action-btn action-primary" id="subAction">${subscribed?"SUSCRITO ✓":"SUSCRIBIRSE · US$"+Number(creator.subscription_price||0).toFixed(2)+"/mes"}</button>
  </div>
  <div class="post-heading"><div><div class="eyebrow">PUBLICACIONES</div><h3>Contenido de ${esc(creator.display_name)}</h3></div></div>
  <div class="posts">${posts.length?posts.map(p=>`<article class="post-card"><div class="post-label">${p.access==="public"?"PÚBLICO":"SOLO SUSCRIPTORES"}</div><h4>${esc(p.title)}</h4><p>${esc(p.preview||"")}</p>${p.access==="subscriber"&&!subscribed?'<div class="locked">🔒 Suscríbete para desbloquear este contenido</div>':'<button class="read-post" data-post="'+p.id+'">VER PUBLICACIÓN</button>'}</article>`).join(""):'<div class="empty-posts">Este creador todavía no tiene publicaciones.</div>'}</div>
 </section>`;
 document.body.appendChild(overlay);

 overlay.querySelector("#closeProfile").onclick=()=>overlay.remove();
 overlay.querySelector("#followAction").onclick=async()=>{
   if(follow){const {error}=await supabaseClient.from("follows").delete().eq("follower_id",user.id).eq("creator_id",creator.id);if(error)alert(error.message);else{await loadAccount();openProfile(i);overlay.remove();}}
   else{const {error}=await supabaseClient.from("follows").insert({follower_id:user.id,creator_id:creator.id});if(error)alert(error.message);else{await loadAccount();openProfile(i);overlay.remove();}}
 };
 overlay.querySelector("#subAction").onclick=async()=>{
   if(subscribed)return;
   const {error}=await supabaseClient.from("subscriptions").insert({subscriber_id:user.id,creator_id:creator.id,status:"active"});
   if(error){alert(error.message);return;}
   alert("Suscripción V0 activada. Todavía no hay cobro real.");
   overlay.remove(); openProfile(i); await loadAccount();
 };
 overlay.querySelectorAll(".read-post").forEach(btn=>btn.onclick=async()=>{
   const id=btn.dataset.post;
   const {data:content,error}=await supabaseClient.from("post_content").select("body").eq("post_id",id).maybeSingle();
   if(error){alert(error.message);return;}
   const post=posts.find(p=>p.id===id);
   alert((post?.title||"Publicación")+"\n\n"+(content?.body||post?.preview||"Sin contenido."));
 });
}

document.getElementById("exploreBtn").onclick=()=>document.getElementById("creators").scrollIntoView({behavior:"smooth"});
document.getElementById("allBtn").onclick=()=>alert("Exploración completa: siguiente módulo.");
document.getElementById("logoutBtn").onclick=async()=>{await supabaseClient.auth.signOut();location.reload();};
document.getElementById("loginBtn").onclick=async()=>{
 const existing=await currentUser(); if(existing){document.getElementById("accountSection").scrollIntoView({behavior:"smooth"});return;}
 const email=prompt("Correo electrónico:"); if(!email)return; const password=prompt("Contraseña (mínimo 6 caracteres):"); if(!password)return;
 const {error}=await supabaseClient.auth.signInWithPassword({email,password});
 if(error){const create=confirm("No pudimos ingresar. ¿Quieres crear esta cuenta?");if(create){const username=prompt("Nombre de usuario:");if(!username)return;const {error:signupError}=await supabaseClient.auth.signUp({email,password,options:{data:{username,display_name:username}}});if(signupError)alert(signupError.message);else alert("Cuenta creada. Si Supabase solicita confirmación por correo, confírmala y vuelve a ingresar.");}else alert(error.message);}
 else{await loadAccount();document.getElementById("accountSection").scrollIntoView({behavior:"smooth"});}
};
supabaseClient.auth.onAuthStateChange(()=>loadAccount()); render(); loadAccount();