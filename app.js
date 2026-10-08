const SUPABASE_URL="https://heqjyafaxjzisddmgvob.supabase.co";
const SUPABASE_KEY="sb_publishable_u8E7mHoZgYnUw02fmkAKUQ_8l1vnuJy";
const supabaseClient=supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
const creators=[{name:"Alex Morgan",handle:"@alexm",sub:"US$9.99",tag:"CREATOR",bio:"Contenido exclusivo y comunidad."},{name:"Sofia Lane",handle:"@sofialane",sub:"US$12.00",tag:"FEATURED",bio:"Contenido premium para suscriptores."},{name:"Mia Carter",handle:"@miac",sub:"US$8.99",tag:"CREATOR",bio:"Nuevas publicaciones cada semana."},{name:"Valentina R.",handle:"@valer",sub:"US$14.99",tag:"FEATURED",bio:"Perfil premium de AFTER SHIFT."}];
const grid=document.getElementById("creatorGrid");
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
async function currentUser(){const{data}=await supabaseClient.auth.getUser();return data.user;}
async function getMyProfile(){const user=await currentUser();if(!user)return null;const{data}=await supabaseClient.from("profiles").select("id,username,display_name,role,bio,subscription_price").eq("id",user.id).maybeSingle();return data||null;}
async function loadAccount(){const user=await currentUser();if(!user)return;const p=await getMyProfile();const{count:fc}=await supabaseClient.from("follows").select("*",{count:"exact",head:true}).eq("follower_id",user.id);const{count:sc}=await supabaseClient.from("subscriptions").select("*",{count:"exact",head:true}).eq("subscriber_id",user.id).eq("status","active");document.getElementById("accountSection").style.display="block";document.getElementById("accountTitle").textContent="Hola, "+(p?.display_name||user.email);document.getElementById("accountEmail").textContent=user.email;document.getElementById("accountRole").textContent="Rol: "+(p?.role||"user")+" · @"+(p?.username||"usuario");document.getElementById("followCount").textContent=fc||0;document.getElementById("subCount").textContent=sc||0;document.getElementById("loginBtn").textContent="Mi cuenta";document.getElementById("signupBtn").style.display="none";const cb=document.getElementById("creatorBtn");cb.style.display="inline-block";cb.textContent=p?.role==="creator"?"Creator Studio":"Convertirme en creador";cb.onclick=()=>p?.role==="creator"?openCreatorStudio():becomeCreator();}
async function render(){const{data:dbCreators}=await supabaseClient.from("profiles").select("id,display_name,username,bio,subscription_price").eq("role","creator").order("display_name");const dynamic=(dbCreators||[]).map(p=>({id:p.id,name:p.display_name||p.username,handle:"@"+p.username,sub:"US$"+Number(p.subscription_price||0).toFixed(2),tag:"CREATOR",bio:p.bio||"Contenido exclusivo y comunidad.",db:true}));const demo=creators.filter(c=>!(dbCreators||[]).some(p=>p.username===c.handle.replace("@","")));const list=[...dynamic,...demo];grid.innerHTML=list.map((c,i)=>`<article class="card" data-index="${i}"><div class="cover"></div><div class="info"><div class="name">${esc(c.name)}</div><div class="handle">${esc(c.handle)}</div><div class="meta"><span class="badge">${esc(c.tag)}</span><span>${esc(c.sub)}/mes</span></div></div></article>`).join("");document.querySelectorAll(".card").forEach(card=>card.onclick=()=>openProfile(+card.dataset.index,list));}
// Private media: signed links are issued only after Supabase Storage RLS authorizes access.
async function secureMediaUrl(post){
  const raw=post.media_url||post.image_url;
  if(!raw)return "";
  const token="/storage/v1/object/public/post-media/";
  const idx=raw.indexOf(token);
  if(idx<0)return ""; // Never render unknown direct links for subscriber content.
  const path=decodeURIComponent(raw.slice(idx+token.length).split("?")[0]);
  const {data,error}=await supabaseClient.storage.from("post-media").createSignedUrl(path,300);
  return error?"":(data?.signedUrl||"");
}
async function authorizePostMedia(posts,creatorId,subscribed,viewerId){
  return Promise.all(posts.map(async p=>{
    const allowed=p.access==="public"||subscribed||viewerId===creatorId;
    return {...p,display_media_url:allowed?await secureMediaUrl(p):""};
  }));
}
async function getPosts(creatorId){const{data,error}=await supabaseClient.from("posts").select("id,title,preview,access,image_url,media_type,media_url,created_at").eq("creator_id",creatorId).order("created_at",{ascending:false});return error?[]:(data||[]);}
async function openProfile(i,list=creators){const c=list[i],user=await currentUser();if(!user){alert("Primero debes ingresar a AFTER SHIFT.");return;}const creator=c.db?{id:c.id,display_name:c.name,username:c.handle.replace("@",""),bio:c.bio,subscription_price:Number(String(c.sub).replace("US$",""))}:await (async()=>{const{data}=await supabaseClient.from("profiles").select("id,display_name,username,bio,subscription_price").eq("username",c.handle.replace("@","")).maybeSingle();return data;})();if(!creator){alert("Este creador todavía no está registrado en la base de datos V0.");return;}const{data:follow}=await supabaseClient.from("follows").select("creator_id").eq("follower_id",user.id).eq("creator_id",creator.id).maybeSingle();const{data:sub}=await supabaseClient.from("subscriptions").select("creator_id,status").eq("subscriber_id",user.id).eq("creator_id",creator.id).maybeSingle();const subscribed=sub?.status==="active";const canViewExclusive=subscribed||user.id===creator.id;const posts=await authorizePostMedia(await getPosts(creator.id),creator.id,subscribed,user.id);const overlay=document.createElement("div");overlay.className="profile-overlay";overlay.innerHTML=`<section class="creator-profile"><button class="profile-close" id="closeProfile" aria-label="Cerrar">×</button><div class="profile-cover"></div><div class="profile-head"><div class="avatar">${esc(creator.display_name.charAt(0))}</div><div class="profile-main"><div class="eyebrow">CREATOR</div><h2>${esc(creator.display_name)}</h2><div class="profile-handle">@${esc(creator.username)}</div><p>${esc(creator.bio||c.bio)}</p></div></div><div class="profile-actions"><button class="action-btn" id="followAction">${follow?"SIGUIENDO ✓":"SEGUIR"}</button><button class="action-btn action-primary" id="subAction">${subscribed?"SUSCRITO ✓":"SUSCRIBIRSE · US$"+Number(creator.subscription_price||0).toFixed(2)+"/mes"}</button></div><div class="post-heading"><div><div class="eyebrow">PUBLICACIONES</div><h3>Contenido de ${esc(creator.display_name)}</h3></div></div><div class="posts">${posts.length?posts.map(p=>`<article class="post-card">${p.access==="subscriber"&&!canViewExclusive?`<div class="post-media" style="display:flex;align-items:center;justify-content:center;flex-direction:column;min-height:220px;background:linear-gradient(130deg,#242031,#101017);position:relative;overflow:hidden"><div aria-hidden="true" style="position:absolute;inset:-45px;background:radial-gradient(circle at 35% 45%,#735477 0%,#242031 35%,#0c101c 70%);filter:blur(45px);opacity:.7"></div><div style="position:relative;text-align:center;color:white;font-size:30px">🔒</div><strong style="position:relative;color:white;margin-top:10px">CONTENIDO EXCLUSIVO</strong><span style="position:relative;color:#d3cbd9;font-size:12px;margin-top:6px">Suscríbete para desbloquear</span></div>`:(p.media_url||p.image_url)?(p.media_type==="video"?`<video class="post-media" src="${esc(p.display_media_url)}" controls playsinline preload="metadata"></video>`:`<img class="post-media" src="${esc(p.display_media_url)}" alt="${esc(p.title)}">`):``}<div class="post-label">${p.access==="public"?"PÚBLICO":"SOLO SUSCRIPTORES"}</div><h4>${esc(p.title)}</h4><p>${esc(p.preview||"")}</p>${p.access==="subscriber"&&!canViewExclusive?'<div class="locked">🔒 Suscríbete para desbloquear este contenido</div>':'<button class="read-post" data-post="'+p.id+'">VER PUBLICACIÓN</button>'}</article>`).join(""):'<div class="empty-posts">Este creador todavía no tiene publicaciones.</div>'}</div></section>`;document.body.appendChild(overlay);
overlay.querySelector("#closeProfile").onclick=()=>overlay.remove();
overlay.querySelectorAll(".post-card").forEach(card=>{
  const lock=card.querySelector(".locked");
  if(!lock)return;
  const preview=card.querySelector(".post-media");
  const subscribe=()=>overlay.querySelector("#subAction")?.click();
  if(preview){preview.style.cursor="pointer";preview.setAttribute("role","button");preview.setAttribute("tabindex","0");preview.setAttribute("aria-label","Suscribirse para desbloquear contenido");preview.onclick=subscribe;preview.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();subscribe();}};}
  lock.style.cursor="pointer";lock.setAttribute("role","button");lock.setAttribute("tabindex","0");lock.onclick=subscribe;lock.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();subscribe();}};
});
overlay.querySelector("#followAction").onclick=async()=>{if(follow){const{error}=await supabaseClient.from("follows").delete().eq("follower_id",user.id).eq("creator_id",creator.id);if(error)alert(error.message);else{overlay.remove();await loadAccount();}}else{const{error}=await supabaseClient.from("follows").insert({follower_id:user.id,creator_id:creator.id});if(error)alert(error.message);else{overlay.remove();await loadAccount();}}};
overlay.querySelector("#subAction").onclick=async()=>{if(subscribed){const ok=confirm("¿Quieres cancelar tu suscripción a "+creator.display_name+"?");if(!ok)return;const{error}=await supabaseClient.from("subscriptions").delete().eq("subscriber_id",user.id).eq("creator_id",creator.id);if(error){alert(error.message);return;}alert("Suscripción cancelada. No hubo ningún cobro real.");overlay.remove();await loadAccount();return;}const{error}=await supabaseClient.from("subscriptions").insert({subscriber_id:user.id,creator_id:creator.id,status:"active"});if(error){alert(error.message);return;}alert("Suscripción V0 activada. Todavía no hay cobro real.");overlay.remove();await loadAccount();await render();await openProfile(i,list);};
overlay.querySelectorAll(".read-post").forEach(btn=>btn.onclick=async()=>{const id=btn.dataset.post;const{data:content,error}=await supabaseClient.from("post_content").select("body").eq("post_id",id).maybeSingle();if(error){alert(error.message);return;}const post=posts.find(p=>p.id===id);alert((post?.title||"Publicación")+"\n\n"+(content?.body||post?.preview||"Sin contenido."));});}
async function becomeCreator(){const user=await currentUser();if(!user)return;const p=await getMyProfile();if(p?.role==="creator"){openCreatorStudio();return;}const username=prompt("Elige tu nombre de usuario para AFTER SHIFT:");if(!username)return;const clean=username.trim().replace(/\s+/g,"").replace(/^@/,"").toLowerCase();if(!/^[a-z0-9_.-]{3,24}$/.test(clean)){alert("Usa 3 a 24 caracteres: letras, números, punto, guion o guion bajo.");return;}const display=prompt("Nombre público del perfil:",p?.display_name||clean);if(!display)return;const{error}=await supabaseClient.from("profiles").update({username:clean,display_name:display.trim(),role:"creator"}).eq("id",user.id);if(error){alert(error.message);return;}alert("Tu perfil de creador está listo.");await loadAccount();openCreatorStudio();}
async function openCreatorStudio(){const user=await currentUser();if(!user)return;let p=await getMyProfile();if(!p)return;if(p.role!=="creator"){const ok=confirm("¿Quieres convertir tu cuenta en creador? Podrás publicar contenido desde AFTER SHIFT.");if(ok)await becomeCreator();return;}const posts=await authorizePostMedia(await getPosts(user.id),user.id,false,user.id);const overlay=document.createElement("div");overlay.className="profile-overlay";overlay.innerHTML=`<section class="creator-studio"><button class="profile-close" id="closeStudio" aria-label="Cerrar">×</button><div class="studio-head"><div><div class="eyebrow">AFTER SHIFT</div><h2>Creator Studio</h2><p>Publica y administra tu contenido.</p></div><button class="action-btn action-primary" id="newPostBtn">+ NUEVA PUBLICACIÓN</button></div><div class="studio-profile"><div><strong>${esc(p.display_name)}</strong><span>@${esc(p.username)}</span></div><div><strong>${Number(p.subscription_price||0).toFixed(2)}</strong><span>Precio mensual</span></div></div><div class="post-heading"><div><div class="eyebrow">MIS PUBLICACIONES</div><h3>${posts.length} publicación${posts.length===1?"":"es"}</h3></div></div><div class="posts" id="studioPosts">${posts.length?posts.map(x=>`<article class="post-card studio-post"><div>${(x.media_url||x.image_url)?(x.media_type==="video"?`<video class="post-media studio-image" src="${esc(x.display_media_url)}" controls playsinline preload="metadata"></video>`:`<img class="post-media studio-image" src="${esc(x.display_media_url)}" alt="${esc(x.title)}">`):``}<div class="post-label">${x.access==="public"?"PÚBLICO":"SOLO SUSCRIPTORES"}</div><h4>${esc(x.title)}</h4><p>${esc(x.preview)}</p></div><button class="delete-post" data-id="${x.id}">ELIMINAR</button></article>`).join(""):'<div class="empty-posts">Todavía no has publicado nada.</div>'}</div></section>`;document.body.appendChild(overlay);
overlay.querySelector("#closeStudio").onclick=()=>overlay.remove();overlay.querySelector("#newPostBtn").onclick=()=>openNewPostForm(overlay,user.id);overlay.querySelectorAll(".delete-post").forEach(btn=>btn.onclick=async()=>{if(!confirm("¿Eliminar esta publicación?"))return;const{error}=await supabaseClient.from("posts").delete().eq("id",btn.dataset.id).eq("creator_id",user.id);if(error){alert(error.message);return;}overlay.remove();openCreatorStudio();});}
function openNewPostForm(parent,creatorId){const formOverlay=document.createElement("div");formOverlay.className="form-overlay";formOverlay.innerHTML=`<form class="post-form" id="postForm"><button type="button" class="profile-close" id="closeForm" aria-label="Cerrar">×</button><div class="eyebrow">NUEVA PUBLICACIÓN</div><h2>Publicar contenido</h2><label>Título<input id="postTitle" maxlength="120" required placeholder="Ej. Nueva publicación"></label><label>Imagen o video<input id="postMedia" type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"></label><label>Acceso<select id="postAccess"><option value="public">Público — todos pueden verlo</option><option value="subscriber">Solo suscriptores</option></select></label><div class="form-actions"><button type="button" class="action-btn" id="cancelForm">Cancelar</button><button class="action-btn action-primary" type="submit">PUBLICAR</button></div><div id="formMsg" class="form-msg"></div></form>`;parent.appendChild(formOverlay);formOverlay.querySelector("#closeForm").onclick=()=>formOverlay.remove();formOverlay.querySelector("#cancelForm").onclick=()=>formOverlay.remove();formOverlay.querySelector("#postForm").onsubmit=async e=>{e.preventDefault();const title=document.getElementById("postTitle").value.trim(),access=document.getElementById("postAccess").value,mediaFile=document.getElementById("postMedia").files[0],msg=document.getElementById("formMsg");if(!title){msg.textContent="Escribe un título.";return;}if(!mediaFile){msg.textContent="Selecciona una imagen o video.";return;}if(!["image/jpeg","image/png","image/webp","video/mp4","video/webm"].includes(mediaFile.type)){msg.textContent="Formato no permitido.";return;}const max=mediaFile.type.startsWith("video/")?50:8;if(mediaFile.size>max*1024*1024){msg.textContent="El archivo no puede superar "+max+" MB.";return;}msg.textContent="Publicando...";const{data:post,error}=await supabaseClient.from("posts").insert({creator_id:creatorId,title,preview:title,access}).select("id").single();if(error){msg.textContent=error.message;return;}const mediaType=mediaFile.type.startsWith("video/")?"video":"image";const ext=(mediaFile.name.split(".").pop()||"bin").toLowerCase();const path=creatorId+"/"+post.id+"."+ext;const{error:uploadError}=await supabaseClient.storage.from("post-media").upload(path,mediaFile,{upsert:true,contentType:mediaFile.type});if(uploadError){await supabaseClient.from("posts").delete().eq("id",post.id).eq("creator_id",creatorId);msg.textContent=uploadError.message;return;}const mediaUrl=supabaseClient.storage.from("post-media").getPublicUrl(path).data.publicUrl; const imageUrl=mediaType==="image"?mediaUrl:null;const{error:updateError}=await supabaseClient.from("posts").update({image_url:imageUrl,media_type:mediaType,media_url:mediaUrl}).eq("id",post.id).eq("creator_id",creatorId);if(updateError){await supabaseClient.storage.from("post-media").remove([path]);await supabaseClient.from("posts").delete().eq("id",post.id).eq("creator_id",creatorId);msg.textContent=updateError.message;return;}const{error:contentError}=await supabaseClient.from("post_content").insert({post_id:post.id,body:""});if(contentError){await supabaseClient.from("posts").delete().eq("id",post.id).eq("creator_id",creatorId);msg.textContent=contentError.message;return;}alert("Publicación creada.");formOverlay.remove();parent.remove();openCreatorStudio();};}
document.getElementById("exploreBtn").onclick=()=>document.getElementById("creators").scrollIntoView({behavior:"smooth"});
document.getElementById("allBtn").onclick=()=>alert("Exploración completa: siguiente módulo.");
document.getElementById("logoutBtn").onclick=async()=>{await supabaseClient.auth.signOut();location.reload()};

