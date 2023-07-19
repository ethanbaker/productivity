<!-- PHP file to be used on server in order to get the user's unique token. '_index.php` is renamed to 'index.php' and 'index.html' is renamed to 'productivity.html' -->
<?php
  if (!isset($_SESSION["id"])) {
    session_name("auth");
    session_set_cookie_params(86400, '/', '.ethanbaker.dev');
    session_start();
  }

  $script = "<script>session = new Session(\"".$_SESSION["token"]."\")</script>";

  if (isset($_GET["DEMO"])) {
    $script = "<script>session = new Session(\"DEMO\")</script>";
  }

  if (!isset($_SESSION["id"]) && !isset($_GET["DEMO"])) {
    header("location: https://login.ethanbaker.dev/");
    exit();
  }

  require_once "./productivity.html";

  echo $script;
