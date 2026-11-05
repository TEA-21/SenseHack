Add-Type -AssemblyName System.Drawing

$srcPath = "d:\Projects\SenseHack\FullCRT.png"
$destPath = "d:\Projects\SenseHack\public\crt-full-clean.png"

Write-Host "Loading $srcPath..."
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

# Target box: X in [2530, 2751], Y in [1300, 1520]
# Watermark center is roughly 2646, 1410
$rng = New-Object System.Random(42)

for ($y = 1300; $y -le 1520; $y++) {
  for ($x = 2530; $x -le 2751; $x++) {
    # Distance from center of watermark (2646, 1410)
    $dx = ($x - 2646) / 100.0
    $dy = ($y - 1410) / 100.0
    $dist = [Math]::Sqrt($dx * $dx + $dy * $dy)
    
    # Feather blend weight: 1 inside star region (dist <= 0.8), smoothly drops to 0 at dist >= 1.25
    $weight = 0.0
    if ($dist -le 0.8) {
      $weight = 1.0
    } elseif ($dist -lt 1.25) {
      $weight = 0.5 * (1.0 + [Math]::Cos([Math]::PI * ($dist - 0.8) / (1.25 - 0.8)))
    }
    
    if ($weight -gt 0.0) {
      # Sample corresponding pixel from adjacent left floor (offset by 220px to the left)
      $srcX = $x - 220
      $jitterX = $rng.Next(-2, 3)
      $jitterY = $rng.Next(-2, 3)
      $samplePixel = $bmp.GetPixel($srcX + $jitterX, $y + $jitterY)
      
      $origPixel = $bmp.GetPixel($x, $y)
      
      $r = [Math]::Round((1.0 - $weight) * $origPixel.R + $weight * $samplePixel.R)
      $g = [Math]::Round((1.0 - $weight) * $origPixel.G + $weight * $samplePixel.G)
      $b = [Math]::Round((1.0 - $weight) * $origPixel.B + $weight * $samplePixel.B)
      
      $r = [Math]::Max(0, [Math]::Min(255, [int]$r))
      $g = [Math]::Max(0, [Math]::Min(255, [int]$g))
      $b = [Math]::Max(0, [Math]::Min(255, [int]$b))
      
      $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($origPixel.A, $r, $g, $b))
    }
  }
}

Write-Host "Saving clean plate to $destPath..."
$bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Host "Inpainting complete!"
