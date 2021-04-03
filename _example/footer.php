    <footer>
      <ul>
        <li>© 2021 Ethan Baker. All rights reserved.</li>
      </ul>
    </footer>

    <section id=small-menu>
      <nav class=small>
          <div class=nav-item><a href="https://sh.ethanbaker.dev">Home</a></div>
          <div class=nav-item><a href="https://blog.ethanbaker.dev">Blog</a></div>
          <?php
            if (isset($_SESSION["id"])) {
              if (isset($_SESSION["admin"]) && $_SESSION["admin"] === 1) {
                echo '<div class=nav-item><a href="https://sh.ethanbaker.dev/logs">Logs</a></div>';
                echo '<div class=nav-item><a href="https://sh.ethanbaker.dev/system">System</a></div>';
                echo '<div class=nav-item><a href="https://sh.ethanbaker.dev/users">Users</a></div>';
              }
              echo '<div class=nav-item><a href="https://sh.ethanbaker.dev/profile">Profile</a></div>';
            } else {
              echo '<div class=nav-item><a href="https://login.ethanbaker.dev">Login</a></div>';
            }
          ?>
            
          <a class="small mode-button" onclick=toggleMode()></a>

        <button class="small close"></button>
      </nav>
    </section>

<script>
