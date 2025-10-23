param(
  [string]$OUT = (Join-Path $PWD "out\normalized"),
  [int]$TimeoutSec = 8,
  [int]$Throttle = 20
)
$ErrorActionPreference="Stop"
$feed = Join-Path $OUT 'feed_seeds_clean.csv'
if(-not (Test-Path $feed)){ throw "Feed fehlt: $feed" }
$links = (Import-Csv $feed).link | Where-Object { $_ } | Select-Object -Unique
Write-Host ("Prüfe {0} Links..." -f $links.Count)

$results = foreach($u in $links){
  try{
    $handler = [System.Net.Http.HttpClientHandler]::new()
    $handler.AllowAutoRedirect = $true
    $client  = [System.Net.Http.HttpClient]::new($handler)
    $client.Timeout = [TimeSpan]::FromSeconds($TimeoutSec)
    $client.DefaultRequestHeaders.UserAgent.ParseAdd("Mozilla/5.0")
    # HEAD
    $req = [System.Net.Http.HttpRequestMessage]::new([System.Net.Http.HttpMethod]::Head, $u)
    $resp = $client.SendAsync($req,[System.Net.Http.HttpCompletionOption]::ResponseHeadersRead).Result
    $code = [int]$resp.StatusCode
    if($code -eq 405 -or $code -eq 400 -or $code -eq 403){
      # Fallback GET nur Header
      $req2 = [System.Net.Http.HttpRequestMessage]::new([System.Net.Http.HttpMethod]::Get, $u)
      $resp = $client.SendAsync($req2,[System.Net.Http.HttpCompletionOption]::ResponseHeadersRead).Result
      $code = [int]$resp.StatusCode
    }
    $ok = ($code -ge 200 -and $code -lt 400)
    [pscustomobject]@{ link=$u; ok=$ok; code=$code; reason=($resp.ReasonPhrase) }
  } catch {
    [pscustomobject]@{ link=$u; ok=$false; code=$null; reason="$($_.Exception.GetType().Name): $($_.Exception.Message)" }
  }
}

$bad = $results | Where-Object { -not $_.ok }
$badPath = Join-Path $OUT 'bad_links.csv'
$results | Export-Csv (Join-Path $OUT 'link_check_full.csv') -NoTypeInformation -Encoding UTF8
$bad     | Export-Csv $badPath -NoTypeInformation -Encoding UTF8
Write-Host ("BAD: {0}  → {1}" -f ($bad|Measure-Object).Count, $badPath)
