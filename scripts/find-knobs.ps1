Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\FullCRT.png")

# Let's search for brightest / metal rim of upper knob (Tuning) in Y in [250, 450], X in [2250, 2500]
$bMax1 = 0; $k1x = 0; $k1y = 0
for ($y = 250; $y -le 450; $y += 2) {
  for ($x = 2250; $x -le 2500; $x += 2) {
    $c = $bmp.GetPixel($x, $y)
    $b = $c.R + $c.G + $c.B
    if ($b -gt $bMax1) {
      $bMax1 = $b; $k1x = $x; $k1y = $y
    }
  }
}
Write-Host "Tuning knob peak at X=$k1x, Y=$k1y (b=$bMax1)"

# Lower knob (Volume) in Y in [500, 750], X in [2250, 2500]
$bMax2 = 0; $k2x = 0; $k2y = 0
for ($y = 500; $y -le 750; $y += 2) {
  for ($x = 2250; $x -le 2500; $x += 2) {
    $c = $bmp.GetPixel($x, $y)
    $b = $c.R + $c.G + $c.B
    if ($b -gt $bMax2) {
      $bMax2 = $b; $k2x = $x; $k2y = $y
    }
  }
}
Write-Host "Volume knob peak at X=$k2x, Y=$k2y (b=$bMax2)"

# Power switch in Y in [1150, 1380], X in [2200, 2450]
$bMax3 = 0; $k3x = 0; $k3y = 0
for ($y = 1150; $y -le 1380; $y += 2) {
  for ($x = 2200; $x -le 2450; $x += 2) {
    $c = $bmp.GetPixel($x, $y)
    $b = $c.R + $c.G + $c.B
    if ($b -gt $bMax3) {
      $bMax3 = $b; $k3x = $x; $k3y = $y
    }
  }
}
Write-Host "Power switch peak at X=$k3x, Y=$k3y (b=$bMax3)"

$bmp.Dispose()