async function ensureProfile(user){
  if(!user)return null;
  const existing=await getMyProfile();
  if(existing)return existing;
  const username=(user.user_metadata?.username||user.user_metadata?.display_name||user.email?.split("@")[0]||"usuario").trim().replace(/\s+/g,"").replace(/^@/,"").toLowerCase().replace(/[^a-z0-9_.-]/g,"").slice(0,24)||("user"+user.id.slice(0,8));
  const display=(user.user_metadata?.display_name||username).trim();
  const {data,error}=await supabaseClient.from("profiles").insert({id:user.id,username,display_name:display,role:"user"}).select("id,username,display_name,role,bio,subscription_price").maybeSingle();
  return error?null:data;
}

async function finishLogin(user){
  if(!user)return;
  await ensureProfile(user);
  await loadAccount();
  document.getElementById("accountSection").scrollIntoView({behavior:"smooth"});
  alert("Sesión iniciada correctamente. Bienvenido a AFTER SHIFT.");
}

document.getElementById("signupBtn").onclick=async()=>{
  const existing=await currentUser();
  if(existing){await finishLogin(existing);return;}
  const email=prompt("Correo electrónico:");
  if(!email)return;
  const password=prompt("Contraseña (mínimo 6 caracteres):");
  if(!password)return;
  if(password.length<6){alert("La contraseña debe tener al menos 6 caracteres.");return;}
  const username=prompt("Nombre de usuario:");
  if(!username)return;
  const clean=username.trim().replace(/\s+/g,"").replace(/^@/,"").toLowerCase();
  if(!/^[a-z0-9_.-]{3,24}$/.test(clean)){alert("Usa 3 a 24 caracteres: letras, números, punto, guion o guion bajo.");return;}
  const {data,error}=await supabaseClient.auth.signUp({email:email.trim(),password,options:{data:{username:clean,display_name:username.trim()}}});
  if(error){alert("No se pudo crear la cuenta: "+error.message);return;}
  if(data.session&&data.user){
    await finishLogin(data.user);
  }else{
    alert("Cuenta creada correctamente. Revisa tu correo para confirmar la cuenta y después pulsa «Ingresar».");
  }
};

