/* Einfache Anzeige: HTML im iframe. PDFÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬ËœDownloadlink separat. */

type Doc = { slug: string; title: string; html: string; pdf: string };

export default function DocViewer({ doc }:{ doc: Doc }){
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{doc.title}</h2>
        <a className="underline" href={doc.pdf} target="_blank" rel="noreferrer">PDF herunterladen</a>
      </div>
      <iframe title={doc.title} src={doc.html} className="w-full h-[70vh] border rounded" />
    </div>
  );
}