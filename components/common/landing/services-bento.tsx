"use client";

export function ServicesBento() {
  const cardStyle =
    "policy-bento-card group relative bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-[2rem] p-8 flex flex-col justify-center gap-4 items-center text-center transition-all duration-700 hover:bg-white/20 hover:scale-[1.02] will-change-transform overflow-hidden";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 auto-rows-[340px] gap-8 mt-28">
      
      {/* Internet Sano */}
      <div className={cardStyle}>
        <h3 className="text-2xl font-bold text-white">
          Internet Sano
        </h3>
        <p className="text-blue-100 text-sm font-paragraph leading-relaxed max-w-md">
          Nos unimos a la campaña del Ministerio TIC para promover el uso seguro de Internet, 
          generando conciencia sobre la prevención de la explotación infantil en entornos digitales. 
          Informamos a nuestros usuarios sobre los riesgos en la red y fomentamos la denuncia de 
          contenidos ilegales ante las autoridades competentes.
        </p>
      </div>

      {/* Ley 679 */}
      <div className={cardStyle}>
        <h3 className="text-2xl font-bold text-white">
          Ley 679 de 2001
        </h3>
        <p className="text-blue-100 text-sm font-paragraph leading-relaxed max-w-md">
          En cumplimiento de esta ley, adoptamos medidas técnicas y administrativas para prevenir 
          la difusión de contenido ilegal relacionado con menores de edad. Implementamos controles, 
          filtros y mecanismos de bloqueo, además de colaborar con las autoridades para el reporte 
          y seguimiento de actividades sospechosas en la red.
        </p>
      </div>

      {/* Ley 1336 */}
      <div className={cardStyle}>
        <h3 className="text-2xl font-bold text-white">
          Ley 1336 de 2009
        </h3>
        <p className="text-blue-100 text-sm font-paragraph leading-relaxed max-w-md">
          Esta ley fortalece la protección de menores mediante la adopción de códigos de conducta, 
          políticas de prevención y controles en servicios digitales. Exige la implementación de 
          medidas que eviten la explotación sexual infantil y establece sanciones para quienes 
          incumplan estas disposiciones.
        </p>
      </div>

      {/* Política de Datos */}
      <div className={cardStyle}>
        <h3 className="text-2xl font-bold text-white">
          Política de Tratamiento de Datos
        </h3>
        <p className="text-blue-100 text-sm font-paragraph leading-relaxed max-w-md">
          Recolectamos, almacenamos y utilizamos datos personales únicamente para fines contractuales, 
          administrativos y de seguridad. Garantizamos la confidencialidad de la información, 
          evitando su divulgación sin autorización, y aplicamos medidas de protección para prevenir 
          fraude, accesos no autorizados y riesgos en el manejo de datos.
        </p>
      </div>

    </div>
  );
}