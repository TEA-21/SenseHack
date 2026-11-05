Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\check-ch04.png")

for ($y = 780; $y -le 840; $y += 5) {
    for ($x = 100; $x -le 1100; $x += 10) {
        $c = $bmp.GetPixel($x, $y)
        # Amber phosphor: R > 70 and R - B > 40
        if ($c.R -gt 70 -and ($c.R - $c.B) -gt 40) {
            Write-Host ("Amber leak at X={0}, Y={1} : R={2} G={3} B={4}" -f $x, $y, $c.R, $c.G, $c.B)
        }
    }
}

$bmp.Dispose()

