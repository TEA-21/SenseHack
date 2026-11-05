Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\FullCRT.png")
$brightest = 0
$bx = 0
$by = 0

for ($y = 1300; $y -lt 1520; $y += 2) {
  for ($x = 2500; $x -lt 2730; $x += 2) {
    $c = $bmp.GetPixel($x, $y)
    $b = $c.R + $c.G + $c.B
    if ($b -gt $brightest) {
      $brightest = $b
      $bx = $x
      $by = $y
    }
  }
}

Write-Host "Brightest point at X: $bx Y: $by (Sum: $brightest)"
$centerColor = $bmp.GetPixel($bx, $by)
Write-Host "Color: R=$($centerColor.R), G=$($centerColor.G), B=$($centerColor.B)"

# Also let's measure bounding box of pixels significantly brighter than background
# Background at x=2450, y=$by:
$bgCol = $bmp.GetPixel(2450, $by)
Write-Host "Background at 2450,$by : R=$($bgCol.R), G=$($bgCol.G), B=$($bgCol.B)"

$bmp.Dispose()

