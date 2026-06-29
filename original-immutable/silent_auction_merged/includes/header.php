<?php
require_once __DIR__ . '/paths.php';

function render_header($pageTitle)
{
  $base = BASE_URL;
  $result = "
    <!DOCTYPE html>
    <html lang='en'>
    <head>
      <meta charset='UTF-8'>
      <title>$pageTitle | Taylor PTA - Silent Auction</title>
      <link rel='stylesheet' href='$base/css/global.css'>
    </head>
    <body>
      <header>
        <div class='o-flex o-flex--justify-start o-flex--align-center u-gap-space-100 u-height-space-1100'>
          <img src='$base/assets/Tiger-icon-hi-res.webp' alt='Taylor Elementary School PTA Logo' width='88' height='88'>
          <div class='o-flex o-flex--column o-flex--justify-between u-height-space-1100'>
            <h1>Taylor Elementary School PTA</h1>
            <h2>Online Silent Auction</h2>
          </div>
        </div>
  ";

  $home = '';
  $donors = '';
  $lots = '';
  $auctions = '';

  $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
  $segments = array_values(array_filter(explode('/', $path), fn($s) => $s !== ''));
  $section = $segments[0] ?? 'home';
  if ($section === 'index.php') {
    $section = 'home';
  }
  switch ($section) {
    case 'home':
      $home = ' c-nav__item--active';
      break;
    case 'donors':
      $donors = ' c-nav__item--active';
      break;
    case 'lots':
      $lots = ' c-nav__item--active';
      break;
    case 'auction':
      $auctions = ' c-nav__item--active';
      break;
    default:
      $home = ' c-nav__item--active';
      break;
  }

  $result .= "
        <nav class='c-nav'>
          <a href='$base/index.php' class='c-nav__item $home'>Home</a>
          <div class='c-nav__divider'></div>
          <a href='$base/donors/' class='c-nav__item $donors'>Donors</a>
          <div class='c-nav__divider'></div>
          <a href='$base/lots/' class='c-nav__item $lots'>Lots</a>
          <div class='c-nav__divider'></div>
          <a href='$base/auction/' class='c-nav__item $auctions'>Auction</a>
        </nav>
      </header>
    <main class='o-container'>
  ";

  return $result;
}
