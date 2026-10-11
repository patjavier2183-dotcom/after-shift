/* 5:30 professional options: informational entry points only.
   Account role changes require verified, server-side workflows not yet deployed. */
(function(){
  function ready(){
    const menu=document.getElementById("professionalOptions");
    const notice=document.getElementById("professionalNotice");
    if(!menu||!notice)return;
    function show(kind){
      notice.hidden=false;
      notice.textContent=kind==="agency"
        ?"Registro Studio en preparación: requerirá identidad del responsable, datos comerciales y autorización de cada creador. Tu cuenta no ha cambiado."
        :"Registro de creador en preparación: requerirá verificación de identidad, mayoría de edad y derechos del contenido. Tu cuenta no ha cambiado.";
      notice.scrollIntoView({behavior:"smooth",block:"nearest"});
    }
    document.getElementById("professionalCreator")?.addEventListener("click",()=>show("creator"));
    document.getElementById("professionalAgency")?.addEventListener("click",()=>show("agency"));
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",ready);else ready();
})();
