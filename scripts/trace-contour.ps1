Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\scripts\phosphor-mask.png")
$w = $bmp.Width
$h = $bmp.Height

# Collect contour points
$leftPoints = @()
$rightPoints = @()

for ($y = 175; $y -le 1270; $y += 20) {
    $minX = -1
    $maxX = -1
    for ($x = 180; $x -le 1700; $x++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.G -eq 255 -and $c.R -eq 0 -and $c.B -eq 0) {
            if ($minX -eq -1) { $minX = $x }
            $maxX = $x
        }
    }
    if ($minX -ne -1) {
        $leftPoints += [PSCustomObject]@{ Y = $y; X = $minX }
        $rightPoints += [PSCustomObject]@{ Y = $y; X = $maxX }
    }
}

Write-Host "--- SAMPLES ALONG LEFT AND RIGHT EDGES ---"
foreach ($p in $leftPoints) {
    if ($p.Y % 100 -lt 25) {
        $r = ($rightPoints | Where-Object { $_.Y -eq $p.Y })[0]
        Write-Host ("Y={0,4} : Left X={1,4}, Right X={2,4}, Width={3,4}" -f $p.Y, $p.X, $r.X, ($r.X - $p.X))
    }
}

$bmp.Dispose()

