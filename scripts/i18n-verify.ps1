param(
[string]$De = "apps/frontend/src/i18n/locales/de/common.json",
[string]$En = "apps/frontend/src/i18n/locales/en/common.json"
)


function Read-Json($path){ Get-Content -Raw -LiteralPath $path | ConvertFrom-Json }
$jde = Read-Json $De
$jen = Read-Json $En


$keysDe = $jde.PSObject.Properties.Name | Sort-Object
$keysEn = $jen.PSObject.Properties.Name | Sort-Object


$missingInEn = Compare-Object -ReferenceObject $keysDe -DifferenceObject $keysEn -PassThru | Where-Object { $_ -in $keysDe }
$missingInDe = Compare-Object -ReferenceObject $keysEn -DifferenceObject $keysDe -PassThru | Where-Object { $_ -in $keysEn }


if ($missingInEn) { Write-Error "Fehlende Keys in EN: $($missingInEn -join ', ')" }
if ($missingInDe) { Write-Error "Fehlende Keys in DE: $($missingInDe -join ', ')" }
if (-not $missingInEn -and -not $missingInDe) { Write-Output "i18n-Keys sind vollständig synchron." }