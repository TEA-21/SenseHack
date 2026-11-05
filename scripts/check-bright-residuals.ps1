Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\public\crt-full-clean.png")

$brightCount = 0
for ($y = 1350; $y -le 1470; $y++) {
  for ($x = 2580; $x -le 2710; $x++) {
    $c = $bmp.GetPixel($x, $y)
    if (($c.R + $c.G + $c.B) -gt 90) {
      $brightCount++
    }
  }
}

Write-Host "Count of pixels with luminance sum > 90 in star region: $brightCount"
$bmp.Dispose()

