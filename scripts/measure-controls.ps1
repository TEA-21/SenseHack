Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\FullCRT.png")

# Right panel is from X=2150 to 2600.
# Let's inspect vertical slice at X = 2370 (approx center of right control faceplate)
Write-Host "Vertical scan down right control faceplate at X=2370:"
for ($y = 200; $y -le 1400; $y += 40) {
  $c = $bmp.GetPixel(2370, $y)
  Write-Host "Y=$y : ($($c.R), $($c.G), $($c.B))"
}

$bmp.Dispose()

