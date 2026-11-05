Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\public\crt-full-tight.png")

Write-Host "Seam groove positions (minimum luminance between bezel and glass):"
foreach ($y in @(200, 250, 300, 400, 500, 600, 710, 800, 900, 1000, 1100, 1200, 1250, 1300)) {
  # Left seam: scan X in [180, 270] for darkest pixel between bezel bevel and glass
  $minBriL = 999
  $seamL = 0
  for ($x = 180; $x -le 270; $x++) {
    $c = $bmp.GetPixel($x, $y)
    $b = $c.R + $c.G + $c.B
    if ($b -lt $minBriL) {
      $minBriL = $b
      $seamL = $x
    }
  }

  # Right seam: scan X in [1620, 1720]
  $minBriR = 999
  $seamR = 0
  for ($x = 1620; $x -le 1720; $x++) {
    $c = $bmp.GetPixel($x, $y)
    $b = $c.R + $c.G + $c.B
    if ($b -lt $minBriR) {
      $minBriR = $b
      $seamR = $x
    }
  }

  Write-Host "Y=$y : LeftSeam=$seamL (b=$minBriL), RightSeam=$seamR (b=$minBriR)"
}

$bmp.Dispose()

