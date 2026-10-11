/* MFA for 5:30 administrative accounts. Never send codes to external services. */
document.addEventListener("DOMContentLoaded",async()=>{
 const section=document.getElementById("accountSection");
 if(!section||typeof currentUser!=="function")return;
 const user=await currentUser();if(!user)return;
 const panel=document.createElement("section");panel.className="five30-professional five30-mfa-panel";
 const title=document.createElement("h3");title.textContent="Seguridad de la cuenta";
 const expand=document.createElement("button");expand.type="button";expand.className="five30-mfa-expand";expand.textContent="Mostrar opciones de seguridad";expand.setAttribute("aria-expanded","false");
 const content=document.createElement("div");content.hidden=true;
 expand.onclick=()=>{content.hidden=!content.hidden;expand.setAttribute("aria-expanded",String(!content.hidden));expand.textContent=content.hidden?"Mostrar opciones de seguridad":"Ocultar opciones de seguridad";};
 const status=document.createElement("p");status.setAttribute("role","status");
 const start=document.createElement("button");start.type="button";start.textContent="Activar verificación en dos pasos";
 const setup=document.createElement("div");setup.hidden=true;
 const qr=document.createElement("img");qr.alt="Código QR para configurar la aplicación autenticadora";qr.style.cssText="display:block;max-width:210px;margin:12px auto";
 const secret=document.createElement("code");secret.style.cssText="display:block;overflow-wrap:anywhere";
 const input=document.createElement("input");input.inputMode="numeric";input.autocomplete="one-time-code";input.placeholder="Código de 6 dígitos";input.maxLength=6;
 const confirm=document.createElement("button");confirm.type="button";confirm.textContent="Confirmar código";
 const reset=document.createElement("button");reset.type="button";reset.textContent="Reiniciar vinculación del autenticador";reset.hidden=true;
 setup.append(qr,secret,input,confirm);content.append(status,start,setup,reset);panel.append(title,expand,content);section.append(panel);
 let factorId=null;
 async function refresh(){
  const {data,error}=await supabaseClient.auth.mfa.listFactors();
  if(error){status.textContent="No se pudo comprobar la seguridad de la cuenta.";return;}
  const factors=data?.all||data?.totp||[];
  const verified=factors.some(f=>f.factor_type==="totp"&&f.status==="verified");
  const pending=factors.find(f=>f.factor_type==="totp"&&f.status==="unverified");
  factorId=pending?.id||null;
  status.textContent=verified?"Autenticador configurado. Al iniciar sesión, verifica el segundo factor.":pending?"Hay una configuración pendiente. Usa el código que ya aparece en Google Authenticator para confirmarla.":"Activa una aplicación autenticadora para proteger tu cuenta.";
  start.hidden=verified||!!pending;setup.hidden=verified||!pending;
  reset.hidden=verified||!pending;
  qr.hidden=!!pending;secret.hidden=!!pending;
  if(pending){qr.removeAttribute("src");secret.textContent="";}
 }
 start.onclick=async()=>{
  start.disabled=true;
  status.textContent="Solicitando configuración segura…";
  const {data,error}=await supabaseClient.auth.mfa.enroll({factorType:"totp",friendlyName:"5:30 Authenticator"});
  start.disabled=false;
  if(error){status.textContent="No se pudo iniciar la configuración: "+error.message+". Si ya configuraste el autenticador, no elimines su entrada.";return;}
  factorId=data.id;qr.src=data.totp.qr_code;secret.textContent="Clave manual: "+data.totp.secret;
  setup.hidden=false;status.textContent="Escanea el QR con una aplicación autenticadora e ingresa el código generado.";
 };
 reset.onclick=async()=>{
  if(!factorId){status.textContent="No se encontró una vinculación pendiente. Actualiza la página.";return;}
  if(!window.confirm("Se eliminará solamente la vinculación de autenticador que aún NO está activada en esta cuenta. Luego debes reemplazar la entrada anterior en Google Authenticator por una nueva. ¿Continuar?"))return;
  reset.disabled=true;confirm.disabled=true;
  status.textContent="Reiniciando la vinculación pendiente…";
  try{
   const {error}=await supabaseClient.auth.mfa.unenroll({factorId});
   if(error)throw error;
   factorId=null;input.value="";qr.removeAttribute("src");secret.textContent="";
   const {data,error:enrollError}=await supabaseClient.auth.mfa.enroll({factorType:"totp",friendlyName:"5:30 Authenticator"});
   if(enrollError)throw enrollError;
   factorId=data.id;qr.hidden=false;secret.hidden=false;
   qr.src=data.totp.qr_code;
   secret.textContent="Clave manual nueva: "+data.totp.secret;
   setup.hidden=false;reset.hidden=true;start.hidden=true;
   status.textContent="Vinculación nueva creada. Elimina la entrada ANTIGUA de 5:30 en Google Authenticator, agrega una nueva con este QR o clave manual y confirma el código nuevo.";
  }catch(error){
   status.textContent="No se pudo reiniciar: "+(error?.message||"Error desconocido")+". Actualiza la página para revisar el estado.";
  }finally{reset.disabled=false;confirm.disabled=false;}
 };
 confirm.onclick=async()=>{
  const code=input.value.trim();
  if(!factorId||!/^[0-9]{6}$/.test(code)){status.textContent="Ingresa los seis números del autenticador.";return;}
  confirm.disabled=true;
  status.textContent="Verificando con Supabase, espera…";
  try{
   const {data:challenge,error:challengeError}=await supabaseClient.auth.mfa.challenge({factorId});
   if(challengeError)throw challengeError;
   if(!challenge?.id)throw new Error("No se recibió el identificador de verificación.");
   const {error}=await supabaseClient.auth.mfa.verify({factorId,challengeId:challenge.id,code});
   if(error)throw error;
   const {data:levels,error:levelError}=await supabaseClient.auth.mfa.getAuthenticatorAssuranceLevel();
   if(levelError)throw levelError;
   if(levels?.currentLevel!=="aal2"){
    status.textContent="El código fue aceptado, pero aún no se confirmó el nivel de seguridad. Actualiza y revisa el estado.";
    return;
   }
   input.value="";secret.textContent="";qr.removeAttribute("src");factorId=null;
   setup.hidden=true;start.hidden=true;
   status.textContent="Verificación en dos pasos ACTIVADA correctamente. Tu sesión ya está protegida.";
  }catch(error){
   status.textContent="No se pudo confirmar: "+(error?.message||"Error desconocido")+". La configuración sigue pendiente.";
  }finally{confirm.disabled=false;}
 };
 await refresh();
});
