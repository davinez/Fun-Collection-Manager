# In local we can use a .env file to insert in the shell the env variables
# but in deploy server we must use env variables injected throught pipeline or
# other mecanism not a file
switch -File .env {
  default {
    $name, $value = $_.Trim() -split '=', 2
    if ($name -and $name[0] -ne '#') { # ignore blank and comment lines.
      Set-Item "Env:$name" $value
    }
  }
}