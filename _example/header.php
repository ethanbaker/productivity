
    <header>
      <span class=large>
        <nav id=large-nav>
          <div class=nav-left>
            <a href="https://sh.ethanbaker.dev">sh.ethanbaker.dev</a>
          </div>
          <div class="nav-right unselectable">
            <ul class=nav-list>
              <li class=nav-item><a href="https://sh.ethanbaker.dev">Home</a></li>
              <li class=nav-item><a href="https://blog.ethanbaker.dev">Blog</a></li>
              <?php
                if (isset($_SESSION["id"])) {
                  if (isset($_SESSION["admin"]) && $_SESSION["admin"] === 1) {
                    echo '<li class=nav-item><a href="https://sh.ethanbaker.dev/logs">Logs</a></li>';
                    echo '<li class=nav-item><a href="https://sh.ethanbaker.dev/system">System</a></li>';
                    echo '<li class=nav-item><a href="https://sh.ethanbaker.dev/users">Users</a></li>';
                  }
                  echo '<li class=nav-item><a href="https://sh.ethanbaker.dev/profile">Profile</a></li>';
                } else {
                  echo '<li class=nav-item><a href="https://login.ethanbaker.dev">Login</a></li>';
                }
              ?>
            
              <li class=nav-button><a class=mode-button onclick=toggleMode()></a></li>
            </ul>
          </div>
        </nav>
      </span>

      <span class=small>
        <nav id=small-nav>
          <a href="https://sh.ethanbaker.dev">sh.ethanbaker.dev</a>

          <button class="small open"></button>
        </nav>
      </span>
    </header>
