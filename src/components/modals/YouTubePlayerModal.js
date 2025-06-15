import { ModalBase } from "./ModalBase.js";

export default function YouTubePlayerModal({ url, onClose }) {
  const getYouTubeId = (url) => {
    let ID = "";
    url = url
      .replace(/(>|<)/gi, "")
      .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if (url[2] !== undefined) {
      ID = url[2].split(/[^0-9a-z_-]/i); // <-- removed the unnecessary escape before '-'
      ID = ID[0];
    } else {
      ID = url;
    }
    return ID;
  };
  const videoId = getYouTubeId(url);
  return (
    <ModalBase onClose={onClose} title="Visualizador de Vídeo">
      <div className="aspect-video bg-black rounded-lg">
        {videoId ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}`}
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
    </ModalBase>
  );
}