document.getElementById("loginBtn").onclick=async()=>{
  const existing=await currentUser();
  if(existing){await finishLogin(existing);return;}
  const email=prompt("Correo electrónico:");
  if(!email)return;
  const password=prompt("Contraseña:");
  if(!password)return;
  const {data,error}=await supabaseClient.auth.signInWithPassword({email:email.trim(),password});
  if(error){
    if(error.message.toLowerCase().includes("email not confirmed")){
      alert("La cuenta existe, pero falta confirmar el correo. Revisa tu bandeja de entrada y luego vuelve a ingresar.");
    }else{
      alert("No pudimos iniciar sesión: "+error.message);
    }
    return;
  }
  await finishLogin(data.user);
};

function handleVerificationReturn(){
  const params=new URLSearchParams(window.location.search);
  if(params.get("verified")==="1"){
    window.history.replaceState({},document.title,window.location.pathname);
    setTimeout(async()=>{
      const user=await currentUser();
      if(user) await finishLogin(user);
      else alert("Correo confirmado. Ahora pulsa «Ingresar» para entrar a AFTER SHIFT.");
    },400);
  }
}
handleVerificationReturn();

supabaseClient.auth.onAuthStateChange(async(event,session)=>{
  if(session?.user) await ensureProfile(session.user);
  await loadAccount();
});
render();
loadAccount();

