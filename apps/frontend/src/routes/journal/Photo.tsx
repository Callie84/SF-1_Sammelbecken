export default function Photo({ fileId, alt }:{ fileId: string; alt?: string }){
  const src = `/api/journal/photo/${fileId}`;
  return (
    <a href={src} target="_blank" rel="noreferrer">
      <img src={src} alt={alt || ''} className="w-full h-32 object-cover rounded" />
    </a>
  );
}