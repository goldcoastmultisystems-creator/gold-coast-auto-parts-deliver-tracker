/* Training tab: short how-to lessons for the team, in English and Español, with a "done" tick per person.
   Open with openTraining() (the 🎓 Training button) or by loading any page with ?training=1.
   Progress is saved per person at gcap/training/{person}; the owner/admins can see everyone's progress. */
(function() {
  var T = function(en, es) { return { en: en, es: es }; };

  var LESSONS = [
    { id: 'start', roles: ['all'], icon: '🚀',
      title: T('Getting started', 'Primeros pasos'),
      steps: T([
        'Open the web app and log in with your own name and your own password. Never share your password.',
        'Pick your dashboard: Delivery Status Board, Sales Representative Routes, or Inventory Management.',
        'Bottom-left of every page: the ☀️/🌙 button switches light or dark, and the 🌐 button switches English / Español. Each device remembers your choice.',
        'If you ever land back on the login screen, just log in again and tell the dispatcher.'
      ], [
        'Abre la aplicación e inicia sesión con tu nombre y tu propia contraseña. Nunca compartas tu contraseña.',
        'Elige tu panel: Tablero de entregas, Rutas de ventas o Gestión de inventario.',
        'Abajo a la izquierda en cada página: el botón ☀️/🌙 cambia entre claro y oscuro, y el botón 🌐 cambia entre English / Español. Cada dispositivo recuerda tu elección.',
        'Si alguna vez vuelves a la pantalla de inicio de sesión, entra de nuevo y avisa al despachador.'
      ]),
      tip: T('Log out (button at the top) when you use someone else’s phone.', 'Cierra sesión (botón arriba) cuando uses el teléfono de otra persona.') },

    { id: 'stops', roles: ['driver', 'dispatcher'], icon: '🚚',
      title: T('Your stops and what the colors mean', 'Tus paradas y qué significan los colores'),
      steps: T([
        'Every stop card starts with a colored banner: green = Delivery (drop it off), red = Return part (pick it up from the shop), blue = Pickup (collect parts), amber = Bank deposit.',
        'Use the status buttons as you go: Pending → En Route → At Location → Completed.',
        'Completed stops leave the list. You can find them under “✅ Completed today” — tap ↩ Reopen if you tapped by mistake.',
        'A PRIORITY flag means do that stop first.',
        'Drag the ⠿ handle to change the order of the stops. Anyone can reorder any route.'
      ], [
        'Cada tarjeta de parada empieza con un letrero de color: verde = Entrega (déjala), rojo = Devolución (recógela en el taller), azul = Recogida (recoge piezas), ámbar = Depósito bancario.',
        'Usa los botones de estado a medida que avanzas: Pendiente → En camino → En el lugar → Completada.',
        'Las paradas completadas salen de la lista. Las encuentras en “✅ Completadas hoy” — toca ↩ Reabrir si tocaste por error.',
        'Una marca de PRIORIDAD significa que esa parada va primero.',
        'Arrastra el control ⠿ para cambiar el orden de las paradas. Cualquiera puede reordenar cualquier ruta.'
      ]),
      tip: T('Completed stops still count in the End of Day Report and History.', 'Las paradas completadas siguen contando en el Reporte del día y el Historial.') },

    { id: 'routes', roles: ['driver', 'dispatcher'], icon: '🧭',
      title: T('Routes and Google Maps', 'Rutas y Google Maps'),
      steps: T([
        'Tap 🧭 Suggest route to see the nearest-first or furthest-first order and how many miles it saves.',
        'Press “Apply this order” — you can still drag stops afterwards, nothing is locked.',
        'Tap 🗺 Google Maps on a route for directions through all its open stops (routes longer than 10 stops are split into parts — do them in order).',
        'Every stop also has an “Open in Maps” and a “Google Maps” link for just that address.'
      ], [
        'Toca 🧭 Sugerir ruta para ver el orden de la más cercana primero o la más lejana primero, y cuántas millas ahorra.',
        'Presiona “Aplicar este orden” — después aún puedes arrastrar las paradas, nada queda bloqueado.',
        'Toca 🗺 Google Maps en una ruta para obtener indicaciones por todas sus paradas abiertas (las rutas de más de 10 paradas se dividen en partes — hazlas en orden).',
        'Cada parada también tiene un enlace “Abrir en Mapas” y uno de “Google Maps” solo para esa dirección.'
      ]) },

    { id: 'found', roles: ['warehouse', 'driver'], icon: '📷',
      title: T('Finding and loading parts', 'Encontrar y cargar piezas'),
      steps: T([
        'Open Parts to Pull (top menu). Parts are grouped by where they are kept: warehouse and shelf.',
        'When you find a part, tap 📷 Found. Add a photo or video of the part, then press “✓ Mark as Found with proof”.',
        'In a rush? Tap “⚡ Skip — just mark Found”. It is saved as “no proof”.',
        'When the part is on the truck, tap 🚚 Loaded. (Loaded needs Found first.)',
        'Tapped by mistake? Tap the green Found, then “↩ Undo Found”.'
      ], [
        'Abre Piezas por sacar (menú de arriba). Las piezas están agrupadas por dónde se guardan: almacén y estante.',
        'Cuando encuentres una pieza, toca 📷 Encontrada. Agrega una foto o video de la pieza y presiona “✓ Marcar como encontrada con prueba”.',
        '¿Con prisa? Toca “⚡ Omitir — solo marcar como encontrada”. Se guarda como “sin prueba”.',
        'Cuando la pieza esté en el camión, toca 🚚 Cargada. (Cargada requiere primero Encontrada.)',
        '¿Tocaste por error? Toca la Encontrada en verde y luego “↩ Deshacer encontrada”.'
      ]),
      tip: T('Everyone sees Found / Loaded update live — the dispatcher too.', 'Todos ven en vivo cuando se actualiza Encontrada / Cargada — también el despachador.') },

    { id: 'media', roles: ['all'], icon: '🎥',
      title: T('Photos and videos', 'Fotos y videos'),
      steps: T([
        'On a stop card use + Photo, + Video or + 💵 Check.',
        'Photos save right away. Videos are saved in the company Google Drive folder, organized by month and then by date.',
        'If a video says it can’t upload, take photos instead and tell the dispatcher.',
        'Tap the ▶ on a video to watch it.'
      ], [
        'En la tarjeta de una parada usa + Foto, + Video o + 💵 Cheque.',
        'Las fotos se guardan al instante. Los videos se guardan en la carpeta de Google Drive de la empresa, organizados por mes y luego por fecha.',
        'Si un video dice que no se puede subir, toma fotos y avisa al despachador.',
        'Toca el ▶ de un video para verlo.'
      ]) },

    { id: 'returns', roles: ['driver', 'warehouse', 'dispatcher'], icon: '🔄',
      title: T('Returned parts: shelve or dispose', 'Piezas devueltas: guardar o desechar'),
      steps: T([
        'At the shop, if a part is not accepted: tap “Returned Part” and choose the reason.',
        'Back at the warehouse open 🔄 Returns and tap “📸 Shelve / Dispose” on that return.',
        'Choose the condition: Good condition (sell at full price) • Slightly damaged / painted (sell at a discount) • Damaged (cannot be sold — it must be disposed).',
        'Add a photo AND a video (both are required), add notes if useful, then confirm.',
        '📚 All saved returns keeps the full history (with condition and photos) and can be downloaded as a CSV.'
      ], [
        'En el taller, si no aceptan una pieza: toca “Pieza devuelta” y elige el motivo.',
        'De vuelta en el almacén abre 🔄 Devoluciones y toca “📸 Guardar / Desechar” en esa devolución.',
        'Elige la condición: Buena condición (vender a precio completo) • Ligeramente dañada / pintada (vender con descuento) • Dañada (no se puede vender — debe desecharse).',
        'Agrega una foto Y un video (ambos son obligatorios), agrega notas si sirve, y confirma.',
        '📚 Todas las devoluciones guardadas conserva el historial completo (con condición y fotos) y se puede descargar como CSV.'
      ]),
      tip: T('If videos are not working, you can continue with photos only — it is marked “no video”.', 'Si los videos no funcionan, puedes continuar solo con fotos — queda marcado como “sin video”.') },

    { id: 'checks', roles: ['driver', 'dispatcher'], icon: '💵',
      title: T('Checks from customers', 'Cheques de los clientes'),
      steps: T([
        'When a customer pays by check, tap “+ 💵 Check” on that stop and take a clear photo of the check.',
        'The app reads the amount, check number, payer and bank. Look it over — tap ✎ to fix anything. “⚠ Needs review” means something is missing.',
        'The check stays in 💵 Checks until the dispatcher taps “✅ Deposited” at the bank.',
        '📚 All saved checks is the permanent record, with photos, totals and a CSV download.'
      ], [
        'Cuando un cliente paga con cheque, toca “+ 💵 Cheque” en esa parada y toma una foto clara del cheque.',
        'La aplicación lee el monto, el número de cheque, el pagador y el banco. Revísalo — toca ✎ para corregir. “⚠ Requiere revisión” significa que falta algo.',
        'El cheque permanece en 💵 Cheques hasta que el despachador toque “✅ Depositado” en el banco.',
        '📚 Todos los cheques guardados es el registro permanente, con fotos, totales y descarga en CSV.'
      ]) },

    { id: 'zoho', roles: ['dispatcher'], icon: '🧾',
      title: T('Zoho orders and MOP (method of payment)', 'Pedidos de Zoho y MOP (forma de pago)'),
      steps: T([
        'Open 🧾 Zoho Orders. Tap an order to see everything: addresses, items, prices and MOP.',
        'Tick the orders for today, choose the driver, and tap “➕ Add to deliveries”.',
        'The app asks for each customer’s MOP (Cash, Check or Charge Account) and their closing time, so drivers know how late they can deliver. If Zoho already has the MOP, or you answered before, it is pre-filled. Fill in what is missing and confirm.',
        'The MOP and closing time are saved for that customer, so next time they are already filled in. A stop shows “🕔 Closes 5:00 PM” — it turns amber under an hour and red once the shop has closed.',
        'Each order has its own Driver choice in that window, so different orders can go to different drivers. To change it later, tap “👤 Assign route” on a route to give the whole route to one driver, or tap the driver tag on a single stop.',
        'Use “↩ Add as return” to schedule picking a part up from the customer.',
        '💬 WhatsApp or ↗ Share sends the order as a neat message.'
      ], [
        'Abre 🧾 Pedidos de Zoho. Toca un pedido para ver todo: direcciones, artículos, precios y MOP.',
        'Marca los pedidos de hoy, elige al conductor y toca “➕ Agregar a entregas”.',
        'La aplicación pide el MOP de cada cliente (Efectivo, Cheque o Cuenta de crédito) y su hora de cierre, para que los conductores sepan hasta qué hora pueden entregar. Si Zoho ya tiene el MOP, o respondiste antes, aparece ya llenado. Completa lo que falte y confirma.',
        'El MOP y la hora de cierre se guardan para ese cliente, así que la próxima vez ya estarán llenados. Una parada muestra “🕔 Cierra a las 5:00 PM” — se pone ámbar con menos de una hora y roja cuando el taller ya cerró.',
        'Cada pedido tiene su propia opción de Conductor en esa ventana, así que pedidos distintos pueden ir a conductores distintos. Para cambiarlo después, toca “👤 Asignar ruta” en una ruta para dar toda la ruta a un conductor, o toca la etiqueta del conductor en una sola parada.',
        'Usa “↩ Agregar como devolución” para programar recoger una pieza con el cliente.',
        '💬 WhatsApp o ↗ Compartir envía el pedido como un mensaje ordenado.'
      ]),
      tip: T('A MOP you type in by hand on a stop is never overwritten by Zoho.', 'Un MOP que escribas a mano en una parada nunca lo sobrescribe Zoho.') },

    { id: 'purchase', roles: ['dispatcher', 'warehouse'], icon: '🛒',
      title: T('Parts to Purchase', 'Piezas por comprar'),
      steps: T([
        'In a Zoho order, a part that is sold out shows “🛒 Out of stock — add to Parts to Purchase”. Tap it.',
        'The part appears in Parts to Purchase (top menu) with the customer and order number.',
        'When it has been bought, tap “✓ Bought”. Use ✕ if it was added by mistake.',
        'Share, WhatsApp or Printable sends the list to whoever is buying.'
      ], [
        'En un pedido de Zoho, una pieza agotada muestra “🛒 Agotada — agregar a Piezas por comprar”. Tócalo.',
        'La pieza aparece en Piezas por comprar (menú de arriba) con el cliente y el número de pedido.',
        'Cuando ya se compró, toca “✓ Comprada”. Usa ✕ si se agregó por error.',
        'Compartir, WhatsApp o Imprimible envía la lista a quien va a comprar.'
      ]) },

    { id: 'inventory', roles: ['warehouse', 'dispatcher'], icon: '📦',
      title: T('Inventory: search, shelves and reorder', 'Inventario: búsqueda, estantes y reorden'),
      steps: T([
        'Search by SKU, OEM number, make, model or name. Filter by In stock / Low stock / Sold out and by warehouse.',
        'Tap ✎ to set where a part is kept. Separate several places with | (example: E9 · Shelf G2 | E2 · Shelf A3).',
        'Tap ☆ to watch a part. Set “Low at” and “Order up to”; watched parts that run low appear on the Reorder list.',
        'Share or copy the Reorder list to send it to the buyer.',
        'Tap a part inside a Zoho order to jump straight to it in the inventory search.'
      ], [
        'Busca por SKU, número OEM, marca, modelo o nombre. Filtra por En existencia / Poca existencia / Agotada y por almacén.',
        'Toca ✎ para definir dónde se guarda una pieza. Separa varios lugares con | (ejemplo: E9 · Estante G2 | E2 · Estante A3).',
        'Toca ☆ para seguir una pieza. Define “Mínimo” y “Pedir hasta”; las piezas en seguimiento que bajan aparecen en la Lista de reorden.',
        'Comparte o copia la Lista de reorden para enviarla al comprador.',
        'Toca una pieza dentro de un pedido de Zoho para ir directo a ella en la búsqueda del inventario.'
      ]),
      tip: T('Only people with the right role can edit; others can look but not change.', 'Solo quienes tienen la función adecuada pueden editar; los demás pueden ver pero no cambiar.') },

    { id: 'tracking', roles: ['driver', 'dispatcher'], icon: '📍',
      title: T('Location tracking on deliveries', 'Rastreo de ubicación en las entregas'),
      steps: T([
        'Drivers: the first time you log in the app explains what is shared. Tap “I understand — start sharing”, then allow location (choose “While using the app”).',
        'Keep the app open with the screen on while driving. The 📍 Tracking button at the top shows ON or OFF — tap it to pause on a break; nobody sees you while it is paused.',
        'Dispatch: tap 📍 Live Map to see each driver, how recent the signal is, their next stop and a rough ETA. “Today’s route” draws where a driver has been today.',
        'On a stop you will see “📍 Anthony is 3.2 mi away • ~9 min”. If the driver would arrive after the customer’s closing time it turns red.',
        'When a driver gets close to the next stop, it is marked “At Location” automatically.'
      ], [
        'Conductores: la primera vez que inicias sesión la aplicación explica qué se comparte. Toca “Entiendo — empezar a compartir” y permite la ubicación (elige “Mientras uso la app”).',
        'Mantén la aplicación abierta con la pantalla encendida mientras manejas. El botón 📍 Rastreo de arriba muestra ACTIVO o APAGADO — tócalo para pausar en un descanso; nadie te ve mientras está en pausa.',
        'Despacho: toca 📍 Mapa en vivo para ver a cada conductor, qué tan reciente es la señal, su siguiente parada y un tiempo estimado. “Ruta de hoy” dibuja por dónde ha pasado un conductor hoy.',
        'En una parada verás “📍 Anthony está a 3.2 mi • ~9 min”. Si el conductor llegaría después de la hora de cierre del cliente, se pone en rojo.',
        'Cuando un conductor se acerca a la siguiente parada, se marca “En el lugar” automáticamente.'
      ]),
      tip: T('The phone must stay on this page — if the app is closed or the screen locks, the map stops updating.', 'El teléfono debe quedarse en esta página — si se cierra la aplicación o se bloquea la pantalla, el mapa deja de actualizarse.') },

    { id: 'ai', roles: ['all'], icon: '🤖',
      title: T('Ask AI', 'Preguntar a la IA'),
      steps: T([
        'Tap 🤖 Ask AI and ask in plain words, for example “Do we have a Camry bumper in stock?” or “What’s still pending?”.',
        'It only reads live data — it cannot change anything. It answers in the language you picked.'
      ], [
        'Toca 🤖 Preguntar a la IA y pregunta con palabras sencillas, por ejemplo “¿Tenemos un parachoques de Camry en existencia?” o “¿Qué sigue pendiente?”.',
        'Solo lee datos en vivo — no puede cambiar nada. Responde en el idioma que elegiste.'
      ]) },

    { id: 'eod', roles: ['dispatcher'], icon: '📊',
      title: T('End of day, History and carry-over', 'Fin del día, Historial y paso al día siguiente'),
      steps: T([
        'Completed stops disappear from the live list but are counted in the End of Day Report and saved in History.',
        'Unfinished stops carry over to the next day automatically (up to 3 days back).',
        'History lists each past day — open one to see every stop and its status.',
        '“+ New List” archives today’s list and starts a clean one.'
      ], [
        'Las paradas completadas desaparecen de la lista en vivo pero se cuentan en el Reporte del día y se guardan en el Historial.',
        'Las paradas sin terminar pasan al día siguiente automáticamente (hasta 3 días atrás).',
        'El Historial lista cada día anterior — abre uno para ver todas las paradas y su estado.',
        '“+ Nueva lista” archiva la lista de hoy y empieza una limpia.'
      ]) },

    { id: 'sales', roles: ['sales'], icon: '🧾',
      title: T('Sales visits', 'Visitas de ventas'),
      steps: T([
        'Open Sales Representative Routes. Add visits with “+ Add Visit” or paste your route list in the bar at the top.',
        'Update each visit’s status as you go, then fill in the Visit Report (shop info, pain points, quotes, next action).',
        'Use ✅ Daily Checklist for morning prep, follow-ups and end-of-day notes.',
        'Tap “🔄 Sync to Zoho Now” in the report to save the visit in the CRM.'
      ], [
        'Abre Rutas de ventas. Agrega visitas con “+ Agregar visita” o pega tu lista de ruta en la barra de arriba.',
        'Actualiza el estado de cada visita sobre la marcha y luego llena el Reporte de la visita (datos del taller, puntos de dolor, cotizaciones, próxima acción).',
        'Usa ✅ Lista diaria para la preparación de la mañana, los seguimientos y las notas de fin del día.',
        'Toca “🔄 Sincronizar con Zoho ahora” en el reporte para guardar la visita en el CRM.'
      ]) },

    { id: 'team', roles: ['owner'], icon: '👥',
      title: T('Adding and managing people', 'Agregar y gestionar personas'),
      steps: T([
        'Owner or admin: open 👥 Manage Team → Add a Person.',
        'Type the name, choose the role (Driver, Dispatcher, Sales Rep or Inventory Specialist) and give each person their own password.',
        'Deactivate or Remove someone who leaves so they can no longer log in. Change a password from the same screen.',
        'Only Drivers are location-tracked while logged in (admins can switch it on for themselves).'
      ], [
        'Dueño o administrador: abre 👥 Gestionar equipo → Agregar una persona.',
        'Escribe el nombre, elige la función (Conductor, Despachador, Representante de ventas o Especialista de inventario) y da a cada persona su propia contraseña.',
        'Desactiva o Quita a quien se vaya para que ya no pueda iniciar sesión. Cambia una contraseña desde la misma pantalla.',
        'Solo a los Conductores se les rastrea la ubicación mientras tienen la sesión iniciada (los administradores pueden activarlo para sí mismos).'
      ]) }
  ];

  var FILTERS = [['mine', T('For my job', 'Para mi trabajo')], ['all', T('All lessons', 'Todas las lecciones')]];
  var ROLE_LABEL = { all: T('Everyone', 'Todos'), driver: T('Drivers', 'Conductores'), warehouse: T('Warehouse', 'Almacén'), dispatcher: T('Dispatchers', 'Despachadores'), sales: T('Sales', 'Ventas'), owner: T('Owner / admin', 'Dueño / admin') };

  var state = { filter: 'mine', open: null, done: {}, view: 'lessons', team: null };

  function lang() { return typeof window.gcapLang === 'function' ? window.gcapLang() : 'en'; }
  function t(o) { return o[lang()] || o.en; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function(c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function sess() { return (typeof session !== 'undefined' && session) || (window.gcapLoadSession ? window.gcapLoadSession() : null); }
  function myGroup() {
    var s = sess();
    if (!s) return 'driver';
    if (s.type === 'owner' || s.isAdmin) return 'owner';
    return ({ 'Driver': 'driver', 'Dispatcher': 'dispatcher', 'Inventory Specialist': 'warehouse', 'Sales Rep': 'sales' })[s.role] || 'driver';
  }
  function isAdmin() { var s = sess(); return !!(s && (s.type === 'owner' || s.isAdmin)); }
  function personKey() {
    var s = sess() || {};
    if (s.memberId) return 'm_' + s.memberId;
    return 'p_' + String(s.name || 'guest').toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40);
  }
  function db() { return (typeof fbDb !== 'undefined' && fbDb) ? fbDb : (window.fbDb || null); }
  function visible() {
    var g = myGroup();
    return LESSONS.filter(function(l) {
      if (state.filter === 'all') return true;
      if (g === 'owner') return true;                       // the owner sees everything
      return l.roles.indexOf('all') !== -1 || l.roles.indexOf(g) !== -1;
    });
  }

  /* ---- progress ---- */
  function loadDone(cb) {
    var local = {}; try { local = JSON.parse(localStorage.getItem('gcap_training_' + personKey())) || {}; } catch (e) {}
    state.done = local;
    var d = db();
    if (d) d.ref('gcap/training/' + personKey()).once('value').then(function(snap) {
      var v = snap.val() || {}; var merged = Object.assign({}, local);
      Object.keys(v).forEach(function(k) { if (k !== '_who') merged[k] = v[k]; });
      state.done = merged; cb && cb();
    }).catch(function() { cb && cb(); });
    else cb && cb();
  }
  function saveDone() { try { localStorage.setItem('gcap_training_' + personKey(), JSON.stringify(state.done)); } catch (e) {} }
  window.trainingToggle = function(id) {
    var s = sess() || {}, d = db(), key = personKey();
    if (state.done[id]) {
      delete state.done[id];
      if (d) d.ref('gcap/training/' + key + '/' + id).remove().catch(function() {});
    } else {
      state.done[id] = { at: Date.now() };
      if (d) {
        var up = {}; up['gcap/training/' + key + '/' + id] = { at: Date.now() };
        up['gcap/training/' + key + '/_who'] = { name: s.name || 'Guest', role: s.type === 'owner' ? 'Owner' : (s.role || '') };
        d.ref().update(up).catch(function() {});
      }
    }
    saveDone(); render();
  };

  /* ---- screen ---- */
  function ensure() {
    if (document.getElementById('trainingOverlay')) return;
    var css = document.createElement('style');
    css.textContent =
      '#trainingOverlay { position: fixed; inset: 0; z-index: 900; display: none; flex-direction: column; background: var(--void, #07070a); color: var(--text, #f3f1ec); }' +
      '#trainingOverlay.open { display: flex; }' +
      '#trainingOverlay .tr-bar { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: rgba(10,10,10,0.92); color: #f3f1ec; border-bottom: 1px solid var(--glass-border-gold, rgba(212,164,65,0.45)); flex-shrink: 0; }' +
      '#trainingOverlay .tr-bar button { background: rgba(212,164,65,0.16); color: #f2d38a; border: 1px solid rgba(212,164,65,0.45); padding: 8px 14px; border-radius: 8px; font: inherit; font-size: 13px; font-weight: 700; cursor: pointer; }' +
      '#trainingOverlay .tr-body { flex: 1; overflow-y: auto; }' +
      '#trainingOverlay .tr-wrap { max-width: 860px; margin: 0 auto; padding: 18px 16px 90px; }' +
      '#trainingOverlay h2 { margin: 0 0 4px; font-size: 22px; }' +
      '#trainingOverlay .tr-sub { color: var(--text-soft, #a39d94); font-size: 13px; margin-bottom: 12px; }' +
      '#trainingOverlay .tr-prog { height: 10px; background: var(--glass, rgba(255,255,255,0.06)); border: 1px solid var(--glass-border, rgba(255,255,255,0.1)); border-radius: 99px; overflow: hidden; margin: 8px 0 14px; }' +
      '#trainingOverlay .tr-prog i { display: block; height: 100%; background: linear-gradient(90deg, #d4a441, #34d399); border-radius: 99px; }' +
      '#trainingOverlay .tr-chips { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }' +
      '#trainingOverlay .tr-chip { border: 1px solid var(--glass-border, rgba(255,255,255,0.12)); background: var(--glass, rgba(255,255,255,0.05)); color: var(--text, #f3f1ec); padding: 7px 14px; border-radius: 99px; font: inherit; font-size: 13px; font-weight: 700; cursor: pointer; }' +
      '#trainingOverlay .tr-chip.on { background: rgba(212,164,65,0.22); border-color: var(--glass-border-gold, rgba(212,164,65,0.6)); color: var(--gold-2, #f2d38a); }' +
      '#trainingOverlay .tr-card { border: 1px solid var(--glass-border, rgba(255,255,255,0.1)); background: var(--glass, rgba(255,255,255,0.045)); border-radius: 14px; margin-bottom: 10px; overflow: hidden; }' +
      '#trainingOverlay .tr-card.done { border-color: rgba(52,211,153,0.5); }' +
      '#trainingOverlay .tr-head { width: 100%; display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: transparent; border: 0; color: inherit; font: inherit; text-align: left; cursor: pointer; }' +
      '#trainingOverlay .tr-ico { font-size: 24px; }' +
      '#trainingOverlay .tr-ttl { flex: 1; font-size: 15px; font-weight: 800; }' +
      '#trainingOverlay .tr-role { font-size: 10.5px; font-weight: 800; text-transform: uppercase; letter-spacing: .4px; color: var(--text-soft, #a39d94); }' +
      '#trainingOverlay .tr-ok { color: #34d399; font-weight: 800; }' +
      '#trainingOverlay .tr-open { padding: 0 18px 16px 52px; }' +
      '#trainingOverlay ol { margin: 0 0 12px; padding-left: 20px; }' +
      '#trainingOverlay li { margin: 7px 0; line-height: 1.5; font-size: 14px; }' +
      '#trainingOverlay .tr-tip { background: rgba(251,191,36,0.12); border: 1px solid rgba(251,191,36,0.4); border-radius: 10px; padding: 9px 12px; font-size: 13px; margin-bottom: 12px; }' +
      '#trainingOverlay .tr-done-btn { border: 1px solid rgba(52,211,153,0.6); background: rgba(52,211,153,0.15); color: #34d399; padding: 9px 16px; border-radius: 10px; font: inherit; font-weight: 800; cursor: pointer; }' +
      '#trainingOverlay .tr-done-btn.undo { background: transparent; color: var(--text-soft, #a39d94); border-color: var(--glass-border, rgba(255,255,255,0.15)); }' +
      '#trainingOverlay table { width: 100%; border-collapse: collapse; font-size: 13.5px; }' +
      '#trainingOverlay th, #trainingOverlay td { text-align: left; padding: 9px 8px; border-bottom: 1px solid var(--glass-border, rgba(255,255,255,0.1)); }' +
      'html[data-theme="light"] #trainingOverlay .tr-bar { background: #14110c; }';
    document.head.appendChild(css);
    var el = document.createElement('div');
    el.id = 'trainingOverlay';
    el.innerHTML = '<div class="tr-bar"><button onclick="closeTraining()" id="trBack"></button><span style="font-weight:800;" id="trTitle"></span></div><div class="tr-body"><div class="tr-wrap" id="trainingBody"></div></div>';
    document.body.appendChild(el);
  }
  window.setTrainingFilter = function(f) { state.filter = f; state.open = null; render(); };
  window.trainingOpenLesson = function(id) { state.open = state.open === id ? null : id; render(); };
  window.trainingView = function(v) {
    state.view = v;
    if (v === 'team') loadTeam();
    render();
  };
  function loadTeam() {
    var d = db(); state.team = null;
    if (!d) { state.team = {}; render(); return; }
    d.ref('gcap/training').once('value').then(function(snap) { state.team = snap.val() || {}; render(); }).catch(function() { state.team = {}; render(); });
  }
  function render() {
    var body = document.getElementById('trainingBody'); if (!body) return;
    document.getElementById('trBack').textContent = '← ' + t(T('Back', 'Atrás'));
    document.getElementById('trTitle').textContent = '🎓 ' + t(T('Training', 'Capacitación'));
    var L = visible(), doneCount = L.filter(function(l) { return state.done[l.id]; }).length;
    var html = '<h2>🎓 ' + t(T('Training', 'Capacitación')) + '</h2><div class="tr-sub">' + t(T('Short lessons for your job. Open one, follow the steps, then tick it as done.', 'Lecciones cortas para tu trabajo. Abre una, sigue los pasos y márcala como hecha.')) + '</div>';
    if (isAdmin()) {
      html += '<div class="tr-chips"><button class="tr-chip' + (state.view === 'lessons' ? ' on' : '') + '" onclick="trainingView(\'lessons\')">📚 ' + t(T('Lessons', 'Lecciones')) + '</button><button class="tr-chip' + (state.view === 'team' ? ' on' : '') + '" onclick="trainingView(\'team\')">👥 ' + t(T('Team progress', 'Progreso del equipo')) + '</button></div>';
    }
    if (state.view === 'team' && isAdmin()) { body.innerHTML = html + teamHtml(); return; }
    html += '<div style="font-size:13px; font-weight:700;">' + doneCount + ' / ' + L.length + ' ' + t(T('lessons done', 'lecciones hechas')) + '</div><div class="tr-prog"><i style="width:' + (L.length ? Math.round(doneCount / L.length * 100) : 0) + '%"></i></div>';
    html += '<div class="tr-chips">' + FILTERS.map(function(f) { return '<button class="tr-chip' + (state.filter === f[0] ? ' on' : '') + '" onclick="setTrainingFilter(\'' + f[0] + '\')">' + esc(t(f[1])) + '</button>'; }).join('') + '</div>';
    html += L.map(function(l) {
      var done = !!state.done[l.id], open = state.open === l.id, roleTxt = l.roles.map(function(r) { return t(ROLE_LABEL[r]); }).join(' • ');
      return '<div class="tr-card' + (done ? ' done' : '') + '"><button class="tr-head" onclick="trainingOpenLesson(\'' + l.id + '\')"><span class="tr-ico">' + l.icon + '</span><span class="tr-ttl">' + esc(t(l.title)) + '<div class="tr-role">' + esc(roleTxt) + '</div></span>' + (done ? '<span class="tr-ok">✓ ' + t(T('Done', 'Hecha')) + '</span>' : '') + '<span>' + (open ? '▴' : '▾') + '</span></button>' +
        (open ? '<div class="tr-open"><ol>' + t(l.steps).map(function(s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>' +
          (l.tip ? '<div class="tr-tip">💡 ' + esc(t(l.tip)) + '</div>' : '') +
          '<button class="tr-done-btn' + (done ? ' undo' : '') + '" onclick="trainingToggle(\'' + l.id + '\')">' + (done ? '↩ ' + t(T('Mark as not done', 'Marcar como no hecha')) : '✓ ' + t(T('Mark as done', 'Marcar como hecha'))) + '</button></div>' : '') + '</div>';
    }).join('');
    body.innerHTML = html;
  }
  function teamHtml() {
    if (state.team == null) return '<div class="tr-sub">' + t(T('Loading…', 'Cargando…')) + '</div>';
    var total = LESSONS.length;
    var people = [];
    var members = (typeof settings !== 'undefined' && settings && settings.team) || [];
    members.forEach(function(m) { people.push({ key: 'm_' + m.id, name: m.name, role: m.role, active: m.active !== false }); });
    Object.keys(state.team).forEach(function(k) {
      if (people.some(function(p) { return p.key === k; })) return;
      var w = state.team[k]._who || {}; people.push({ key: k, name: w.name || k, role: w.role || '', active: true });
    });
    var rows = people.map(function(p) {
      var rec = state.team[p.key] || {}, ids = Object.keys(rec).filter(function(k) { return k !== '_who'; });
      var last = ids.reduce(function(a, k) { return Math.max(a, (rec[k] && rec[k].at) || 0); }, 0);
      return '<tr><td><b>' + esc(p.name) + '</b>' + (p.active ? '' : ' <span class="tr-role">(' + t(T('inactive', 'inactivo')) + ')</span>') + '</td><td>' + esc(p.role) + '</td><td>' + ids.length + ' / ' + total + '</td><td>' + (last ? new Date(last).toLocaleDateString() : '—') + '</td></tr>';
    }).join('');
    return '<div class="tr-sub">' + t(T('How many lessons each person has marked as done.', 'Cuántas lecciones ha marcado como hechas cada persona.')) + '</div><table><thead><tr><th>' + t(T('Name', 'Nombre')) + '</th><th>' + t(T('Role', 'Función')) + '</th><th>' + t(T('Lessons done', 'Lecciones hechas')) + '</th><th>' + t(T('Last activity', 'Última actividad')) + '</th></tr></thead><tbody>' + (rows || '<tr><td colspan="4">—</td></tr>') + '</tbody></table>';
  }
  window.openTraining = function() {
    ensure(); state.view = 'lessons'; state.open = null; state.filter = 'mine';
    document.getElementById('trainingOverlay').classList.add('open');
    render();
    loadDone(render);
  };
  window.closeTraining = function() { var o = document.getElementById('trainingOverlay'); if (o) o.classList.remove('open'); };
  window.addEventListener('gcap-lang', function() { var o = document.getElementById('trainingOverlay'); if (o && o.classList.contains('open')) render(); });
  window.gcapTrainingLessons = LESSONS;
  document.addEventListener('DOMContentLoaded', function() {
    try { if (/[?&]training=1\b/.test(location.search)) setTimeout(window.openTraining, 600); } catch (e) {}
  });
})();
