Add-Type -AssemblyName System.Drawing

$srcPath = "d:\Projects\SenseHack\FullCRT.png"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

function Crop-KnobInnerClean($centerX, $centerY, $radius, $destPath) {
  $size = [int]($radius * 2)
  $crop = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($crop)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.Clear([System.Drawing.Color]::Transparent)

  # Anti-aliased circular clip
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddEllipse(0.5, 0.5, $size - 1, $size - 1)
  $g.SetClip($path)

  $srcX = [int]($centerX - $radius)
  $srcY = [int]($centerY - $radius)
  $srcRect = New-Object System.Drawing.Rectangle($srcX, $srcY, $size, $size)
  $destRect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
  $g.DrawImage($bmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

  $g.Dispose()
  $path.Dispose()

  $crop.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $crop.Dispose()
  Write-Host "Exported clean knob cap to $destPath ($size x $size)"
}

# Top knob (Tuning): Center=(2372.5, 342.5), Radius=62.5 -> size=125
Crop-KnobInnerClean 2372.5 342.5 62.5 "d:\Projects\SenseHack\public\tuning-knob-cap.png"

# Bottom knob (Volume): Center=(2372.5, 602.5), Radius=62.5 -> size=125
Crop-KnobInnerClean 2372.5 602.5 62.5 "d:\Projects\SenseHack\public\volume-knob-cap.png"

$bmp.Dispose()
Write-Host "Clean knob extraction complete!"
