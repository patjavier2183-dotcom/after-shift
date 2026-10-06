const creators=[
 {name:"Alex Morgan",handle:"@alexm",sub:"US$9.99",tag:"CREATOR"},
 {name:"Sofia Lane",handle:"@sofialane",sub:"US$12.00",tag:"FEATURED"},
 {name:"Mia Carter",handle:"@miac",sub:"US$8.99",tag:"CREATOR"},
 {name:"Valentina R.",handle:"@valer",sub:"US$14.99",tag:"FEATURED"}
];
const grid=document.getElementById("creatorGrid");
function render(){
 grid.innerHTML=creators.map((c,i)=>`
  <article class="card" data-index="${i}">
   <div class="cover"></div>
   <div class="info">
    <div class="name">${c.name}</div><div class="handle">${c.handle}</div>
    <div class="meta"><span class="badge">${c.tag}</span><span>${c.sub}/mes</span></div>
   </div>
  </article>`).join("");
 document.querySelectorAll(".card").forEach(card=>card.onclick=()=>alert("Perfil de creador — V0\n\nAquí conectaremos el perfil, publicaciones y suscripción."));
}
render();
document.getElementById("exploreBtn").onclick=()=>document.getElementById("creators").scrollIntoView({behavior:"smooth"});
document.getElementById("allBtn").onclick=()=>alert("Exploración completa — siguiente módulo V0.");
document.getElementById("loginBtn").onclick=()=>alert("Inicio de sesión — siguiente módulo V0.");