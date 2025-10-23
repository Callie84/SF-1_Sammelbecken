import { Helmet } from "react-helmet";


export function Hreflang({ path }: { path: string }) {
return (
<Helmet>
<link rel="alternate" hrefLang="de" href={`https://seedfinderpro.de/de${path}`} />
<link rel="alternate" hrefLang="en" href={`https://seedfinderpro.de/en${path}`} />
<link rel="alternate" hrefLang="x-default" href={`https://seedfinderpro.de${path}`} />
</Helmet>
);
}