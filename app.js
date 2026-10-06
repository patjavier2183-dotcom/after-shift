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

async function render(){
  grid.innerHTML=creators.map((c,i)=>`<article class="card" data-index="${i}">
    <div class="cover"></div><div class="info"><div class="name">${c.name}</div>
    <div class="handle">${c.handle}</div><div class="meta"><span class="badge">${c.tag}</span><span>${c.sub}/mes</span></div></div></article>`).join("");
  document.querySelectorAll(".card").forEach(card=>card.onclick=()=>openProfile(+card.dataset.index));
}

async function openProfile(i){
  const c=creators[i];
  const user=await currentUser();
  if(!user){alert("Primero debes ingresar a AFTER SHIFT.");return;}
  const {data:creator}=await supabaseClient.from("profiles").select("id,display_name,username,bio,subscription_price").eq("username",c.handle.replace("@","")).maybeSingle();
  if(!creator){alert("Este creador todavía no está registrado en la base de datos V0.");return;}
  const {data:follow}=await supabaseClient.from("follows").select("creator_id").eq("follower_id",user.id).eq("creator_id",creator.id).maybeSingle();
  const {data:sub}=await supabaseClient.from("subscriptions").select("creator_id,status").eq("subscriber_id",user.id).eq("creator_id",creator.id).maybeSingle();
  const action=prompt(`${creator.display_name} · @${creator.username}\n\n${creator.bio||c.bio}\nSuscripción: US$${Number(creator.subscription_price||0).toFixed(2)}/mes\n\nEscribe: SEGUIR, DEJAR DE SEGUIR, SUSCRIBIR, CERRAR`,follow?"DEJAR DE SEGUIR":"SEGUIR");
  if(!action)return;
  const a=action.toUpperCase();
  if(a==="SEGUIR"){
    if(!follow){const {error}=await supabaseClient.from("follows").insert({follower_id:user.id,creator_id:creator.id});if(error)alert(error.message);else alert("Ahora sigues a "+creator.display_name+".");}
  }else if(a==="DEJAR DE SEGUIR"){
    if(follow){const {error}=await supabaseClient.from("follows").delete().eq("follower_id",user.id).eq("creator_id",creator.id);if(error)alert(error.message);else alert("Dejaste de seguir a "+creator.display_name+".");}
  }else if(a==="SUSCRIBIR"){
    if(!sub){const {error}=await supabaseClient.from("subscriptions").insert({subscriber_id:user.id,creator_id:creator.id,status:"active"});if(error)alert(error.message);else alert("Suscripción V0 activada. Todavía no hay cobro real.");}
    else alert("Ya tienes una suscripción V0 activa.");
  }
}

document.getElementById("exploreBtn").onclick=()=>document.getElementById("creators").scrollIntoView({behavior:"smooth"});
document.getElementById("allBtn").onclick=()=>alert("Exploración completa: siguiente módulo.");

document.getElementById("loginBtn").onclick=async()=>{
  const email=prompt("Correo electrónico:");
  if(!email)return;
  const password=prompt("Contraseña (mínimo 6 caracteres):");
  if(!password)return;
  const {data,error}=await supabaseClient.auth.signInWithPassword({email,password});
  if(error){
    const create=confirm("No pudimos ingresar. ¿Quieres crear esta cuenta?");
    if(create){
      const username=prompt("Nombre de usuario:");
      if(!username)return;
      const {error:signupError}=await supabaseClient.auth.signUp({email,password,options:{data:{username,display_name:username}}});
      if(signupError)alert(signupError.message);
      else alert("Cuenta creada. Si Supabase solicita confirmación por correo, confírmala y vuelve a ingresar.");
    }else alert(error.message);
  }else alert("Bienvenido a AFTER SHIFT, "+(data.user.email||"usuario")+".");
};

supabaseClient.auth.onAuthStateChange((_event)=>{});
render();
