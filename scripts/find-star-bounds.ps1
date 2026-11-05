Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\FullCRT.png")

$minX = 2646; $maxX = 2646; $minY = 1398; $maxY = 1398

for ($y = 1200; $y -le 1535; $y++) {
  for ($x = 2400; $x -le 2751; $x++) {
    $c = $bmp.GetPixel($x, $y)
    if (($c.R + $c.G + $c.B) -gt 25) {
      if ($x -lt $minX) { $minX = $x }
      if ($x -gt $maxX) { $maxX = $x }
      if ($y -lt $minY) { $minY = $y }
      if ($y -gt $maxY) { $maxY = $y }
    }
  }
}

Write-Host "Watermark star bounds: X=[$minX, $maxX], Y=[$minY, $maxY]"
Write-Host "Width=$($maxX - $minX + 1), Height=$($maxY - $minY + 1)"
$bmp.Dispose()
