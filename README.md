#README
<script type='module'>EtherAuth((authenticated){})</script> 

Best Practice: use authenticated var from closure cb() to protect functions

#MAKE SURE YOUR isAuthenticated variable in the EtherAuth() callback fn() IS IN A CLOSURE, preferably module-scoped

<script type='module'>
```  let isAuthenticated;
  EtherAuth((authenticated)=>{
    isAuthenticated = authenticated;
    if(isAuthenticated) //wrong
      protectedFn()
    if(authenticated) //correct
      protectedFn()
  </script>
```

#JAVASCRIPT WEB3 CLOSURE VULNERABILITY:
 <script> <!-- isAuthenticated hoisted to globals scope !-->
  let isAuthenticated;
  EtherAuth((authenticated)=>{
    isAuthenticated = authenticated;
    if(isAuthenticated) //wrong
      protectedFn()
    if(authenticated) //this is in a closure so it's secure
      protectedFn()
    if(isAuthenticated) //ABSOLUTELY DO NOT DO THIS
      protectedFn()
```
  </script>
