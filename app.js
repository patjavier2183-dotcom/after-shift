const SUPABASE_URL="https://heqjyafaxjzisddmgvob.supabase.co";
const SUPABASE_KEY="sb_publishable_u8E7mHoZgYnUw02fmkAKUQ_8l1vnuJy";
const supabaseClient=supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
const creators=[{name:"Valentina",handle:"@valentina",sub:"US$9.99",tag:"DEMO",bio:"Contenido exclusivo y comunidad."},{name:"Sofía",handle:"@sofia",sub:"US$12.00",tag:"DEMO",bio:"Contenido premium para suscriptores."},{name:"Isabella",handle:"@isabella",sub:"US$8.99",tag:"DEMO",bio:"Nuevas publicaciones cada semana."},{name:"Camila",handle:"@camila",sub:"US$14.99",tag:"DEMO",bio:"Perfil ilustrativo de AFTER SHIFT."}];
const grid=document.getElementById("creatorGrid");
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
async function currentUser(){const{data}=await supabaseClient.auth.getUser();return data.user;}
async function getMyProfile(){const user=await currentUser();if(!user)return null;const{data}=await supabaseClient.from("profiles").select("id,username,display_name,role,bio,subscription_price").eq("id",user.id).maybeSingle();return data||null;}
async function loadAccount(){const user=await currentUser();if(!user)return;const p=await getMyProfile();const{count:fc}=await supabaseClient.from("follows").select("*",{count:"exact",head:true}).eq("follower_id",user.id);const{count:sc}=await supabaseClient.from("subscriptions").select("*",{count:"exact",head:true}).eq("subscriber_id",user.id).eq("status","active");const accountBox=document.getElementById("accountSection");accountBox.style.display=accountBox.dataset.open==="true"?"block":"none";document.getElementById("accountTitle").textContent="Hola, "+(p?.display_name||user.email);document.getElementById("accountEmail").textContent=user.email;document.getElementById("accountRole").textContent="Rol: "+(p?.role||"user")+" · @"+(p?.username||"usuario");document.getElementById("followCount").textContent=fc||0;document.getElementById("subCount").textContent=sc||0;document.getElementById("loginBtn").textContent="Mi cuenta";document.getElementById("signupBtn").style.display="none";const cb=document.getElementById("creatorBtn");cb.style.display="inline-block";cb.textContent=p?.role==="creator"?"Creator Studio":"Convertirme en creador";cb.onclick=()=>p?.role==="creator"?openCreatorStudio():becomeCreator();}

