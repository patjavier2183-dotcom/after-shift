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
"Contenido exclusivo y comunidad.|Exclusive content and community.|Conteúdo exclusivo e comunidade.",
"Contenido premium para suscriptores.|Premium content for subscribers.|Conteúdo premium para assinantes.",
"Nuevas publicaciones cada semana.|New posts every week.|Novas publicações toda semana.",
"Perfil ilustrativo de AFTER SHIFT.|Sample AFTER SHIFT profile.|Perfil ilustrativo do AFTER SHIFT.",
"PRUEBA · SOLO SUSCRIPTORES|DEMO · SUBSCRIBERS ONLY|TESTE · APENAS ASSINANTES",
"Cada LIVE requiere entrada adicional a la suscripción. Los regalos son voluntarios.|Each LIVE requires a separate ticket beyond the subscription. Gifts are optional.|Cada LIVE exige ingresso adicional à assinatura. Os presentes são opcionais.",
"PROBAR LIVE PREMIUM|TRY PREMIUM LIVE|TESTAR LIVE PREMIUM",
"Idioma de la interfaz|Interface language|Idioma da interface",
"Ingresar|Log in|Entrar",
"INGRESAR|LOG IN|ENTRAR",
"No tengo cuenta → Crear cuenta|No account? → Create one|Não tem conta? → Criar conta",
"← Volver a ingresar|← Back to log in|← Voltar para entrar",
"Ingresa con tu cuenta de AFTER SHIFT.|Log in with your AFTER SHIFT account.|Entre com sua conta AFTER SHIFT.",
"Ingresa el correo con el que registraste tu cuenta. Te enviaremos un enlace para recuperar el acceso.|Enter the email used to register your account. We’ll send you a recovery link.|Digite o e-mail usado para criar sua conta. Enviaremos um link de recuperação.",
"Escribe una contraseña nueva para recuperar tu cuenta.|Enter a new password to recover your account.|Digite uma nova senha para recuperar sua conta.",
"Recuperar contraseña|Reset password|Recuperar senha",
"Nueva contraseña|New password|Nova senha",
"ENVIAR ENLACE|SEND LINK|ENVIAR LINK",
"GUARDAR CONTRASEÑA|SAVE PASSWORD|SALVAR SENHA",
"Procesando...|Processing...|Processando...",
"El enlace de recuperación expiró o no es válido. Solicita uno nuevo.|The recovery link has expired or is invalid. Request a new one.|O link de recuperação expirou ou é inválido. Solicite outro.",
"El usuario debe tener 3 a 24 caracteres: letras, números, punto, guion o guion bajo.|Username must contain 3 to 24 letters, digits, periods, hyphens or underscores.|O nome de usuário deve ter de 3 a 24 caracteres: letras, números, pontos, hífens ou sublinhados.",
"Cuenta creada. Revisa tu correo para confirmar la cuenta y luego ingresa.|Account created. Check your email to confirm it, then log in.|Conta criada. Verifique seu e-mail para confirmá-la e depois entre.",
"Falta confirmar el correo. Revisa tu bandeja de entrada.|Your email isn't confirmed yet. Check your inbox.|Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada.",
"El correo o la contraseña no son correctos. Compruébalos o usa «¿Olvidaste tu contraseña?»|Incorrect email or password. Check them or use “Forgot your password?”|E-mail ou senha incorretos. Confira os dados ou use “Esqueceu sua senha?”",
"Escribe el correo de tu cuenta.|Enter your account email.|Digite o e-mail da sua conta.",
"No se pudo enviar el enlace. Inténtalo nuevamente en unos minutos.|Couldn't send the link. Try again in a few minutes.|Não foi possível enviar o link. Tente novamente em alguns minutos.",
"Si ese correo está asociado a una cuenta, recibirás un enlace de recuperación. Revisa también la carpeta Spam.|If that email belongs to an account, you'll receive a recovery link. Check your spam folder too.|Se esse e-mail estiver vinculado a uma conta, você receberá um link de recuperação. Confira também o spam.",
"Primero abre el enlace de recuperación enviado a tu correo.|First open the recovery link sent to your email.|Primeiro abra o link de recuperação enviado ao seu e-mail.",
"Tu nueva contraseña debe tener al menos 8 caracteres.|Your new password must have at least 8 characters.|Sua nova senha deve ter pelo menos 8 caracteres.",
"No se pudo cambiar la contraseña. Solicita otro enlace si expiró.|Couldn't change the password. Request another link if it expired.|Não foi possível alterar a senha. Solicite outro link se ele tiver expirado.",
"Ocurrió un error. Comprueba tu conexión e inténtalo nuevamente.|Something went wrong. Check your connection and try again.|Ocorreu um erro. Verifique sua conexão e tente novamente.",
"No pudimos cargar tus datos. Inténtalo nuevamente.|Couldn't load your information. Try again.|Não foi possível carregar seus dados. Tente novamente.",
"No se pudo actualizar la cuenta.|Couldn't update your account.|Não foi possível atualizar sua conta.",
"Cargando tus suscripciones...|Loading your subscriptions...|Carregando suas assinaturas...",
"Selecciona Suscripciones para ver a quién sigues.|Select Subscriptions to view creators you follow.|Selecione Assinaturas para ver quem você segue.",
"Inicia sesión para ver tus suscripciones.|Log in to view your subscriptions.|Entre para ver suas assinaturas.",
"Todavía no tienes suscripciones activas.|You don't have any active subscriptions yet.|Você ainda não tem assinaturas ativas.",
"Suscripción activa|Active subscription|Assinatura ativa",
"No pudimos encontrar el perfil de este creador.|We couldn't find this creator’s profile.|Não encontramos o perfil deste criador.",
"Ver perfil y gestionar →|View and manage profile →|Ver e gerenciar perfil →",
"No pudimos cargar tus suscripciones.|Couldn't load your subscriptions.|Não foi possível carregar suas assinaturas.",
"Reintentar|Retry|Tentar novamente",
"No se pudieron cargar los perfiles reales.|Couldn't load real creator profiles.|Não foi possível carregar os perfis reais.",
"No encontramos creadores con ese nombre.|No creators found with that name.|Não encontramos criadores com esse nome.",
"Perfil de ejemplo|Demo profile|Perfil de demonstração",
"CREATOR|CREATOR|CRIADOR",
"Este creador todavía no tiene publicaciones.|This creator has no posts yet.|Este criador ainda não tem publicações.",
"Precio comercial pendiente de habilitación|Commercial pricing not enabled yet|Preços comerciais ainda não habilitados",
"Precio comercial propuesto (borrador)|Proposed commercial price (draft)|Preço comercial proposto (rascunho)",
"Precio por definir|Price not set|Preço a definir",
"Los pagos todavía no están habilitados. El contenido exclusivo se desbloqueará únicamente después de verificar un pago; por ahora no se activan nuevas suscripciones gratuitas.|Payments are not enabled yet. Exclusive content unlocks only after verified payment; new free subscriptions are disabled for now.|Os pagamentos ainda não estão disponíveis. O conteúdo exclusivo só é liberado após pagamento verificado; novas assinaturas gratuitas estão desativadas.",
"🔒 Acceso exclusivo mediante suscripción|🔒 Exclusive access by subscription|🔒 Acesso exclusivo por assinatura",
"Este creador todavía no tiene publicaciones.|This creator has no posts yet.|Este criador ainda não tem publicações.",
"SEGUIR|FOLLOW|SEGUIR",
"SIGUIENDO ✓|FOLLOWING ✓|SEGUINDO ✓",
"SUSCRITO ✓|SUBSCRIBED ✓|ASSINADO ✓",
"GESTIONAR SUSCRIPCIÓN|MANAGE SUBSCRIPTION|GERENCIAR ASSINATURA",
"VER DISPONIBILIDAD|CHECK AVAILABILITY|VER DISPONIBILIDADE",
"VER PUBLICACIÓN|VIEW POST|VER PUBLICAÇÃO",
"VER SUSCRIPCIÓN|VIEW SUBSCRIPTION|VER ASSINATURA",
"CONTENIDO EXCLUSIVO|EXCLUSIVE CONTENT|CONTEÚDO EXCLUSIVO",
"Precio comercial:|Subscription price:|Preço da assinatura:",
"Contenido de|Content by|Conteúdo de",
"Cargando publicación...|Loading post...|Carregando publicação...",
"Inicia sesión para ver esta publicación.|Log in to view this post.|Entre para ver esta publicação.",
"Tu suscripción no está activa. Vuelve al perfil para actualizar el acceso.|Your subscription is not active. Return to the profile to refresh access.|Sua assinatura não está ativa. Volte ao perfil para atualizar o acesso.",
"No se pudo autorizar el archivo protegido. Inténtalo nuevamente.|Couldn't authorize the protected file. Try again.|Não foi possível autorizar o arquivo protegido. Tente novamente.",
"No se pudo abrir la publicación. Comprueba tu conexión e inténtalo nuevamente.|Couldn't open the post. Check your connection and try again.|Não foi possível abrir a publicação. Verifique sua conexão e tente novamente.",
"Cerrar publicación|Close post|Fechar publicação",
"Cancelando...|Cancelling...|Cancelando...",
"Suscripción de prueba cancelada. El contenido volvió a bloquearse.|Test subscription cancelled. Content is locked again.|Assinatura de teste cancelada. O conteúdo foi bloqueado novamente.",
"Todavía no has publicado nada.|You haven't posted anything yet.|Você ainda não publicou nada.",
"Sin configurar|Not configured|Não configurado",
"Planes y promociones|Plans and promotions|Planos e promoções",
"Publica y administra tu contenido.|Publish and manage your content.|Publique e gerencie seu conteúdo.",
"Publicar contenido|Publish content|Publicar conteúdo",
"Imagen o video|Image or video|Imagem ou vídeo",
"Escribe un título.|Enter a title.|Digite um título.",
"Selecciona una imagen o video.|Choose an image or video.|Selecione uma imagem ou vídeo.",
"No se pudo publicar. Inténtalo de nuevo.|Couldn't publish. Try again.|Não foi possível publicar. Tente novamente.",
"PUBLICANDO...|PUBLISHING...|PUBLICANDO...",
"Subiendo archivo y guardando publicación...|Uploading file and saving post...|Enviando arquivo e salvando a publicação...",
"Mensual|Monthly|Mensal",
"Anual|Yearly|Anual",
"1 mes|1 month|1 mês",
"3 meses|3 months|3 meses",
"6 meses|6 months|6 meses",
"12 meses|12 months|12 meses",
"Descuento|Discount|Desconto",
"Plazos y descuentos|Terms and discounts|Períodos e descontos",
"Precio mensual de referencia (US$)|Reference monthly price (US$)|Preço mensal de referência (US$)",
"Oferta de bienvenida|Welcome offer|Oferta de boas-vindas",
"Descuento para nuevos suscriptores|Discount for new subscribers|Desconto para novos assinantes",
"¿Cuánto tiempo estará disponible la oferta?|How long will the offer be available?|Por quanto tempo a oferta ficará disponível?",
"Duración de la oferta|Offer duration|Duração da oferta",
"24 horas|24 hours|24 horas",
"3 días|3 days|3 dias",
"7 días|7 days|7 dias",
"Bienvenida permanente|Permanent welcome offer|Boas-vindas permanentes",
"Reactivar oferta vencida|Reactivate expired offer|Reativar oferta expirada",
"Vista previa|Preview|Prévia",
"GUARDAR BORRADOR|SAVE DRAFT|SALVAR RASCUNHO",
"Simulación para preparar ofertas. No genera pagos ni suscripciones. Precio comercial mínimo: US$4,99 al mes.|Simulation to prepare offers. It doesn't create payments or subscriptions. Minimum commercial price: US$4.99 per month.|Simulação para preparar ofertas. Não gera pagamentos nem assinaturas. Preço comercial mínimo: US$ 4,99 por mês.",
"La oferta se puede contratar durante el plazo elegido, pero el descuento se aplica solo al primer mes de una suscripción mensual. Los planes de 3, 6 y 12 meses mantienen sus descuentos propios, sin acumulación. El vencimiento se calcula al guardar y no se extiende automáticamente.|The offer is available for the chosen period, but the discount applies only to the first month of a monthly subscription. Three-, six- and twelve-month plans have their own discounts, which don't stack. The expiry is set when saved and does not automatically extend.|A oferta fica disponível pelo período escolhido, mas o desconto vale apenas para o primeiro mês de uma assinatura mensal. Planos de 3, 6 e 12 meses mantêm seus próprios descontos, sem acumular. O vencimento é calculado ao salvar e não se estende automaticamente.",
"El precio propuesto aparece en Creator Studio al guardar. Solo se guarda en este navegador; tu suscripción activa de prueba sigue siendo gratuita.|The proposed price appears in Creator Studio when saved. It's stored only in this browser; your active test subscription remains free.|O preço proposto aparece no Creator Studio ao salvar. Ele é guardado apenas neste navegador; sua assinatura de teste ativa continua gratuita.",
"Revisa el precio mínimo de US$4,99, los descuentos de 0 a 50% y los plazos activos.|Check the US$4.99 minimum price, discounts from 0% to 50%, and enabled terms.|Confira o preço mínimo de US$ 4,99, descontos de 0% a 50% e os períodos ativos.",
"Por mes|Per month|Por mês",
"Primer mes|First month|Primeiro mês",
"Pendiente de guardar|Not yet saved|Pendente de salvar",
"Oferta en borrador · nuevos suscriptores|Draft offer · new subscribers|Oferta em rascunho · novos assinantes",
"Oferta desactivada. Los planes siguen disponibles.|Offer disabled. Plans remain available.|Oferta desativada. Os planos continuam disponíveis.",
"Oferta pendiente de guardar. Su plazo comenzará al guardar este borrador.|Offer not saved yet. Its period starts when you save the draft.|Oferta pendente de salvar. O prazo começa ao salvar o rascunho.",
"Oferta de bienvenida permanente (borrador local).|Permanent welcome offer (local draft).|Oferta permanente de boas-vindas (rascunho local).",
"La oferta se reactivará al guardar. Se calculará un nuevo vencimiento.|The offer will reactivate when saved. A new expiry will be calculated.|A oferta será reativada ao salvar. Um novo vencimento será calculado.",
"Revisa los valores antes de guardar.|Check the values before saving.|Confira os valores antes de salvar.",
"Borrador guardado. Se actualizó el precio propuesto y la vigencia de la oferta. No se realizó ningún cobro.|Draft saved. Proposed price and offer validity were updated. No charge was made.|Rascunho salvo. O preço proposto e a validade da oferta foram atualizados. Nenhuma cobrança foi feita.",
"No se pudo guardar en este navegador.|Couldn't save in this browser.|Não foi possível salvar neste navegador.",
"AFTER SHIFT · LABORATORIO V0|AFTER SHIFT · TEST LAB V0|AFTER SHIFT · LABORATÓRIO V0",
"Simulación de pagos|Payment simulation|Simulação de pagamentos",
"Selecciona el plazo|Select a term|Selecione um período",
"Aplicar oferta de bienvenida al primer mes|Apply first-month welcome offer|Aplicar oferta de boas-vindas no primeiro mês",
"1. Iniciar pago simulado|1. Start simulated payment|1. Iniciar pagamento simulado",
"2. Aprobar|2. Approve|2. Aprovar",
"2. Rechazar|2. Decline|2. Recusar",
"✓ Aprobado|✓ Approved|✓ Aprovado",
"✕ Rechazado|✕ Declined|✕ Recusado",
"Cancelar renovación|Cancel renewal|Cancelar renovação",
"Simular vencimiento|Simulate expiry|Simular vencimento",
"Reiniciar prueba|Reset test|Reiniciar teste",
"Registro de esta prueba|Test activity log|Registro deste teste",
"Foto de prueba|Sample photo|Foto de teste",
"Video de prueba|Sample video|Vídeo de teste",
"Publicación de prueba|Sample post|Publicação de teste",
"Cerrar publicación de prueba|Close sample post|Fechar publicação de teste",
"AFTER SHIFT · CONTENIDO DEMO|AFTER SHIFT · DEMO CONTENT|AFTER SHIFT · CONTEÚDO DEMO",
"Fotografía editorial ilustrativa utilizada en AFTER SHIFT|Illustrative editorial photograph used in AFTER SHIFT|Fotografia editorial ilustrativa usada no AFTER SHIFT",
"Imagen editorial de ejemplo. No es una publicación privada ni corresponde a una compra real.|Sample editorial image. This is not a private post or a real purchase.|Imagem editorial de exemplo. Não é uma publicação privada nem uma compra real.",
"Video público de muestra para comprobar el reproductor. No pertenece al creador. Si tu conexión bloquea el video externo, la prueba de navegación sigue disponible.|Public sample video for testing playback. It doesn't belong to the creator. If your connection blocks this external video, you can still test navigation.|Vídeo público de exemplo para testar o player. Não pertence ao criador. Se sua conexão bloquear esse vídeo externo, ainda será possível testar a navegação.",
"Esta es una publicación ficticia de AFTER SHIFT. Sirve para comprobar que, después de aprobar un pago simulado, el botón permite abrir y cerrar una publicación. Ninguna fotografía, video o archivo privado se desbloquea.|This is a fictional AFTER SHIFT post. It checks whether you can open and close a post after a simulated payment. No private photo, video or file is unlocked.|Esta é uma publicação fictícia do AFTER SHIFT. Ela serve para testar a abertura e o fechamento de publicações após o pagamento simulado. Nenhuma foto, vídeo ou arquivo privado é liberado.",
"Cerrar y volver a la prueba|Close and return to test|Fechar e voltar ao teste",
"SIN COBROS: solo para @aftershift y @pat, una aprobación de PRUEBA pedirá a Supabase una autorización temporal de 2 horas. No es un pago real.|NO CHARGES: only for @aftershift and @pat. Approving this TEST asks Supabase for two hours of temporary access. It is not a real payment.|SEM COBRANÇAS: apenas para @aftershift e @pat. Aprovar este TESTE solicita ao Supabase duas horas de acesso temporário. Não é um pagamento real.",
"Esta pantalla simula pagos y acceso sobre datos ficticios. NO cobra, no activa una suscripción real ni desbloquea archivos privados.|This screen simulates payments and access with fictional data. It does NOT charge, activate a real subscription or unlock private files.|Esta tela simula pagamentos e acesso com dados fictícios. NÃO cobra, não ativa uma assinatura real nem desbloqueia arquivos privados.",
"Borrador de Creator Studio en este dispositivo|Creator Studio draft on this device|Rascunho do Creator Studio neste dispositivo",
"Precios de ejemplo (no publicados)|Example prices (not published)|Preços de exemplo (não publicados)",
"La aprobación ficticia no verifica dinero. El acceso a @pat es una excepción administrativa de prueba, limitada a esta cuenta y autorizada por Supabase durante 2 horas. Puedes cancelarla en el perfil o con «Simular vencimiento».|Simulated approval doesn't verify money. Access to @pat is a test-only exception limited to this account and authorized by Supabase for two hours. You can cancel it from the profile or by choosing “Simulate expiry”.|A aprovação simulada não verifica dinheiro. O acesso a @pat é uma exceção de teste limitada a esta conta, autorizada pelo Supabase por duas horas. Você pode cancelar no perfil ou em “Simular vencimento”.",
"El estado de prueba se borra al cerrar. La seguridad de las publicaciones reales continúa en Supabase. En producción, solo un servidor podrá confirmar el pago.|Test state is cleared on close. Real post security remains in Supabase. In production, only a server can confirm payments.|O estado do teste é apagado ao fechar. A segurança das publicações reais permanece no Supabase. Em produção, somente um servidor poderá confirmar pagamentos.",
"Primero aprueba el pago ficticio. Los íconos de prueba se habilitan solo durante la simulación activa.|Approve the fictional payment first. Demo icons unlock only while the simulation is active.|Primeiro aprove o pagamento fictício. Os ícones de teste só são liberados enquanto a simulação estiver ativa.",
"Consultando autorización de prueba en Supabase...|Checking test authorization in Supabase...|Verificando a autorização de teste no Supabase...",
"Supabase no confirmó la operación.|Supabase did not confirm the operation.|O Supabase não confirmou a operação.",
"✓ PRUEBA REAL AUTORIZADA. Los archivos exclusivos de @pat ya tienen permiso por 2 horas. Cierra esta ventana para verlos; no se cobró dinero.|✓ REAL TEST ACCESS GRANTED. @pat’s exclusive posts are authorized for two hours. Close this window to view them; no money was charged.|✓ ACESSO REAL DE TESTE AUTORIZADO. As publicações exclusivas de @pat estão autorizadas por duas horas. Feche esta janela para vê-las; nenhuma cobrança foi realizada.",
"✓ PRUEBA REVOCADA EN SUPABASE. Las publicaciones exclusivas volverán a mostrar candados.|✓ TEST ACCESS REVOKED IN SUPABASE. Exclusive posts will be locked again.|✓ ACESSO DE TESTE REVOGADO NO SUPABASE. As publicações exclusivas voltarão a ficar bloqueadas.",
"Pago pendiente de confirmar|Payment awaiting confirmation|Pagamento aguardando confirmação",
"Pago rechazado|Payment declined|Pagamento recusado",
"Suscripción vencida|Subscription expired|Assinatura expirada",
"Renovación cancelada · acceso simulado hasta el vencimiento|Renewal cancelled · simulated access until expiry|Renovação cancelada · acesso simulado até o vencimento",
"Pago simulado aprobado|Simulated payment approved|Pagamento simulado aprovado",
"Sin intento de pago|No attempted payment|Nenhuma tentativa de pagamento",
"Sin promoción aplicada|No discount applied|Sem promoção aplicada",
"Todavía no hay un período de acceso aprobado.|No access period has been approved yet.|Ainda não há um período de acesso aprovado.",
"Galería DEMO desbloqueada|DEMO gallery unlocked|Galeria DEMO desbloqueada",
"Galería DEMO bloqueada|DEMO gallery locked|Galeria DEMO bloqueada",
"🔒 Foto|🔒 Photo|🔒 Foto",
"📷 Abrir foto|📷 Open photo|📷 Abrir foto",
"🔒 Video|🔒 Video|🔒 Vídeo",
"▶ Ver video|▶ Watch video|▶ Ver vídeo",
"🔒 Publicación|🔒 Post|🔒 Publicação",
"📄 Leer texto|📄 Read text|📄 Ler texto",
"✓ PERMISO REAL DE PRUEBA: @aftershift puede abrir las publicaciones de @pat durante 2 horas. Cierra esta ventana para actualizar el perfil.|✓ REAL TEST ACCESS: @aftershift can view @pat’s posts for two hours. Close this window to refresh the profile.|✓ ACESSO REAL DE TESTE: @aftershift pode abrir as publicações de @pat por duas horas. Feche esta janela para atualizar o perfil.",
"El permiso real de prueba está revocado.|Real test access has been revoked.|O acesso real de teste foi revogado.",
"La galería DEMO se abrió, pero el acceso REAL NO fue autorizado.|The DEMO gallery opened, but REAL access was NOT authorized.|A galeria DEMO foi aberta, mas o acesso REAL NÃO foi autorizado.",
"Los tres íconos son demostraciones. Si apruebas esta prueba, Supabase autorizará temporalmente las publicaciones reales de @pat.|The three icons are demos. If you approve this test, Supabase will temporarily authorize @pat’s real posts.|Os três ícones são demonstrações. Se você aprovar este teste, o Supabase autorizará temporariamente as publicações reais de @pat.",
"Selecciona un plazo y comienza la simulación.|Select a term and start the simulation.|Selecione um período e inicie a simulação.",
"Esta acción no está disponible en el estado actual. Usa «Reiniciar prueba» si necesitas empezar de nuevo.|This action is unavailable in the current state. Choose “Reset test” to start again.|Esta ação não está disponível no estado atual. Use “Reiniciar teste” para começar novamente.",
"Solicitud iniciada. Ahora presiona «2. Aprobar» o «2. Rechazar».|Request started. Now tap “2. Approve” or “2. Decline”.|Solicitação iniciada. Agora toque em “2. Aprovar” ou “2. Recusar”.",
"✓ PAGO APROBADO (SIMULACIÓN). Se habilitaron tres íconos de prueba: foto, video y publicación. Puedes tocarlos arriba. No se cobró dinero ni se abrió contenido privado.|✓ PAYMENT APPROVED (SIMULATION). Three demo icons are enabled: photo, video and post. Tap them above. No money was charged and no private content was opened.|✓ PAGAMENTO APROVADO (SIMULAÇÃO). Três ícones de teste foram liberados: foto, vídeo e publicação. Toque neles acima. Nenhuma cobrança foi feita e nenhum conteúdo privado foi aberto.",
"✕ PAGO RECHAZADO (SIMULACIÓN). La tarjeta ficticia permanece bloqueada.|✕ PAYMENT DECLINED (SIMULATION). The demo card remains locked.|✕ PAGAMENTO RECUSADO (SIMULAÇÃO). O cartão fictício permanece bloqueado.",
"Renovación cancelada. El acceso ficticio continúa solo hasta la fecha indicada.|Renewal cancelled. Simulated access lasts only until the stated date.|Renovação cancelada. O acesso fictício continua apenas até a data indicada.",
"Suscripción vencida. La tarjeta ficticia volvió a bloquearse.|Subscription expired. The demo card is locked again.|Assinatura expirada. O cartão fictício foi bloqueado novamente.",
"Solicitud iniciada · esperando respuesta del banco ficticio.|Request started · waiting for simulated bank response.|Solicitação iniciada · aguardando resposta do banco fictício.",
"Aprobación simulada · galería de pruebas habilitada.|Simulated approval · demo gallery unlocked.|Aprovação simulada · galeria de testes liberada.",
"Rechazo simulado · no se concedió acceso.|Simulated decline · access not granted.|Recusa simulada · acesso não concedido.",
"Renovación cancelada · acceso ficticio hasta el vencimiento.|Renewal cancelled · simulated access until expiry.|Renovação cancelada · acesso fictício até o vencimento.",
"Vencimiento simulado · tarjeta ficticia bloqueada.|Simulated expiry · demo card locked.|Vencimento simulado · cartão fictício bloqueado."
];
const dict=new Map(lines.map(s=>{const [es,en,pt]=s.split("|");return [es,{en,pt}]}));
const savedText=new WeakMap(),savedAttr=new WeakMap();
let lang="es",scheduled=false;
const excluded="script,style,noscript,textarea,[contenteditable],.card .name,.card .handle,.post-card h4,.post-card>p,.post-card p,.post-detail-head h2,.post-detail-description,.my-subscription-info strong,#accountEmail";
function formatVariable(value,language){
  const en=language==="en";
  let m=value.match(/^(\d+) publicaciones?$/);
  if(m)return m[1]+(en?(m[1]==="1"?" post":" posts"):(m[1]==="1"?" publicação":" publicações"));
  m=value.match(/^Contenido de (.+)$/);
  if(m)return (en?"Content by ":"Conteúdo de ")+m[1];
  m=value.match(/^Sobre (.+)$/);
  if(m)return (en?"About ":"Sobre ")+m[1];
  m=value.match(/^Hola, (.+)$/);
  if(m)return (en?"Hello, ":"Olá, ")+m[1];
  m=value.match(/^Rol: (.+)$/);
  if(m)return (en?"Role: ":"Função: ")+m[1];
  m=value.match(/^Creador: (.+)$/);
  if(m)return (en?"Creator: ":"Criador: ")+m[1];
  m=value.match(/^Precio activo de prueba: (.+)$/);
  if(m)return (en?"Active test price: ":"Preço ativo de teste: ")+m[1];
  m=value.match(/^(.*)\/mes( · pagos pendientes)?$/);
  if(m)return m[1]+(en?"/month":"/mês")+(m[2]?(en?" · payments pending":" · pagamentos pendentes"):"");
  m=value.match(/^Activa · suscripción de prueba, sin cobros reales( · desde .+)?$/);
  if(m)return (en?"Active · test subscription, no real charges":"Ativa · assinatura de teste, sem cobranças reais")+(m[1]?(en?m[1].replace(" · desde "," · since "):m[1]):"");
  m=value.match(/^Total por (\d+) meses$/);
  if(m)return (en?"Total for ":"Total por ")+m[1]+(en?" months":" meses");
  m=value.match(/^(\d+)% descuento$/);
  if(m)return m[1]+(en?"% discount":"% de desconto");
  m=value.match(/^(\d+)% bienvenida$/);
  if(m)return m[1]+(en?"% welcome discount":"% de boas-vindas");
  m=value.match(/^Total del plazo · descuento (\d+)%$/);
  if(m)return (en?"Term total · ":"Total do período · ")+m[1]+(en?"% discount":"% de desconto");
  m=value.match(/^Precio normal (.+) · (bienvenida del primer mes|descuento por plazo)$/);
  if(m)return (en?"Regular price ":"Preço normal ")+m[1]+(m[2]==="bienvenida del primer mes"?(en?" · first-month welcome":" · boas-vindas do primeiro mês"):(en?" · term discount":" · desconto do período"));
  m=value.match(/^Acceso DEMO hasta (.+?)( · renovación simulada activa| · no se renovará)?$/);
  if(m)return (en?"DEMO access until ":"Acesso DEMO até ")+m[1]+(m[2]===" · renovación simulada activa"?(en?" · simulated renewal on":" · renovação simulada ativa"):m[2]?(en?" · won't renew":" · não será renovada"):"");
  m=value.match(/^Estas publicaciones son de PRUEBA\. Las fotos y videos privados de (.+) siguen protegidos\.$/);
  if(m)return (en?"These are DEMO posts. Private photos and videos from ":"Estas são publicações de TESTE. As fotos e vídeos privados de ")+m[1]+(en?" remain protected.":" continuam protegidos.");
  m=value.match(/^Vence el (.+) \(hora de tu dispositivo\)\. No está publicada\.$/);
  if(m)return (en?"Expires on ":"Vence em ")+m[1]+(en?" (your device time). Not published.":" (hora do dispositivo). Não publicada.");
  m=value.match(/^Oferta vencida el (.+)\. No se muestra el precio promocional\.$/);
  if(m)return (en?"Offer expired on ":"Oferta expirada em ")+m[1]+(en?". Promotional price hidden.":". Preço promocional oculto.");
  m=value.match(/^Suscripción a (.+)$/);
  if(m)return (en?"Subscription to ":"Assinatura de ")+m[1];
  return null;
}
function renderSource(es,language){
  const value=es.trim(),entry=dict.get(value);
  const target=entry&&entry[language]||formatVariable(value,language);
  if(!target)return null;
  const offset=es.indexOf(value);
  return es.slice(0,offset)+target+es.slice(offset+value.length);
}
function translate(es){
  if(lang==="es")return es;
  return renderSource(es,lang);
}
function isGenerated(source,actual){
  if(actual===source)return true;
  return ["en","pt"].some(language=>renderSource(source,language)===actual);
}
function translateNode(n){
  if(!n.parentElement||n.parentElement.closest(excluded))return;
  const actual=n.nodeValue;
  let source=savedText.get(n);
  if(source!==undefined&&!isGenerated(source,actual))source=undefined;
  if(source===undefined){
    source=actual;
    if(!dict.has(source.trim())&&!formatVariable(source.trim(),"en"))return;
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
    if(source===undefined){source=actual;if(!dict.has(source.trim())&&!formatVariable(source.trim(),"en"))return;stored[attr]=source;}
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

// Untranslated creator-authored copy remains in its original language.
// This display-only layer does not change the account, payment or post lifecycle.
window.AfterShiftI18n={setLanguage,getLanguage:()=>lang};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();