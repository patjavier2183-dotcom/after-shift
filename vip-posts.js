/* AFTER SHIFT V33 · real creator VIP uploads with private media / preview catalog.
   Purchases are explicitly UI-only simulations, never grant media URLs or payment entitlements. */
(function(){
"use strict";
const BUCKET="vip-media";
const TYPES={"image/jpeg":"jpg","image/png":"png","image/webp":"webp","video/mp4":"mp4","video/webm":"webm"};
const copy={
 es:{
  eyebrow:"AFTER SHIFT · CREADOR",studioTitle:"🔒 Mis publicaciones VIP",studioDesc:"Publica fotos o videos VIP con precio propio. No están incluidos en la mensualidad. El archivo se almacena privado; todavía no hay cobros ni desbloqueos reales.",create:"+ NUEVO CONTENIDO VIP",empty:"Todavía no has publicado contenido VIP.",loading:"Cargando contenido VIP...",error:"No pudimos cargar las publicaciones VIP. Intenta abrir Creator Studio de nuevo.",format:"Foto / Video",price:"Precio",remove:"ELIMINAR VIP",confirm:"¿Eliminar esta publicación VIP? No se puede deshacer.",removing:"Eliminando...",deleteError:"No se pudo eliminar el VIP.",
  formEyebrow:"PUBLICACIÓN VIP · CREADOR",formTitle:"Publicar contenido VIP",formInfo:"La foto o video se guardará de forma privada. En el perfil solo se mostrará el título, descripción y precio. Ningún suscriptor podrá ver el archivo mediante una compra ficticia.",title:"Título",titleHint:"Ej. Video exclusivo de esta semana",description:"Descripción visible (sin revelar el contenido)",descriptionHint:"Cuenta qué incluye este contenido VIP...",file:"Foto o video VIP",priceInput:"Precio adicional (monedas)",coinExample:"Ejemplo: 30 monedas = US$3",fileLimit:"Fotos hasta 8 MB · Videos hasta 50 MB",cancel:"Cancelar",publish:"PUBLICAR VIP",uploading:"Subiendo archivo privado...",publishing:"Guardando publicación...",success:"✓ Contenido VIP publicado. El archivo está privado hasta implementar pagos y permisos reales.",badTitle:"Escribe un título de 3 a 120 caracteres.",badDesc:"Descripción demasiado larga (máximo 1000 caracteres).",badPrice:"El precio debe ser un número entero de 5 a 5000 monedas.",badFile:"Selecciona una foto JPG/PNG/WebP o video MP4/WebM.",bigFile:"Archivo demasiado grande para este tipo de contenido.",saveError:"No se pudo completar la publicación.",showOwner:"VISTA PRIVADA",openOwner:"VER MI ARCHIVO",previewOwner:"Solo el creador puede previsualizar este archivo. No se publica para suscriptores.",close:"Cerrar",
  profileTitle:"🔒 Contenido VIP",profileDesc:"Publicaciones especiales con precio adicional. Solo para suscriptores activos del creador. No están incluidas en la mensualidad.",premium:"VIP EXCLUSIVO",video:"Video privado",image:"Foto privada",locked:"Solo los suscriptores pueden comprar este contenido VIP.",test:"SIMULAR COMPRA VIP",testOwner:"PROBAR COMPRA COMO CREADOR",complete:"✓ Compra VIP simulada (sin cargo, monedas reales ni acceso a archivo).",already:"✓ COMPRA DEMO REALIZADA",disclaimer:"Solo para ver en AFTER SHIFT · No descargable. Sin ventas reales todavía.",ticket:(coins)=>coins+" monedas · US$"+(coins*.1).toFixed(2).replace(".",","),gross:(creator,platform)=>"De una compra real de este importe: creador 80% ("+creator+") / plataforma 20% ("+platform+"), antes de costos. Aquí no se cobra dinero.",notYet:"La compra y el acceso verdadero se activarán solamente al integrar pagos y autorizaciones seguros."
 },
 en:{
  eyebrow:"AFTER SHIFT · CREATOR",studioTitle:"🔒 My VIP posts",studioDesc:"Publish VIP photos or videos at your own price. These are separate from the monthly subscription. Files are private; no real charges or access unlocks yet.",create:"+ NEW VIP CONTENT",empty:"You have not published VIP content yet.",loading:"Loading VIP posts...",error:"Unable to load VIP posts. Try reopening Creator Studio.",format:"Photo / Video",price:"Price",remove:"DELETE VIP",confirm:"Delete this VIP post? This cannot be undone.",removing:"Deleting...",deleteError:"Could not delete the VIP post.",
  formEyebrow:"VIP POST · CREATOR",formTitle:"Publish VIP content",formInfo:"Photo or video will be stored privately. Subscribers see only title, description and price. A fictional purchase never unlocks the file.",title:"Title",titleHint:"e.g. This week's exclusive video",description:"Visible description (do not reveal the content)",descriptionHint:"Describe what's included...",file:"VIP photo or video",priceInput:"Extra price (coins)",coinExample:"Example: 30 coins = US$3",fileLimit:"Photos up to 8MB · Videos up to 50MB",cancel:"Cancel",publish:"PUBLISH VIP",uploading:"Uploading private file...",publishing:"Saving post...",success:"✓ VIP post published. The file stays private until real payments and permissions are implemented.",badTitle:"Enter a title between 3 and 120 characters.",badDesc:"Description too long (max 1000 characters).",badPrice:"Price must be a whole number between 5 and 5000 coins.",badFile:"Select a JPG/PNG/WebP photo or MP4/WebM video.",bigFile:"File is too large.",saveError:"Could not finish publishing.",showOwner:"PRIVATE VIEW",openOwner:"VIEW MY FILE",previewOwner:"Only the creator can preview this file. It is not shared with subscribers.",close:"Close",
  profileTitle:"🔒 VIP content",profileDesc:"Special paid-extra content, for active subscribers only. Not included in the monthly subscription.",premium:"EXCLUSIVE VIP",video:"Private video",image:"Private photo",locked:"Only subscribers can buy this VIP content.",test:"SIMULATE VIP PURCHASE",testOwner:"TEST PURCHASE AS CREATOR",complete:"✓ Fictional VIP purchase (no real charge, coins or access to file).",already:"✓ DEMO PURCHASED",disclaimer:"Watch on AFTER SHIFT only · No downloads. No real sales yet.",ticket:(coins)=>coins+" coins · US$"+(coins*.1).toFixed(2),gross:(creator,platform)=>"Example gross split: creator 80% ("+creator+") / platform 20% ("+platform+"), before costs. No money is charged here.",notYet:"Real purchase and viewing require secure payments and server permissions."
 },
 pt:{
  eyebrow:"AFTER SHIFT · CRIADOR",studioTitle:"🔒 Minhas publicações VIP",studioDesc:"Publique fotos ou vídeos VIP com preço próprio. Não estão incluídos na assinatura. Os arquivos ficam privados; sem cobranças ou desbloqueios reais.",create:"+ NOVO CONTEÚDO VIP",empty:"Você ainda não publicou conteúdo VIP.",loading:"Carregando publicações VIP...",error:"Não foi possível carregar as publicações VIP.",format:"Foto / Vídeo",price:"Preço",remove:"EXCLUIR VIP",confirm:"Excluir esta publicação VIP? Não será possível desfazer.",removing:"Excluindo...",deleteError:"Não foi possível excluir o VIP.",
  formEyebrow:"PUBLICAÇÃO VIP · CRIADOR",formTitle:"Publicar conteúdo VIP",formInfo:"A foto ou vídeo será armazenado de forma privada. Assinantes veem somente título, descrição e preço. Compra fictícia não libera arquivos.",title:"Título",titleHint:"Ex.: Vídeo exclusivo da semana",description:"Descrição visível (sem revelar o conteúdo)",descriptionHint:"Descreva o conteúdo VIP...",file:"Foto ou vídeo VIP",priceInput:"Preço adicional (moedas)",coinExample:"Exemplo: 30 moedas = US$3",fileLimit:"Fotos até 8 MB · Vídeos até 50 MB",cancel:"Cancelar",publish:"PUBLICAR VIP",uploading:"Enviando arquivo privado...",publishing:"Salvando publicação...",success:"✓ VIP publicado. O arquivo continua privado até termos pagamentos e permissões reais.",badTitle:"Informe um título de 3 a 120 caracteres.",badDesc:"Descrição muito longa (máximo 1000 caracteres).",badPrice:"Preço deve ser inteiro entre 5 e 5000 moedas.",badFile:"Selecione foto JPG/PNG/WebP ou vídeo MP4/WebM.",bigFile:"Arquivo grande demais.",saveError:"Não foi possível publicar.",showOwner:"VISTA PRIVADA",openOwner:"VER MEU ARQUIVO",previewOwner:"Somente o criador pode visualizar este arquivo. Não é compartilhado com assinantes.",close:"Fechar",
  profileTitle:"🔒 Conteúdo VIP",profileDesc:"Publicações especiais pagas à parte, exclusivas para assinantes ativos. Não estão na mensalidade.",premium:"VIP EXCLUSIVO",video:"Vídeo privado",image:"Foto privada",locked:"Somente assinantes podem comprar este VIP.",test:"SIMULAR COMPRA VIP",testOwner:"TESTAR COMPRA COMO CRIADOR",complete:"✓ Compra VIP fictícia (sem cobrança, moedas reais ou acesso ao arquivo).",already:"✓ COMPRADO NO TESTE",disclaimer:"Assistir apenas no AFTER SHIFT · Sem downloads. Ainda sem vendas reais.",ticket:(coins)=>coins+" moedas · US$"+(coins*.1).toFixed(2).replace(".",","),gross:(creator,platform)=>"Exemplo de divisão bruta: criador 80% ("+creator+") / plataforma 20% ("+platform+"), antes de custos. Sem cobrança real.",notYet:"Compras reais e acesso exigem pagamentos e permissões seguras."
 }
};
function t(){return copy[document.getElementById("uiLanguage")?.value]||copy.es;}
function node(tag,cls,text){
 const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;
}
function button(cls,label){const n=node("button",cls,label);n.type="button";return n;}
function price(n){const lang=document.getElementById("uiLanguage")?.value;return "US$"+(n/10).toFixed(2).replace(".",lang==="en"?".":",");}
function mimeExt(file){return TYPES[file?.type]||null;}
async function getPosts(creatorId){
 const {data,error}=await supabaseClient.from("vip_posts")
  .select("id,creator_id,title,description,price_coins,media_type,created_at")
  .eq("creator_id",creatorId).order("created_at",{ascending:false}).limit(100);
 if(error)throw error;return data||[];
}
async function ownerAssets(creatorId,ids){
 if(!ids.length)return new Map();
 const{data,error}=await supabaseClient.from("vip_assets")
  .select("post_id,object_path").eq("creator_id",creatorId).in("post_id",ids);
 if(error)throw error;return new Map((data||[]).map(x=>[x.post_id,x.object_path]));
}
async function uploadVip(creatorId,{title,description,priceCoins,file}){
 const ext=mimeExt(file);
 if(!ext)throw new Error(t().badFile);
 if(file.size<=0||file.size>(file.type.startsWith("video/")?50:8)*1024*1024)throw new Error(t().bigFile);
 if(!title||title.trim().length<3||title.trim().length>120)throw new Error(t().badTitle);
 if(description.length>1000)throw new Error(t().badDesc);
 if(!Number.isInteger(priceCoins)||priceCoins<5||priceCoins>5000)throw new Error(t().badPrice);
 const user=(await supabaseClient.auth.getUser()).data.user;
 if(!user||user.id!==creatorId)throw new Error(t().saveError);
 const id=crypto.randomUUID(),path=creatorId+"/"+id+"."+ext;
 const storage=supabaseClient.storage.from(BUCKET);
 const{error:uploadError}=await storage.upload(path,file,{upsert:false,contentType:file.type});
 if(uploadError)throw uploadError;
 let inserted=false;
 try{
  const{error:postError}=await supabaseClient.from("vip_posts").insert({
   id,creator_id:creatorId,title:title.trim(),description,price_coins:priceCoins,media_type:file.type.startsWith("video/")?"video":"image"
  });
  if(postError)throw postError;
  inserted=true;
  const{error:assetError}=await supabaseClient.from("vip_assets").insert({
   post_id:id,creator_id:creatorId,object_path:path
  });
  if(assetError)throw assetError;
  return id;
 }catch(error){
  if(inserted)await supabaseClient.from("vip_posts").delete().eq("id",id).eq("creator_id",creatorId);
  await storage.remove([path]);throw error;
 }
}
function openUpload(creatorId,onSuccess){
 if(document.getElementById("vipUploadModal"))return;
 const previous=document.activeElement,back=node("div","vip-upload-overlay");back.id="vipUploadModal";
 const form=node("form","vip-upload-form");
 const close=button("vip-upload-close","×");
 const eyebrow=node("div","vip-upload-eyebrow"),h=node("h2","vip-upload-heading"),intro=node("p","vip-upload-info");
 function field(tag,type){
  const l=node("label"),caption=node("span"),input=node(tag);if(type)input.type=type;l.append(caption,input);return {l,caption,input};
 }
 const title=field("input","text"),description=field("textarea"),file=field("input","file"),cost=field("input","number");
 title.input.required=true;title.input.maxLength=120;description.input.maxLength=1000;description.input.rows=3;
 file.input.required=true;file.input.accept="image/jpeg,image/png,image/webp,video/mp4,video/webm";
 cost.input.required=true;cost.input.inputMode="numeric";cost.input.min="5";cost.input.max="5000";cost.input.step="1";cost.input.value="30";
 const hint=node("p","vip-upload-hint");
 const actions=node("div","vip-upload-actions"),cancel=button("vip-upload-cancel"),submit=button("vip-upload-submit");
 submit.type="submit";actions.append(cancel,submit);
 const feedback=node("p","vip-upload-feedback");feedback.setAttribute("role","status");feedback.setAttribute("aria-live","polite");
 form.append(close,eyebrow,h,intro,title.l,description.l,file.l,cost.l,hint,actions,feedback);
 back.append(form);document.body.append(back);
 function render(){
  const l=t();close.setAttribute("aria-label",l.close);eyebrow.textContent=l.formEyebrow;h.textContent=l.formTitle;
  intro.textContent=l.formInfo;title.caption.textContent=l.title;title.input.placeholder=l.titleHint;
  description.caption.textContent=l.description;description.input.placeholder=l.descriptionHint;
  file.caption.textContent=l.file;cost.caption.textContent=l.priceInput;
  hint.textContent=l.coinExample+" · "+l.fileLimit;cancel.textContent=l.cancel;submit.textContent=l.publish;
 }
 let busy=false;
 function finish(){
  if(busy)return;
  document.removeEventListener("keydown",onKey);
  document.getElementById("uiLanguage")?.removeEventListener("change",render);
  back.remove();if(previous?.isConnected)previous.focus();
 }
 function onKey(e){if(e.key==="Escape"){e.preventDefault();finish();}}
 close.onclick=finish;cancel.onclick=finish;back.onclick=e=>{if(e.target===back)finish();};
 form.onsubmit=async e=>{
  e.preventDefault();if(busy)return;
  const coins=Number(cost.input.value),titleText=title.input.value.trim(),descText=description.input.value.trim();
  if(titleText.length<3){feedback.textContent=t().badTitle;return;}
  if(!Number.isInteger(coins)||coins<5||coins>5000){feedback.textContent=t().badPrice;return;}
  if(descText.length>1000){feedback.textContent=t().badDesc;return;}
  const media=file.input.files?.[0];
  if(!mimeExt(media)){feedback.textContent=t().badFile;return;}
  if(media.size<=0||media.size>(media.type.startsWith("video/")?50:8)*1024*1024){feedback.textContent=t().bigFile;return;}
  busy=true;submit.disabled=true;cancel.disabled=true;feedback.textContent=t().uploading;
  try{
   await uploadVip(creatorId,{title:titleText,description:descText,priceCoins:coins,file:media});
   feedback.textContent=t().success;
   busy=false;cancel.disabled=false;
   finish();
   await onSuccess();
  }catch(err){
   busy=false;submit.disabled=false;cancel.disabled=false;
   feedback.textContent=(err?.message||t().saveError);
  }
 };
 document.addEventListener("keydown",onKey);
 document.getElementById("uiLanguage")?.addEventListener("change",render);
 render();title.input.focus();
}
async function openOwnerPreview(item,path){
 if(!path)return;
 const previous=document.activeElement,back=node("div","vip-preview-overlay");
 const card=node("section","vip-preview-dialog"),close=button("vip-preview-close","×");
 const warning=node("p","vip-preview-warning",t().previewOwner),content=node("div","vip-preview-content");
 const status=node("p","vip-preview-status","...");
 card.append(close,node("h2","",item.title),warning,content,status);back.append(card);document.body.append(back);
 let closed=false;
 function stop(){if(closed)return;closed=true;back.remove();if(previous?.isConnected)previous.focus();}
 close.onclick=stop;back.onclick=e=>{if(e.target===back)stop();};
 const{data,error}=await supabaseClient.storage.from(BUCKET).createSignedUrl(path,180);
 if(closed)return;
 if(error||!data?.signedUrl){status.textContent=t().saveError;return;}
 const media=node(item.media_type==="video"?"video":"img","vip-preview-media");
 media.src=data.signedUrl;if(item.media_type==="video"){media.controls=true;media.playsInline=true;media.preload="metadata";media.setAttribute("controlsList","nodownload noremoteplayback");media.disablePictureInPicture=true;}
 else{media.draggable=false;media.alt=item.title;}
 content.append(media);status.textContent=t().previewOwner;
}
function mountStudio(overlay,{creatorId,creatorName}){
 const profile=overlay.querySelector(".creator-studio .studio-profile");
 if(!profile||overlay.querySelector(".vip-studio-section"))return;
 const section=node("section","vip-studio-section"),header=node("div","vip-studio-header");
 const headingBox=node("div"),heading=node("h3"),hint=node("p"),create=button("vip-studio-create");
 headingBox.append(heading,hint);header.append(headingBox,create);
 const list=node("div","vip-studio-list"),status=node("p","vip-studio-status");
 section.append(header,status,list);profile.insertAdjacentElement("afterend",section);
 let request=0,items=[];
 async function refresh(){
  const run=++request;status.textContent=t().loading;
  try{
   const rows=await getPosts(creatorId);
   const assets=await ownerAssets(creatorId,rows.map(x=>x.id));
   if(run!==request||!section.isConnected)return;
   items=rows;list.replaceChildren();
   status.textContent=rows.length?"":t().empty;
   rows.forEach(item=>{
    const box=node("article","vip-studio-item"),meta=node("div","vip-studio-item-main");
    const title=node("strong","",item.title),description=node("p","",item.description||"");
    const priceBadge=node("span","vip-studio-item-price",t().ticket(item.price_coins));
    const indicator=node("span","vip-studio-owner-tag",t().showOwner);
    meta.append(title,description,priceBadge,indicator);
    const controls=node("div","vip-studio-item-actions");
    const path=assets.get(item.id);
    if(path){
     const preview=button("vip-studio-preview",t().openOwner);
     preview.onclick=()=>void openOwnerPreview(item,path);controls.append(preview);
    }
    const remove=button("vip-studio-remove",t().remove);
    remove.onclick=async()=>{
     if(!confirm(t().confirm))return;
     remove.disabled=true;remove.textContent=t().removing;
     const{error}=await supabaseClient.from("vip_posts").delete().eq("id",item.id).eq("creator_id",creatorId);
     if(error){remove.disabled=false;remove.textContent=t().remove;status.textContent=t().deleteError;return;}
     if(path){const{error:fileError}=await supabaseClient.storage.from(BUCKET).remove([path]);if(fileError)console.warn("VIP object cleanup pending",fileError.message);}
     await refresh();
    };
    controls.append(remove);box.append(meta,controls);list.append(box);
   });
  }catch(error){
   if(run===request&&section.isConnected){status.textContent=t().error;console.error("VIP catalog read failed",error);}
  }
 }
 function translate(){
  const l=t();heading.textContent=l.studioTitle;hint.textContent=l.studioDesc;create.textContent=l.create;
  if(!items.length)status.textContent=l.empty;
  // Cards are refreshed only when reopening or upon create/delete.
 }
 create.onclick=()=>openUpload(creatorId,refresh);
 const langEl=document.getElementById("uiLanguage");
 langEl?.addEventListener("change",translate);
 const obs=new MutationObserver(()=>{if(!overlay.isConnected){obs.disconnect();langEl?.removeEventListener("change",translate);request++;}});
 obs.observe(document.body,{childList:true});
 translate();void refresh();
}
function mountProfile(overlay,{creatorId,subscribed=false,owner=false}){
 const panel=overlay.querySelector('.profile-panel[data-panel="content"]');
 if(!panel||panel.querySelector(".vip-profile-section"))return;
 const section=node("section","vip-profile-section");panel.prepend(section);
 let alive=true;
 const purchases=new Set();
 async function refresh(){
  try{
   const rows=await getPosts(creatorId);
   if(!section.isConnected||!alive)return;
   if(!rows.length){section.remove();return;}
   section.replaceChildren();
   const heading=node("h3","vip-profile-heading",t().profileTitle),desc=node("p","vip-profile-desc",t().profileDesc);
   const list=node("div","vip-profile-grid");section.append(heading,desc,list);
   rows.forEach(item=>{
    const card=node("article","vip-profile-card"),visual=node("div","vip-profile-lock");
    visual.append(node("span","vip-profile-lock-icon","🔒"),node("small","",item.media_type==="video"?t().video:t().image));
    const body=node("div","vip-profile-card-body");
    body.append(node("small","vip-profile-kicker",t().premium),node("h4","",item.title),node("p","",item.description||""));
    const cents=item.price_coins*10;
    body.append(node("strong","vip-profile-cost",t().ticket(item.price_coins)));
    const label=node("p","vip-profile-rule",t().disclaimer);
    const action=button("vip-profile-buy");
    const feedback=node("p","vip-profile-feedback");feedback.setAttribute("role","status");feedback.setAttribute("aria-live","polite");
    function update(){
     if(!subscribed&&!owner){action.textContent=t().locked;action.disabled=true;}
     else if(purchases.has(item.id)){action.textContent=t().already;action.disabled=true;}
     else{action.textContent=owner?t().testOwner:t().test;action.disabled=false;}
    }
    action.onclick=()=>{
     if(!subscribed&&!owner)return;
     purchases.add(item.id);
     feedback.textContent=t().complete+" "+t().gross(price(Math.round(cents*.8/10)),price(Math.round(cents*.2/10)))+" "+t().notYet;
     update();
    };
    body.append(label,action,feedback);card.append(visual,body);list.append(card);update();
   });
  }catch(err){
   if(section.isConnected)console.error("VIP profile catalog not available",err);
   section.remove();
  }
 }
 // When the profile closes, do not retain purchase demo state.
 const cleanup=new MutationObserver(()=>{if(!overlay.isConnected){alive=false;cleanup.disconnect();}});
 cleanup.observe(document.body,{childList:true});
 void refresh();
}
window.AfterShiftVIP={mountStudio,mountProfile,uploadVip,getPosts};
})();
