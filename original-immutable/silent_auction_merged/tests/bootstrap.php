<?php

if (!defined('BASE_URL')) {
    define('BASE_URL', '');
}

$root = dirname(__DIR__);

require_once $root . '/includes/utils/format.php';
require_once $root . '/includes/utils/form_parse.php';
require_once $root . '/includes/ui/button.php';
require_once $root . '/includes/ui/action_links.php';
require_once $root . '/includes/ui/empty_state.php';
require_once $root . '/includes/ui/table_shell.php';
require_once $root . '/includes/ui/form_field.php';
require_once $root . '/includes/ui/select.php';
require_once $root . '/includes/ui/select_lot.php';
require_once $root . '/includes/ui/detail_field.php';
require_once $root . '/includes/ui/subnav.php';
require_once $root . '/includes/ui/form_actions.php';
require_once $root . '/includes/ui/page_intro.php';
require_once $root . '/includes/ui/confirm_delete.php';