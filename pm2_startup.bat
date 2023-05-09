@echo off
set HOMEDRIVE=C:
set PM2_HOME=c:\Users\Tim\.pm2
REM set PM2_HOME=c:\ProgramData\pm2\home\

@REM Ensure that pm2 command is part of your PATH variable
@REM  if you're not sure, add  it here, as follow:
REM set path=C:\Users\Tim\AppData\Roaming\npm;%path%

@REM Optionally, you can add 'pm2 kill' just before 
@REM  resurrect (adding a sleep between 2 commands):
@REM  	pm2 kill
@REM  	timeout /t 5 /nobreak > NUL
@REM  	pm2 resurrect
@REM otherwise, you can simple call resurrect as follow:
pm2 resurrect

echo "Done"