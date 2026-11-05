Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\FullCRT.png")

Write-Host "Image dimensions: $($bmp.Width) x $($bmp.Height)"

# Let's inspect the entire tuning knob bounding box
# Looking at the knob in media_1793859473427_74d48648.png,
# the knob is a circular dial with numbered notches around it and a pointer in the center.
# Let's find the circle of the dial base and the circle of the rotating pointer!
# Let's save a crop of the right control panel (X from 2150 to 2550, Y from 180 to 750)
$crop = New-Object System.Drawing.Bitmap(400, 600)
$g = [System.Drawing.Graphics]::FromImage($crop)
$srcRect = New-Object System.Drawing.Rectangle(2150, 180, 400, 600)
$destRect = New-Object System.Drawing.Rectangle(0, 0, 400, 600)
$g.DrawImage($bmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$crop.Save("d:\Projects\SenseHack\scripts\panel-crop.png", [System.Drawing.Imaging.ImageFormat]::Png)
$crop.Dispose()

Write-Host "Saved panel-crop.png"
$bmp.Dispose()

