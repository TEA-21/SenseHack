Add-Type -AssemblyName System.Drawing

$srcPath = "d:\Projects\SenseHack\FullCRT.png"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

function Crop-KnobCap($centerX, $centerY, $radius, $destPath) {
  $size = $radius * 2
  $crop = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($crop)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.Clear([System.Drawing.Color]::Transparent)

  # Circular clip path
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddEllipse(0, 0, $size, $size)
  $g.SetClip($path)

  # Draw portion of source bitmap
  $srcRect = New-Object System.Drawing.Rectangle(($centerX - $radius), ($centerY - $radius), $size, $size)
  $destRect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
  $g.DrawImage($bmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

  $g.Dispose()
  $path.Dispose()
  $crop.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $crop.Dispose()
  Write-Host "Exported knob cap to $destPath ($size x $size)"
}

# Tuning knob center: X=2324, Y=336, radius=85
Crop-KnobCap 2324 336 85 "d:\Projects\SenseHack\public\tuning-knob-cap.png"

# Volume knob center: X=2326, Y=588, radius=85
Crop-KnobCap 2326 588 85 "d:\Projects\SenseHack\public\volume-knob-cap.png"

$bmp.Dispose()

