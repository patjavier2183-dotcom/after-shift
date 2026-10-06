const creators=[
{name:"Alex Morgan",handle:"@alexm",sub:"US$9.99",tag:"CREATOR",bio:"Contenido exclusivo y comunidad."},
{name:"Sofia Lane",handle:"@sofialane",sub:"US$12.00",tag:"FEATURED",bio:"Contenido premium para suscriptores."},
{name:"Mia Carter",handle:"@miac",sub:"US$8.99",tag:"CREATOR",bio:"Nuevas publicaciones cada semana."},
{name:"Valentina R.",handle:"@valer",sub:"US$14.99",tag:"FEATURED",bio:"Perfil premium de AFTER SHIFT."}];
const grid=document.getElementById("creatorGrid");
const state=JSON.parse(localStorage.getItem("afterShift")||'{"following":[],"subscriptions":[]}');
function save(){localStorage.setItem("afterShift",JSON.stringify(state))}
function render(){grid.innerHTML=creators.map((c,i)=>`<article class="card" data-index="${i}"><div class="cover"></div><div class="info"><div class="name">${c.name}</div><div class="handle">${c.handle}</div><div class="meta"><span class="badge">${c.tag}</span><span>${c.sub}/mes</span></div></div></article>`).join("");document.querySelectorAll(".card").forEach(card=>card.onclick=()=>openProfile(+card.dataset.index))}
function openProfile(i){const c=creators[i];const following=state.following.includes(c.handle);const subscribed=state.subscriptions.includes(c.handle);const action=prompt(`${c.name} · ${c.handle}\n\n${c.bio}\nSuscripción: ${c.sub}/mes\n\nEscribe: SEGUIR, SUSCRIBIR o CERRAR`,following?"SEGUIR":"SUSCRIBIR");if(!action)return;const a=action.toUpperCase();if(a==="SEGUIR"){if(!following)state.following.push(c.handle);save();alert("Ahora sigues a "+c.name+" en esta V0.");}else if(a==="SUSCRIBIR"){if(!subscribed)state.subscriptions.push(c.handle);save();alert("Suscripción de prueba activada. No hay cobro real en esta V0.");}}
render();
document.getElementById("exploreBtn").onclick=()=>document.getElementById("creators").scrollIntoView({behavior:"smooth"});
document.getElementById("allBtn").onclick=()=>alert("Exploración completa: siguiente módulo.");
document.getElementById("loginBtn").onclick=()=>{const name=prompt("AFTER SHIFT V0\n\nEscribe un nombre de usuario para crear una cuenta local de prueba:");if(name){localStorage.setItem("afterShiftUser",name);alert("Cuenta local creada para "+name+". Más adelante la conectaremos a autenticación real.");}};
