import React from 'react';
import { MapPin, Clock, MessageCircle, Phone, Heart, Share2 } from 'lucide-react';
import { ChurreLogo } from './ChurreLogo';

export const Footer: React.FC = () => {
  const handleShare = async () => {
    const shareData = {
      title: 'Churre Malcriado - Sabor Piurano con Calle',
      text: '¡Prueba los mejores chicharrones y antojitos piuranos en el Mercado 2 de Surquillo!',
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.warn('Error sharing:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('¡Enlace del menú copiado al portapapeles!');
      } catch {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`, '_blank');
      }
    }
  };

  return (
    <footer className="w-full mt-12 pt-8 pb-32 border-t border-neutral-200/80 bg-gradient-to-b from-white via-[#faf6f7] to-[#fcecee]">
      <div className="max-w-md mx-auto px-5 text-center flex flex-col items-center">
        {/* Logo oficial con fondo transparente */}
        <div className="mb-4">
          <ChurreLogo size="sm" showSubtitle={true} variant="transparent" />
        </div>

        {/* Botón de Compartir Menú */}
        <button
          id="share-menu-footer-btn"
          onClick={handleShare}
          className="w-full mb-5 py-3 px-4 bg-[#e51d5a] hover:bg-[#cf144d] text-white rounded-2xl text-sm font-black shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          <span>¡Compartir Menú & Redes!</span>
        </button>

        {/* Tarjeta de Información Principal del Local */}
        <div className="w-full bg-white/90 backdrop-blur-xs rounded-3xl p-5 border border-neutral-200 shadow-sm text-left flex flex-col gap-4 mb-5">
          {/* Ubicación */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#e51d5a]/10 text-[#e51d5a] flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-[#e51d5a] tracking-wider">Ubicación</p>
              <p className="text-sm font-bold text-neutral-900 leading-snug">
                Mercado 2 de Surquillo • Puesto 651
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">Surquillo, Lima - Perú</p>
            </div>
          </div>

          <div className="h-px bg-neutral-100 w-full" />

          {/* Horario de Atención */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#e51d5a]/10 text-[#e51d5a] flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-black uppercase text-[#e51d5a] tracking-wider">Horario de Atención</p>
                <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Abierto
                </span>
              </div>
              <p className="text-sm font-bold text-neutral-900 leading-snug mt-0.5">
                Martes a domingo de 8:00 am a 5:00 pm
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">Lunes cerrado por abastecimiento</p>
            </div>
          </div>

          <div className="h-px bg-neutral-100 w-full" />

          {/* Delivery WhatsApp */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase text-[#e51d5a] tracking-wider">Pedidos & Delivery WhatsApp</p>
              <p className="text-xs text-neutral-600 mt-0.5 mb-2">Escríbenos directamente para tu pedido o consulta:</p>
              
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://wa.me/51936494711?text=Hola%20Churre%20Malcriado!%20Deseo%20hacer%20un%20pedido"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all"
                >
                  <Phone className="w-3 h-3" />
                  <span>936 494 711</span>
                </a>

                <a
                  href="https://wa.me/51901885960?text=Hola%20Churre%20Malcriado!%20Deseo%20hacer%20un%20pedido"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all"
                >
                  <Phone className="w-3 h-3" />
                  <span>901 885 960</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Firma de Sabor & Tradición */}
        <p className="text-xs text-neutral-500 font-medium flex items-center justify-center gap-1">
          Sabor 100% piurano con calle hecho con <Heart className="w-3 h-3 text-[#e51d5a] fill-[#e51d5a]" /> en Surquillo
        </p>
        <p className="text-[11px] text-neutral-400 mt-1">
          © {new Date().getFullYear()} Churre Malcriado • Todos los derechos reservados
        </p>
      </div>
    </footer>
  );
};
