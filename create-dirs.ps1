$directories = @(
    "src\app\core\services",
    "src\app\core\models",
    "src\app\core\guards",
    "src\app\shared\components",
    "src\app\shared\directives",
    "src\app\shared\pipes",
    "src\app\features\auth",
    "src\app\features\technicians",
    "src\app\features\work-orders",
    "src\app\features\dashboard",
    "src\assets\images"
)

foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force
        Write-Host "Created directory: $dir"
    } else {
        Write-Host "Directory already exists: $dir"
    }
}