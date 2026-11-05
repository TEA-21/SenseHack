Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\scripts\panel-crop.png")

Write-Host "Finding center of inner knob on top dial:"

# In panel-crop, top dial center is roughly around X=150..300, Y=80..200
$maxBri = 0
$px = 0; $py = 0
for ($y = 80; $y -le 200; $y++) {
  for ($x = 150; $x -le 300; $x++) {
    $c = $bmp.GetPixel($x, $y)
    $b = $c.R + $c.G + $c.B
    if ($b -gt $maxBri) {
      $maxBri = $b; $px = $x; $py = $y
    }
  }
}
Write-Host "Top knob specular peak at X=$px, Y=$py in panel-crop (X=$($px+2150), Y=$($py+180) in FullCRT)"

# Let's inspect the circular boundary of the inner cylinder:
# The inner cylinder has a ribbed skirt and a smooth beveled top face.
# Let's find the left edge and right edge of the inner cylinder at Y=140:
Write-Host "Profile at Y=140 across top knob:"
for ($x = 150; $x -le 300; $x += 5) {
  $c = $bmp.GetPixel($x, 140)
  Write-Host "x=$x : ($($c.R), $($c.G), $($c.B))"
}

$bmp.Dispose()
