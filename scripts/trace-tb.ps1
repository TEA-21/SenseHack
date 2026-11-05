Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\scripts\phosphor-mask.png")

Write-Host "--- SAMPLES ALONG TOP AND BOTTOM EDGES ---"
for ($x = 220; $x -le 1660; $x += 100) {
    $minY = -1
    $maxY = -1
    for ($y = 160; $y -le 1280; $y++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.G -eq 255 -and $c.R -eq 0 -and $c.B -eq 0) {
            if ($minY -eq -1) { $minY = $y }
            $maxY = $y
        }
    }
    Write-Host ("X={0,4} : Top Y={1,4}, Bottom Y={2,4}, Height={3,4}" -f $x, $minY, $maxY, ($maxY - $minY))
}

$bmp.Dispose()

