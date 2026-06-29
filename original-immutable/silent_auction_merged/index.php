<?php
include 'includes/page_layout.php';

$content = "
<div class='o-flex o-flex--column u-gap-space-200'>
  <h2>Silent Auction Management</h2>
  <p>Select a module to get started.</p>

  <div class='o-flex o-flex--column u-gap-space-100'>
    <a href='" . BASE_URL . "/donors/' class='c-nav__item'>Donors</a>
    <a href='" . BASE_URL . "/lots/' class='c-nav__item'>Lots</a>
    <a href='" . BASE_URL . "/auction/' class='c-nav__item'>Auction</a>
  </div>
</div>";

echo render_page('Home', $content);
