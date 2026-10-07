const SUPABASE_URL="https://heqjyafaxjzisddmgvob.supabase.co";
const SUPABASE_KEY="sb_publishable_u8E7mHoZgYnUw02fmkAKUQ_8l1vnuJy";
const supabaseClient=supabase.createClient(SUPABASE_URL,SUPABASE_KEY);

const creators=[
{name:"Alex Morgan",handle:"@alexm",sub:"US$9.99",tag:"CREATOR",bio:"Contenido exclusivo y comunidad."},
{name:"Sofia Lane",handle:"@sofialane",sub:"US$12.00",tag:"FEATURED",bio:"Contenido premium para suscriptores."},
{name:"Mia Carter",handle:"@miac",sub:"US$8.99",tag:"CREATOR",bio:"Nuevas publicaciones cada semana."},
{name:"Valentina R.",handle:"@valer",sub:"US$14.99",tag:"FEATURED",bio:"Perfil premium de AFTER SHIFT."}];

const grid=document.getElementById("creatorGrid");

async function currentUser(){const {data}=await supabaseClient.auth.getUser();return data.user;}

async function loadAccount(){
  const user=await currentUser();
  if(!user)return;
  const {data:p}=await supabaseClient.from("profiles").select("username,display_name,role").eq("id",user.id).maybeSingle();
  const {count:fc}=await supabaseClient.from("follows").select("*",{count:"exact",head:true}).eq("follower_id",user.id);
  const {count:sc}=await supabaseClient.from("subscriptions").select("*",{count:"exact",head:true}).eq("subscriber_id",user.id).eq("status","active");
  document.getElementById("accountSection").style.display="block";
  document.getElementById("accountTitle").textContent="Hola, "+(p?.display_name||user.email);
  document.getElementById("accountEmail").textContent=user.email;
  document.getElementById("accountRole").textContent="Rol: "+(p?.role||"user")+" · @"+(p?.username||"usuario");
  document.getElementById("followCount").textContent=fc||0;
  document.getElementById("subCount").textContent=sc||0;
  document.getElementById("loginBtn").textContent="Mi cuenta";
  document.getElementById("loginBtn").onclick=()=>document.getElementById("accountSection").scrollIntoView({behavior:"smooth"});
}

async function render(){
  grid.innerHTML=creators.map((c,i)=>`<article class="card" data-index="${i}">
    <div class="cover"></div><div class="info"><div class="name">${c.name}</div>
    <div class="handle">${c.handle}</div><div class="meta"><span class="badge">${c.tag}</span><span>${c.sub}/mes</span></div></div></article>`).join("");
  document.querySelectorAll(".card").forEach(card=>card.onclick=()=>openProfile(+card.dataset.index));
}

