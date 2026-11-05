Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\public\crt-full-clean.png")

for ($y = 1350; $y -le 1470; $y++) {
  for ($x = 2580; $x -le 2710; $x++) {
    $c = $bmp.GetPixel($x, $y)
    if (($c.R + $c.G + $c.B) -gt 90) {
      Write-Host "X=$x, Y=$y : ($($c.R), $($c.G), $($c.B))"
    }
  }
}

$bmp.Dispose()

