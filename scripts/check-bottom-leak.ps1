Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\check-ch04.png")
Write-Host "check-ch04: $($bmp.Width) x $($bmp.Height)"

# Bottom of screen is around Y = 700 to 850
# Let's inspect column X = 598 (middle of screen)
for ($y = 750; $y -le 850; $y += 5) {
    $c = $bmp.GetPixel(598, $y)
    Write-Host ("Y={0,4} : R={1,3} G={2,3} B={3,3}" -f $y, $c.R, $c.G, $c.B)
}

$bmp.Dispose()