function escapeHtml(value){
  return String(value||"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[ch]));
}

async function loadCreatorPosts(creatorId, isSubscribed){
  const {data:posts,error}=await supabaseClient.from("posts")
    .select("id,title,preview,access,created_at")
    .eq("creator_id",creatorId)
    .order("created_at",{ascending:false});
  if(error)return {html:`<p style="opacity:.65">No pudimos cargar las publicaciones.</p>`,count:0};

  if(!posts?.length){
    return {html:`<div style="padding:16px;border:1px solid #333;border-radius:12px;opacity:.7">Todavía no hay publicaciones.</div>`,count:0};
  }

  let html="";
  for(const post of posts){
    const locked=post.access==="subscriber" && !isSubscribed;
    let body="";
    if(!locked){
      const {data:content}=await supabaseClient.from("post_content").select("body").eq("post_id",post.id).maybeSingle();
      body=content?.body||post.preview||"";
    }
    html+=`<article style="border:1px solid #333;border-radius:14px;padding:15px;margin-top:10px">
      <div style="font-size:12px;opacity:.6;margin-bottom:6px">${post.access==="public"?"PÚBLICO":"SOLO SUSCRIPTORES"}</div>
      <h3 style="margin:0 0 7px">${escapeHtml(post.title)}</h3>
      <p style="line-height:1.5;margin:0">${locked?escapeHtml(post.preview||"Contenido exclusivo"):escapeHtml(body)}</p>
      ${locked?'<div style="margin-top:12px;padding:10px;border-radius:10px;background:#222;text-align:center">🔒 Suscríbete para desbloquear este contenido</div>':""}
    </article>`;
  }
  return {html,count:posts.length};
}

async function openProfile(i){
  const c=creators[i];
  const user=await currentUser();
  if(!user){alert("Primero debes ingresar a AFTER SHIFT.");return;}
  const {data:creator}=await supabaseClient.from("profiles").select("id,display_name,username,bio,subscription_price").eq("username",c.handle.replace("@","")).maybeSingle();
  if(!creator){alert("Este creador todavía no está registrado en la base de datos V0.");return;}
  const {data:follow}=await supabaseClient.from("follows").select("creator_id").eq("follower_id",user.id).eq("creator_id",creator.id).maybeSingle();
  const {data:sub}=await supabaseClient.from("subscriptions").select("creator_id,status").eq("subscriber_id",user.id).eq("creator_id",creator.id).maybeSingle();
  const isSubscribed=sub?.status==="active";

  const overlay=document.createElement("div");
  overlay.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.72);display:flex;align-items:center;justify-content:center;padding:20px;z-index:9999;overflow:auto";
  overlay.innerHTML=`<div style="width:min(520px,100%);background:#171717;color:#fff;border:1px solid #333;border-radius:18px;padding:24px;margin:20px 0">
    <h2 style="margin:0 0 6px">${escapeHtml(creator.display_name)}</h2>
    <div style="opacity:.7;margin-bottom:14px">@${escapeHtml(creator.username)}</div>
    <p style="line-height:1.5;margin:0 0 8px">${escapeHtml(creator.bio||c.bio)}</p>
    <p style="margin:0 0 16px">Suscripción: <strong>US$${Number(creator.subscription_price||0).toFixed(2)}/mes</strong></p>
    <div id="postList" style="margin:0 0 18px"><div style="padding:12px;border:1px solid #333;border-radius:12px;opacity:.65">Cargando publicaciones...</div></div>
    <div style="display:grid;gap:10px">
      <button id="followAction" style="padding:13px;border:0;border-radius:10px;cursor:pointer">${follow?"SIGUIENDO":"SEGUIR"}</button>
      <button id="subAction" style="padding:13px;border:0;border-radius:10px;cursor:pointer">${isSubscribed?"SUSCRITO":"SUSCRIBIRSE"}</button>
      <button id="closeAction" style="padding:11px;background:transparent;color:#aaa;border:1px solid #444;border-radius:10px;cursor:pointer">CERRAR</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);

  const close=()=>overlay.remove();
  overlay.querySelector("#closeAction").onclick=close;

  const posts=await loadCreatorPosts(creator.id,isSubscribed);
  const postList=overlay.querySelector("#postList");
  if(document.body.contains(overlay))postList.innerHTML=posts.html;

  overlay.querySelector("#followAction").onclick=async()=>{
    if(follow){
      const {error}=await supabaseClient.from("follows").delete().eq("follower_id",user.id).eq("creator_id",creator.id);
      if(error)alert(error.message);else{close();await loadAccount();}
    }else{
      const {error}=await supabaseClient.from("follows").insert({follower_id:user.id,creator_id:creator.id});
      if(error)alert(error.message);else{close();await loadAccount();}
    }
  };

  overlay.querySelector("#subAction").onclick=async()=>{
    if(isSubscribed){alert("Ya estás suscrito a "+creator.display_name+".");return;}
    const {error}=await supabaseClient.from("subscriptions").insert({subscriber_id:user.id,creator_id:creator.id,status:"active"});
    if(error){alert(error.message);return;}
    alert("Suscripción V0 activada. Todavía no hay cobro real.");
    close();
    await loadAccount();
  };
}

document.getElementById("exploreBtn").onclick=()=>document.getElementById("creators").scrollIntoView({behavior:"smooth"});
document.getElementById("allBtn").onclick=()=>alert("Exploración completa: siguiente módulo.");
document.getElementById("logoutBtn").onclick=async()=>{await supabaseClient.auth.signOut();location.reload();};

document.getElementById("loginBtn").onclick=async()=>{
  const existing=await currentUser();
  if(existing){document.getElementById("accountSection").scrollIntoView({behavior:"smooth"});return;}
  const email=prompt("Correo electrónico:");
  if(!email)return;
  const password=prompt("Contraseña (mínimo 6 caracteres):");
  if(!password)return;
  const {error}=await supabaseClient.auth.signInWithPassword({email,password});
  if(error){
    const create=confirm("No pudimos ingresar. ¿Quieres crear esta cuenta?");
    if(create){
      const username=prompt("Nombre de usuario:");
      if(!username)return;
      const {error:signupError}=await supabaseClient.auth.signUp({email,password,options:{data:{username,display_name:username}}});
      if(signupError)alert(signupError.message);
      else alert("Cuenta creada. Si Supabase solicita confirmación por correo, confírmala y vuelve a ingresar.");
    }else alert(error.message);
  }else{
    await loadAccount();
    document.getElementById("accountSection").scrollIntoView({behavior:"smooth"});
  }
};

supabaseClient.auth.onAuthStateChange(()=>loadAccount());
render();
loadAccount();