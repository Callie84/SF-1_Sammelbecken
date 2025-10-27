export function parsePrice(raw?: string){
  const txt = (raw||"").replace(/\u00A0/g," ").trim();

  // 1) Zahl finden
  const mNum = txt.match(/([\d]+(?:[.,\s][\d]{3})*(?:[.,][\d]{2})?|[\d]+)/);
  if(!mNum) return { price:null, currency:null } as const;
  const numRaw0 = mNum[1];

  // 2) Währung als erstes vorkommendes Token (ISO oder Symbol)
  const mCur = txt.match(/\b(EUR|USD|GBP|CHF)\b|[$£]/i);
  let cur = (mCur?.[0]||"").toUpperCase();
  if(cur==="") cur="EUR";
  else if(cur==="$") cur="USD";
  else if(cur==="£") cur="GBP";

  // 3) Zahl normalisieren (Heuristik: letzter Trenner = Dezimal)
  const numRaw = numRaw0.replace(/\s/g,"");
  const hasDot   = numRaw.includes(".");
  const hasComma = numRaw.includes(",");
  let norm = numRaw;
  if(hasDot && hasComma){
    const lastDot = numRaw.lastIndexOf(".");
    const lastComma = numRaw.lastIndexOf(",");
    const decIsComma = lastComma > lastDot;
    const decIdx = decIsComma ? lastComma : lastDot;
    let out = "";
    for(let i=0;i<numRaw.length;i++){
      const ch = numRaw[i];
      if((ch==="." || ch===",") && i!==decIdx) continue;
      out += (i===decIdx && (ch==="." || ch===",")) ? "." : ch;
    }
    norm = out;
  } else if(hasComma && !hasDot){
    norm = numRaw.replace(/\./g,"").replace(/,/g,".");
  } else {
    norm = numRaw.replace(/\./g,"");
  }

  const price = Number.parseFloat(norm);
  if(!Number.isFinite(price)) return { price:null, currency: cur||null } as const;
  return { price, currency: cur||null } as const;
}
