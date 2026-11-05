Add-Type -AssemblyName System.Drawing
$srcPath = "C:\Users\user\.gemini\antigravity\brain\62fae0a2-57b2-41b2-8c76-8d29cba083c3\.user_uploaded\media_1793815279630_7d6e85ba.jpg"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

for ($y = 470; $y -le 512; $y += 5) {
    $minLum = 999
    $bestX = 920
    for ($x = 905; $x -le 945; $x++) {
        $c = $bmp.GetPixel($x, $y)
        $lum = [int](0.299 * $c.R + 0.587 * $c.G + 0.114 * $c.B)
        if ($lum -lt $minLum) {
            $minLum = $lum
            $bestX = $x
        }
    }
    Write-Host "Y=$y : bestX=$bestX minLum=$minLum"
}
$bmp.Dispose()

