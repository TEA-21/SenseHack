Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile('d:\Projects\SenseHack\test-clean-crop.png')
# In test-clean-crop.png, X_crop = X - 784, Y_crop = Y - 392
# For X=924, Y=484: X_crop = 140, Y_crop = 92
for ($y = 85; $y -le 100; $y++) {
    Write-Host "Y_crop=${y}:"
    for ($x = 135; $x -le 145; $x++) {
        $c = $bmp.GetPixel($x, $y)
        Write-Host -NoNewline " X=${x}:($($c.R),$($c.G),$($c.B))"
    }
    Write-Host ""
}
$bmp.Dispose()

