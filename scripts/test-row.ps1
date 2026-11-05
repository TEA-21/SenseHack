Add-Type -AssemblyName System.Drawing
$b2 = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\live-ch02.png")

Write-Host "Row 200 in live-ch02 (1360 x 907):"
for ($x = 20; $x -le 250; $x += 10) {
    $c = $b2.GetPixel($x, 200)
    Write-Host ("X={0,4} : R={1,3} G={2,3} B={3,3}" -f $x, $c.R, $c.G, $c.B)
}

$b2.Dispose()

