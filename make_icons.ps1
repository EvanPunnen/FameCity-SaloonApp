Add-Type -AssemblyName System.Drawing
$logoPath = "C:\Users\evanp\famecity-saloon\public\logo.jpg"
$img = [System.Drawing.Image]::FromFile($logoPath)

# 512x512
$b512 = New-Object System.Drawing.Bitmap(512, 512)
$g512 = [System.Drawing.Graphics]::FromImage($b512)
$g512.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g512.DrawImage($img, 0, 0, 512, 512)
$b512.Save("C:\Users\evanp\famecity-saloon\public\icon-512.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g512.Dispose()
$b512.Dispose()

# 192x192
$b192 = New-Object System.Drawing.Bitmap(192, 192)
$g192 = [System.Drawing.Graphics]::FromImage($b192)
$g192.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g192.DrawImage($img, 0, 0, 192, 192)
$b192.Save("C:\Users\evanp\famecity-saloon\public\icon-192.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g192.Dispose()
$b192.Dispose()

$img.Dispose()
Write-Output "Successfully generated icon-192.png and icon-512.png!"
