
$root = "c:\Users\Utente\Documents\GitHub\JingleMachinePython\documentazione\guide"
$langs = @{
    "IT" = @("MANUALE_UTENTE.txt", "LEGGIMI.txt", "MINI_GUIDE.txt");
    "EN" = @("*_EN.txt");
    "DE" = @("*_DE.txt");
    "ES" = @("*_ES.txt");
    "FR" = @("*_FR.txt");
    "PT" = @("*_PT.txt");
    "RU" = @("*_RU.txt");
    "ZH" = @("*_ZH.txt");
}

Set-Location $root

foreach ($lang in $langs.Keys) {
    if (!(Test-Path $lang)) {
        New-Item -ItemType Directory -Force -Path $lang | Out-Null
        Write-Host "Created $lang folder"
    }
    
    $patterns = $langs[$lang]
    foreach ($pattern in $patterns) {
        Get-ChildItem -Path . -Filter $pattern -File | ForEach-Object {
            Move-Item -Path $_.FullName -Destination $lang -Force
            Write-Host "Moved $($_.Name) to $lang"
        }
    }
}
