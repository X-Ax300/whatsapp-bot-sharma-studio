/**
 * Response templates for different menu options
 */

const responses = {
  welcome: `🌟 *Bienvenido a Sharma Studio* 🌟 

1. *Diseño Gráfico*
2. *Manejo de Redes*
3. *Programación de Página Web*
4. *Impresión de Materiales*
5. *Hablar con un Agente*
6. *Listados de precio*
7. *Cotización*
10. *Productos para lisos o teñidos*

👉 *Responde con el número del servicio que te interesa y con gusto te ayudaré.*

*Métodos de pago:*
Como desea pagar: link de pago, Tarjetas de crédito, transferencia.`,

  designGraphic: `*Diseño Gráfico* 🎨
  
Ofrecemos servicios profesionales de diseño gráfico incluyendo:

• Logotipos e identidad de marca
• Materiales de marketing (folletos, tarjetas, etc.)
• Diseño de publicidad para redes sociales
• Diseño de empaques y etiquetas

*¿Qué tipo de diseño necesitas?*
1. Logotipo
2. Material impreso
3. Diseño para redes sociales
4. Otro

0. Volver al menú principal`,

  socialMedia: `*Manejo de Redes Sociales* 📱
  
Nuestros servicios de gestión de redes sociales incluyen:

• Creación y programación de contenido
• Estrategia de marketing digital
• Análisis de métricas y resultados
• Gestión de comunidad y respuesta a comentarios

*¿Qué servicio te interesa?*
1. Estrategia completa
2. Solo creación de contenido
3. Consultoría

0. Volver al menú principal`,

  webDevelopment: `*Programación de Página Web* 💻
  
Desarrollamos sitios web profesionales y funcionales:

• Sitios web corporativos
• Tiendas online (e-commerce)
• Landing pages
• Aplicaciones web personalizadas

*¿Qué tipo de proyecto web necesitas?*
1. Sitio web informativo
2. Tienda online
3. Rediseño de sitio existente
4. Consulta específica

0. Volver al menú principal`,

  printing: `*Impresión de Materiales* 🖨️
  
Ofrecemos servicios completos de impresión:

• Tarjetas de presentación
• Folletos y catálogos
• Lonas y materiales de gran formato
• Artículos promocionales personalizados

*¿Qué materiales necesitas imprimir?*
1. Tarjetas de presentación
2. Folletos/Volantes
3. Impresión de gran formato
4. Otro material

0. Volver al menú principal`,

  agent: `*Hablar con un Agente* 👨‍💼
  
Un miembro de nuestro equipo se pondrá en contacto contigo a la brevedad posible.

Por favor, proporciona la siguiente información:
1. Tu nombre completo
2. El motivo de tu consulta
3. El mejor horario para contactarte

En breve, un agente se comunicará contigo. Gracias por tu paciencia.

0. Volver al menú principal`,

  priceList: `*Listados de Precio* 💰
  
Nuestras tarifas varían según las especificaciones de cada proyecto.

*Selecciona una categoría para ver precios aproximados:*
1. Diseño Gráfico
2. Manejo de Redes
3. Desarrollo Web
4. Servicios de Impresión
5. Productos Capilares

0. Volver al menú principal`,

  quote: `*Solicitud de Cotización* 📝
  
Para brindarte una cotización precisa, necesitamos algunos detalles:

1. Tipo de servicio que necesitas
2. Descripción breve del proyecto
3. Fecha límite (si aplica)
4. Presupuesto aproximado (opcional)

Por favor, envía esta información y te responderemos con una cotización detallada lo antes posible.

0. Volver al menú principal`,

  closingSession: `Gracias por contactar a Sharma Studio. ¡Esperamos poder servirte pronto! 

Si necesitas algo más, no dudes en escribirnos nuevamente.`,

  default: `Lo siento, no he entendido tu respuesta. Por favor, elige una de las opciones del menú o ingresa "0" para volver al menú principal.`
};

module.exports = responses;