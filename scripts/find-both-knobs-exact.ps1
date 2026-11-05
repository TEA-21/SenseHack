Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\scripts\panel-crop.png")

# Let's inspect vertical slice through X=222 on top knob:
Write-Host "Vertical profile across top knob at X=222:"
for ($y = 80; $y -le 250; $y += 5) {
  $c = $bmp.GetPixel(222, $y)
  Write-Host "y=$y : ($($c.R), $($c.G), $($c.B))"
}

# Now let's inspect the bottom dial (Volume):
Write-Host "`nProfile across bottom knob at Y=410:"
for ($x = 150; $x -le 300; $x += 5) {
  $c = $bmp.GetPixel($x, 410)
  Write-Host "x=$x : ($($c.R), $($c.G), $($c.B))"
}

Write-Host "`nVertical profile across bottom knob at X=222:"
for ($y = 330; $y -le 500; $y += 5) {
  $c = $bmp.GetPixel(222, $y)
  Write-Host "y=$y : ($($c.R), $($c.G), $($c.B))"
}

$bmp.Dispose()

