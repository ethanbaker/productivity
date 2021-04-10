<?php
  if (!isset($_SESSION["id"])) {
    session_name("auth");
    session_set_cookie_params(0, '/', '.ethanbaker.dev');
    session_start();
  }

  if (!isset($_SESSION["id"])) {
    header("location: https://login.ethanbaker.dev/");
  }

  echo "<script>let TOKEN=\"".$_SESSION["token"]."\"</script>";

  require_once "./productivity.html";

