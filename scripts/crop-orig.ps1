Add-Type -AssemblyName System.Drawing
$srcPath = "C:\Users\user\.gemini\antigravity\brain\62fae0a2-57b2-41b2-8c76-8d29cba083c3\.user_uploaded\media_1793815279630_7d6e85ba.jpg"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

$crop = New-Object System.Drawing.Bitmap(240, 180)
$g = [System.Drawing.Graphics]::FromImage($crop)
$srcRect = New-Object System.Drawing.Rectangle(784, 392, 240, 180)
$destRect = New-Object System.Drawing.Rectangle(0, 0, 240, 180)
$g.DrawImage($bmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$crop.Save("d:\Projects\SenseHack\original-bezel-crop.png", [System.Drawing.Imaging.ImageFormat]::Png)
$crop.Dispose()
$bmp.Dispose()
Write-Host "Saved original-bezel-crop.png"
