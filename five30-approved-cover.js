/* Los hotspots ejecutan los flujos originales, no formularios de muestra. */
(function(){
  const panel=document.getElementById('approvedSearchPanel');
  const input=document.getElementById('approvedSearchInput');
  function clickOriginal(id){const el=document.getElementById(id);if(el)el.click();}
  function navigate(id){const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});}
  function searchSync(){const original=document.getElementById('creatorSearch');if(original){original.value=input.value;original.dispatchEvent(new Event('input',{bubbles:true}));}}
  document.addEventListener('click',function(event){
    const trigger=event.target.closest('[data-cover-action]');if(!trigger)return;
    const action=trigger.getAttribute('data-cover-action');
    if(action==='home')navigate('portada');
    if(action==='explore')navigate('creators');
    if(action==='about')navigate('about');
    if(action==='subscriptions')clickOriginal('navSubscriptions');
    if(action==='login')clickOriginal('loginBtn');
    if(action==='join'){
      const login=document.getElementById('loginBtn');
      const signup=document.getElementById('signupBtn');
      if(login&&(/mi cuenta|my account/i.test(login.textContent||'')||signup?.style.display==='none'))login.click();
      else clickOriginal('signupBtn');
    }
    if(action==='search'){panel.hidden=!panel.hidden;if(!panel.hidden)input.focus();}
    if(action==='search-close')panel.hidden=true;
    if(action==='search-go'){searchSync();navigate('creators');}
  });
  input.addEventListener('input',searchSync);
  input.addEventListener('keydown',event=>{if(event.key==='Enter'){searchSync();navigate('creators');}});
})();
