# Programm: PowerShell
# Zweck: UGGâ€‘Markdown â†’ HTML + PDF rendern (pandoc optional)
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo = Split-Path -Parent $root
$src  = Join-Path $repo 'apps/backend/data/ugg'
$out  = Join-Path $src 'build'

if(-not (Test-Path $src)){ throw "Quellordner fehlt: $src" }
New-Item -ItemType Directory -Force -Path $out | Out-Null

# HTML aus Markdown erzeugen (Node/pandoc nicht erforderlich â†’ einfache Konvertierung via PowerShell)
Get-ChildItem $src -Filter 'UGG-1_*.md' | ForEach-Object {
  $md = Get-Content $_.FullName -Raw
  $html = "<html><head><meta charset='utf-8'><title>$(($_.BaseName) -replace '_',' ')</title><style>body{font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;max-width:900px;margin:2rem auto;padding:0 1rem;line-height:1.6}</style></head><body>" +
    ($md -replace "^# (.*)$","<h1>$1</h1>" -replace "^## (.*)$","<h2>$1</h2>" -replace "^### (.*)$","<h3>$1</h3>" -replace "\n\n","<br/><br/>") + "</body></html>"
  $slug = ($_.BaseName).ToLower() -replace '[^a-z0-9]+','-'
  $htmlPath = Join-Path $out ($slug + '.html')
  Set-Content -Path $htmlPath -Value $html -Encoding UTF8
}

# PDF optional via pandoc, wenn vorhanden
try {
  $pandoc = (Get-Command pandoc -ErrorAction Stop).Source
  Get-ChildItem $src -Filter 'UGG-1_*.md' | ForEach-Object {
    $slug = ($_.BaseName).ToLower() -replace '[^a-z0-9]+','-'
    $pdfPath = Join-Path $out ($slug + '.pdf')
    & $pandoc $_.FullName -o $pdfPath
  }
  Write-Host '[SF-1] PDF-Erzeugung: OK'
} catch {
  Write-Warning '[SF-1] pandoc nicht gefunden. PDF-Erzeugung Ã¼bersprungen. HTML vorhanden.'
}

# Index erneuern
$index = Join-Path $src 'UGG-1_index.json'
$docs = @()
Get-ChildItem $src -Filter 'UGG-1_*.md' | Sort-Object Name | ForEach-Object {
  $slug = ($_.BaseName).ToLower() -replace '[^a-z0-9]+','-'
  $docs += [pscustomobject]@{
    slug = $slug
    title = ($_.BaseName -replace '_',' ')
    html = "/api/ugg/html/$slug"
    pdf  = "/api/ugg/pdf/$slug"
  }
}
($docs | ConvertTo-Json -Depth 3) | Set-Content -Path $index -Encoding UTF8

Write-Host '[SF-1] UGG Build abgeschlossen.'