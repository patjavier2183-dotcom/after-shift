/* AFTER SHIFT V24 / phase 1: ES, EN, PT-BR. Display-only UI translations.
   Never changes authorization, payments, prices, creators' data, or published posts. */
(function(){
"use strict";
const key="aftershift_ui_language",supported=["es","en","pt"];
const lines=[
"Inicio|Home|Início",
"Explorar|Explore|Explorar",
"Suscripciones|Subscriptions|Assinaturas",
"Mi cuenta|My account|Minha conta",
"Buscar creadores...|Search creators...|Buscar criadores...",
"Iniciar sesión|Log in|Entrar",
"Crear cuenta|Create account|Criar conta",
"Crear cuenta para continuar.|Create an account to continue.|Crie uma conta para continuar.",
"Crea tu cuenta para continuar.|Create an account to continue.|Crie sua conta para continuar.",
"Cerrar sesión|Log out|Sair",
"Tu cuenta|Your account|Sua conta",
"Convertirme en creador|Become a creator|Tornar-me criador",
"Ver mis suscripciones|View my subscriptions|Ver minhas assinaturas",
"Mis suscripciones|My subscriptions|Minhas assinaturas",
"Cerrar|Close|Fechar",
"Siguiendo|Following|Seguindo",
"Tu mundo.|Your world.|Seu mundo.",
"Sin filtros.|Unfiltered.|Sem filtros.",
"Cuando cae la noche,|When night falls,|Quando a noite cai,",
"empieza todo.|everything begins.|tudo começa.",
"Explorar creadores|Explore creators|Explorar criadores",
"Contenido exclusivo|Exclusive content|Conteúdo exclusivo",
"Fotos y videos para suscriptores|Photos and videos for subscribers|Fotos e vídeos para assinantes",
"Conexión real|Real connection|Conexão real",
"Apoya directamente a tus creadores|Support creators directly|Apoie os criadores diretamente",
"Experiencia premium|Premium experience|Experiência premium",
"Tu espacio, a tu ritmo|Your space, your pace|Seu espaço, no seu ritmo",
"MI CUENTA|MY ACCOUNT|MINHA CONTA",
"Creadores destacados|Featured creators|Criadores em destaque",
"Ver todos|See all|Ver todos",
"Las fotografías de ejemplo no representan perfiles verificados. Los perfiles reales se muestran con sus datos registrados.|Sample photos are not verified profiles. Real profiles show their registered data.|Fotos de exemplo não representam perfis verificados. Perfis reais exibem os dados cadastrados.",
"Sobre nosotros|About us|Sobre nós",
"Términos|Terms|Termos",
"Privacidad|Privacy|Privacidade",
"Soporte|Support|Suporte",
"Nombre de usuario|Username|Nome de usuário",
"Correo electrónico|Email|E-mail",
"Contraseña|Password|Senha",
"Mostrar contraseña|Show password|Mostrar senha",
"Ocultar contraseña|Hide password|Ocultar senha",
"¿Olvidaste tu contraseña?|Forgot your password?|Esqueceu sua senha?",
"Ya tengo una cuenta → Ingresar|Already have an account → Log in|Já tem uma conta? → Entrar",
"CREAR CUENTA|CREATE ACCOUNT|CRIAR CONTA",
"Contenido|Content|Conteúdo",
"Sobre mí|About me|Sobre mim",
"Suscripción|Subscription|Assinatura",
"Secciones del creador|Creator sections|Seções do criador",
"Ver perfil|View profile|Ver perfil",
"Perfil de demostración|Demo profile|Perfil de demonstração",
"PERFIL DE EJEMPLO|DEMO PROFILE|PERFIL DE DEMONSTRAÇÃO",
"Precio por definir|Price not set|Preço a definir",
"PUBLICACIONES|POSTS|PUBLICAÇÕES",
"MIS PUBLICACIONES|MY POSTS|MINHAS PUBLICAÇÕES",
"CONTENIDO EXCLUSIVO|EXCLUSIVE CONTENT|CONTEÚDO EXCLUSIVO",
"SOLO SUSCRIPTORES|SUBSCRIBERS ONLY|SOMENTE ASSINANTES",
"PÚBLICO|PUBLIC|PÚBLICO",
"Solo suscriptores|Subscribers only|Somente assinantes",
"Público — todos pueden verlo|Public — everyone can view it|Público — todos podem ver",
"VER SUSCRIPCIÓN|VIEW SUBSCRIPTION|VER ASSINATURA",
"SUSCRITO ✓|SUBSCRIBED ✓|ASSINADO ✓",
"SEGUIR|FOLLOW|SEGUIR",
"SIGUIENDO ✓|FOLLOWING ✓|SEGUINDO ✓",
"VER PUBLICACIÓN|VIEW POST|VER PUBLICAÇÃO",
"GESTIONAR SUSCRIPCIÓN|MANAGE SUBSCRIPTION|GERENCIAR ASSINATURA",
"VER DISPONIBILIDAD|CHECK AVAILABILITY|VER DISPONIBILIDADE",
"🔒 Acceso exclusivo mediante suscripción|🔒 Exclusive subscriber access|🔒 Acesso exclusivo por assinatura",
"Este creador todavía no tiene publicaciones.|This creator has no posts yet.|Este criador ainda não tem publicações.",
"Los pagos todavía no están habilitados.|Payments are not available yet.|Os pagamentos ainda não estão disponíveis.",
"ELIMINAR|DELETE|EXCLUIR",
"+ NUEVA PUBLICACIÓN|+ NEW POST|+ NOVA PUBLICAÇÃO",
"NUEVA PUBLICACIÓN|NEW POST|NOVA PUBLICAÇÃO",
"Publicar contenido|Publish content|Publicar conteúdo",
"Publica y administra tu contenido.|Publish and manage your content.|Publique e gerencie seu conteúdo.",
"Planes y promociones|Plans and promotions|Planos e promoções",
"Precio comercial propuesto (borrador)|Proposed price (draft)|Preço proposto (rascunho)",
"Sin configurar|Not configured|Não configurado",
"Todavía no has publicado nada.|You haven't posted anything yet.|Você ainda não publicou nada.",
"Título|Title|Título",
"Ej. Nueva publicación|e.g. New post|Ex.: Nova publicação",
"Descripción o texto (opcional)|Description or text (optional)|Descrição ou texto (opcional)",
"Escribe algo para tus suscriptores...|Write something for subscribers...|Escreva algo para seus assinantes...",
"Imagen o video|Image or video|Imagem ou vídeo",
"Acceso|Access|Acesso",
"Cancelar|Cancel|Cancelar",
"PUBLICAR|PUBLISH|PUBLICAR",
"PUBLICANDO...|PUBLISHING...|PUBLICANDO...",
"Subiendo archivo y guardando publicación...|Uploading and saving post...|Enviando arquivo e salvando publicação...",
"Precio comercial:|Subscription price:|Preço da assinatura:",
"Simulación de pagos|Payment simulation|Simulação de pagamentos",
"Cerrar simulación|Close simulation|Fechar simulação",
"Cancelar renovación|Cancel renewal|Cancelar renovação",
"Reiniciar prueba|Reset test|Reiniciar teste",
"Pago simulado aprobado|Simulated payment approved|Pagamento simulado aprovado",
"Pago pendiente de confirmar|Payment pending confirmation|Pagamento aguardando confirmação",
"Pago rechazado|Payment rejected|Pagamento recusado",
"Suscripción vencida|Subscription expired|Assinatura expirada",
"Sin intento de pago|No payment attempted|Nenhum pagamento tentado",
"Idioma de la interfaz|Interface language|Idioma da interface"
];
const dict=new Map(lines.map(s=>{const [es,en,pt]=s.split("|");return [es,{en,pt}]}));
const savedText=new WeakMap(),savedAttr=new WeakMap();
let lang="es",scheduled=false;
const excluded="script,style,noscript,textarea,[contenteditable],.card .name,.card .handle,.creator-profile .profile-main p,.profile-panel-extra[data-panel='about'] p,.post-card h4,.post-card>p,.post-card p,.post-detail-head h2,.post-detail-description,.my-subscription-info strong,#accountEmail";
function translate(es){
  if(lang==="es")return es;
  const value=es.trim(),entry=dict.get(value);
  let target=entry&&entry[lang];
  if(!target){
    const m=value.match(/^(\d+) publicaciones?$/);
    if(m)target=m[1]+(lang==="en"?(m[1]==="1"?" post":" posts"):(m[1]==="1"?" publicação":" publicações"));
  }
  if(!target)return null;
  const i=es.indexOf(value);
  return es.slice(0,i)+target+es.slice(i+value.length);
}

function isGenerated(source,actual){
  if(actual===source)return true;
  const word=source.trim(),m=word.match(/^(\d+) publicaciones?$/);
  const row=dict.get(word);
  const i=source.indexOf(word);
  if(row&&i>=0)return actual===source.slice(0,i)+row.en+source.slice(i+word.length)||
                         actual===source.slice(0,i)+row.pt+source.slice(i+word.length);
  if(m)return actual.trim()===m[1]+(m[1]==="1"?" post":" posts")||
                actual.trim()===m[1]+(m[1]==="1"?" publicação":" publicações");
  return false;
}
function translateNode(n){
  if(!n.parentElement||n.parentElement.closest(excluded))return;
  const actual=n.nodeValue;
  let source=savedText.get(n);
  if(source!==undefined&&!isGenerated(source,actual))source=undefined;
  if(source===undefined){
    source=actual;
    if(!dict.has(source.trim())&&!/^\d+ publicaciones?$/.test(source.trim()))return;
    savedText.set(n,source);
  }
  const result=translate(source)||source;
  if(actual!==result)n.nodeValue=result;
}
function translateAttrs(el){
  if(el.nodeType!==1||el.closest("script,style,noscript"))return;
  const stored=savedAttr.get(el)||{};
  ["placeholder","aria-label","title"].forEach(attr=>{
    if(!el.hasAttribute(attr))return;
    const actual=el.getAttribute(attr);
    let source=stored[attr];
    if(source!==undefined&&!isGenerated(source,actual))source=undefined;
    if(source===undefined){source=actual;if(!dict.has(source.trim()))return;stored[attr]=source;}
    const result=translate(source)||source;
    if(actual!==result)el.setAttribute(attr,result);
  });
  savedAttr.set(el,stored);
}
function refresh(){
  scheduled=false;
  const root=document.body;if(!root)return;
  translateAttrs(root);
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);
  while(walker.nextNode()){
    const n=walker.currentNode;
    if(n.nodeType===3)translateNode(n);else translateAttrs(n);
  }
}
function schedule(){if(scheduled)return;scheduled=true;Promise.resolve().then(refresh);}
function setLanguage(value){
  if(!supported.includes(value))return;
  lang=value;try{localStorage.setItem(key,lang)}catch{}
  document.documentElement.lang=lang==="pt"?"pt-BR":lang;
  const select=document.getElementById("uiLanguage");if(select)select.value=lang;
  schedule();
}
function init(){
  const select=document.getElementById("uiLanguage");if(!select)return;
  let saved=null;try{saved=localStorage.getItem(key)}catch{}
  const browser=(navigator.language||"es").toLowerCase();
  const initial=supported.includes(saved)?saved:browser.startsWith("pt")?"pt":browser.startsWith("en")?"en":"es";
  select.addEventListener("change",()=>setLanguage(select.value));
  new MutationObserver(()=>schedule()).observe(document.body,{childList:true,characterData:true,attributes:true,attributeFilter:["placeholder","title","aria-label"],subtree:true});
  setLanguage(initial);
}
window.AfterShiftI18n={setLanguage,getLanguage:()=>lang};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();