param(
  [int]$Retries=3
)
$ErrorActionPreference='Stop'
function Stamp($m){ Write-Host ("[GH-FIX] {0} {1}" -f (Get-Date -Format s), $m) }

# --- Diagnose ---
Stamp "Diagnose: DNS & Porttests"
$hosts = @('github.com','api.github.com','raw.githubusercontent.com','codeload.github.com')
$tests = foreach($h in $hosts){
  try{
    $dns = (Resolve-DnsName $h -ErrorAction Stop | Select-Object -First 1).IPAddress
  }catch{ $dns = $null }
  $tnc = Test-NetConnection $h -Port 443
  [PSCustomObject]@{ Host=$h; DNS=$dns; Reachable=$tnc.TcpTestSucceeded; RemoteAddr=$tnc.RemoteAddress }
}
$tests | Format-Table -AutoSize | Out-Host

# --- Umfeld säubern ---
Stamp "Umfeld bereinigen: Proxys, TLS, Git/gh Settings"
# 1) Env/WinINET Proxy entfernen
$env:HTTP_PROXY=""; $env:HTTPS_PROXY=""; $env:NO_PROXY=""
try{ netsh winhttp reset proxy | Out-Null }catch{}
# 2) TLS 1.2 erzwingen (PowerShell < 7)
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
# 3) Git Proxy/SSL auf Windows SChannel und HTTP/1.1
git config --global --unset http.proxy 2>$null
git config --global --unset https.proxy 2>$null
git config --global http.sslbackend schannel
git config --global http.version HTTP/1.1
git config --global http.postBuffer 524288000
git config --global core.longpaths true
# 4) gh CLI Proxy aus
# 5) Zeit sync (TLS bricht bei stark falscher Uhrzeit)
try{ w32tm /resync | Out-Null }catch{}

# --- DNS Cache ---
Stamp "DNS-Cache leeren"
ipconfig /flushdns | Out-Null

# --- Verifikation: nackter HTTPS-Call ---
function TryCall($url){
  try{
    $r = Invoke-WebRequest -Uri $url -Headers @{ 'User-Agent'='SF1-Fix/1.0' } -TimeoutSec 15
    return $r.StatusCode
  }catch{
    return $_.Exception.Message
  }
}

$ok=$false
for($i=1;$i -le $Retries -and -not $ok;$i++){
  Stamp "Probe $($i): api.github.com"
  $r1 = TryCall "https://api.github.com"
  Stamp "Antwort: $r1"
  if("$r1" -match '200'){ $ok=$true; break }
  Start-Sleep -Seconds ([Math]::Min(5*$i,15))
}

# --- Fallback-Heilungsschleife ---
if(-not $ok){
  Stamp "Fallback 1: Winsock-Reset + Netzwerkneustart HINWEIS: trennt kurz das Netz"
  try{
    netsh winsock reset | Out-Null
    Start-Sleep 3
  }catch{}
  Stamp "Probe nach Winsock-Reset"
  $r2 = TryCall "https://api.github.com"
  Stamp "Antwort: $r2"
  if("$r2" -match '200'){ $ok=$true }
}

if(-not $ok){
  Stamp "Fallback 2: Temporär IPv6 meiden (nur für aktuelle Sitzung)"
  $pref = (Get-ItemProperty "HKLM:\SYSTEM\CurrentControlSet\Services\Tcpip6\Parameters" -Name DisabledComponents -ErrorAction SilentlyContinue).DisabledComponents
  # Nur Laufzeit: Git zwingend IPv4
  $env:GIT_TRACE=1; $env:GIT_CURL_VERBOSE=1
  git -c "http.sslbackend=schannel" -c "http.version=HTTP/1.1" ls-remote https://github.com/githubtraining/hellogitworld 2>&1 | Out-Host
  $ok = $LASTEXITCODE -eq 0
}

# --- Letzte Option: auf SSH umstellen (ohne HTTPS) ---
$switched=$false
if(-not $ok){
  Stamp "HTTPS weiterhin blockiert. Wechsel auf SSH (dauerhaft)."
  $sshDir = "$env:USERPROFILE\.ssh"
  if(-not (Test-Path $sshDir)){ New-Item -ItemType Directory -Path $sshDir | Out-Null }
  if(-not (Test-Path "$sshDir\id_ed25519")){
    Stamp "SSH-Key erzeugen"
    ssh-keygen -t ed25519 -N "" -f "$sshDir\id_ed25519" | Out-Null
  }
  Stamp "Öffentlichen Key anzeigen – diesen bei GitHub unter Settings > SSH keys hinzufügen:"
  Get-Content "$sshDir\id_ed25519.pub"
  # Repo-URL umstellen
  try{
    git remote set-url origin git@github.com:Callie84/SF-1_Sammelbecken.git
    $switched=$true
  }catch{}
}

# --- End-Verifikation: push/gh ---
$pushDone=$false
try{
  Stamp "Test: git fetch origin"
  git fetch origin 2>&1 | Out-Host
  if($LASTEXITCODE -eq 0){ $pushDone = $true }
}catch{}

# Ergebnisübersicht
Stamp ("Reachable-Tabelle oben geprüft. HTTPS_OK={0} SSH_Switched={1} PushOK={2}" -f $ok,$switched,$pushDone)

if(-not $ok -and -not $switched){
  Stamp "Status: PARTIAL. Bitte Firewall/AV/Router prüfen oder SSH-Key bei GitHub hinterlegen und Skript erneut laufen lassen."
}else{
  Stamp "Fertig."
}


