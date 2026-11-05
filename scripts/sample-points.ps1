Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile('d:\Projects\SenseHack\public\crt-master-clean.jpg')

Write-Host "Sample points:"
$points = @(
    @(50, 50), @(500, 50), @(950, 50),
    @(50, 286), @(500, 286), @(950, 286),
    @(50, 520), @(500, 520), @(950, 520),
    @(100, 286), @(920, 286), @(500, 20), @(500, 550)
)
foreach ($pt in $points) {
    $x = $pt[0]; $y = $pt[1]
    $c = $bmp.GetPixel($x, $y)
    Write-Host "($x, $y): R=$($c.R), G=$($c.G), B=$($c.B)"
}
$bmp.Dispose()