// Auth UI V0: visible form instead of browser prompts.
(function(){
  const modal=document.getElementById("authModal");
  const form=document.getElementById("authForm");
  const title=document.getElementById("authTitle");
  const hint=document.getElementById("authHint");
  const userLabel=document.getElementById("authUserLabel");
  const username=document.getElementById("authUsername");
  const email=document.getElementById("authEmail");
  const password=document.getElementById("authPassword");
  const msg=document.getElementById("authMsg");
  const submit=document.getElementById("authSubmit");
  const close=document.getElementById("authClose");
  const sw=document.getElementById("authSwitch");
  if(!modal||!form)return;
  let mode="signup";
  function open(modeName){
    mode=modeName;
    title.textContent=mode==="signup"?"Crear cuenta":"Ingresar";
    hint.textContent=mode==="signup"?"Crea tu cuenta para continuar.":"Ingresa con tu cuenta de AFTER SHIFT.";
    userLabel.style.display=mode==="signup"?"block":"none";
    username.required=mode==="signup";
    password.autocomplete=mode==="signup"?"new-password":"current-password";
    submit.textContent=mode==="signup"?"CREAR CUENTA":"INGRESAR";
    sw.textContent=mode==="signup"?"Ya tengo una cuenta → Ingresar":"No tengo cuenta → Crear cuenta";
    msg.textContent="";
    modal.style.display="flex";
    setTimeout(()=>email.focus(),50);
  }
  function closeModal(){modal.style.display="none";form.reset();msg.textContent="";}
  close.onclick=closeModal;
  sw.onclick=()=>open(mode==="signup"?"login":"signup");
  modal.addEventListener("click",e=>{if(e.target===modal)closeModal();});
  document.getElementById("signupBtn").onclick=()=>open("signup");
  document.getElementById("loginBtn").onclick=async()=>{
    const existing=await currentUser();
    if(existing){await finishLogin(existing);return;}
    open("login");
  };
  form.onsubmit=async e=>{
    e.preventDefault();
    msg.textContent="Procesando...";
    submit.disabled=true;
    try{
      if(mode==="signup"){
        const clean=username.value.trim().replace(/\s+/g,"").replace(/^@/,"").toLowerCase();
        if(!/^[a-z0-9_.-]{3,24}$/.test(clean)){
          msg.textContent="El usuario debe tener 3 a 24 caracteres: letras, números, punto, guion o guion bajo.";
          return;
        }
        const {data,error}=await supabaseClient.auth.signUp({
          email:email.value.trim(),
          password:password.value,
          options:{data:{username:clean,display_name:username.value.trim()},emailRedirectTo:window.location.origin+"/?verified=1"}
        });
        if(error){msg.textContent="No se pudo crear la cuenta: "+error.message;return;}
        if(data.session&&data.user){
          closeModal();
          await finishLogin(data.user);
        }else{
          msg.textContent="Cuenta creada. Revisa tu correo para confirmar la cuenta y luego ingresa.";
        }
      }else{
        const {data,error}=await supabaseClient.auth.signInWithPassword({email:email.value.trim(),password:password.value});
        if(error){msg.textContent=error.message.toLowerCase().includes("email not confirmed")?"Falta confirmar el correo. Revisa tu bandeja de entrada.":"No pudimos iniciar sesión: "+error.message;return;}
        closeModal();
        await finishLogin(data.user);
      }
    }catch(err){
      msg.textContent="Ocurrió un error al procesar la cuenta. Inténtalo nuevamente.";
    }finally{
      submit.disabled=false;
    }
  };
})();
