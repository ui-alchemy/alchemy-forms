angular.module("alch-templates").run(function($templateCache) {
  $templateCache.put("app/views/example.html",
    "<form class=\"form\">" +
    "  <div class=\"control_group\">" +
    "    <div class=\"label\">" +
    "      <label for=\"preview_name\">Name and surname</label>" +
    "    </div>" +
    "    <div class=\"input\">" +
    "      <input id=\"preview_name\" type=\"text\">" +
    "      <span class=\"hint\">The length should be between 1-50 characters.</span>" +
    "    </div>" +
    "  </div>" +
    "  <div class=\"control_group\">" +
    "    <div class=\"label help\">" +
    "      <i>?</i>" +
    "      <label for=\"preview_login\">Login name</label>" +
    "      <span>You can fill in your own login name, otherwise your <nobr>e-mail</nobr> will be used as a login information.</span>" +
    "    </div>" +
    "    <div class=\"input\">" +
    "      <input id=\"preview_login\" type=\"text\">" +
    "      <span class=\"hint\">The length should be between 1-15 characters.</span>" +
    "    </div>" +
    "  </div>" +
    "  <div class=\"control_group required\">" +
    "    <div class=\"label\">" +
    "      <label for=\"preview_email\">E-mail</label>" +
    "    </div>" +
    "    <div class=\"input\">" +
    "      <input id=\"preview_email\" required=\"required\" type=\"email\">" +
    "    </div>" +
    "  </div>" +
    "  <div class=\"control_group required\">" +
    "    <div class=\"label\">" +
    "      <label for=\"preview_password\">Password</label>" +
    "    </div>" +
    "    <div class=\"input\">" +
    "      <input id=\"preview_password\" required=\"required\" type=\"password\">" +
    "      <span class=\"hint\">You need to use at least one capital letter, one digit and one special character (such as \".\" \",\" \"_\" \"-\"). The length should be between 1-15 characters.</span>" +
    "    </div>" +
    "  </div>" +
    "  <div class=\"control_group required\">" +
    "    <div class=\"label\">" +
    "      <label for=\"preview_password_confirm\">Password confirmation</label>" +
    "    </div>" +
    "    <div class=\"input\">" +
    "      <input id=\"preview_password_confirm\" required=\"required\" type=\"password\">" +
    "      <span class=\"hint\">Please re-type your password.</span>" +
    "    </div>" +
    "  </div>" +
    "  <div class=\"control_group buttons\">" +
    "    <div class=\"label\"></div>" +
    "    <div class=\"input\">" +
    "      <input class=\"btn primary\" type=\"submit\" value=\"Save\">" +
    "      <a class=\"btn\" href=\"#\">" +
    "        Cancel" +
    "      </a>" +
    "    </div>" +
    "  </div>" +
    "</form>" +
    "");
});
