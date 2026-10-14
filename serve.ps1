$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:5050/")
$listener.Start()
Write-Output "Server running at http://localhost:5050/"

$baseDir = "C:\Users\Gaurav Kumar Gupta\Desktop\SIH26092-Business-Platform"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $req = $context.Request
        $res = $context.Response

        $path = $req.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($path) -or $path -eq "index.html") {
            $path = "PROJECT_SYNOPSIS.html"
        }

        if ($path -eq "download" -or $path -eq "download-doc") {
            $path = "PROJECT_SYNOPSIS.doc"
        }

        $fullPath = Join-Path $baseDir $path

        if (Test-Path $fullPath) {
            $bytes = [System.IO.File]::ReadAllBytes($fullPath)
            if ($path.EndsWith(".doc")) {
                $res.ContentType = "application/msword"
                $res.AddHeader("Content-Disposition", "attachment; filename=`"BTech_Project_Synopsis_Samarth_Business_BIT_Gorakhpur.doc`"")
            } elseif ($path.EndsWith(".html")) {
                $res.ContentType = "text/html; charset=utf-8"
            } elseif ($path.EndsWith(".pdf")) {
                $res.ContentType = "application/pdf"
            } else {
                $res.ContentType = "application/octet-stream"
            }
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $res.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $res.OutputStream.Write($msg, 0, $msg.Length)
        }
        $res.Close()
    } catch {
        # ignore context errors on shutdown
    }
}