let visibleCreatorList=[];
function drawCreatorGrid(search=""){
  const q=search.trim().toLowerCase();
  const filtered=visibleCreatorList.map((creator,index)=>({creator,index}))
    .filter(item=>!q||(item.creator.name+" "+item.creator.handle+" "+item.creator.bio).toLowerCase().includes(q));
  grid.innerHTML=filtered.length?filtered.map(({creator:c,index})=>{
    const photo=c.portrait||"";
    const art=c.spriteIndex!==undefined?'<div class="creator-photo-sprite sprite-'+c.spriteIndex+'" role="img" aria-label="Imagen ilustrativa de '+esc(c.name)+'"></div>':photo?'<img class="creator-photo" src="'+esc(photo)+'" alt="Retrato de '+esc(c.name)+'" loading="lazy" referrerpolicy="no-referrer">':'<div class="creator-photo-fallback">'+esc(c.name.charAt(0))+'</div>';
    return '<article class="card"><div class="cover">'+art+'</div><div class="info"><div class="name">'+esc(c.name)+'</div><div class="handle">'+esc(c.handle)+'</div>'+(c.db?'':'<span class="creator-demo">Perfil de demostración</span>')+'<div class="card-footer"><span class="card-price">'+esc(c.sub)+'/mes</span><button class="profile-open" type="button" data-index="'+index+'">Ver perfil</button></div></div></article>';
  }).join(""):'<div class="empty-creators">No encontramos creadores con ese nombre.</div>';
  grid.querySelectorAll(".profile-open").forEach(btn=>btn.onclick=()=>openProfile(Number(btn.dataset.index),visibleCreatorList));
}
async function render(){
  const{data:dbCreators,error}=await supabaseClient.from("profiles")
    .select("id,display_name,username,bio,subscription_price,avatar_url,cover_url")
    .eq("role","creator").order("display_name");
  if(error)console.warn("Perfiles: ",error.message);
  const dynamic=(dbCreators||[]).map(p=>({
    id:p.id,name:p.display_name||p.username,handle:"@"+p.username,
    sub:"US$"+Number(p.subscription_price||0).toFixed(2),tag:"CREATOR",
    bio:p.bio||"Contenido exclusivo y comunidad.",db:true,
    portrait:p.avatar_url||"",cover:p.cover_url||""
  }));
  const demo=creators.filter(c=>!(dbCreators||[]).some(p=>p.username===c.handle.replace("@","")))
    .map((c,i)=>({...c,portrait:"",spriteIndex:i}));
  visibleCreatorList=[...dynamic,...demo];
  drawCreatorGrid(document.getElementById("creatorSearch")?.value||"");
}
// Demo cards are illustrative and never create subscriptions or claim verified identities.
function openDemoProfile(c){
  const overlay=document.createElement("div");
  overlay.className="profile-overlay";
  overlay.innerHTML=`<section class="creator-profile demo-profile">
    <button class="profile-close" type="button" aria-label="Cerrar">×</button>
    <div class="profile-cover"></div>
    <div class="profile-head">
      <div class="avatar sprite-avatar sprite-${c.spriteIndex}"><span class="visually-hidden">${esc(c.name)}</span></div>
      <div class="profile-main"><h2>${esc(c.name)}</h2><div class="profile-handle">${esc(c.handle)}</div><p>${esc(c.bio)}</p></div>
      <div class="profile-actions"><button class="action-btn action-primary" type="button" disabled>PERFIL DE EJEMPLO</button></div>
    </div>
    <div class="profile-tabs"><span class="profile-tab active">Contenido</span><span class="profile-tab">Sobre mí</span><span class="profile-tab">Suscripción</span></div>
    <div class="profile-panel-extra"><h3>Perfil de demostración</h3><p>Esta imagen representa solamente una vista de ejemplo del diseño de AFTER SHIFT. No corresponde a una cuenta verificada ni permite suscripciones reales.</p></div>
  </section>`;
  document.body.appendChild(overlay);
  overlay.querySelector(".profile-close").onclick=()=>overlay.remove();
  overlay.addEventListener("click",e=>{if(e.target===overlay)overlay.remove()});
  // The demonstration profile uses only the approved editorial image sprite.
}
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
// Visible deterrent for test subscribers; browser-side marks are NOT screenshot protection.
function renderViewerMedia(post, viewerMark){
  const url=post.display_media_url;
  if(!url)return '<div class="secured-media-unavailable">No se pudo cargar el archivo protegido.</div>';
  const video=post.media_type==="video";
  const media=video
    ? `<video class="post-media" src="${esc(url)}" controls playsinline preload="metadata" controlsList="nodownload nofullscreen noremoteplayback" disablePictureInPicture></video>`
    : `<img class="post-media" src="${esc(url)}" alt="${esc(post.title)}" draggable="false">`;
  if(post.access!=="subscriber")return media;
  const stamp=esc(viewerMark);
  return `<div class="secured-media-frame">${media}<div class="secured-watermark" aria-hidden="true"><span class="secured-watermark-viewer">${stamp}</span></div></div>`;
}
async function getPosts(creatorId){const{data,error}=await supabaseClient.from("posts").select("id,title,preview,access,image_url,media_type,media_url,created_at").eq("creator_id",creatorId).order("created_at",{ascending:false});return error?[]:(data||[]);}
async function openProfile(i,list=creators,options={}){const c=list[i];if(!c.db){openDemoProfile(c);return;}const user=await currentUser();if(!user){alert("Primero debes ingresar a AFTER SHIFT.");return;}const creator=c.db?{id:c.id,display_name:c.name,username:c.handle.replace("@",""),bio:c.bio,subscription_price:Number(String(c.sub).replace("US$",""))}:await (async()=>{const{data}=await supabaseClient.from("profiles").select("id,display_name,username,bio,subscription_price").eq("username",c.handle.replace("@","")).maybeSingle();return data;})();if(!creator){alert("Este creador todavía no está registrado en la base de datos V0.");return;}const{data:follow}=await supabaseClient.from("follows").select("creator_id").eq("follower_id",user.id).eq("creator_id",creator.id).maybeSingle();const{data:sub}=await supabaseClient.from("subscriptions").select("creator_id,status").eq("subscriber_id",user.id).eq("creator_id",creator.id).maybeSingle();const subscribed=sub?.status==="active";const canViewExclusive=subscribed||user.id===creator.id;const posts=await authorizePostMedia(await getPosts(creator.id),creator.id,subscribed,user.id);const viewerMark=`ID ${user.id.replace(/-/g,"").slice(0,16).toUpperCase()}`;const overlay=document.createElement("div");overlay.className="profile-overlay";overlay.innerHTML=`<section class="creator-profile">
<button class="profile-close" id="closeProfile" aria-label="Cerrar">×</button>
<div class="profile-cover"></div>
<div class="profile-head">
 <div class="avatar">${c.portrait?'<img src="'+esc(c.portrait)+'" alt="" loading="lazy">':esc(creator.display_name.charAt(0))}</div>
 <div class="profile-main"><div class="eyebrow">CREATOR</div><h2>${esc(creator.display_name)}</h2><div class="profile-handle">@${esc(creator.username)}</div><p>${esc(creator.bio||c.bio)}</p></div>
 <div class="profile-actions"><button class="action-btn" id="followAction">${follow?"SIGUIENDO ✓":"SEGUIR"}</button><button class="action-btn action-primary" id="subAction">${subscribed?"SUSCRITO ✓":"SUSCRIBIRSE · US$"+Number(creator.subscription_price||0).toFixed(2)+"/mes"}</button></div>
</div>
<div class="profile-tabs" role="tablist" aria-label="Secciones del creador">
 <button class="profile-tab active" type="button" data-tab="content" role="tab" aria-selected="true">Contenido</button>
 <button class="profile-tab" type="button" data-tab="about" role="tab" aria-selected="false">Sobre mí</button>
 <button class="profile-tab" type="button" data-tab="subscription" role="tab" aria-selected="false">Suscripción</button>
</div>
<div class="profile-panel" data-panel="content">
<div class="post-heading"><div><div class="eyebrow">PUBLICACIONES</div><h3>Contenido de ${esc(creator.display_name)}</h3></div></div>
<div class="posts">${posts.length?posts.map(p=>`<article class="post-card">${p.access==="subscriber"&&!canViewExclusive?`<div class="post-media" style="display:flex;align-items:center;justify-content:center;flex-direction:column;min-height:175px;background:linear-gradient(135deg,#5b4438,#231b1c 53%,#4c3830);position:relative;overflow:hidden"><div aria-hidden="true" style="position:absolute;inset:-35px;background:radial-gradient(circle at 65% 42%,#b98c75 0%,#523c3b 39%,#231e22 75%);filter:blur(36px);opacity:.8"></div><div style="position:relative;color:white;font-size:26px">🔒</div><strong style="position:relative;color:white;font-size:11px;margin-top:8px">CONTENIDO EXCLUSIVO</strong><button type="button" class="unlock-post-action" style="position:relative;margin-top:13px;padding:9px 11px;background:#ffd35a;color:#17212b;border:0;border-radius:7px;font-weight:700;font-size:11px">SUSCRIBIRME</button></div>`:(p.media_url||p.image_url)?renderViewerMedia(p,viewerMark):``}<div class="post-label">${p.access==="public"?"PÚBLICO":"SOLO SUSCRIPTORES"}</div><h4>${esc(p.title)}</h4><p>${esc(p.preview||"")}</p>${p.access==="subscriber"&&!canViewExclusive?'<div class="locked">🔒 Suscríbete para desbloquear</div>':'<button class="read-post" data-post="'+p.id+'">VER PUBLICACIÓN</button>'}</article>`).join(""):'<div class="empty-posts">Este creador todavía no tiene publicaciones.</div>'}</div>
</div>
<div class="profile-panel profile-panel-extra" data-panel="about" hidden><h3>Sobre ${esc(creator.display_name)}</h3><p>${esc(creator.bio||c.bio||"Contenido exclusivo y comunidad.")}</p></div>
<div class="profile-panel profile-panel-extra" data-panel="subscription" hidden><h3>Suscripción</h3><p>Precio indicado: <strong>US$${Number(creator.subscription_price||0).toFixed(2)}/mes</strong>.</p><p>Accede a las publicaciones exclusivas del creador. En esta versión V0 solo existen suscripciones de prueba, sin cobros reales.</p><button type="button" class="action-btn action-primary" id="tabSubscribe">${subscribed?"GESTIONAR SUSCRIPCIÓN":"SUSCRIBIRME"}</button></div>
</section>`;if(options.previousOverlay?.isConnected){
  const scrollPosition=options.previousOverlay.scrollTop;
  options.previousOverlay.replaceWith(overlay);
  overlay.scrollTop=scrollPosition;
}else{
  document.body.appendChild(overlay);
}
if(options.notice){
  const toast=document.createElement("div");
  toast.className="profile-feedback";
  toast.setAttribute("role","status");
  toast.textContent=options.notice;
  overlay.appendChild(toast);
  setTimeout(()=>toast.remove(),4000);
}
overlay.querySelector("#closeProfile").onclick=()=>overlay.remove();
if(c.cover){
  try{const coverUrl=new URL(c.cover);if(coverUrl.protocol==="https:")overlay.querySelector(".profile-cover").style.backgroundImage='linear-gradient(90deg,#00000035,#00000012),url("'+coverUrl.href.replaceAll('"',"%22")+'")';}catch{}
}else if(c.portrait){
  try{const coverUrl=new URL(c.portrait);if(coverUrl.protocol==="https:")overlay.querySelector(".profile-cover").style.backgroundImage='linear-gradient(90deg,#00000035,#00000012),url("'+coverUrl.href.replaceAll('"',"%22")+'")';}catch{}
}
overlay.querySelectorAll(".profile-tab").forEach(btn=>btn.onclick=()=>{
  const tab=btn.dataset.tab;
  overlay.querySelectorAll(".profile-tab").forEach(el=>{el.classList.toggle("active",el.dataset.tab===tab);el.setAttribute("aria-selected",String(el.dataset.tab===tab));});
  overlay.querySelectorAll(".profile-panel").forEach(panel=>panel.hidden=panel.dataset.panel!==tab);
});
overlay.querySelector("#tabSubscribe").onclick=()=>overlay.querySelector("#subAction").click();
overlay.querySelectorAll(".unlock-post-action").forEach(btn=>btn.onclick=e=>{e.preventDefault();e.stopPropagation();overlay.querySelector("#subAction")?.click();});
overlay.querySelectorAll(".post-card").forEach(card=>{
  const lock=card.querySelector(".locked");
  if(!lock)return;
  const preview=card.querySelector(".post-media");
  const subscribe=()=>overlay.querySelector("#subAction")?.click();
  if(preview){preview.style.cursor="pointer";preview.setAttribute("role","button");preview.setAttribute("tabindex","0");preview.setAttribute("aria-label","Suscribirse para desbloquear contenido");preview.onclick=subscribe;preview.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();subscribe();}};}
  lock.style.cursor="pointer";lock.setAttribute("role","button");lock.setAttribute("tabindex","0");lock.onclick=subscribe;lock.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();subscribe();}};
});
overlay.querySelector("#followAction").onclick=async()=>{if(follow){const{error}=await supabaseClient.from("follows").delete().eq("follower_id",user.id).eq("creator_id",creator.id);if(error)alert(error.message);else{overlay.remove();await loadAccount();}}else{const{error}=await supabaseClient.from("follows").insert({follower_id:user.id,creator_id:creator.id});if(error)alert(error.message);else{overlay.remove();await loadAccount();}}};
// Todas las entradas (botón superior, miniatura y candado) pasan por confirmación.
const subscriptionAction=overlay.querySelector("#subAction");
async function updateSubscription(){
  if(subscriptionAction.disabled)return;
  if(subscribed&&!confirm("¿Quieres cancelar tu suscripción a "+creator.display_name+"?"))return;
  subscriptionAction.disabled=true;
  subscriptionAction.textContent=subscribed?"Cancelando...":"Activando suscripción...";
  try{
    if(subscribed){
      const{error}=await supabaseClient.from("subscriptions").delete()
        .eq("subscriber_id",user.id).eq("creator_id",creator.id);
      if(error)throw error;
    }else{
      const{error}=await supabaseClient.from("subscriptions").insert({
        subscriber_id:user.id,creator_id:creator.id,status:"active"
      });
      if(error)throw error;
    }
    await openProfile(i,list,{
      previousOverlay:overlay,
      notice:subscribed?"Suscripción de prueba cancelada. El contenido volvió a bloquearse.":"Suscripción de prueba activada. Contenido desbloqueado; no hubo cobro real."
    });
    await loadAccount();
    await render();
  }catch(err){
    subscriptionAction.disabled=false;
    subscriptionAction.textContent=subscribed?"SUSCRITO ✓":"SUSCRIBIRSE · US$"+Number(creator.subscription_price||0).toFixed(2)+"/mes";
    const notice=document.createElement("div");
    notice.className="profile-feedback";
    notice.setAttribute("role","alert");
    notice.textContent="No se pudo cambiar la suscripción: "+(err?.message||"Inténtalo de nuevo.");
    overlay.appendChild(notice);
    setTimeout(()=>notice.remove(),5000);
  }
}
function showSubscriptionConfirmation(){
  if(overlay.querySelector(".subscription-confirm-overlay"))return;
  const price="US$"+Number(creator.subscription_price||0).toFixed(2)+"/mes";
  const dialog=document.createElement("div");
  dialog.className="subscription-confirm-overlay";
  dialog.setAttribute("role","presentation");
  dialog.innerHTML=`<section class="subscription-confirm-card" role="dialog" aria-modal="true" aria-labelledby="subscriptionConfirmTitle" aria-describedby="subscriptionConfirmDesc">
    <button type="button" class="subscription-confirm-close" aria-label="Cerrar confirmación">×</button>
    <div class="eyebrow">AFTER SHIFT · V0</div>
    <h2 id="subscriptionConfirmTitle">Confirmar suscripción</h2>
    <p id="subscriptionConfirmDesc">Estás por suscribirte a <strong>${esc(creator.display_name)}</strong>.</p>
    <div class="subscription-confirm-price"><span>Precio mensual anunciado</span><strong>${price}</strong></div>
    <p class="subscription-confirm-note">Esta es una <strong>prueba gratuita de funcionamiento</strong>. No se procesará ningún pago, no se solicitará tarjeta y no se generarán cobros automáticos.</p>
    <div class="subscription-confirm-actions">
      <button type="button" class="action-btn subscription-confirm-cancel">CANCELAR</button>
      <button type="button" class="action-btn action-primary subscription-confirm-accept">CONFIRMAR PRUEBA</button>
    </div>
  </section>`;
  overlay.appendChild(dialog);
  const previousFocus=document.activeElement;
  const close=()=>{dialog.remove();if(previousFocus?.isConnected)previousFocus.focus();};
  dialog.querySelector(".subscription-confirm-close").onclick=close;
  dialog.querySelector(".subscription-confirm-cancel").onclick=close;
  dialog.addEventListener("click",e=>{if(e.target===dialog)close();});
  dialog.addEventListener("keydown",e=>{if(e.key==="Escape"){e.preventDefault();close();}});
  dialog.querySelector(".subscription-confirm-accept").onclick=()=>{
    dialog.remove();
    updateSubscription();
  };
  dialog.querySelector(".subscription-confirm-cancel").focus();
}
subscriptionAction.onclick=()=>subscribed?updateSubscription():showSubscriptionConfirmation();
overlay.querySelectorAll(".read-post").forEach(btn=>btn.onclick=async()=>{const id=btn.dataset.post;const{data:content,error}=await supabaseClient.from("post_content").select("body").eq("post_id",id).maybeSingle();if(error){alert(error.message);return;}const post=posts.find(p=>p.id===id);alert((post?.title||"Publicación")+"\n\n"+(content?.body||post?.preview||"Sin contenido."));});}
async function becomeCreator(){const user=await currentUser();if(!user)return;const p=await getMyProfile();if(p?.role==="creator"){openCreatorStudio();return;}const username=prompt("Elige tu nombre de usuario para AFTER SHIFT:");if(!username)return;const clean=username.trim().replace(/\s+/g,"").replace(/^@/,"").toLowerCase();if(!/^[a-z0-9_.-]{3,24}$/.test(clean)){alert("Usa 3 a 24 caracteres: letras, números, punto, guion o guion bajo.");return;}const display=prompt("Nombre público del perfil:",p?.display_name||clean);if(!display)return;const{error}=await supabaseClient.from("profiles").update({username:clean,display_name:display.trim(),role:"creator"}).eq("id",user.id);if(error){alert(error.message);return;}alert("Tu perfil de creador está listo.");await loadAccount();openCreatorStudio();}
async function openCreatorStudio(){const user=await currentUser();if(!user)return;let p=await getMyProfile();if(!p)return;if(p.role!=="creator"){const ok=confirm("¿Quieres convertir tu cuenta en creador? Podrás publicar contenido desde AFTER SHIFT.");if(ok)await becomeCreator();return;}const posts=await authorizePostMedia(await getPosts(user.id),user.id,false,user.id);const overlay=document.createElement("div");overlay.className="profile-overlay";overlay.innerHTML=`<section class="creator-studio"><button class="profile-close" id="closeStudio" aria-label="Cerrar">×</button><div class="studio-head"><div><div class="eyebrow">AFTER SHIFT</div><h2>Creator Studio</h2><p>Publica y administra tu contenido.</p></div><button class="action-btn action-primary" id="newPostBtn">+ NUEVA PUBLICACIÓN</button></div><div class="studio-profile"><div><strong>${esc(p.display_name)}</strong><span>@${esc(p.username)}</span></div><div><strong>${Number(p.subscription_price||0).toFixed(2)}</strong><span>Precio mensual</span></div></div><div class="post-heading"><div><div class="eyebrow">MIS PUBLICACIONES</div><h3>${posts.length} publicación${posts.length===1?"":"es"}</h3></div></div><div class="posts" id="studioPosts">${posts.length?posts.map(x=>`<article class="post-card studio-post"><div>${(x.media_url||x.image_url)?(x.media_type==="video"?`<video class="post-media studio-image" src="${esc(x.display_media_url)}" controls playsinline preload="metadata"></video>`:`<img class="post-media studio-image" src="${esc(x.display_media_url)}" alt="${esc(x.title)}">`):``}<div class="post-label">${x.access==="public"?"PÚBLICO":"SOLO SUSCRIPTORES"}</div><h4>${esc(x.title)}</h4><p>${esc(x.preview)}</p></div><button class="delete-post" data-id="${x.id}">ELIMINAR</button></article>`).join(""):'<div class="empty-posts">Todavía no has publicado nada.</div>'}</div></section>`;document.body.appendChild(overlay);
overlay.querySelector("#closeStudio").onclick=()=>overlay.remove();overlay.querySelector("#newPostBtn").onclick=()=>openNewPostForm(overlay,user.id);overlay.querySelectorAll(".delete-post").forEach(btn=>btn.onclick=async()=>{if(!confirm("¿Eliminar esta publicación?"))return;const{error}=await supabaseClient.from("posts").delete().eq("id",btn.dataset.id).eq("creator_id",user.id);if(error){alert(error.message);return;}overlay.remove();openCreatorStudio();});}
function openNewPostForm(parent,creatorId){const formOverlay=document.createElement("div");formOverlay.className="form-overlay";formOverlay.innerHTML=`<form class="post-form" id="postForm"><button type="button" class="profile-close" id="closeForm" aria-label="Cerrar">×</button><div class="eyebrow">NUEVA PUBLICACIÓN</div><h2>Publicar contenido</h2><label>Título<input id="postTitle" maxlength="120" required placeholder="Ej. Nueva publicación"></label><label>Imagen o video<input id="postMedia" type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"></label><label>Acceso<select id="postAccess"><option value="public">Público — todos pueden verlo</option><option value="subscriber">Solo suscriptores</option></select></label><div class="form-actions"><button type="button" class="action-btn" id="cancelForm">Cancelar</button><button class="action-btn action-primary" type="submit">PUBLICAR</button></div><div id="formMsg" class="form-msg"></div></form>`;parent.appendChild(formOverlay);formOverlay.querySelector("#closeForm").onclick=()=>formOverlay.remove();formOverlay.querySelector("#cancelForm").onclick=()=>formOverlay.remove();formOverlay.querySelector("#postForm").onsubmit=async e=>{e.preventDefault();const title=document.getElementById("postTitle").value.trim(),access=document.getElementById("postAccess").value,mediaFile=document.getElementById("postMedia").files[0],msg=document.getElementById("formMsg");if(!title){msg.textContent="Escribe un título.";return;}if(!mediaFile){msg.textContent="Selecciona una imagen o video.";return;}if(!["image/jpeg","image/png","image/webp","video/mp4","video/webm"].includes(mediaFile.type)){msg.textContent="Formato no permitido.";return;}const max=mediaFile.type.startsWith("video/")?50:8;if(mediaFile.size>max*1024*1024){msg.textContent="El archivo no puede superar "+max+" MB.";return;}msg.textContent="Publicando...";const{data:post,error}=await supabaseClient.from("posts").insert({creator_id:creatorId,title,preview:title,access}).select("id").single();if(error){msg.textContent=error.message;return;}const mediaType=mediaFile.type.startsWith("video/")?"video":"image";const ext=(mediaFile.name.split(".").pop()||"bin").toLowerCase();const path=creatorId+"/"+post.id+"."+ext;const{error:uploadError}=await supabaseClient.storage.from("post-media").upload(path,mediaFile,{upsert:true,contentType:mediaFile.type});if(uploadError){await supabaseClient.from("posts").delete().eq("id",post.id).eq("creator_id",creatorId);msg.textContent=uploadError.message;return;}const mediaUrl=supabaseClient.storage.from("post-media").getPublicUrl(path).data.publicUrl; const imageUrl=mediaType==="image"?mediaUrl:null;const{error:updateError}=await supabaseClient.from("posts").update({image_url:imageUrl,media_type:mediaType,media_url:mediaUrl}).eq("id",post.id).eq("creator_id",creatorId);if(updateError){await supabaseClient.storage.from("post-media").remove([path]);await supabaseClient.from("posts").delete().eq("id",post.id).eq("creator_id",creatorId);msg.textContent=updateError.message;return;}const{error:contentError}=await supabaseClient.from("post_content").insert({post_id:post.id,body:""});if(contentError){await supabaseClient.from("posts").delete().eq("id",post.id).eq("creator_id",creatorId);msg.textContent=contentError.message;return;}alert("Publicación creada.");formOverlay.remove();parent.remove();openCreatorStudio();};}
document.getElementById("creatorSearch").addEventListener("input",e=>drawCreatorGrid(e.target.value));
document.getElementById("navSubscriptions").onclick=async()=>{
  const user=await currentUser();
  if(!user){document.getElementById("loginBtn").click();return;}
  const section=document.getElementById("accountSection");section.dataset.open="true";await loadAccount();section.scrollIntoView({behavior:"smooth"});
};
document.getElementById("exploreBtn").onclick=()=>document.getElementById("creators").scrollIntoView({behavior:"smooth"});
document.getElementById("allBtn").onclick=()=>{document.getElementById("creatorSearch").value="";drawCreatorGrid();document.getElementById("creators").scrollIntoView({behavior:"smooth"});};
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
  if(existing){const box=document.getElementById("accountSection");box.dataset.open="true";await loadAccount();box.scrollIntoView({behavior:"smooth"});return;}
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
