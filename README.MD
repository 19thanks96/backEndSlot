# To kill port 

```
netstat -ano | findstr :3000

```
## When see something as 

> netstat -ano | findstr :3000
TCP    0.0.0.0:3000           0.0.0.0:0              LISTENING       10788
TCP    [::]:3000              [::]:0                 LISTENING       10788

### Use command

``` taskkill /PID 10788 /F ```
