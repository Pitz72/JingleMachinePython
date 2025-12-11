
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
# 64x64 is a good size for header icon (retina ready for 32px height)
Resize-Image -InputFile $source -OutputFile "LANDINGPAGE\public\header-logo.png" -Width 64 -Height 64

Write-Host "Header logo created."
