Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\user\.gemini\antigravity\brain\62fae0a2-57b2-41b2-8c76-8d29cba083c3\.user_uploaded\media_1793815279630_7d6e85ba.jpg"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

Write-Host "Checking where the star actually is in media_1793815279630_7d6e85ba.jpg:"
for ($y = 440; $y -le 540; $y += 5) {
    for ($x = 880; $x -le 960; $x += 5) {
        $c = $bmp.GetPixel($x, $y)
        # Star is white/light grey (R, G, B are high and close together)
        if ($c.R -gt 90 -and $c.G -gt 90 -and $c.B -gt 90 -and [Math]::Abs($c.R - $c.B) -lt 15) {
            Write-Host "Found star pixel at X=$x, Y=$y : RGB=($($c.R), $($c.G), $($c.B))"
        }
    }
}
$bmp.Dispose()

