Add-Type -AssemblyName System.Drawing

$srcPath = "d:\Projects\SenseHack\public\crt-full-tight.png"
$tempPath = "d:\Projects\SenseHack\public\crt-full-tight.tmp.png"

Write-Host "Loading plate from $srcPath..."
$src = [System.Drawing.Bitmap]::FromFile($srcPath)
$bmp = New-Object System.Drawing.Bitmap($src)

$xMin = 1754
$xMax = 2080
$yMin = 100
$yMax = 1290

Write-Host "Applying seam-aligned +25% exposure lift to control column X=[$xMin, $xMax], Y=[$yMin, $yMax]..."

for ($y = $yMin; $y -le $yMax; $y++) {
    for ($x = $xMin; $x -le $xMax; $x++) {
        $p = $src.GetPixel($x, $y)
        
        # Calculate cosine feather weights
        $wx = 1.0
        if ($x -lt ($xMin + 25)) {
            $wx = ($x - $xMin) / 25.0
        } elseif ($x -gt ($xMax - 35)) {
            $wx = ($xMax - $x) / 35.0
        }
        
        $wy = 1.0
        if ($y -lt ($yMin + 35)) {
            $wy = ($y - $yMin) / 35.0
        } elseif ($y -gt ($yMax - 35)) {
            $wy = ($yMax - $y) / 35.0
        }
        
        $w = [Math]::Max(0.0, [Math]::Min(1.0, [Math]::Min($wx, $wy)))
        if ($w -gt 0.0) {
            $smoothW = 0.5 * (1.0 - [Math]::Cos([Math]::PI * $w))
            
            # +28% exposure lift with shadow detail recovery
            $liftFactor = 1.0 + 0.28 * $smoothW
            $shadowBoost = 7.0 * $smoothW
            
            $r = [Math]::Min(255, [int]($p.R * $liftFactor + $shadowBoost))
            $g = [Math]::Min(255, [int]($p.G * $liftFactor + $shadowBoost))
            $b = [Math]::Min(255, [int]($p.B * $liftFactor + $shadowBoost))
            
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($p.A, $r, $g, $b))
        }
    }
}

Write-Host "Saving illuminated plate to temporary file..."
$bmp.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$src.Dispose()

Write-Host "Overwriting $srcPath with $tempPath..."
Move-Item $tempPath $srcPath -Force

Write-Host "Direct plate brightening complete!"
