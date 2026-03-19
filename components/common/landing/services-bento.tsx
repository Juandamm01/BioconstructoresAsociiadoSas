"use client";

export function ServicesBento() {
  const cardStyle =
    "service-card relative bg-white/85 backdrop-blur-3xl border border-white/40 shadow-xl rounded-3xl p-8 flex flex-col justify-between transition-all duration-500 hover:bg-white/95 will-change-transform";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 auto-rows-[300px] gap-8 mt-28">
      {/* Internet Sano */}
      <div className={cardStyle}>
        <h3 className="text-2xl font-bold text-blue-950">
          Internet Sano
        </h3>
        <p className="text-blue-900 text-lg font-paragraph leading-relaxed">
          BCAS se une a la campaña del Ministerio TIC para promover un uso seguro y responsable de Internet.
        </p>
      </div>

      {/* Ley 679 */}
      <div className={cardStyle}>
        <h3 className="text-2xl font-bold text-blue-950">
          Ley 679 de 2001
        </h3>
        <p className="text-blue-900 text-lg font-paragraph leading-relaxed">
          Adoptamos medidas para prevenir la explotación sexual de menores en medios digitales, cumpliendo la normativa colombiana.
        </p>
      </div>

      {/* Ley 1336 */}
      <div className={cardStyle}>
        <h3 className="text-2xl font-bold text-blue-950">
          Ley 1336 de 2009
        </h3>
        <p className="text-blue-900 text-lg font-paragraph leading-relaxed">
          Refuerza la Ley 679 y amplía las sanciones contra delitos informáticos relacionados con menores de edad.
        </p>
      </div>

      {/* Política de Tratamiento de Datos */}
      <div className={cardStyle}>
        <h3 className="text-2xl font-bold text-blue-950">
          Política de Tratamiento de Datos
        </h3>
        <p className="text-blue-900 text-lg font-paragraph leading-relaxed">
          Garantizamos la protección, privacidad y uso responsable de la información de nuestros usuarios, empleados y proveedores.
        </p>
      </div>
    </div>
  );
}