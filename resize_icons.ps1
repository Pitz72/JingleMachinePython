
Add-Type -AssemblyName System.Drawing

function Resize-Image {
    param([string]$InputFile, [string]$OutputFile, [int]$Width, [int]$Height)

    $srcImage = [System.Drawing.Image]::FromFile($InputFile)
    $newImage = new-object System.Drawing.Bitmap $Width, $Height
    $graphics = [System.Drawing.Graphics]::FromImage($newImage)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.DrawImage($srcImage, 0, 0, $Width, $Height)
    $newImage.Save($OutputFile, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $newImage.Dispose()
    $srcImage.Dispose()
}

$source = "GRAFICA\RRJM_icona.png"
Resize-Image -InputFile $source -OutputFile "APP\public\icon.png" -Width 512 -Height 512
Resize-Image -InputFile $source -OutputFile "APP\public\icon-512.png" -Width 512 -Height 512
Resize-Image -InputFile $source -OutputFile "APP\public\icon-192.png" -Width 192 -Height 192
Resize-Image -InputFile $source -OutputFile "APP\public\apple-touch-icon.png" -Width 180 -Height 180

Write-Host "Icons resized and saved."
