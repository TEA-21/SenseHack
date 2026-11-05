Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\public\crt-full-tight.png")

# Find the leftmost glass pixel and rightmost glass pixel for rows Y=200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300
Write-Host "Row analysis of glass width:"
foreach ($y in @(200, 245, 300, 400, 500, 600, 710, 800, 900, 1000, 1100, 1200, 1250, 1300)) {
  # Scan from X=150 to X=500 to find where bezel ends and glass starts (first orange/amber/lit pixel)
  $leftGlass = -1
  for ($x = 180; $x -le 500; $x++) {
    $c = $bmp.GetPixel($x, $y)
    # Bezel seam is very dark (< 15 sum) and glass starts with orange/bright (> 25 sum)
    if (($c.R + $c.G + $c.B) -gt 35 -and $c.R -gt $c.B) {
      $leftGlass = $x
      break
    }
  }

  $rightGlass = -1
  for ($x = 1750; $x -ge 1400; $x--) {
    $c = $bmp.GetPixel($x, $y)
    if (($c.R + $c.G + $c.B) -gt 35 -and $c.R -gt $c.B) {
      $rightGlass = $x
      break
    }
  }

  Write-Host "Y=$y : LeftGlass=$leftGlass, RightGlass=$rightGlass"
}

$bmp.Dispose()

