Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\test-ch02-nofilter.png")

Write-Host "--- ROW Y=160 (Near Top-Left Corner) ---"
for ($x = 120; $x -le 250; $x += 10) {
    $c = $bmp.GetPixel($x, 160)
    Write-Host ("X={0,4} : R={1,3} G={2,3} B={3,3}" -f $x, $c.R, $c.G, $c.B)
}

$bmp.Dispose()

