"use client";

export function Privacy({ config }: { config?: any }) {
  const cardStyle =
    "policy-bento-card group relative bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-[1.2rem] md:rounded-[1.5rem] p-3 md:p-5 flex flex-col justify-center gap-2 md:gap-3 items-center text-center transition-all duration-700 hover:bg-white/20 hover:scale-[1.02] will-change-transform overflow-hidden";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[140px] md:auto-rows-[260px] gap-3 md:gap-6 mt-6">

      {/* Internet Sano */}
      <div className={cardStyle}>
        <h3 className="text-sm md:text-xl font-bold text-white">
          {config?.b1Titulo || "Internet Sano"}
        </h3>
        <p className="text-[9px] md:text-xs text-blue-100 font-paragraph leading-tight md:leading-relaxed">
          {config?.b1Texto || "Nos unimos a la campaña del Ministerio TIC para promover el uso seguro de Internet, generando conciencia sobre la prevención de la explotación infantil en entornos digitales."}
        </p>
      </div>

      {/* Ley 679 */}
      <div className={cardStyle}>
        <h3 className="text-sm md:text-xl font-bold text-white">
          {config?.b2Titulo || "Ley 679 de 2001"}
        </h3>
        <p className="text-[9px] md:text-xs text-blue-100 font-paragraph leading-tight md:leading-relaxed">
          {config?.b2Texto || "Adoptamos medidas técnicas y administrativas para prevenir la difusión de contenido ilegal relacionado con menores de edad, implementando controles y filtros."}
        </p>
      </div>

      {/* Ley 1336 */}
      <div className={cardStyle}>
        <h3 className="text-sm md:text-xl font-bold text-white">
          {config?.b3Titulo || "Ley 1336 de 2009"}
        </h3>
        <p className="text-[9px] md:text-xs text-blue-100 font-paragraph leading-tight md:leading-relaxed">
          {config?.b3Texto || "Fortalecemos la protección de menores mediante códigos de conducta y políticas de prevención en servicios digitales para evitar la explotación sexual infantil."}
        </p>
      </div>

      {/* Protección de Datos */}
      <div className={cardStyle}>
        <h3 className="text-sm md:text-xl font-bold text-white leading-tight">
          {config?.b4Titulo || "Protección de Datos"}
        </h3>
        <p className="text-[9px] md:text-xs text-blue-100 font-paragraph leading-tight md:leading-relaxed">
          {config?.b4Texto || "Garantizamos la confidencialidad de la información personal, aplicamos medidas de protección para prevenir fraude y accesos no autorizados."}
        </p>
      </div>

    </div>
  );
}