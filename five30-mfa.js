/* MFA for 5:30 administrative accounts. Never send codes to external services. */
document.addEventListener("DOMContentLoaded",async()=>{
 const section=document.getElementById("accountSection");
 if(!section||typeof currentUser!=="function")return;
 const user=await currentUser();if(!user)return;
 const panel=document.createElement("section");panel.className="five30-professional";
 const title=document.createElement("h3");title.textContent="Seguridad de la cuenta";
 const status=document.createElement("p");status.setAttribute("role","status");
 const start=document.createElement("button");start.type="button";start.textContent="Activar verificación en dos pasos";
 const setup=document.createElement("div");setup.hidden=true;
 const qr=document.createElement("img");qr.alt="Código QR para configurar la aplicación autenticadora";qr.style.cssText="display:block;max-width:210px;margin:12px auto";
 const secret=document.createElement("code");secret.style.cssText="display:block;overflow-wrap:anywhere";
 const input=document.createElement("input");input.inputMode="numeric";input.autocomplete="one-time-code";input.placeholder="Código de 6 dígitos";input.maxLength=6;
 const confirm=document.createElement("button");confirm.type="button";confirm.textContent="Confirmar código";
 setup.append(qr,secret,input,confirm);panel.append(title,status,start,setup);section.append(panel);
 let factorId=null;
 async function refresh(){
  const {data,error}=await supabaseClient.auth.mfa.listFactors();
  if(error){status.textContent="No se pudo comprobar la seguridad de la cuenta.";return;}
  const verified=(data?.totp||[]).some(f=>f.status==="verified");
  status.textContent=verified?"Autenticador configurado. Al iniciar sesión, verifica el segundo factor.":"Activa una aplicación autenticadora para proteger tu cuenta.";
  start.hidden=verified;setup.hidden=true;
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
 confirm.onclick=async()=>{
  const code=input.value.trim();
  if(!factorId||!/^[0-9]{6}$/.test(code)){status.textContent="Ingresa un código de 6 dígitos.";return;}
  confirm.disabled=true;
  status.textContent="Comprobando el código…";
  const {data:challenge,error:challengeError}=await supabaseClient.auth.mfa.challenge({factorId});
  if(challengeError){status.textContent="No se pudo generar la verificación: "+challengeError.message;confirm.disabled=false;return;}
  const {error}=await supabaseClient.auth.mfa.verify({factorId,challengeId:challenge.id,code});
  confirm.disabled=false;
  if(error){status.textContent="No se pudo confirmar el código: "+error.message;return;}
  input.value="";secret.textContent="";qr.removeAttribute("src");factorId=null;
  await refresh();status.textContent="Verificación en dos pasos activada. Vuelve a ingresar para comprobarla.";
 };
 await refresh();
});
