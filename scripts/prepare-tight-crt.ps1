Add-Type -AssemblyName System.Drawing

$srcPath = "d:\Projects\SenseHack\public\crt-full-clean.png"
$destPath = "d:\Projects\SenseHack\public\crt-full-tight.png"

Write-Host "Loading clean plate from $srcPath..."
$src = [System.Drawing.Bitmap]::FromFile($srcPath)

# Crop box: X in [440, 2570], Y in [30, 1450]
$cropX = 440
$cropY = 30
$cropW = 2130
$cropH = 1420

$dest = New-Object System.Drawing.Bitmap($cropW, $cropH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($dest)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

$srcRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
$destRect = New-Object System.Drawing.Rectangle(0, 0, $cropW, $cropH)
$g.DrawImage($src, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

# Feather edges to transparent alpha
# Top 40px, bottom 50px, left 40px, right 40px
Write-Host "Feathering perimeter alpha..."
for ($y = 0; $y -lt $cropH; $y++) {
  for ($x = 0; $x -lt $cropW; $x++) {
    $alpha = 1.0
    
    # Left edge
    if ($x -lt 45) {
      $alpha = [Math]::Min($alpha, ($x / 45.0))
    }
    # Right edge
    if ($x -gt ($cropW - 45)) {
      $alpha = [Math]::Min($alpha, (($cropW - 1 - $x) / 45.0))
    }
    # Top edge
    if ($y -lt 35) {
      $alpha = [Math]::Min($alpha, ($y / 35.0))
    }
    # Bottom edge (feather bottom studio floor smoothly to 0)
    if ($y -gt ($cropH - 60)) {
      $alpha = [Math]::Min($alpha, (($cropH - 1 - $y) / 60.0))
    }

    if ($alpha -lt 1.0) {
      $p = $dest.GetPixel($x, $y)
      # Smooth cosine fade
      $w = 0.5 * (1.0 - [Math]::Cos([Math]::PI * $alpha))
      $newA = [Math]::Round($p.A * $w)
      $dest.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($newA, $p.R, $p.G, $p.B))
    }
  }
}

Write-Host "Saving tight cropped plate to $destPath ($cropW x $cropH)..."
$dest.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
$dest.Dispose()
$src.Dispose()
Write-Host "Tight crop and edge feather complete!"

