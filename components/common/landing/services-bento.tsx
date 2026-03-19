"use client";

export function ServicesBento() {
  const cardStyle =
    "relative bg-blue-950 border border-blue-700 rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 hover:bg-blue-900";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 auto-rows-[280px] gap-6 mt-28">
      {/* Internet Sano */}
      <div className={cardStyle}>
        <h3 className="text-2xl font-bold bg-linear-to-b from-white to-blue-400 text-transparent bg-clip-text">
          Internet Sano
        </h3>
        <p className="text-white/90 text-lg font-paragraph">
          BCAS se une a la campaña del Ministerio TIC para promover un uso seguro y responsable de Internet.
        </p>
      </div>

      {/* Ley 679 */}
      <div className={cardStyle}>
        <h3 className="text-2xl font-bold bg-linear-to-b from-white to-blue-400 text-transparent bg-clip-text">
          Ley 679 de 2001
        </h3>
        <p className="text-white/90 text-lg font-paragraph">
          Adoptamos medidas para prevenir la explotación sexual de menores en medios digitales, cumpliendo la normativa colombiana.
        </p>
      </div>

      {/* Ley 1336 */}
      <div className={cardStyle}>
        <h3 className="text-2xl font-bold bg-linear-to-b from-white to-blue-400 text-transparent bg-clip-text">
          Ley 1336 de 2009
        </h3>
        <p className="text-white/90 text-lg font-paragraph">
          Refuerza la Ley 679 y amplía las sanciones contra delitos informáticos relacionados con menores de edad.
        </p>
      </div>

      {/* Política de Tratamiento de Datos */}
      <div className={cardStyle}>
        <h3 className="text-2xl font-bold bg-linear-to-b from-white to-blue-400 text-transparent bg-clip-text">
          Política de Tratamiento de Datos
        </h3>
        <p className="text-white/90 text-lg font-paragraph">
          Garantizamos la protección, privacidad y uso responsable de la información de nuestros usuarios, empleados y proveedores.
        </p>
      </div>
    </div>
  );
}