import { ModalBase } from "./ModalBase.js";
import { ExternalLink } from "lucide-react";

export default function YouTubePlayerModal({ url, onClose }) {
  const getYouTubeId = (url) => {
    if (!url) return null;

    // Regex atualizada para incluir URLs de Shorts
    const urlParts = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|shorts\/)(.{11})/
    );
    return urlParts && urlParts[1] ? urlParts[1] : null;
  };
  
  const videoId = getYouTubeId(url);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  const watchUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : "";

  // Verifica se a URL é de um Short para ajustar a proporção da tela
  const isShort = url && url.includes('/shorts/');
  const aspectRatioClass = isShort ? 'aspect-[9/16]' : 'aspect-video';

  return (
    <ModalBase onClose={onClose} title="Visualizador de Vídeo">
      {/* Container do Player com classe de proporção dinâmica */}
      <div 
        className={`${aspectRatioClass} bg-black rounded-lg w-full sm:w-auto mx-auto max-h-[75vh]`}
      >
        {videoId ? (
          <iframe
            className="w-full h-full"
            src={embedUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <p className="text-red-400 text-center p-8">
            URL do YouTube inválida.
          </p>
        )}
      </div>

      {videoId && (
        <div className="mt-4 text-center">
            <a
                href={watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex"
            >
                <ExternalLink size={20} className="mr-2" />
                Assistir no YouTube
            </a>
            <p className="text-xs text-gray-500 mt-2">
                Se o vídeo não iniciar, o proprietário pode ter desativado a reprodução em outros sites.
            </p>
        </div>
      )}
    </ModalBase>
  );
}