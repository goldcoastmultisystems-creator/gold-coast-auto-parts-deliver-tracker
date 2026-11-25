/* English / Español switch for every page.
   How it works: the pages are written in English. When Spanish is chosen, every piece of visible text (including text
   the pages build later — modals, toasts, lists) is translated on screen from the dictionary below; choosing English puts the
   originals back. Customer names, part numbers, addresses and anything typed by people are never changed.
   The choice is remembered on each device. Load in <head> after theme.js. */
(function() {
  var KEY = 'gcap_lang';

  /* ---------------- exact phrases ---------------- */
  var ES = {
    /* --- login --- */
    'Sign in to view the team status board.': 'Inicia sesión para ver el tablero del equipo.',
    'Sign in to view the sales route board.': 'Inicia sesión para ver el tablero de rutas de ventas.',
    'Log In': 'Iniciar sesión', 'Log Out': 'Cerrar sesión', 'Associate / Guest': 'Empleado / Invitado',
    'Email': 'Correo electrónico', 'Password': 'Contraseña', 'Set / Reset Password': 'Crear / Restablecer contraseña',
    'You Are': 'Eres', 'Someone else (type your name)': 'Otra persona (escribe tu nombre)', 'Your Name': 'Tu nombre',
    'Role': 'Función', 'Driver': 'Conductor', 'Dispatcher': 'Despachador', 'Sales Rep': 'Representante de ventas',
    'Inventory Specialist': 'Especialista de inventario', 'Your Password': 'Tu contraseña', 'Your password': 'Tu contraseña',
    '4-Digit Code': 'Código de 4 dígitos', 'Enter': 'Entrar', 'Owner': 'Dueño',
    'Set a new owner password.': 'Crea una nueva contraseña de dueño.', 'Owner Email': 'Correo del dueño', 'New Password': 'Nueva contraseña',
    'Confirm New Password': 'Confirmar nueva contraseña', 'Set Password': 'Guardar contraseña', 'Back to Log In': 'Volver a iniciar sesión',
    '⚠️ This browser is blocking saved logins (private/incognito mode?). Turn that off so you stay logged in.': '⚠️ Este navegador bloquea el inicio de sesión guardado (¿modo privado/incógnito?). Desactívalo para mantener tu sesión.',
    'Welcome': 'Bienvenido', 'Which dashboard would you like to open?': '¿Qué panel quieres abrir?',
    /* --- header & menus --- */
    'GOLD COAST AUTO PARTS': 'GOLD COAST AUTO PARTS', 'DELIVERY STATUS BOARD': 'TABLERO DE ENTREGAS', 'Live sync': 'Sincronizado',
    'Connecting…': 'Conectando…', 'Local only': 'Solo local', 'Sync error': 'Error de sincronización', 'Company': 'Empresa',
    '📍 Tracking: ON': '📍 Rastreo: ACTIVO', '📍 Tracking: OFF': '📍 Rastreo: APAGADO', '🧾 Sales Rep Routes →': '🧾 Rutas de ventas →',
    '+ New List': '+ Nueva lista', '📍 Live Map': '📍 Mapa en vivo', 'History': 'Historial', 'Share': 'Compartir',
    'End of Day Report': 'Reporte del día', 'Parts to Pull': 'Piezas por sacar', 'Parts to Purchase': 'Piezas por comprar',
    '🔄 Returns': '🔄 Devoluciones', '🧾 Zoho Orders': '🧾 Pedidos de Zoho', '🤖 Ask AI': '🤖 Preguntar a la IA',
    '📦 Inventory Management →': '📦 Inventario →', '👥 Manage Team': '👥 Gestionar equipo', '📤 Alert Team': '📤 Avisar al equipo',
    'Inventory Management': 'Gestión de inventario', 'Delivery Status Board': 'Tablero de entregas', 'Sales Rep Routes': 'Rutas de ventas',
    'Delivery Status Board — Sales Rep Routes': 'Rutas de ventas',
    'Delivery': 'Entrega', 'Pickup': 'Recogida', 'Deposit': 'Depósito', 'Stop': 'Parada', 'Other / Stop': 'Otra / Parada',
    'Sales Representative Routes': 'Rutas de representantes de ventas', 'Delivery Status Board': 'Tablero de entregas',
    "Today's delivery stops, live driver tracking": 'Paradas de entrega de hoy, rastreo en vivo de conductores',
    "Today's sales visits, live rep tracking": 'Visitas de ventas de hoy, rastreo en vivo de representantes',
    'Search parts, stock levels and prices': 'Busca piezas, existencias y precios',
    '→ Delivery': '→ Entregas', '🚚 Delivery': '🚚 Entregas', '🧾 Sales Routes': '🧾 Rutas de ventas', 'Sales Routes': 'Rutas de ventas',
    /* --- status & counters --- */
    'Pending': 'Pendiente', 'En Route': 'En camino', 'At Location': 'En el lugar', 'Completed': 'Completada', 'Postponed': 'Pospuesta',
    'Returned Part': 'Pieza devuelta', 'Returned': 'Devuelta', 'Total Stops': 'Paradas totales', 'Activity Feed': 'Actividad',
    'Up Next': 'Siguiente', 'Directions →': 'Cómo llegar →', 'CURRENT STOP': 'PARADA ACTUAL', 'PRIORITY': 'PRIORIDAD',
    'Carried Over': 'Pasadas del día anterior', "Today's Stops": 'Paradas de hoy', '💬 WhatsApp': '💬 WhatsApp', '↗ Share': '↗ Compartir',
    '+ Add Stop': '+ Agregar parada', '🧭 Suggest route': '🧭 Sugerir ruta', '🗺 Google Maps': '🗺 Google Maps',
    'Open in Maps →': 'Abrir en Mapas →', 'Google Maps →': 'Google Maps →', 'Unassigned': 'Sin asignar', 'Unnamed stop': 'Parada sin nombre',
    '— Unassigned —': '— Sin asignar —',
    /* --- stop banners --- */
    '🚚 DELIVERY on this trip - drop it off': '🚚 ENTREGA en este viaje - déjala',
    '↩ RETURN PART on this trip - pick it up': '↩ DEVOLUCIÓN en este viaje - recógela',
    '📦 PICKUP on this trip - collect the parts': '📦 RECOGIDA en este viaje - recoge las piezas',
    '🏦 BANK DEPOSIT on this trip - take it to the bank': '🏦 DEPÓSITO BANCARIO en este viaje - llévalo al banco',
    '📍 STOP on this trip': '📍 PARADA en este viaje',
    /* --- stop card --- */
    'SO#:': 'N.º de pedido:', 'MOP:': 'MOP:', 'MOP': 'MOP', '🔧 Parts to deliver': '🔧 Piezas a entregar', '• coming from': '• viene de',
    '📍 In stock — shelf not set': '📍 En existencia — estante sin asignar', '🛒 Sold out — buy from a supplier': '🛒 Agotada — comprar a un proveedor',
    '🛒 Buy from a supplier': '🛒 Comprar a un proveedor', '📷 Found': '📷 Encontrada', '🚚 Loaded': '🚚 Cargada', 'Found': 'Encontrada', 'Loaded': 'Cargada',
    '+ Photo': '+ Foto', '+ Video': '+ Video', '+ 💵 Check': '+ 💵 Cheque', 'Send': 'Enviar', 'No messages yet.': 'Aún no hay mensajes.',
    'Add a note or message...': 'Agrega una nota o mensaje...', 'Return Reason:': 'Motivo de la devolución:', '⏳ Needs shelving': '⏳ Falta guardarla en el estante',
    'Reason:': 'Motivo:', '↪ from': '↪ del', 'Uploading…': 'Subiendo…', 'Tap to remove': 'Toca para quitar', 'Tap to view full size': 'Toca para ver en tamaño completo',
    '✅ Completed today': '✅ Completadas hoy', 'Show ▾': 'Mostrar ▾', 'Hide ▴': 'Ocultar ▴', '↩ Reopen': '↩ Reabrir',
    'Send on WhatsApp': 'Enviar por WhatsApp', 'Share (with photos)': 'Compartir (con fotos)', 'Edit': 'Editar', 'Delete': 'Eliminar',
    'Unfinished, carried over from an earlier day': 'Sin terminar, pasada de un día anterior',
    '🎉 All stops completed': '🎉 Todas las paradas completadas', '↩ This is a return — pick the part up': '↩ Esto es una devolución — recoger la pieza',
    '🔍 find': '🔍 buscar', 'Click to find this part in Inventory': 'Haz clic para buscar esta pieza en el inventario',
    /* --- report --- */
    'Stops Completed': 'Paradas completadas', 'Deliveries': 'Entregas', 'Pickups': 'Recogidas', 'Deposits': 'Depósitos',
    'No flagged notes yet today.': 'Aún no hay notas marcadas hoy.', 'Gold Coast Auto Parts — Internal Delivery Tool': 'Gold Coast Auto Parts — Herramienta interna de entregas',
    'Gold Coast Auto Parts. All rights reserved.': 'Gold Coast Auto Parts. Todos los derechos reservados.',
    'No activity yet. Status updates and messages will show up here.': 'Aún no hay actividad. Aquí aparecerán los cambios de estado y los mensajes.',
    'No stops yet': 'Aún no hay paradas', 'Nothing here yet.': 'Aún no hay nada aquí.',
    /* --- add / edit stop --- */
    'Add a Stop': 'Agregar una parada', 'Location / Business Name': 'Ubicación / Nombre del negocio', 'Address': 'Dirección', 'Type': 'Tipo',
    'Assign to Driver': 'Asignar a conductor', 'Sales Order #': 'N.º de pedido de venta', 'Part # / Description': 'N.º de pieza / Descripción',
    'Method of Payment': 'Forma de pago', 'Cash': 'Efectivo', 'Check': 'Cheque', 'Charge Account': 'Cuenta de crédito', 'Notes': 'Notas',
    'Cancel': 'Cancelar', 'Add Stop': 'Agregar parada', 'Save': 'Guardar', 'Close': 'Cerrar', 'Continue': 'Continuar', 'Clear': 'Limpiar', 'Back': 'Atrás',
    'e.g. Maaco Lauderdale': 'p. ej. Maaco Lauderdale', 'Street, City, State, ZIP': 'Calle, ciudad, estado, código postal', 'SO-XXXXX (optional)': 'SO-XXXXX (opcional)',
    'Part number and description': 'Número y descripción de la pieza', 'Priority, discount requested, not yet paid, etc.': 'Prioridad, descuento solicitado, sin pagar, etc.',
    'Any additional detail...': 'Cualquier detalle adicional...',
    /* --- return modal --- */
    'Return / Not Accepted': 'Devolución / No aceptada', "The body shop didn't accept this part — let us know why.": 'El taller no aceptó esta pieza — dinos por qué.',
    'Reason': 'Motivo', '— Select a reason —': '— Selecciona un motivo —', 'Wrong Part': 'Pieza equivocada', 'Damaged in Transit': 'Dañada en el transporte',
    'Incorrect Fitment': 'No ajusta', 'No Longer Needed': 'Ya no la necesitan', 'Duplicate Order': 'Pedido duplicado', 'Other': 'Otro', 'Mark as Returned': 'Marcar como devuelta',
    'Returns': 'Devoluciones',
    'Parts not accepted by the body shop. Each one stays here until it is shelved or disposed (needs a condition, a photo and a video) or deleted — regardless of what day it happened.': 'Piezas que el taller no aceptó. Cada una permanece aquí hasta que se guarda o se desecha (requiere condición, foto y video) o se elimina, sin importar el día en que ocurrió.',
    '📚 All saved returns': '📚 Todas las devoluciones guardadas', "📤 Share Today's Returns": '📤 Compartir devoluciones de hoy',
    'No open returns — nice and clean.': 'No hay devoluciones abiertas — todo en orden.', '📸 Shelve / Dispose': '📸 Guardar / Desechar',
    /* --- process return --- */
    '📸 Process return': '📸 Procesar devolución', '1. What condition is the part in?': '1. ¿En qué condición está la pieza?', '2. Show it — a photo': '2. Muéstrala — una foto',
    'and': 'y', 'a video are both required': 'un video son obligatorios', '✅ Good condition': '✅ Buena condición', 'Good condition': 'Buena condición',
    'Can still be sold — goes back on the shelf at full price': 'Aún se puede vender — vuelve al estante a precio completo',
    '🎨 Slightly damaged / painted': '🎨 Ligeramente dañada / pintada', 'Slightly damaged / painted': 'Ligeramente dañada / pintada',
    'Can be sold at a discounted price — goes back on the shelf': 'Se puede vender con descuento — vuelve al estante',
    '🗑 Damaged': '🗑 Dañada', 'Damaged': 'Dañada', 'Really damaged — it cannot be sold and must be disposed': 'Muy dañada — no se puede vender y debe desecharse',
    'Sell — full price': 'Vender — precio completo', 'Sell — discounted price': 'Vender — precio con descuento', 'Cannot be sold — dispose': 'No se puede vender — desechar',
    'No photo or video yet.': 'Aún no hay foto ni video.', '📷 Add photo': '📷 Agregar foto', '🎥 Add video': '🎥 Agregar video', 'Notes (optional)': 'Notas (opcional)',
    'e.g. scratch on the lower edge': 'p. ej. rayón en el borde inferior', '✓ Confirm — shelve it to sell': '✓ Confirmar — guardarla para vender',
    '✓ Confirm — shelve it to sell at a discount': '✓ Confirmar — guardarla para vender con descuento', '🗑 Confirm — dispose of this part': '🗑 Confirmar — desechar esta pieza',
    '✅ Shelved': '✅ Guardada', '🗑 Disposed': '🗑 Desechada', '⚠ no video': '⚠ sin video', 'Condition not recorded': 'Condición sin registrar',
    /* --- found / proof --- */
    '📸 Show it before marking Found': '📸 Muéstrala antes de marcarla como encontrada', 'Nothing added yet.': 'Aún no se ha agregado nada.',
    '⚡ Skip — just mark Found': '⚡ Omitir — solo marcar como encontrada', '✓ Mark as Found with proof': '✓ Marcar como encontrada con prueba',
    'In a rush? Mark it found now — no photo or video': '¿Con prisa? Márcala ya como encontrada — sin foto ni video',
    '✓ Found — proof': '✓ Encontrada — prueba', 'Loading…': 'Cargando…', '↩ Undo Found': '↩ Deshacer encontrada',
    'Add a photo or video, then mark it found': 'Agrega una foto o video y luego márcala como encontrada', 'Mark it Found first': 'Márcala primero como encontrada',
    'Marked found without a photo or video (rush).': 'Marcada como encontrada sin foto ni video (prisa).',
    'No photo or video was saved for this part (it was marked found before proof was required).': 'No se guardó foto ni video de esta pieza (se marcó antes de que se exigiera prueba).',
    '🛒 Add to Parts to Purchase': '🛒 Agregar a Piezas por comprar', '🛒 Out of stock — add to Parts to Purchase': '🛒 Agotada — agregar a Piezas por comprar',
    '🛒 On Parts to Purchase ✓': '🛒 En Piezas por comprar ✓', 'Add this part to the Parts to Purchase list': 'Agrega esta pieza a la lista de Piezas por comprar',
    '✓ Bought': '✓ Comprada', 'To buy': 'Por comprar',
    /* --- checks --- */
    'Checks': 'Cheques', "Checks received from customers. Each one stays here — across every day — until it's marked deposited or deleted.": 'Cheques recibidos de los clientes. Cada uno permanece aquí — sin importar el día — hasta que se marque como depositado o se elimine.',
    '📚 All saved checks': '📚 Todos los cheques guardados', 'No pending checks.': 'No hay cheques pendientes.', 'Amount ($)': 'Monto ($)', 'Check #': 'N.º de cheque', 'From': 'De', 'Bank': 'Banco',
    'Payer / shop name': 'Pagador / nombre del taller', 'Bank name': 'Nombre del banco', '✅ Deposited': '✅ Depositado', '⏳ Not deposited': '⏳ Sin depositar', 'Deposited': 'Depositado',
    'Not deposited': 'Sin depositar', 'View photo': 'Ver foto', '⚠ Needs review': '⚠ Requiere revisión', '⏳ Reading check details…': '⏳ Leyendo los datos del cheque…',
    /* --- history --- */
    "Past days' delivery lists. Photos stay on this device.": 'Listas de entregas de días anteriores.', '← Back to dates': '← Volver a las fechas', 'Current List': 'Lista actual',
    'No history yet.': 'Aún no hay historial.', 'List': 'Lista', '← Back': '← Atrás',
    /* --- team --- */
    'Enter your password to manage the team.': 'Ingresa tu contraseña para gestionar el equipo.',
    'Each person gets their own name and password to log in with — no more sharing one code. Assign a role so location tracking only turns on for actual drivers.': 'Cada persona tiene su propio nombre y contraseña para entrar — ya no se comparte un código. Asigna una función para que el rastreo de ubicación solo se active en los conductores.',
    'Add a Person': 'Agregar una persona', 'Name': 'Nombre', 'Email (optional)': 'Correo (opcional)',
    "Admin access — can manage the team and freely switch their own Driver/Dispatcher role. Admins aren't location-tracked.": 'Acceso de administrador — puede gestionar el equipo y cambiar su propia función de Conductor/Despachador. A los administradores no se les rastrea la ubicación.',
    '+ Add': '+ Agregar', 'Deactivate': 'Desactivar', 'Reactivate': 'Reactivar', 'Remove': 'Quitar', 'Admin': 'Administrador',
    'No one added yet — add your first team member below.': 'Aún no hay nadie — agrega abajo a tu primer miembro del equipo.',
    'At least 6 characters': 'Al menos 6 caracteres', 'Retype password': 'Repite la contraseña', 'e.g. Marcus': 'p. ej. Marcus', 'e.g. name@gmail.com': 'p. ej. nombre@gmail.com', 'e.g. Limelight': 'p. ej. Limelight',
    'e.g. Anthony': 'p. ej. Anthony', 'e.g. Gold Coast Auto Parts': 'p. ej. Gold Coast Auto Parts', 'you@example.com': 'tu@ejemplo.com',
    'Dismiss': 'Descartar',
    /* --- map & routes --- */
    'Route Map': 'Mapa de rutas', 'Routes & suggestions': 'Rutas y sugerencias', 'Now': 'Ahora', 'Nearest first': 'Más cercana primero', 'Furthest first': 'Más lejana primero',
    '🏭 Davie Warehouse': '🏭 Almacén de Davie', 'This is the start point. Distances are straight-line. Each route has its own color and is numbered the same way as on the board.': 'Este es el punto de partida. Las distancias son en línea recta. Cada ruta tiene su color y se numera igual que en el tablero.',
    '🧭 Route suggestion': '🧭 Sugerencia de ruta', 'You can still drag any stop to a different spot afterwards — nothing is locked.': 'Después aún puedes arrastrar cualquier parada a otro lugar — nada queda bloqueado.',
    '🗺 Preview in Google Maps': '🗺 Vista previa en Google Maps', 'Apply this order': 'Aplicar este orden', 'no map location yet': 'aún sin ubicación en el mapa', '(same as now)': '(igual que ahora)',
    'Current order:': 'Orden actual:', '• Suggested:': '• Sugerido:', '🗺 Google Maps': '🗺 Google Maps',
    'Open this route\'s open stops, in the order shown, in Google Maps': 'Abre en Google Maps las paradas abiertas de esta ruta, en el orden mostrado',
    /* --- parts overlay --- */
    '← Back': '← Atrás', '🖨 Printable': '🖨 Imprimible', 'Parts': 'Piezas', 'Units needed': 'Unidades necesarias', 'In stock': 'En existencia', 'Low stock': 'Poca existencia', 'Sold out': 'Agotada',
    'Stops': 'Paradas', 'All': 'Todo', 'All sources': 'Todas las fuentes', 'Suppliers': 'Proveedores', 'Unknown': 'Desconocido', 'SKU': 'SKU', 'Part': 'Pieza', 'Need': 'Necesita',
    'Warehouse / Shelf': 'Almacén / Estante', 'Status': 'Estado', 'Found / Loaded': 'Encontrada / Cargada', 'On hand': 'En existencia', 'Deliver to': 'Entregar a', 'Stop status': 'Estado de la parada',
    'Shelf not set': 'Estante sin asignar', 'Low Stock': 'Poca existencia', 'Sold Out': 'Agotada', 'In Stock': 'En existencia', 'Not in catalog': 'No está en el catálogo',
    'Search SKU, part, customer, SO#, shelf…': 'Buscar SKU, pieza, cliente, n.º de pedido, estante…', 'Search name, check #, SO#, part, date…': 'Buscar nombre, n.º de cheque, pedido, pieza, fecha…',
    'Send today\'s stops on WhatsApp': 'Enviar las paradas de hoy por WhatsApp', "Share today's stops": 'Compartir las paradas de hoy',
    'Unassigned stops': 'Paradas sin asignar',
    /* --- saved records --- */
    'Needs shelving': 'Falta guardar', 'Shelved / disposed': 'Guardadas / desechadas', 'Deleted': 'Eliminadas', 'Condition:': 'Condición:', 'Any': 'Cualquiera',
    '✅ Good — sell': '✅ Buena — vender', '🎨 Slightly damaged — discount': '🎨 Ligeramente dañada — descuento', 'Not recorded': 'Sin registrar', "Couldn't reach the database.": 'No se pudo conectar con la base de datos.',
    '⬇ Download CSV': '⬇ Descargar CSV', '＋ Set condition': '＋ Definir condición', 'View photo & video': 'Ver foto y video', 'Set the condition': 'Definir la condición',
    'Every returned part ever recorded, kept permanently — even after it is shelved or the day is over.': 'Todas las piezas devueltas registradas, guardadas para siempre — incluso después de guardarlas o de que termine el día.',
    'Every check ever captured, kept permanently — even after it is deposited or the day is over.': 'Todos los cheques capturados, guardados para siempre — incluso después de depositarlos o de que termine el día.',
    '📚 All saved returns': '📚 Todas las devoluciones guardadas', 'Nothing saved here yet.': 'Aún no hay nada guardado aquí.', 'Loading saved records…': 'Cargando registros guardados…',
    /* --- zoho panel --- */
    '🧾 Zoho Sales Orders': '🧾 Pedidos de venta de Zoho', 'Confirmed': 'Confirmados', 'All statuses': 'Todos los estados', '↻ Refresh': '↻ Actualizar',
    "Couldn't reach Zoho. Check your connection and try again.": 'No se pudo conectar con Zoho. Revisa tu conexión e inténtalo de nuevo.',
    '➕ Add to deliveries': '➕ Agregar a entregas', '↩ Add as return': '↩ Agregar como devolución', 'Search customer or order #': 'Buscar cliente o n.º de pedido',
    'Add as a return — the driver picks the part up from the customer': 'Agregar como devolución — el conductor recoge la pieza con el cliente',
    '⚠ Backorder': '⚠ Pedido pendiente', '⚠ Some items need backordering.': '⚠ Algunos artículos requieren pedido pendiente.', 'Order': 'Pedido', 'Invoice': 'Factura', 'Payment': 'Pago', 'Shipment': 'Envío',
    'Billing address': 'Dirección de facturación', 'Shipping address': 'Dirección de envío', 'MOP (method of payment)': 'MOP (forma de pago)', 'Reference #': 'N.º de referencia', 'Order date': 'Fecha del pedido',
    'Delivery date': 'Fecha de entrega', 'Payment terms': 'Condiciones de pago', 'Delivery method': 'Método de entrega', 'Salesperson': 'Vendedor', 'Location': 'Ubicación', 'Contact': 'Contacto',
    'Items & description': 'Artículos y descripción', 'Ordered': 'Pedido', 'Rate': 'Precio', 'Amount': 'Importe', 'Sub total': 'Subtotal', 'Shipping': 'Envío', 'Tax': 'Impuesto', 'Total': 'Total',
    'Notes:': 'Notas:', 'not invoiced': 'sin facturar', 'unpaid': 'sin pagar', 'pending': 'pendiente', 'confirmed': 'confirmado', 'paid': 'pagado', 'pcs': 'pzs',
    'Terms & conditions': 'Términos y condiciones', 'No line items.': 'No hay artículos.', 'No orders with this status.': 'No hay pedidos con este estado.', 'Loading orders from Zoho…': 'Cargando pedidos de Zoho…',
    'Log out and log back in once so your login can be used for Zoho orders.': 'Cierra sesión y vuelve a entrar una vez para poder usar tu sesión con los pedidos de Zoho.',
    /* --- ask ai --- */
    "Ask about today's board or look up a part in the inventory. It only reads live data — it can't change anything.": 'Pregunta sobre el tablero de hoy o busca una pieza en el inventario. Solo lee datos en vivo — no puede cambiar nada.',
    'Ask a question to get started.': 'Haz una pregunta para empezar.', 'Summarize today': 'Resume el día de hoy', "What's still pending?": '¿Qué sigue pendiente?',
    'Which checks are not deposited yet?': '¿Qué cheques aún no se han depositado?', 'Do we have a Camry bumper in stock?': '¿Tenemos un parachoques de Camry en existencia?', 'Ask': 'Preguntar',
    'e.g. Do we have a RAV4 bumper in stock?': 'p. ej. ¿Tenemos un parachoques de RAV4 en existencia?', 'Thinking…': 'Pensando…',
    "Summarize today's visits": 'Resume las visitas de hoy', "Who haven't I visited yet?": '¿A quién aún no he visitado?', 'What does a RAV4 bumper cost?': '¿Cuánto cuesta un parachoques de RAV4?',
    'What Camry parts are in stock?': '¿Qué piezas de Camry hay en existencia?', 'Which RAV4 parts are sold out?': '¿Qué piezas de RAV4 están agotadas?', 'How many bumpers do we have?': '¿Cuántos parachoques tenemos?',
    /* --- smart bar --- */
    "💬 Paste your dispatcher's list, or type a stop — I'll organize it for you": '💬 Pega la lista del despachador o escribe una parada — yo la organizo',
    'Paste a list here, or describe a stop... (Enter to process, Shift+Enter for a new line)': 'Pega una lista aquí o describe una parada... (Enter para procesar, Shift+Enter para una nueva línea)',
    'Process': 'Procesar', "Add to today's list, or keep this as its own route?": '¿Agregar a la lista de hoy o mantener esto como una ruta aparte?',
    /* --- appearance / language --- */
    'Appearance': 'Apariencia', '☀️ Light': '☀️ Claro', '🌙 Dark': '🌙 Oscuro', '💻 Device default': '💻 Según el dispositivo', 'Language': 'Idioma',
    /* --- inventory page --- */
    'Zoho Orders': 'Pedidos de Zoho', 'Ask AI': 'Preguntar a la IA', 'All parts': 'Todas las piezas', 'Reorder list': 'Lista de reorden', 'Search SKU, OEM number, make, model, part name…': 'Buscar SKU, n.º OEM, marca, modelo, nombre de la pieza…',
    'Watching': 'En seguimiento', '★ Watching': '★ En seguimiento', 'All locations': 'Todas las ubicaciones', 'CATALOG SKUS': 'SKUS EN CATÁLOGO', 'IN STOCK': 'EN EXISTENCIA', 'LOW STOCK': 'POCA EXISTENCIA',
    'SOLD OUT': 'AGOTADAS', 'NEEDS REORDER': 'POR REORDENAR', 'UNITS ON HAND': 'UNIDADES EN EXISTENCIA', 'PART': 'PIEZA', 'OEM #': 'N.º OEM', 'WAREHOUSE / SHELF': 'ALMACÉN / ESTANTE', 'STATUS': 'ESTADO',
    'QTY': 'CANT.', 'LOW AT': 'MÍNIMO', 'PRICE': 'PRECIO', 'ORDER UP TO': 'PEDIR HASTA', 'ORDER': 'PEDIR', 'OEM #': 'N.º OEM', 'Unassigned': 'Sin asignar', 'Catalog SKUs': 'SKUs en catálogo',
    'Needs reorder': 'Por reordenar', 'Units on hand': 'Unidades en existencia', 'Low at': 'Mínimo', 'Order up to': 'Pedir hasta', 'On hand': 'En existencia'
  };

  Object.assign(ES, {
    '💵 Checks': '💵 Cheques', 'Manage Team': 'Gestionar equipo', '📤 Share': '📤 Compartir', 'Repair Order #': 'N.º de orden de reparación', 'Order Source': 'Origen del pedido',
    'Due On Receipt': 'Pago al recibir', 'Cargo Van': 'Camioneta de carga', 'Net 15': 'Neto 15 días', 'Net 30': 'Neto 30 días', 'Net 45': 'Neto 45 días', 'Net 60': 'Neto 60 días',
    '⚠ Video uploads aren\'t working right now, so you can continue with photos only — this return will be marked "no video".': '⚠ La subida de videos no funciona ahora, así que puedes continuar solo con fotos — esta devolución quedará marcada como "sin video".'
  });

  Object.assign(ES, {
    'Qty': 'Cant.', 'Price': 'Precio', 'Flag as low at': 'Marcar poca existencia en', 'or fewer': 'o menos', 'units': 'unidades', 'unit': 'unidad',
    'Inventory has not been loaded yet. It is copied over from the Stock Board — check back soon.': 'El inventario aún no se ha cargado. Se copia desde el Stock Board — vuelve a revisar pronto.',
    'Could not connect. Check your internet and refresh.': 'No se pudo conectar. Revisa tu internet y actualiza la página.',
    'Could not save that change. Check your connection.': 'No se pudo guardar ese cambio. Revisa tu conexión.',
    'Nothing needs reordering — every watched part is above its low level.': 'Nada necesita reorden — todas las piezas en seguimiento están por encima de su mínimo.',
    'No parts are being watched yet. Tap the ☆ next to a part in All parts to watch it.': 'Aún no hay piezas en seguimiento. Toca la ☆ junto a una pieza en Todas las piezas para seguirla.',
    'Nothing to reorder right now.': 'No hay nada que reordenar ahora.', 'Reorder list copied.': 'Lista de reorden copiada.', 'Copy this list:': 'Copia esta lista:', 'No parts match.': 'Ninguna pieza coincide.',
    'Reorder list': 'Lista de reorden', '📤 Share list': '📤 Compartir lista', '📋 Copy': '📋 Copiar', 'Watch for reorder alerts': 'Seguir para alertas de reorden',
    'Flag as low stock when on hand is at or below this number': 'Marcar como poca existencia cuando haya esta cantidad o menos', 'Edit location': 'Editar ubicación',
    "Only parts you're watching (★) show up here. These levels apply to every part unless you set its own: \"Low at\" in the All parts view, \"Order up to\" in the table below.": 'Aquí solo aparecen las piezas que sigues (★). Estos niveles se aplican a todas las piezas, salvo que fijes uno propio: "Mínimo" en la vista Todas las piezas, "Pedir hasta" en la tabla de abajo.',
    'Order up to': 'Pedir hasta', 'Low at': 'Mínimo', 'Edit': 'Editar'
  });

  /* --- Sales Rep page --- */
  Object.assign(ES, {
    'SALES REP ROUTES': 'RUTAS DE VENTAS', '← Delivery Tracker': '← Seguimiento de entregas', '+ New Route': '+ Nueva ruta', '✅ Daily Checklist': '✅ Lista diaria',
    "💬 Paste your route list, or type a stop — I'll organize it for you": '💬 Pega tu lista de ruta o escribe una parada — yo la organizo',
    'Total Visits': 'Visitas totales', 'Not Interested': 'No interesados', 'Sales Pipeline': 'Embudo de ventas', '+ Add Visit': '+ Agregar visita', 'No visits yet': 'Aún no hay visitas',
    'Paste your route list up top, or tap': 'Pega tu lista de ruta arriba o toca', 'to get started.': 'para empezar.', 'Visits Completed': 'Visitas completadas', 'New Prospects': 'Prospectos nuevos',
    'Existing Customers': 'Clientes existentes', 'Follow-Ups': 'Seguimientos', 'No visits added yet today.': 'Aún no se han agregado visitas hoy.',
    'Gold Coast Auto Parts — Internal Sales Tool': 'Gold Coast Auto Parts — Herramienta interna de ventas', 'Add a Visit': 'Agregar una visita', 'Customer / Business Name': 'Cliente / Nombre del negocio',
    'New Prospect': 'Prospecto nuevo', 'Existing Customer': 'Cliente existente', 'Follow-Up': 'Seguimiento', 'Contact Name': 'Nombre del contacto', 'Phone': 'Teléfono', 'Add Visit': 'Agregar visita',
    'Each person gets their own name and password to log in with. Assign a role so location tracking and page access line up correctly.': 'Cada persona tiene su propio nombre y contraseña para entrar. Asigna una función para que el rastreo y el acceso a las páginas coincidan.',
    "Admin access — can manage the team and freely switch their own role. Admins aren't location-tracked.": 'Acceso de administrador — puede gestionar el equipo y cambiar su propia función. A los administradores no se les rastrea la ubicación.',
    "Past days' sales routes. Photos stay on this device.": 'Rutas de ventas de días anteriores.', 'Visit Report': 'Reporte de la visita', 'Save Report': 'Guardar reporte', 'Daily Checklist —': 'Lista diaria —',
    'Live Sales Rep Map': 'Mapa en vivo de representantes', 'Sales Reps': 'Representantes de ventas', 'No sales reps currently sharing their location.': 'Ningún representante está compartiendo su ubicación ahora.',
    'Paste a list here, or describe a visit... (Enter to process, Shift+Enter for a new line)': 'Pega una lista aquí o describe una visita... (Enter para procesar, Shift+Enter para una nueva línea)',
    "Who you're meeting with (optional)": 'Con quién te reúnes (opcional)', '(optional)': '(opcional)', 'Priority, what they need, last conversation, etc.': 'Prioridad, qué necesitan, última conversación, etc.',
    'CURRENT': 'ACTUAL', 'Drop a visit here': 'Suelta una visita aquí', 'Needs Follow-Up': 'Necesita seguimiento', 'Visit': 'Visita', 'Visits': 'Visitas',
    /* visit report */
    'Shop Information': 'Información del taller', 'Number of Bays': 'Número de bahías', 'Jobs per Week': 'Trabajos por semana', 'Contact Details': 'Datos de contacto', 'Contact Number': 'Número de contacto',
    'Title': 'Cargo', 'Preferred Contact Method': 'Método de contacto preferido', 'Call': 'Llamar', 'Text': 'Mensaje', 'Shop Profile': 'Perfil del taller', 'Vehicle Makes Serviced': 'Marcas de vehículos que atienden',
    'DRP Affiliations': 'Afiliaciones DRP', 'Current Suppliers': 'Proveedores actuales', 'Estimating Software': 'Software de estimados', 'Pain Points': 'Puntos de dolor', 'Fitment': 'Ajuste', 'Communication': 'Comunicación',
    'Availability': 'Disponibilidad', 'Quote Opportunities': 'Oportunidades de cotización', 'Quote 1': 'Cotización 1', 'Quote 2': 'Cotización 2', 'Year / Make / Model': 'Año / Marca / Modelo', 'Fitment Notes': 'Notas de ajuste',
    'Visit Outcome': 'Resultado de la visita', 'What was accomplished': 'Qué se logró', 'Lead Tier': 'Nivel del prospecto', 'Next Action': 'Próxima acción', 'What': 'Qué', 'When': 'Cuándo', 'Channel': 'Canal',
    'Pipeline Stage': 'Etapa del embudo', 'CRM Confirmation': 'Confirmación en el CRM', 'This visit has been fully logged in the CRM': 'Esta visita ya se registró por completo en el CRM', '🔄 Sync to Zoho Now': '🔄 Sincronizar con Zoho ahora',
    'e.g. 6': 'p. ej. 6', 'e.g. 25': 'p. ej. 25', 'e.g. Marcus Reyes': 'p. ej. Marcus Reyes', 'e.g. (954) 555-0142': 'p. ej. (954) 555-0142', 'e.g. Shop Manager': 'p. ej. Gerente del taller',
    'e.g. Domestic, Import, Luxury': 'p. ej. Nacionales, Importados, De lujo', 'e.g. State Farm, Geico': 'p. ej. State Farm, Geico', 'e.g. LKQ, Keystone': 'p. ej. LKQ, Keystone', 'e.g. CCC ONE, Mitchell': 'p. ej. CCC ONE, Mitchell',
    'e.g. 2021 Honda Accord': 'p. ej. 2021 Honda Accord', 'e.g. 2019 Toyota Camry': 'p. ej. 2019 Toyota Camry', 'e.g. Send pricing sheet': 'p. ej. Enviar lista de precios',
    'Introduced yourself and Gold Coast Auto Parts': 'Te presentaste y presentaste a Gold Coast Auto Parts', 'Asked about current pain points': 'Preguntaste por sus problemas actuales', 'Noted vehicle makes & DRP affiliations': 'Anotaste las marcas de vehículos y afiliaciones DRP',
    'Offered a quote if the opportunity came up': 'Ofreciste una cotización si se presentó la oportunidad', 'Got a business card or direct contact info': 'Conseguiste una tarjeta o un contacto directo', 'Took a photo of the shop': 'Tomaste una foto del taller',
    /* daily checklist */
    'Morning Prep (Before First Visit)': 'Preparación de la mañana (antes de la primera visita)', "Reviewed today's route and shop list": 'Revisaste la ruta de hoy y la lista de talleres', 'Samples/catalogs loaded in vehicle': 'Muestras/catálogos cargados en el vehículo',
    'Business cards stocked': 'Tarjetas de presentación disponibles', 'Vehicle inspected (fuel, cleanliness)': 'Vehículo revisado (combustible, limpieza)', 'Confirmed first appointment/contact': 'Confirmaste la primera cita/contacto',
    'Follow-Up Actions for the Day': 'Acciones de seguimiento del día', 'Called/emailed scheduled follow-ups': 'Llamaste/escribiste a los seguimientos programados', 'Sent quote follow-ups': 'Enviaste seguimientos de cotizaciones',
    'Confirmed CRM entries for the day': 'Confirmaste los registros del CRM del día', 'End of Day': 'Fin del día', "Reviewed today's completed visits": 'Revisaste las visitas completadas de hoy', 'Reviewed KPI actuals below': 'Revisaste los resultados de KPI de abajo',
    'Wrote EOD summary notes': 'Escribiste las notas de resumen del día', "Planned tomorrow's priority shops": 'Planeaste los talleres prioritarios de mañana', 'New Prospects Added': 'Prospectos nuevos agregados', 'Quotes Given': 'Cotizaciones dadas',
    'Follow-Ups Scheduled': 'Seguimientos programados', 'Target': 'Meta', 'Actual': 'Real', 'KPIs': 'KPI'
  });

  Object.assign(ES, {
    '🎓 Training': '🎓 Capacitación', 'Training': 'Capacitación', 'Short lessons on how to use the app': 'Lecciones cortas sobre cómo usar la aplicación',
    '💳 Method of payment (MOP)': '💳 Forma de pago (MOP)',
    'Choose how each customer pays before these orders go to the drivers. It is saved for that customer, so next time it is already filled in.': 'Elige cómo paga cada cliente antes de que estos pedidos pasen a los conductores. Se guarda para ese cliente, así que la próxima vez ya estará llenado.',
    "Remember each customer's MOP for next time": 'Recordar el MOP de cada cliente para la próxima vez', '— Select MOP —': '— Selecciona el MOP —', 'Add to deliveries': 'Agregar a entregas',
    'MOP from Zoho': 'MOP de Zoho', 'saved for this customer': 'guardado para este cliente'
  });

  Object.assign(ES, {
    '💳 Method of payment (MOP) & closing time': '💳 Forma de pago (MOP) y hora de cierre',
    'Before these orders go to the drivers, set how each customer pays and when they close. It is saved for that customer, so next time it is already filled in.': 'Antes de que estos pedidos pasen a los conductores, indica cómo paga cada cliente y a qué hora cierra. Se guarda para ese cliente, así que la próxima vez ya estará llenado.',
    "Remember each customer's MOP and closing time for next time": 'Recordar el MOP y la hora de cierre de cada cliente para la próxima vez',
    'Closes at': 'Cierra a las', '(saved)': '(guardado)', 'No closing time': 'Sin hora de cierre', 'Closing time': 'Hora de cierre', 'Closing time (optional)': 'Hora de cierre (opcional)'
  });

  Object.assign(ES, {
    'Make admin': 'Hacer administrador', 'Remove admin': 'Quitar administrador', 'You cannot remove your own admin access.': 'No puedes quitarte tu propio acceso de administrador.'
  });

  Object.assign(ES, {
    '👤 Assign route': '👤 Asignar ruta', 'Give this whole route to a driver': 'Da toda esta ruta a un conductor', '👤 Assign to a driver': '👤 Asignar a un conductor', 'Assign': 'Asignar',
    'Change who this stop is assigned to': 'Cambiar a quién está asignada esta parada', 'No active drivers yet — add one in Manage Team (role: Driver).': 'Aún no hay conductores activos — agrega uno en Gestionar equipo (función: Conductor).',
    '— Unassigned —': '— Sin asignar —', '(current)': '(actual)', 'Driver': 'Conductor', 'Nothing to change — already assigned that way.': 'Nada que cambiar — ya está asignada así.',
    'Assign driver ▾': 'Asignar conductor ▾', '✓ Make unassigned': '✓ Dejar sin asignar'
  });

  Object.assign(ES, {
    '📍 Location sharing for deliveries': '📍 Compartir ubicación para las entregas',
    'While you are logged in and tracking is ON, dispatch can see where you are on the map. It is used to:': 'Mientras hayas iniciado sesión y el rastreo esté ACTIVO, el despacho puede ver dónde estás en el mapa. Se usa para:',
    "show customers' arrival times and warn if a shop will close first": 'mostrar la hora de llegada a los clientes y avisar si un taller cerrará antes',
    'mark a stop "At Location" when you arrive': 'marcar una parada como "En el lugar" cuando llegues', "keep a record of today's route": 'guardar un registro de la ruta de hoy',
    'Keep this page open and the screen on while driving. You can pause sharing any time (for example on a break) with the 📍 Tracking button at the top. Nothing is shared when you are logged out.': 'Mantén esta página abierta y la pantalla encendida mientras manejas. Puedes pausar en cualquier momento (por ejemplo en un descanso) con el botón 📍 Rastreo de arriba. No se comparte nada cuando cierras sesión.',
    'Not now': 'Ahora no', 'I understand — start sharing': 'Entiendo — empezar a compartir',
    '📍 Tracking: ON': '📍 Rastreo: ACTIVO', '📍 Tracking: OFF': '📍 Rastreo: APAGADO', '📍 Live Map': '📍 Mapa en vivo', 'Live Driver Map': 'Mapa en vivo de conductores',
    'Drivers sharing location': 'Conductores compartiendo ubicación', 'None right now.': 'Ninguno por ahora.', 'Live': 'En vivo', 'Slow signal': 'Señal lenta', 'Center': 'Centrar',
    "Today's route": 'Ruta de hoy', 'Hide route': 'Ocultar ruta', '📍 Location tracking paused.': '📍 Rastreo de ubicación en pausa.',
    'No route recorded yet today for this driver.': 'Aún no hay ruta registrada hoy para este conductor.', "Couldn't load the route.": 'No se pudo cargar la ruta.',
    'Location is blocked for this site — turn it on in your phone/browser settings so dispatch can see your deliveries.': 'La ubicación está bloqueada para este sitio — actívala en los ajustes de tu teléfono/navegador para que el despacho vea tus entregas.',
    "Admin access — can manage the team and freely switch their own Driver/Dispatcher role. Admins aren't location-tracked unless they turn it on themselves.": 'Acceso de administrador — puede gestionar el equipo y cambiar su propia función de Conductor/Despachador. A los administradores no se les rastrea la ubicación a menos que lo activen ellos mismos.',
    "Admin access — can manage the team and freely switch their own role. Admins aren't location-tracked unless they turn it on themselves.": 'Acceso de administrador — puede gestionar el equipo y cambiar su propia función. A los administradores no se les rastrea la ubicación a menos que lo activen ellos mismos.'
  });

  Object.assign(ES, { '📍 Route Map': '📍 Mapa de rutas', 'Only admins can see live locations.': 'Solo los administradores pueden ver las ubicaciones en vivo.' });

  /* Cancellations, Returns & Refunds page */
  Object.assign(ES, {
    'Cancellations, Returns & Refunds': 'Cancelaciones, devoluciones y reembolsos',
    '↩ Cancellations, Returns & Refunds →': '↩ Cancelaciones, devoluciones y reembolsos →',
    '↩ Returns & Refunds': '↩ Devoluciones y reembolsos',
    'Cancelled orders, return pickups, inspections and refunds': 'Pedidos cancelados, recogidas de devoluciones, inspecciones y reembolsos',
    '+ New Case': '+ Nuevo caso',
    '🚚 Delivery Board': '🚚 Tablero de entregas',
    '⬇ CSV': '⬇ CSV',
    '✖ Cancellations': '✖ Cancelaciones',
    '↩ Returns': '↩ Devoluciones',
    '💲 Refunds': '💲 Reembolsos',
    'Open': 'Abiertos',
    'Refunds to approve / pay': 'Reembolsos por aprobar / pagar',
    'Closed': 'Cerrados',
    'Open cases': 'Casos abiertos',
    'Cancellations open': 'Cancelaciones abiertas',
    'Returns open': 'Devoluciones abiertas',
    'Refunded this month': 'Reembolsado este mes',
    'Search case #, customer, SO#, part, reason…': 'Buscar caso #, cliente, SO#, pieza, motivo…',
    '✖ ORDER CANCELLATION': '✖ CANCELACIÓN DE PEDIDO',
    '↩ RETURN — part comes back to us': '↩ DEVOLUCIÓN — la pieza regresa a nosotros',
    '💲 REFUND — money back to the customer': '💲 REEMBOLSO — dinero de vuelta al cliente',
    'Order Cancellation': 'Cancelación de pedido',
    'Return': 'Devolución',
    'Refund': 'Reembolso',
    'Requested': 'Solicitado',
    'Cancelled': 'Cancelado',
    'Rejected': 'Rechazado',
    'Pickup scheduled': 'Recogida programada',
    'Picked up': 'Recogido',
    'Inspected': 'Inspeccionado',
    'Approved': 'Aprobado',
    'Refunded': 'Reembolsado',
    'Denied': 'Negado',
    'Waiting for approval': 'Esperando aprobación',
    'Approved — ready to pay': 'Aprobado — listo para pagar',
    '✓ Approve cancellation': '✓ Aprobar cancelación',
    '✕ Reject': '✕ Rechazar',
    '🚚 Schedule pickup': '🚚 Programar recogida',
    '📦 Customer dropped it off': '📦 El cliente la trajo',
    '📦 Mark picked up': '📦 Marcar como recogida',
    '🔍 Inspect part': '🔍 Inspeccionar pieza',
    '✓ Close case': '✓ Cerrar caso',
    '💲 Refund needed': '💲 Se necesita reembolso',
    '💲 Add refund details': '💲 Agregar datos del reembolso',
    '↺ Reopen': '↺ Reabrir',
    '📷 Inspection photos': '📷 Fotos de la inspección',
    '🗑 Delete': '🗑 Eliminar',
    '✓ Approve refund': '✓ Aprobar reembolso',
    '✕ Deny': '✕ Negar',
    '💵 Mark as refunded…': '💵 Marcar como reembolsado…',
    '✎ Edit': '✎ Editar',
    'Waiting for the owner / an admin to approve.': 'Esperando que el dueño / un administrador lo apruebe.',
    'Approved — the owner / an admin pays it out.': 'Aprobado — el dueño / un administrador lo paga.',
    'New case': 'Nuevo caso',
    'What does the customer want?': '¿Qué quiere el cliente?',
    'Customer *': 'Cliente *',
    'Part(s)': 'Pieza(s)',
    'Order amount': 'Monto del pedido',
    'MOP (how they paid)': 'MOP (cómo pagó)',
    'Reason *': 'Motivo *',
    'Delivery stop': 'Parada de entrega',
    '— Not on the delivery board —': '— No está en el tablero de entregas —',
    '— Pick a reason —': '— Elige un motivo —',
    '💲 The customer already paid — a refund is needed': '💲 El cliente ya pagó — se necesita un reembolso',
    'Refund amount *': 'Monto del reembolso *',
    'Refund how': 'Cómo se reembolsa',
    '🚚 Put the pickup on today\'s delivery board now': '🚚 Poner la recogida en el tablero de entregas de hoy',
    'Create cancellation': 'Crear cancelación',
    'Create return': 'Crear devolución',
    'Create refund': 'Crear reembolso',
    'Order not wanted any more — stop the delivery': 'Ya no quieren el pedido — detener la entrega',
    'Part comes back — pickup, inspect, shelve': 'La pieza regresa — recoger, inspeccionar, guardar',
    'Money back only (overcharge, credit…)': 'Solo devolver dinero (cobro de más, crédito…)',
    '🚚 Schedule the return pickup': '🚚 Programar la recogida de la devolución',
    'Add to delivery board': 'Agregar al tablero de entregas',
    '🔍 Inspect the returned part': '🔍 Inspeccionar la pieza devuelta',
    'Photo + video of the part': 'Foto + video de la pieza',
    'Save inspection': 'Guardar inspección',
    '✓ Save — back on the shelf': '✓ Guardar — de vuelta al estante',
    '🗑 Save — dispose of this part': '🗑 Guardar — desechar esta pieza',
    'Amount *': 'Monto *',
    'How': 'Cómo',
    'Reference (check #, transaction ID…)': 'Referencia (cheque #, ID de transacción…)',
    'Note': 'Nota',
    '💲 Refund': '💲 Reembolso',
    '💵 Mark refund as paid': '💵 Marcar reembolso como pagado',
    '✎ Edit refund': '✎ Editar reembolso',
    '✓ Refunded': '✓ Reembolsado',
    'Inspection photos': 'Fotos de la inspección',
    '✖ Cancel order': '✖ Cancelar pedido',
    '↩ Return': '↩ Devolución',
    'Wrong part': 'Pieza equivocada',
    'Does not fit': 'No queda',
    'Damaged on arrival': 'Llegó dañada',
    'Defective': 'Defectuosa',
    'Body shop refused the part': 'El taller rechazó la pieza',
    'Customer no longer needs it': 'El cliente ya no la necesita',
    'Customer changed their mind': 'El cliente cambió de opinión',
    'Wrong part ordered': 'Se pidió la pieza equivocada',
    'Found it cheaper / elsewhere': 'La consiguió más barata / en otro lado',
    'Taking too long': 'Tarda demasiado',
    'Out of stock': 'Sin existencias',
    'Duplicate order': 'Pedido duplicado',
    'Returned part': 'Pieza devuelta',
    'Cancelled order (already paid)': 'Pedido cancelado (ya pagado)',
    'Overcharged': 'Cobro de más',
    'Damaged / defective': 'Dañada / defectuosa',
    'Goodwill credit': 'Crédito de cortesía',
    'Card refund': 'Reembolso a tarjeta',
    'Store credit': 'Crédito en tienda',
    'Account credit': 'Crédito en cuenta',
    '↩ Customer wants to return this / 💲 refund →': '↩ El cliente quiere devolver esto / 💲 reembolso →',
    '✖ Customer cancelled this order / ↩ return / 💲 refund →': '✖ El cliente canceló este pedido / ↩ devolución / 💲 reembolso →',
    'Which cases are still open?': '¿Qué casos siguen abiertos?',
    'Which refunds need approval?': '¿Qué reembolsos necesitan aprobación?',
    'What returns are waiting for pickup?': '¿Qué devoluciones esperan recogida?'
  });

  /* ---------------- phrases with changing parts ---------------- */
  var ST = { 'pending': 'pendiente', 'en route': 'en camino', 'at location': 'en el lugar', 'completed': 'completada', 'postponed': 'pospuesta', 'returned part': 'pieza devuelta', 'returned': 'devuelta' };
  var STC = { 'Pending': 'Pendiente', 'En Route': 'En camino', 'At Location': 'En el lugar', 'Completed': 'Completada', 'Postponed': 'Pospuesta', 'Returned Part': 'Pieza devuelta' };
  var ROLE = { 'Driver': 'Conductor', 'Dispatcher': 'Despachador', 'Sales Rep': 'Representante de ventas', 'Inventory Specialist': 'Especialista de inventario', 'Owner': 'Dueño' };
  function n(m) { return m; }
  function pl(num, one, many) { return num + ' ' + (Number(num) === 1 ? one : many); }
  var PAT = [
    [/^(\d+) stops?$/, function(m) { return pl(m[1], 'parada', 'paradas'); }],
    [/^(\d+) parts?$/, function(m) { return pl(m[1], 'pieza', 'piezas'); }],
    [/^(\d+) returns?$/, function(m) { return pl(m[1], 'devolución', 'devoluciones'); }],
    [/^(\d+) checks?( • total (.+))?$/, function(m) { return pl(m[1], 'cheque', 'cheques') + (m[3] ? ' • total ' + m[3] : ''); }],
    [/^💵 Checks \((\d+)\)$/, function(m) { return '💵 Cheques (' + m[1] + ')'; }],
    [/^(\d+) open \/ (\d+)$/, function(m) { return m[1] + ' abiertas / ' + m[2]; }],
    [/^(\d+) items?( — tap for full order ▾)?$/, function(m) { return pl(m[1], 'artículo', 'artículos') + (m[2] ? ' — toca para ver el pedido completo ▾' : ''); }],
    [/^(.+) — tap for full order ▾$/, function(m) { return m[1].replace(/\b(\d+) items?\b/, function(x, k) { return pl(k, 'artículo', 'artículos'); }) + ' — toca para ver el pedido completo ▾'; }],
    [/^(.+)'s [Rr]oute$/, function(m) { return 'Ruta de ' + m[1]; }],
    [/^Your Route — (.+)$/, function(m) { return 'Tu ruta — ' + m[1]; }],
    [/^(.+) \((Driver|Dispatcher|Sales Rep|Inventory Specialist|Owner)\)$/, function(m) { return m[1] + ' (' + ROLE[m[2]] + ')'; }],
    [/^(.+) • (Driver|Dispatcher|Sales Rep|Inventory Specialist|Owner)$/, function(m) { return m[1] + ' • ' + ROLE[m[2]]; }],
    [/^Route in progress — (\d+) of (\d+) stops complete\.$/, function(m) { return 'Ruta en curso — ' + m[1] + ' de ' + m[2] + ' paradas completadas.'; }],
    [/^All stops complete — great work!$/, function() { return 'Todas las paradas completadas — ¡buen trabajo!'; }],
    [/^Route not started yet — all stops pending\.$/, function() { return 'La ruta aún no empieza — todas las paradas están pendientes.'; }],
    [/^No stops added yet today\.$/, function() { return 'Aún no se han agregado paradas hoy.'; }],
    [/^End-of-Day Summary — (.+)$/, function(m) { return 'Resumen del día — ' + m[1]; }],
    [/^Updated by (.+?) • (.+)$/, function(m) { return 'Actualizado por ' + m[1] + ' • ' + m[2]; }],
    [/^Last updated by (.+)$/, function(m) { return 'Última actualización por ' + m[1]; }],
    [/^Updated (.+)$/, function(m) { return 'Actualizado ' + m[1]; }],
    [/^Captured by (.+?) at (.+)$/, function(m) { return 'Capturado por ' + m[1] + ' a las ' + m[2]; }],
    [/^(.+) • captured by (.+)$/, function(m) { return m[1] + ' • capturado por ' + m[2]; }],
    [/^↪ from (.+)$/, function(m) { return '↪ del ' + m[1]; }],
    [/^(.+) \(Today\)$/, function(m) { return m[1] + ' (Hoy)'; }],
    [/^(.+) \(archived (.+)\)$/, function(m) { return m[1] + ' (archivada ' + m[2] + ')'; }],
    [/^List (\d+)$/, function(m) { return 'Lista ' + m[1]; }],
    [/^— (Delivery|Pickup|Deposit|Stop) — (Pending|En Route|At Location|Completed|Postponed|Returned Part)$/, function(m) { return '— ' + ES[m[1]] + ' — ' + STC[m[2]]; }],
    [/^(.+) marked (pending|en route|at location|completed|postponed|returned part) by (.+)$/, function(m) { return m[1] + ' marcada como ' + ST[m[2]] + ' por ' + m[3]; }],
    [/^(.+) — not accepted \((.+)\) by (.+)$/, function(m) { return m[1] + ' — no aceptada (' + tr(m[2]) + ') por ' + m[3]; }],
    [/^(\d+) unfinished stops? carried over from (.+)$/, function(m) { return pl(m[1], 'parada sin terminar pasada', 'paradas sin terminar pasadas') + ' desde ' + m[2]; }],
    [/^(.+) → (Pending|En Route|At Location|Completed|Postponed|Returned Part)$/, function(m) { return m[1] + ' → ' + STC[m[2]]; }],
    [/^✅ (.+) completed — saved in End of Day & History$/, function(m) { return '✅ ' + m[1] + ' completada — guardada en el Reporte del día y el Historial'; }],
    [/^💵 (\d+) checks? on this stop — see the Checks tab to review\/deposit$/, function(m) { return '💵 ' + pl(m[1], 'cheque', 'cheques') + ' en esta parada — mira la pestaña Cheques para revisar/depositar'; }],
    [/^Marked found by (.+?) at (.+)$/, function(m) { return 'Marcada como encontrada por ' + m[1] + ' el ' + m[2]; }],
    [/^(\d+) confirmed$/, function(m) { return m[1] + ' confirmadas'; }],
    [/^\((\d+) confirmed\)$/, function(m) { return '(' + m[1] + ' confirmadas)'; }],
    [/^Found (\d+) stops?:$/, function(m) { return 'Se encontró ' + pl(m[1], 'parada', 'paradas') + ':'; }],
    [/^Add (\d+) Stops?$/, function(m) { return 'Agregar ' + pl(m[1], 'parada', 'paradas'); }],
    [/^➕ Add (\d+) to deliveries$/, function(m) { return '➕ Agregar ' + m[1] + ' a entregas'; }],
    [/^↩ Add (\d+) as return$/, function(m) { return '↩ Agregar ' + m[1] + ' como devolución'; }],
    [/^(\d+) in stock$/, function(m) { return m[1] + ' en existencia'; }],
    [/^• (\d+) in stock$/, function(m) { return '• ' + m[1] + ' en existencia'; }],
    [/^(\d+) packed • (\d+) invoiced$/, function(m) { return m[1] + ' empacadas • ' + m[2] + ' facturadas'; }],
    [/^SKU: (.+)$/, function(m) { return 'SKU: ' + m[1]; }],
    [/^Total quantity: (\d+)$/, function(m) { return 'Cantidad total: ' + m[1]; }],
    [/^(.+) \((\d+) (confirmed|confirmado)\)$/, function(m) { return m[1] + ' (' + m[2] + ')'; }],
    [/^Confirmed \((\d+)\)$/, function(m) { return 'Confirmados (' + m[1] + ')'; }],
    [/^From Zoho Inventory • newest 200 orders checked( , showing 30)?(, showing 30)? • updated (.+) • read-only$/, function(m) { return 'De Zoho Inventory • se revisaron los 200 pedidos más recientes' + (m[2] ? ', mostrando 30' : '') + ' • actualizado ' + m[3] + ' • solo lectura'; }],
    [/^Anthony's$/, function() { return 'De Anthony'; }],
    [/^Appearance: (.+)$/, function(m) { return 'Apariencia: ' + ({ 'Light': 'Claro', 'Dark': 'Oscuro', 'Device default': 'Según el dispositivo' }[m[1]] || m[1]); }],
    [/^(.+) hours?$/, function(m) { return m[1] + ' h'; }],
    [/^(\d+(?:\.\d+)?) mi( from start| from previous)?$/, function(m) { return m[1] + ' mi' + (m[2] ? (/start/.test(m[2]) ? ' desde el inicio' : ' desde la anterior') : ''); }],
    [/^(.+) • starting from (.+) • straight-line distance \(real roads run a bit longer\)$/, function(m) { return tr(m[1]) + ' • saliendo de ' + (m[2] === 'the Davie warehouse' ? 'el almacén de Davie' : m[2]) + ' • distancia en línea recta (las calles reales son un poco más largas)'; }],
    [/^• nearest first (.+) mi • furthest first (.+) mi$/, function(m) { return '• más cercana primero ' + m[1] + ' mi • más lejana primero ' + m[2] + ' mi'; }],
    [/^To continue: (.+)\.$/, function(m) { var T = { 'pick the condition': 'elige la condición', 'add a photo': 'agrega una foto', 'add a video': 'agrega un video', 'wait for the video to finish uploading': 'espera a que termine de subirse el video' }; return 'Para continuar: ' + m[1].split(', ').map(function(x) { return T[x] || x; }).join(', ') + '.'; }],
    [/^(.+) — add a photo or video of the part, or skip it if you're in a rush\.$/, function(m) { return m[1] + ' — agrega una foto o video de la pieza, u omítelo si tienes prisa.'; }],
    [/^Net (\d+)$/, function(m) { return 'Neto ' + m[1] + ' días'; }],
    [/^Uploading video… ?(\d+)%$/, function(m) { return 'Subiendo video… ' + m[1] + '%'; }],
    [/^⏳ Uploading video…( (\d+)%)?$/, function(m) { return '⏳ Subiendo video…' + (m[1] || ''); }],
    [/^Show more \((\d+) left\)$/, function(m) { return 'Mostrar más (quedan ' + m[1] + ')'; }],
    [/^Inventory data is (\d+) days? old — the daily copy from the Stock Board may not be running\.$/, function(m) { return 'Los datos del inventario tienen ' + m[1] + ' día' + (m[1] === '1' ? '' : 's') + ' — es posible que la copia diaria del Stock Board no esté funcionando.'; }],
    [/^(\d+) parts? to reorder • (\d+) units?$/, function(m) { return pl(m[1], 'pieza', 'piezas') + ' por reordenar • ' + pl(m[2], 'unidad', 'unidades'); }],
    [/^grade ([A-D])$/, function(m) { return 'grado ' + m[1]; }],
    [/^Where is (.+) kept\? Separate several places with .*$/, function(m) { return '¿Dónde está guardada ' + m[1] + '? Separa varios lugares con | (ejemplo: E9 · Estante G2 | E2 · Estante A3). Déjalo en blanco para borrar.'; }],
    [/^(\d+) visits?$/, function(m) { return pl(m[1], 'visita', 'visitas'); }],
    [/^Route in progress — (\d+) of (\d+) visits complete\.$/, function(m) { return 'Ruta en curso — ' + m[1] + ' de ' + m[2] + ' visitas completadas.'; }],
    [/^Choose a MOP for (\d+) more orders? to continue\.$/, function(m) { return 'Elige un MOP para ' + m[1] + ' pedido' + (m[1] === '1' ? '' : 's') + ' más para continuar.'; }],
    [/^🕔 Closes (.+)$/, function(m) { var r = /^in (\d+) min \((.+)\)$/.exec(m[1]); return r ? '🕔 Cierra en ' + r[1] + ' min (' + r[2] + ')' : '🕔 Cierra a las ' + m[1]; }],
    [/^🕔 Closed at (.+)$/, function(m) { return '🕔 Cerró a las ' + m[1]; }],
    [/^Choose a MOP and closing time for (\d+) more orders? to continue\.$/, function(m) { return 'Elige el MOP y la hora de cierre de ' + m[1] + ' pedido' + (m[1] === '1' ? '' : 's') + ' más para continuar.'; }],
    [/^Give (.+) admin access\? Admins can manage the team and see everyone's passwords\. It applies the next time they log in\.$/, function(m) { return '¿Dar acceso de administrador a ' + m[1] + '? Los administradores pueden gestionar el equipo y ver las contraseñas de todos. Se aplica la próxima vez que inicie sesión.'; }],
    [/^Remove admin access from (.+)\?$/, function(m) { return '¿Quitar el acceso de administrador a ' + m[1] + '?'; }],
    [/^(.+) is now an admin\.$/, function(m) { return m[1] + ' ahora es administrador.'; }],
    [/^(.+) is no longer an admin\.$/, function(m) { return m[1] + ' ya no es administrador.'; }],
    [/^(.+) — (\d+) stops?\. Pick who should do (it|them)\.$/, function(m) { return tr(m[1]) + ' — ' + pl(m[2], 'parada', 'paradas') + '. Elige quién debe hacerla' + (m[2] === '1' ? '' : 's') + '.'; }],
    [/^✓ Assign to (.+)$/, function(m) { return '✓ Asignar a ' + m[1]; }],
    [/^🚚 (.+)'s route$/, function(m) { return '🚚 Ruta de ' + m[1]; }],
    [/^👤 (.+) ▾$/, function(m) { return '👤 ' + m[1] + ' ▾'; }],
    [/^(\d+) stops? assigned to (.+)\.$/, function(m) { return pl(m[1], 'parada asignada', 'paradas asignadas') + ' a ' + m[2] + '.'; }],
    [/^(\d+) stops? made unassigned\.$/, function(m) { return pl(m[1], 'parada dejada', 'paradas dejadas') + ' sin asignar.'; }],
    [/^📍 Live Map \((\d+)\)$/, function(m) { return '📍 Mapa en vivo (' + m[1] + ')'; }],
    [/^📍 (.+) is arriving$/, function(m) { return '📍 ' + m[1] + ' está llegando'; }],
    [/^📍 (.+) is (\d+(?:\.?\d+)?) mi away$/, function(m) { return '📍 ' + m[1] + ' está a ' + m[2] + ' mi'; }],
    [/^~(\d+) min$/, function(m) { return '~' + m[1] + ' min'; }],
    [/^⚠ may arrive after closing \((.+)\)$/, function(m) { return '⚠ podría llegar después del cierre (' + m[1] + ')'; }],
    [/^Last seen (.+)$/, function(m) { return 'Visto por última vez ' + m[1].replace(/ago$/, 'atrás'); }],
    [/^Next: (.+?) • (\d+(?:\.?\d+)?) mi • ~(\d+) min$/, function(m) { return 'Siguiente: ' + m[1] + ' • ' + m[2] + ' mi • ~' + m[3] + ' min'; }],
    [/^Next: (.+)$/, function(m) { return 'Siguiente: ' + m[1]; }],
    [/^Updated (.+?)( • (\d+) mph)?$/, function(m) { return 'Actualizado ' + m[1] + (m[3] ? ' • ' + m[3] + ' mph' : ''); }],
    [/^⚪ Not sharing: (.+)$/, function(m) { return '⚪ Sin compartir: ' + m[1]; }],
    [/^Start (.+)$/, function(m) { return 'Inicio ' + m[1]; }],
    [/^Latest (.+)$/, function(m) { return 'Último ' + m[1]; }],
    [/^(\d+) cases?$/, function(m) { return pl(m[1], 'caso', 'casos'); }],
    [/^(.+) • (.+) • (.+)$/, null]   // placeholder: resolved by splitting on " • " below
  ];
  PAT.pop();

  /* parts of a line joined with " • " or " — " are translated one by one */
  function splitJoin(core) {
    var seps = [' • ', ' — '];
    for (var i = 0; i < seps.length; i++) {
      if (core.indexOf(seps[i]) !== -1) {
        var parts = core.split(seps[i]), out = [], hit = false;
        parts.forEach(function(p) { var t = lookup(p, true); if (t != null) { hit = true; out.push(t); } else out.push(p); });
        if (hit) return out.join(seps[i]);
      }
    }
    return null;
  }

  var WORDS = [[/\bShelf\b/g, 'Estante'], [/\bsold out\b/gi, 'agotada']];
  function lookup(core, noSplit) {
    if (Object.prototype.hasOwnProperty.call(ES, core)) return ES[core];
    for (var i = 0; i < PAT.length; i++) { var m = PAT[i][0].exec(core); if (m) { var r = PAT[i][1](m); if (r != null) return r; } }
    if (!noSplit) { var j = splitJoin(core); if (j != null) return j; }
    if (/\bShelf\b/.test(core) && /[·,]/.test(core)) return core.replace(/\bShelf\b/g, 'Estante');
    return null;
  }
  function tr(str) {
    if (str == null) return str;
    str = String(str);
    var m = /^(\s*)([\s\S]*?)(\s*)$/.exec(str);
    var core = m[2].replace(/\s+/g, ' ');
    if (!core) return str;
    var t = lookup(core);
    return t == null ? str : m[1] + t + m[3];
  }

  /* ---------------- messages shown with alert()/confirm() ---------------- */
  var MSG = {
    'Log out?': '¿Cerrar sesión?', 'Remove this photo?': '¿Quitar esta foto?', 'Remove this video?': '¿Quitar este video?',
    "Start a new list? Today's current stops will be archived to History.": '¿Empezar una lista nueva? Las paradas actuales de hoy se archivarán en el Historial.',
    'Remove this person? They will no longer be able to log in.': '¿Quitar a esta persona? Ya no podrá iniciar sesión.',
    'Delete this return entry? This cannot be undone.': '¿Eliminar esta devolución? No se puede deshacer.',
    'Delete this check entry? This cannot be undone.': '¿Eliminar este cheque? No se puede deshacer.',
    'Confirm this check has been deposited?': '¿Confirmas que este cheque ya fue depositado?',
    'Please enter a location or business name.': 'Escribe una ubicación o nombre de negocio.', 'Please select a reason.': 'Selecciona un motivo.',
    'Undo Found for this part? (This also clears Loaded. The saved photos are kept.)': '¿Deshacer "Encontrada" de esta pieza? (También quita "Cargada". Las fotos guardadas se conservan.)'
  };
  ES = Object.assign(ES, MSG);
  /* ---------------- toasts & messages (exact) ---------------- */
  Object.assign(ES, {
    'Route reordered ✓': 'Ruta reordenada ✓', 'Marked as found ✓': 'Marcada como encontrada ✓', 'Marked as found (no proof) ✓': 'Marcada como encontrada (sin prueba) ✓',
    'Marked as shelved ✓': 'Marcada como guardada ✓', 'Marked as disposed ✓': 'Marcada como desechada ✓', 'Marked as deposited ✓': 'Marcada como depositada ✓', 'Marked as bought ✓': 'Marcada como comprada ✓',
    'Added to Parts to Purchase ✓': 'Agregada a Piezas por comprar ✓', 'Check details updated.': 'Datos del cheque actualizados.', 'Check entry deleted.': 'Cheque eliminado.', 'Return deleted.': 'Devolución eliminada.',
    'Condition saved ✓': 'Condición guardada ✓', 'Already on the board.': 'Ya está en el tablero.', 'Video uploaded.': 'Video subido.', 'Video uploaded to Google Drive.': 'Video subido a Google Drive.',
    'Video upload failed — check your connection.': 'No se pudo subir el video — revisa tu conexión.', 'No addresses to map yet.': 'Aún no hay direcciones para el mapa.',
    'Nothing to share with these filters.': 'No hay nada que compartir con estos filtros.', 'List is already empty.': 'La lista ya está vacía.', 'New list started — previous list saved to History.': 'Nueva lista iniciada — la lista anterior se guardó en el Historial.',
    'Copied to clipboard!': '¡Copiado al portapapeles!', 'Order copied — paste it anywhere.': 'Pedido copiado — pégalo donde quieras.', 'Copy this text:': 'Copia este texto:',
    'Incorrect password.': 'Contraseña incorrecta.', 'Incorrect code.': 'Código incorrecto.', 'Incorrect email or password.': 'Correo o contraseña incorrectos.', 'Pick your name from the list.': 'Elige tu nombre de la lista.',
    'Enter your name.': 'Escribe tu nombre.', 'Enter a name.': 'Escribe un nombre.', 'Enter a valid email.': 'Escribe un correo válido.', 'Enter your email and password.': 'Escribe tu correo y contraseña.',
    'Passwords do not match.': 'Las contraseñas no coinciden.', 'Password must be at least 6 characters.': 'La contraseña debe tener al menos 6 caracteres.', 'Password must be at least 3 characters.': 'La contraseña debe tener al menos 3 caracteres.',
    'Password set! You can log in now.': '¡Contraseña creada! Ya puedes iniciar sesión.', 'Password set — log in below.': 'Contraseña creada — inicia sesión abajo.',
    "No owner account yet — tap 'Set / Reset Password' to create one.": "Aún no hay cuenta de dueño — toca 'Crear / Restablecer contraseña' para crear una.",
    'Location access denied — live tracking is off.': 'Acceso a la ubicación denegado — el rastreo en vivo está apagado.', 'Location is not supported on this device.': 'La ubicación no está disponible en este dispositivo.',
    "Please log out and log back in, then try again.": 'Cierra sesión, vuelve a entrar e inténtalo de nuevo.', "Mark it Found first — with a photo or video.": 'Márcala primero como encontrada — con una foto o video.',
    "Couldn't save that — check your connection.": 'No se pudo guardar — revisa tu conexión.', "Couldn't reach the database — try again in a moment.": 'No se pudo conectar con la base de datos — inténtalo en un momento.',
    "Couldn't reach the AI — check your connection and try again.": 'No se pudo conectar con la IA — revisa tu conexión e inténtalo de nuevo.',
    "Sorry, I couldn't answer that right now. Please try again.": 'Lo siento, no pude responder eso ahora. Inténtalo de nuevo.',
    "Video upload isn't working right now (video storage isn't switched on yet). Photos still work.": 'La subida de video no funciona ahora (el almacenamiento de video aún no está activado). Las fotos sí funcionan.',
    'Video upload is not available right now. Photos still work.': 'La subida de video no está disponible ahora. Las fotos sí funcionan.',
    'That video is too large (max 300MB).': 'Ese video es demasiado grande (máx. 300 MB).', 'Up to 6 photos.': 'Hasta 6 fotos.',
    'Please try again.': 'Inténtalo de nuevo.', 'Today:': 'Hoy:'
  });

  /* ---------------- applying it to the page ---------------- */
  function lang() { try { return localStorage.getItem(KEY) === 'es' ? 'es' : 'en'; } catch (e) { return 'en'; } }
  var ATTRS = ['placeholder', 'title', 'alt', 'aria-label'];
  var busy = false;

  function doText(node) {
    var v = node.nodeValue;
    if (node.__gt !== undefined && v === node.__gt) return;          // already our translation
    var t = tr(v);
    if (t !== v) { node.__go = v; node.__gt = t; node.nodeValue = t; }
    else { node.__go = undefined; node.__gt = undefined; }
  }
  function doAttrs(el) {
    if (el.nodeType !== 1) return;
    for (var i = 0; i < ATTRS.length; i++) {
      var a = ATTRS[i], v = el.getAttribute(a);
      if (v == null) continue;
      var store = el.__ga || (el.__ga = {});
      if (store[a] && store[a].t === v) continue;
      var t = tr(v);
      if (t !== v) { store[a] = { o: v, t: t }; el.setAttribute(a, t); } else delete store[a];
    }
  }
  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { if (root.parentNode && !/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/.test(root.parentNode.nodeName)) doText(root); return; }
    if (root.nodeType !== 1 || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(root.nodeName)) return;
    doAttrs(root);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null), n;
    while ((n = w.nextNode())) {
      if (n.nodeType === 3) { if (!/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/.test(n.parentNode.nodeName)) doText(n); }
      else if (!/^(SCRIPT|STYLE|NOSCRIPT)$/.test(n.nodeName)) doAttrs(n);
    }
  }
  function restore(root) {
    var w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null), n;
    while ((n = w.nextNode())) {
      if (n.nodeType === 3) { if (n.__go !== undefined && n.nodeValue === n.__gt) n.nodeValue = n.__go; n.__go = undefined; n.__gt = undefined; }
      else if (n.__ga) { Object.keys(n.__ga).forEach(function(a) { if (n.getAttribute(a) === n.__ga[a].t) n.setAttribute(a, n.__ga[a].o); }); n.__ga = null; }
    }
  }
  var observer = null;
  function onMutations(list) {
    if (busy || lang() !== 'es') return; busy = true;
    try {
      list.forEach(function(m) {
        if (m.type === 'childList') m.addedNodes.forEach(walk);
        else if (m.type === 'characterData') { if (m.target.parentNode && !/^(SCRIPT|STYLE|TEXTAREA)$/.test(m.target.parentNode.nodeName)) doText(m.target); }
        else if (m.type === 'attributes') doAttrs(m.target);
      });
    } finally { busy = false; }
  }
  function start() {
    if (observer) return;
    observer = new MutationObserver(onMutations);
    observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }
  function apply() {
    if (!document.body) return;
    var es = lang() === 'es';
    document.documentElement.setAttribute('lang', es ? 'es' : 'en');
    busy = true;
    try { if (es) { walk(document.documentElement); } else { restore(document.documentElement); } } finally { busy = false; }
    if (es) start(); else if (observer) { observer.disconnect(); observer = null; }
    renderMenu();
    try { window.dispatchEvent(new Event('gcap-lang')); } catch (e) {}
  }
  window.setLanguage = function(l) { try { localStorage.setItem(KEY, l === 'es' ? 'es' : 'en'); } catch (e) {} apply(); };
  window.gcapLang = lang;
  window.gcapT = function(s) { return lang() === 'es' ? tr(s) : s; };
  window.gcapTranslateExists = function(s) { return lookup(String(s).replace(/\s+/g, ' ').trim()) != null; };

  /* alert / confirm / prompt messages */
  ['alert', 'confirm', 'prompt'].forEach(function(fn) {
    var orig = window[fn];
    window[fn] = function(msg) { var a = Array.prototype.slice.call(arguments); if (lang() === 'es' && typeof a[0] === 'string') a[0] = tr(a[0]); return orig.apply(window, a); };
  });

  /* ---------------- the language button ---------------- */
  var css = '#gcapLangBtn { position: fixed; left: 62px; bottom: 14px; z-index: 1001; height: 40px; min-width: 40px; padding: 0 10px; border-radius: 20px; border: 1px solid var(--glass-border-gold, rgba(212,164,65,0.45)); background: var(--glass-strong, rgba(255,255,255,0.1)); color: var(--text, #f3f1ec); font: inherit; font-size: 13px; font-weight: 800; cursor: pointer; box-shadow: 0 6px 18px rgba(0,0,0,0.3); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; gap: 5px; }' +
    '#gcapLangMenu { position: fixed; left: 62px; bottom: 62px; z-index: 1002; min-width: 160px; padding: 6px; border-radius: 12px; border: 1px solid var(--glass-border-gold, rgba(212,164,65,0.45)); background: rgba(24,20,14,0.97); color: #f3f1ec; box-shadow: 0 16px 40px rgba(0,0,0,0.45); display: none; font-family: inherit; }' +
    'html[data-theme="light"] #gcapLangMenu { background: rgba(255,253,248,0.98); color: #1c1912; box-shadow: 0 16px 40px rgba(60,45,10,0.25); }' +
    '#gcapLangMenu.open { display: block; }' +
    '#gcapLangMenu button { display: flex; align-items: center; gap: 9px; width: 100%; text-align: left; background: transparent; border: 0; border-radius: 8px; padding: 9px 10px; font: inherit; font-size: 13.5px; font-weight: 600; color: inherit; cursor: pointer; }' +
    '#gcapLangMenu button:hover { background: rgba(212,164,65,0.18); }' +
    '#gcapLangMenu button .tick { margin-left: auto; color: #d4a441; font-weight: 800; }';
  function renderMenu() {
    var btn = document.getElementById('gcapLangBtn'), menu = document.getElementById('gcapLangMenu');
    if (!btn || !menu) return;
    var l = lang();
    btn.textContent = '🌐 ' + (l === 'es' ? 'ES' : 'EN');
    btn.setAttribute('data-gcap-skip', '1');
    menu.innerHTML = [['en', 'English'], ['es', 'Español']].map(function(o) {
      return '<button type="button" onclick="setLanguage(\'' + o[0] + '\'); document.getElementById(\'gcapLangMenu\').classList.remove(\'open\');">🌐 ' + o[1] + (l === o[0] ? '<span class="tick">✓</span>' : '') + '</button>';
    }).join('');
  }
  function mount() {
    if (document.getElementById('gcapLangBtn')) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var btn = document.createElement('button'); btn.id = 'gcapLangBtn'; btn.type = 'button'; btn.title = 'Language / Idioma';
    var menu = document.createElement('div'); menu.id = 'gcapLangMenu';
    btn.onclick = function(e) { e.stopPropagation(); menu.classList.toggle('open'); var t = document.getElementById('gcapThemeMenu'); if (t) t.classList.remove('open'); };
    document.body.appendChild(menu); document.body.appendChild(btn);
    document.addEventListener('click', function(e) { if (!menu.contains(e.target)) menu.classList.remove('open'); });
    renderMenu();
    if (lang() === 'es') apply();
  }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
  window.addEventListener('storage', function(e) { if (e.key === KEY) apply(); });
})();
