import Link from "next/link";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Logo } from "@/components/common";

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-linear-to-b from-white to-blue-950 to-40% font-poppins">
      <div className="relative z-10 container mx-auto py-28 px-10 flex flex-col items-center text-center">
        {/* Logo */}
        <Logo className="size-22.5" />

        {/* Nombre corporativo */}
        <h2
          className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tighter 
          bg-linear-to-b from-white to-blue-200 bg-clip-text text-transparent drop-shadow-lg"
        >
          Bioconstructores Asociados SAS
        </h2>

        {/* Descripción */}
        <p className="text-lg md:max-w-2xl text-white/90 mb-10 font-paragraph">
          Construimos soluciones sostenibles y conectamos comunidades con
          tecnología, innovación y compromiso. <br />
          Nuestro propósito es transformar espacios y generar impacto positivo
          en Villavicencio.
        </p>

        {/* Redes sociales */}
        <div className="flex items-center gap-6 mb-12 z-20">
          <Link
            href="https://www.facebook.com/people/Bioconstructores-Asociados/61576844756821/"
            className="cursor-pointer text-white hover:text-blue-400 transition-colors"
            target="_blank"
          >
            <FaFacebook className="size-6" />
          </Link>
          <Link
            href="https://www.instagram.com/bcatelecomunicaciones"
            className="cursor-pointer text-white hover:text-pink-400 transition-colors"
            target="_blank"
          >
            <FaInstagram className="size-6" />
          </Link>
          <Link
            href="https://api.whatsapp.com/send?phone=3202739134"
            className="cursor-pointer text-white hover:text-green-400 transition-colors"
            target="_blank"
          >
            <FaWhatsapp className="size-6" />
          </Link>
        </div>

        {/* Información de contacto */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-16 text-neutral-300 text-center md:text-left">
          <div className="flex flex-col items-center">
            <p className="font-semibold text-white">Teléfono</p>
            <p>+57 320 273 9134</p>
          </div>

          <div className="flex flex-col items-center">
            <p className="font-semibold text-white">Correo</p>
            <p>bcatelecomunicaciones@gmail.com</p>
          </div>

          <div className="flex flex-col items-center">
            <p className="font-semibold text-white">Ubicación</p>
            <p>Cra. 59 #40-28 L1, Villavicencio, Meta</p>
          </div>
        </div>

        {/* Derechos reservados */}
        <div className="text-sm text-neutral-400 font-paragraph flex flex-col md:flex-row justify-center items-center gap-4 w-full border-t border-neutral-700 pt-6 mt-12">
          <p>© 2026 Bioconstructores Asociados SAS. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};