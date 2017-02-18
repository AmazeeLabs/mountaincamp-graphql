<?php

/**
 * @file
 * The PHP page that serves all page requests on a Drupal installation.
 *
 * All Drupal code is released under the GNU General Public License.
 * See COPYRIGHT.txt and LICENSE.txt files in the "core" directory.
 */

use Drupal\Core\DrupalKernel;
use Symfony\Component\HttpFoundation\Request;

$autoloader = require_once 'autoload.php';

$kernel = new DrupalKernel('prod', $autoloader);

$request = Request::createFromGlobals();
$response = $kernel->handle($request);

// Enable CORS for the MountainCamp Demo.
$response->headers->set('Access-Control-Allow-Origin', '*');
$response->headers->set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
$response->headers->set('Access-Control-Allow-Headers', 'Content-Type,Authorization');

$response->send();

$kernel->terminate($request, $response);
