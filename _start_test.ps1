$p = Start-Process powershell -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-File','C:\Users\piesc\Pictures\NoName SMP\_serve_test.ps1' -PassThru -WindowStyle Hidden
$p.Id | Out-File 'C:\Users\piesc\Pictures\NoName SMP\_test.pid' -Encoding ascii
